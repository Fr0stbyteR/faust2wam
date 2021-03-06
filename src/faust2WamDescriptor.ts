import type { FaustDspMeta } from "@shren/faustwasm/dist/esm-bundle";
import type { WamDescriptor } from "@webaudiomodules/api";

const faust2WamDescriptor = (dspMeta: FaustDspMeta, effectMeta: FaustDspMeta, poly = false) => {
    /** @type {Record<string, any>} */
    const flatMeta: Record<string, any> = {};
    for (const metaItem of dspMeta.meta) {
        for (const key in metaItem) {
            flatMeta[key] = metaItem[key];
        }
    }
    const { name, author, description, version, keywords, isInstrument, website } = flatMeta;
    return {
        name: name || "Faust User",
        vendor: author,
        description: description || "",
        version: version || "1.0.0",
        apiVersion: "2.0.0",
        keywords: keywords ? keywords.split(", ") : [],
        isInstrument: isInstrument === "true",
        website: website || "",
        faustMeta: {
            poly,
            effect: !!effectMeta
        }
    } as Partial<WamDescriptor> & Record<string, any>;
};

export default faust2WamDescriptor;
