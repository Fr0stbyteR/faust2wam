#!/usr/bin/env node
//@ts-check
import process from "process";
import faust2wamFiles from "./faust2wam-files.js";

const argv = process.argv.slice(2);

if (argv[0] === "-help" || argv[0] === "-h") {
    console.log(`
faust2wam.js <file.dsp> <outputDir> [-poly]
Generates WebAudioModule with WebAssembly and metadata JSON files of a given Faust DSP.
`);
    process.exit();
}

const $poly = argv.indexOf("-poly");
const poly = $poly !== -1;
if (poly) argv.splice($poly, 1);
const $fft = argv.indexOf("-fft");
const fft = $fft !== -1;
if (fft) argv.splice($fft, 1);

const [inputFile, outputDir, ...argvFaust] = argv;

(async () => {
    const { default: faust2wasmFiles } = await import("@grame/faustwasm/src/faust2wasmFiles.js");
    const { dspMeta, effectMeta } = await faust2wasmFiles(inputFile, outputDir, argvFaust, poly);
    await faust2wamFiles(dspMeta, effectMeta, outputDir, fft ? "fft" : !!poly);
})();
