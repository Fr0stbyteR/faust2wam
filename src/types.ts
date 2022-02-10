import type { FaustDspMeta } from "@shren/faustwasm";

export interface FaustDspDistribution {
    dspModule: WebAssembly.Module;
    dspMeta: FaustDspMeta;
    effectModule?: WebAssembly.Module;
    effectMeta?: FaustDspMeta;
    mixerModule?: WebAssembly.Module;
}
