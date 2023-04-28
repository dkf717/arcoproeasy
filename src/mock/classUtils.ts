/* eslint-disable */
//  @ts-nocheck
const CreateTableConfig = {
  college: {
    id: 'text primary key',
    pName: 'varchar(12)',
    pPassword: 'varchar(16)',
    collegeName: 'text',
    isCache: 'int default 0',
    isDefault: 'int default 0',
  },
};

export default class DbTable {
  _db;

  _tableName: any;

  // 执行sql方法
  _executeSql(sqlStr = '', valueList = []) {
    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(
          sqlStr,
          valueList,
          function (tx, result) {
            resolve(Object.values(result.rows));
          },
          function (tx, error) {
            console.error('sql执行错误',sqlStr,valueList)
            reject(error);
          }
        );
      });
    });
  }

  // 表是否存在
  _tableCreateOrNot() {
    return new Promise((resolve, reject) => {
      this._executeSql(
        `SELECT count(*) as count FROM sqlite_master WHERE type="table" AND name = ?`,
        [this._tableName]
      )
        .then((res) => {
          resolve(res[0].count);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // 创建表
  _createTable(config) {
    const keyList = Object.keys(config);
    const keySqlStr = keyList.map((v) => `${v} ${config[v]}`).join(',');
    return new Promise((resolve, reject) => {
      this._executeSql(
        `create table if not exists ${this._tableName} (${keySqlStr})`
      )
        .then((res) => {
          return this._executeSql(
            `REPLACE INTO tableCreateKeyList (tableName,keyList) VALUES (?, ?)`,
            [this._tableName, JSON.stringify(keyList)]
          );
        })
        .then((res) => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // 重置表
  _remakeTable(config) {
    const keyList = Object.keys(config);
    let oldKeyList = [];
    let addKeyList = [];
    return new Promise((resolve, reject) => {
      this._executeSql(`select * from tableCreateKeyList where tableName = ?`, [
        this._tableName,
      ])
        .then((res) => {
          oldKeyList = JSON.parse(res[0].keyList);
          addKeyList = keyList.filter((v) => !oldKeyList.includes(v));
          if (addKeyList.length) {
            return Promise.all(
              addKeyList.map((v) =>
                this._executeSql(
                  `ALTER TABLE ${this._tableName} ADD ${v} ${config[v]}`
                )
              )
            );
          }
          return Promise.resolve(true);
        })
        .then((res) => {
          return this._executeSql(
            `REPLACE INTO tableCreateKeyList (tableName,keyList) VALUES (?, ?)`,
            [this._tableName, JSON.stringify([...oldKeyList, ...addKeyList])]
          );
        })
        .then((res) => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // 创建表方法
  createTable(tableName, config) {
    this._tableName = tableName;
    return new Promise((resolve, reject) => {
      this._executeSql(
        `create table if not exists tableCreateKeyList (tableName text primary key,keyList text)`
      )
        .then((res) => {
          return this._tableCreateOrNot();
        })
        .then((res) => {
          if (res) {
            return this._remakeTable(config || CreateTableConfig[tableName]);
          }
          return this._createTable(config || CreateTableConfig[tableName]);
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  _splitList(list = [], size = 200) {
    let _list = list;
    if (!Array.isArray(list)) {
      _list = [].concat(list);
    }
    const arr = _list.splice(0, size);
    let afterList = [];
    if (_list.length) {
      afterList = this._splitList(_list, size);
    }
    return [arr, ...afterList];
  }

  // 增加数据方法
  addData(data) {
    return new Promise((resolve, reject) => {
      this._getValidKeyList(data)
        .then((res) => {
          const validKeyList = res;
          const keySqlStr = validKeyList.join(',');
          const dataList = this._splitList(data);
          const dataSqlStrList = dataList.map((v) =>
            v
              .map((v2) =>
                validKeyList.map((v3) => `${this._sqlValue(v2[v3])}`).join(',')
              )
              .join('),(')
          );
          return Promise.all(
            dataSqlStrList.map((v) =>
              this._executeSql(
                `REPLACE INTO ${this._tableName} (${keySqlStr}) VALUES (${v})`
              )
            )
          );
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  _contrastMap = {
    not: ' is not ',
    start: ' >= ',
    no_start: ' > ',
    end: ' <= ',
    no_end: ' < ',
    like: ' like ',
  };

  _sqlValue(val) {
    return typeof val === 'string' ? `'${val}'` : val;
  }

  // 获取有效的键列表
  _getValidKeyList = (data = {}) => {
    const dataKeyList = Object.keys([].concat(data)[0]);
    return new Promise((resolve, reject) => {
      this._executeSql(`SELECT * FROM tableCreateKeyList WHERE tableName = ?`, [
        this._tableName,
      ])
        .then((res) => {
          const keyList = JSON.parse(res[0].keyList).filter((v) =>
            dataKeyList.includes(v)
          );
          resolve(keyList);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // 获取搜索sql
  _getSearchSqlStr = (search = {},defaultAll=true) => {
    const searchList = [].concat(search);
    const searchSql = searchList
      .map((searchItem) => {
        const searchItemKeyList = Object.keys(searchItem);
        const searchItemSql = searchItemKeyList
          .map((fullKey) => {
            const [keyStr, contrast] = fullKey.split('__');
            const valueList = [].concat(searchItem[fullKey]);
            const fullKeySql = valueList
              .map(
                (value) =>
                  `${keyStr} ${
                    this._contrastMap[contrast] || 'is'
                  } ${this._sqlValue(value)}`
              )
              .join(' OR ');
            return `${fullKeySql}`;
          })
          .join(' ) And ( ');
        return `${searchItemSql}`;
      })
      .join(' ) or ( ');
    return `${searchSql}`;
  };
  // 获取分页sql
  getLimitSqlStr(pageNum = 0, pageSize=0){
      if(!pageNum ||!pageSize){
        return ''
      }
      return `LIMIT ${pageSize*(pageNum-1)},${pageSize}`
  }
  // 查询数据方法(旧)
  getDataListOld = ({ search = {}, pageNum = 0, pageSize=0, orderBy = '' }) => {
    const searchSqlStr = this._getSearchSqlStr(search);
    const limitSqlStr = this.getLimitSqlStr(pageNum , pageSize)
    return this._executeSql(
      `SELECT * FROM ${this._tableName} WHERE (${
        searchSqlStr || '1 = 1'
      }) ORDER BY ${orderBy || 'rowid'} ${limitSqlStr} `
    );
  };
    // 查询数据方法(新)
    getDataList = ({ search = {}, pageNum = 0, pageSize=0, orderBy = '' }={}) => {
      const searchSqlStr = this._getSearchSqlStr(search);
      const limitSqlStr = this.getLimitSqlStr(pageNum , pageSize)
      return  new Promise<T>((resolve, reject) => {
        Promise.all([
          this._executeSql(
            `SELECT COUNT(*) as total FROM ${this._tableName} WHERE (${searchSqlStr || '1 = 1'})`
          ),
          this._executeSql(
              `SELECT * FROM ${this._tableName} WHERE (${
                searchSqlStr || '1 = 1'
              }) ORDER BY ${orderBy || 'rowid'} ${limitSqlStr} `
            )
        ]).then(([[{total}],list])=>{
          resolve({
            total,list
          })
        }).catch((err) => {
          reject(err);
        });
      })
    };

  // 更新数据
  _updateData = ({ data = {}, search = {} }) => {
    return new Promise((resolve, reject) => {
      this._getValidKeyList(data)
        .then((res) => {
          const validKeyList = res;
          const dataSqlStr = validKeyList.map(
            (v) => ` ${v} = ${this._sqlValue(data[v])}`
          );
          const searchSqlStr = this._getSearchSqlStr(search);
          return this._executeSql(
            `UPDATE ${this._tableName} SET ${dataSqlStr} WHERE (${
              searchSqlStr || '1 = 1'
            })`
          );
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // 修改数据方法
  updateData = ({ data = {}, search = {} }) => {
    return new Promise((resolve, reject) => {
      return this.getDataListOld({ search })
        .then((res) => {
          if (res.length) {
            return this._updateData({ data, search });
          }
          return this.addData(data);
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // 删除数据方法
  deleteData({ search = {} }) {
    // DELETE FROM 表名 WHERE 字段 = 值;
    return new Promise((resolve, reject) => {
      const searchSqlStr = this._getSearchSqlStr(search,false);

      this._executeSql(`DELETE FROM ${this._tableName} WHERE (${searchSqlStr})`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  checkExist(tableName){
    return new Promise((resolve, reject) => {
      this._executeSql(`SELECT count(*) as total FROM sqlite_master WHERE type="table" AND name = "${tableName}"`)
        .then(([{total}]) => {
          resolve(!!total);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // 构造方法
 constructor(tableName='', config={}, dbName = 'arcoproDb') {
    this._db = openDatabase(dbName, '0.1', 'arcopro数据库', 1024 * 1024);
    if(tableName){
      this.createTable(tableName, config);
    }
  }
}
