// const wasmFile = require('path').resolve(__dirname, './mpc.wasm');
const JSONBig = require('json-bigint');

// const randomPrime = generateRandomPrime();
// console.log(randomPrime);
// 创建一个自定义的JSON解析器
const JSONBigInt = JSONBig({
    storeAsString: true, // 将大整数存储为字符串
    strict: true, // 启用严格模式，禁用科学计数法
});

module.exports = {
    test1: function (buffer) {
        require('./RunWasm')(buffer).then(async () => {
            // generate device data(three keys)
            const keys = generateDeviceData();
            let keysJson = JSONBigInt.parse(keys);
            if (keysJson["code"] === 200) {
                console.log("p1JsonData: " + JSONBigInt.stringify(keysJson["data"]["p1JsonData"]));
                console.log("p2JsonData: " + JSONBigInt.stringify(keysJson["data"]["p2JsonData"]));
                console.log("p3JsonData: " + JSONBigInt.stringify(keysJson["data"]["p3JsonData"]));
            } else {
                console.log("generateDeviceData error. Response: " + keys);
            }
        })
    }
};