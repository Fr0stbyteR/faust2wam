import { instantiateFaustModule, FaustCompiler, FaustMonoDspGenerator, FaustPolyDspGenerator, LibFaust, FaustDspMeta } from "@shren/faustwasm/dist/esm-bundle";
import type { FaustDspDistribution } from "./type";

const compile = async (code: string, name = "FaustDSP", argv = ["-I", "libraries/"], poly = false) => {
    const faustModule = await instantiateFaustModule();
    const libFaust = new LibFaust(faustModule);
    const compiler = new FaustCompiler(libFaust);
    if (!argv.find(a => a === "-I")) argv.push("-I", "libraries/");
    
    let dspModule: WebAssembly.Module;
    let dspMeta: FaustDspMeta;
    let effectModule: WebAssembly.Module;
    let effectMeta: FaustDspMeta = null;
    let mixerModule: WebAssembly.Module = null;
    if (poly) {
        const generator = new FaustPolyDspGenerator();
        const dsp = await generator.compile(compiler, name, code, argv.join(" "));
        if (!dsp) throw new Error("Faust DSP not compiled");
        const { voiceFactory, effectFactory, mixerBuffer } = dsp;
        if (!voiceFactory) throw new Error("Faust DSP Factory not compiled");
        dspModule = await WebAssembly.compile(voiceFactory.code);
        dspMeta = JSON.parse(voiceFactory.json);
        mixerModule = await WebAssembly.compile(mixerBuffer);

        if (effectFactory) {
            effectModule = await WebAssembly.compile(effectFactory.code);
            effectMeta = JSON.parse(effectFactory.json);
        }
    } else {
        const generator = new FaustMonoDspGenerator();
        const dsp = await generator.compile(compiler, name, code, argv.join(" "));
        if (!dsp) throw new Error("Faust DSP not compiled");
        const { factory } = dsp;
        if (!factory) throw new Error("Faust DSP Factory not compiled");
        dspModule = await WebAssembly.compile(factory.code);
        dspMeta = JSON.parse(factory.json);
    }
    return { dspModule, dspMeta, effectModule, effectMeta, mixerModule } as FaustDspDistribution;
};

export default compile;
