const JSONBig = require('json-bigint');
let runWasmModule;

module.exports = {

    JSONBigInt: JSONBig({
        storeAsString: true, // 将大整数存储为字符串
        strict: true, // 启用严格模式，禁用科学计数法
    }),

    init: async function(buffer){
        if (!runWasmModule) {
            runWasmModule = await require('./run_wasm')(buffer);
        }
    },

    generateDeviceData: async function () {
        console.log("start run generateDeviceData...")
        return generateDeviceData();
    }

};