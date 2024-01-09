import { WebAudioModule } from "@webaudiomodules/api";

declare const generate: (code: string, name?: string, argv?: string[], polyOrFFT?: boolean | "fft") => Promise<typeof WebAudioModule>;

export default generate;
