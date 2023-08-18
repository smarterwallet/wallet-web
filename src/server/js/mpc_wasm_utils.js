const JSONBig = require('json-bigint');
let runWasmModule;

export const JSONBigInt = JSONBig({
    storeAsString: true, // 将大整数存储为字符串
    strict: true, // 启用严格模式，禁用科学计数法
})

export async function initWasm(buffer) {
    if (!runWasmModule) {
        runWasmModule = await require('./run_wasm').runWasm(buffer);
    }
}

/** generate keys */
export async function wasmGenerateDeviceData() {
    console.log("start run generateDeviceData...")
    return generateDeviceData();
}

/** Get address */
export async function wasmInitP1KeyData(key) {
    console.log("start run initP1KeyData...")
    return initP1KeyData(key);
}

export async function wasmKeyGenRequestMessage(partnerDataId, prime1, prime2) {
    console.log("start run keyGenRequestMessage...")
    return keyGenRequestMessage(partnerDataId, prime1, prime2);
}

/** sign */
export async function wasmInitPubKey() {
    console.log("start run initPubKey...")
    return initPubKey();
}

export async function wasmInitP1Context() {
    console.log("start run initP1Context...")
    return initP1Context();
}

export async function wasmP1Step1() {
    console.log("start run p1Step1...")
    return p1Step1();
}

export async function wasmP1Step2() {
    console.log("start run p1Step2...")
    return p1Step2();
}

export async function wasmP1Step3() {
    console.log("start run p1Step3...")
    return p1Step3();
}

