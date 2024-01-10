//@ts-check
import path from "path";
import fs from "fs";
import url from "url";
import { cpSync, rmSync } from "./fileutils.js";

// @ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const wamSdkParamMgrDistPath = path.join(__dirname, "./node_modules/@webaudiomodules/sdk-parammgr/dist");
const wamSdkParamMgrDistDest = path.join(__dirname, "./assets/wam2/sdk-parammgr");

try {
    rmSync(wamSdkParamMgrDistDest);
} catch (e) {
    console.warn(e);
}
try {
    fs.mkdirSync(wamSdkParamMgrDistDest);
} catch (e) {
    console.warn(e);
}

cpSync(wamSdkParamMgrDistPath, wamSdkParamMgrDistDest);
const wamSdkParamMgrDts = `export * from "@webaudiomodules/sdk-parammgr";\n`;
fs.writeFileSync(path.join(wamSdkParamMgrDistDest, "index.d.ts"), wamSdkParamMgrDts);

console.log("WAM SDK-ParamMgr files copied.")

const wamSdkDistPath = path.join(__dirname, "./node_modules/@webaudiomodules/sdk/dist");
const wamSdkDistDest = path.join(__dirname, "./assets/wam2/sdk");

try {
    rmSync(wamSdkDistDest);
} catch (e) {
    console.warn(e);
}
try {
    fs.mkdirSync(wamSdkDistDest);
} catch (e) {
    console.warn(e);
}

cpSync(wamSdkDistPath, wamSdkDistDest);
const wamSdkDts = `export * from "@webaudiomodules/sdk";\n`;
fs.writeFileSync(path.join(wamSdkDistDest, "index.d.ts"), wamSdkDts);

console.log("WAM SDK files copied.")

const faustUiDistPath = path.join(__dirname, "./node_modules/@shren/faust-ui/dist/esm");
const faustUiDistDest = path.join(__dirname, "./assets/wam2/faust-ui");

try {
    rmSync(faustUiDistDest);
} catch (e) {
    console.warn(e);
}
try {
    fs.mkdirSync(faustUiDistDest);
} catch (e) {
    console.warn(e);
}

cpSync(faustUiDistPath, faustUiDistDest);
const faustUiDts = `export * from "@shren/faust-ui";\n`;
fs.writeFileSync(path.join(faustUiDistDest, "index.d.ts"), faustUiDts);

console.log("FaustUI files copied.")

const faustWasmDistEsmPath = path.join(__dirname, "./node_modules/@grame/faustwasm/dist/esm");
const faustWasmDistDest = path.join(__dirname, "./assets/wam2/faustwasm");

try {
    rmSync(faustWasmDistDest);
} catch (e) {
    console.warn(e);
}
try {
    fs.mkdirSync(faustWasmDistDest);
} catch (e) {
    console.warn(e);
}

cpSync(faustWasmDistEsmPath, faustWasmDistDest);

console.log("FaustWasm files copied.")

const fftwDistPath = path.join(__dirname, "./node_modules/@shren/fftw-js/dist/cjs-bundle");
const fftwDistDest = path.join(__dirname, "./assets/wam2/fftw");

try {
    rmSync(fftwDistDest);
} catch (e) {
    console.warn(e);
}
try {
    fs.mkdirSync(fftwDistDest);
} catch (e) {
    console.warn(e);
}

cpSync(fftwDistPath, fftwDistDest);
const fftwDts = `export * from "@shren/fftw-js";\n`;
fs.writeFileSync(path.join(fftwDistDest, "index.d.ts"), fftwDts);

console.log("FFTW files copied.")
