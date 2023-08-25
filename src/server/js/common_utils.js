const JSONBig = require('json-bigint');

export const JSONBigInt = JSONBig({
    storeAsString: true, // 将大整数存储为字符串
    strict: true, // 启用严格模式，禁用科学计数法
})