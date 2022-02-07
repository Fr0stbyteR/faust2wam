import { WebAudioModule } from "@webaudiomodules/api";

declare const generate: (code: string, name?: string, argv?: string[], poly?: boolean) => Promise<typeof WebAudioModule>;

export default generate;
