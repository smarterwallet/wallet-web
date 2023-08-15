const JSONBig = require('json-bigint');
let runWasmModule;

export const JSONBigInt = JSONBig({
    storeAsString: true, // 将大整数存储为字符串
    strict: true, // 启用严格模式，禁用科学计数法
})

export async function initWasm(buffer) {
    if (!runWasmModule) {
        runWasmModule = await require('./run_wasm')(buffer);
    }
}

export async function generateDeviceData() {
    console.log("start run generateDeviceData...")
    return generateDeviceData();
}

