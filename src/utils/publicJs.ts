export function listToTree({
  list: _list,
  pIdKey = 'pId',
  idKey = 'id',
  topId,
}: {
  list: any[];
  pIdKey?: string;
  idKey?: string;
  topId?: string;
}) {
  const obj: any = {};
  const topIdList: any[] = [];
  const list = JSON.parse(JSON.stringify(_list));
  list.forEach((v: any) => {
    const vId = v[idKey];
    if (!obj[vId]) {
      obj[vId] = v;
    }
    if (!obj[vId][idKey]) {
      obj[vId] = Object.assign(v, obj[vId]);
    }
    const vPId = v[pIdKey];
    if (vPId) {
      if (!obj[vPId]) {
        obj[vPId] = { children: [] };
      }
      if (!obj[vPId].children) {
        obj[vPId].children = [];
      }
      obj[vPId].children.push(v);
    } else {
      topIdList.push(vId);
    }
  });
  if (topId) {
    return [obj[topId]];
  }
  if (!topIdList.length) {
    return list;
  }
  return topIdList.map((v) => obj[v]);
}
export function listToObj(list: any[], idKey = 'id') {
  const obj: any = {};
  list.forEach((v) => {
    obj[v[idKey]] = v;
  });
  return obj;
}
// 获取值得位置
export function getIndexList(
  tree: any,
  val: any,
  key: any,
  childrenKey = 'children'
) {
  let indexList: any[] = [];
  tree.some((v: any, i: number): boolean => {
    if (v[childrenKey]) {
      indexList = getIndexList(v[childrenKey], val, key, childrenKey);
    }
    if (indexList.length || v[key] === val) {
      indexList.unshift(i);
    }
    if (indexList.length) {
      return true;
    }
    return false;
  });
  return indexList;
}
// 搜索树
export function searchTree(
  tree: any,
  str: string,
  keyList: any,
  treeLevel: any,
  childrenKey = 'children'
) {
  let indexList: any[] = [];
  let itemList: any[] = [];
  if (!treeLevel) {
    return { indexList, itemList };
  }
  tree.forEach((v: any, i: number) => {
    if (treeLevel === 1) {
      keyList.forEach((key: any) => {
        if (v[key].includes(str)) {
          indexList.push([i]);
          itemList.push(v);
        }
      });
    } else if (v[childrenKey]) {
      const childBackObject = searchTree(
        v[childrenKey],
        str,
        keyList,
        treeLevel - 1,
        childrenKey
      );
      indexList = indexList.concat(
        childBackObject.indexList.map((indexListItem) => [i, ...indexListItem])
      );
      itemList = itemList.concat(childBackObject.itemList);
    }
  });
  return { indexList, itemList };
}
// url解码（多层级）
export function decodeUrl(str: string): string {
  const res = decodeURIComponent(str);
  if (res.length === str.length) {
    return res;
  }
  return decodeUrl(res);
}
// 随机id
export function getRandomId() {
  return (
    Number(new Date()).toString(16) +
    (Math.random() * 10 ** 20).toString(16).slice(0, 10)
  );
}
