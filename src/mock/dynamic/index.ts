import Mock from 'mockjs';
import setupMock from '@/utils/setup-mock';

const modules = import.meta.glob(['./*.ts', '!./index.ts'], { eager: true });
const mockData = {};
Object.assign(mockData, ...Object.values(modules).map((v: any) => v.default));
setupMock({
  setup() {
    Object.keys(mockData).forEach((v) => {
      Mock.mock(new RegExp(v), async () => ({}));
    });
  },
});
export default mockData;
