let runWasmModule;


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
export async function wasmInitPubKey(pubKey) {
    console.log("start run initPubKey...")
    return initPubKey(pubKey);
}

export async function wasmInitP1Context(data) {
    console.log("start run initP1Context...")
    return initP1Context(data);
}

export async function wasmP1Step1() {
    console.log("start run p1Step1...")
    return p1Step1();
}

export async function wasmP1Step2(proofJson, ecpointJson) {
    console.log("start run p1Step2...")
    return p1Step2(proofJson, ecpointJson);
}

export async function wasmP1Step3(p2Step2Result, message) {
    console.log("start run p1Step3...")
    return p1Step3(p2Step2Result, message);
}

// 将JSON中的数字字符串转换为数字
export const parseNumbers = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            parseNumbers(obj[key]);
        } else if (typeof obj[key] === 'string' && /^\d+$/.test(obj[key])) {
            obj[key] = BigInt(obj[key]).valueOf();
        }
    }
    return obj
};