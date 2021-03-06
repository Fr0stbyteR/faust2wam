import type { FaustDspMeta } from "@shren/faustwasm/dist/esm-bundle";

export interface FaustDspDistribution {
    dspModule: WebAssembly.Module;
    dspMeta: FaustDspMeta;
    effectModule?: WebAssembly.Module;
    effectMeta?: FaustDspMeta;
    mixerModule?: WebAssembly.Module;
}
