//@ts-check
import path from "path";
import fs from "fs";
import url from "url";
import { cpSync } from "./fileutils.js";

// @ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @param {import("@shren/faustwasm").FaustDspMeta} dspMeta
 * @param {import("@shren/faustwasm").FaustDspMeta} effectMeta
 * @param {boolean} [poly]
 * @returns {Record<string, any>}
 */
const faust2WamDescriptor = (dspMeta, effectMeta, poly = false) => {
    /** @type {Record<string, any>} */
    const flatMeta = {};
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
    }
};

/**
 * @param {import("@shren/faustwasm").FaustDspMeta} dspMeta
 * @param {import("@shren/faustwasm").FaustDspMeta} effectMeta
 * @param {string} outputDir
 * @param {boolean} [poly]
 */
const faust2wamFiles = async (dspMeta, effectMeta, outputDir, poly = false) => {
    console.log(`Writing WAM2 assets files.`)
    const assetsPath = path.join(__dirname, "./assets/wam2");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    cpSync(assetsPath, outputDir);
    console.log(`Writing Descriptor file.`)
    const descriptorPath = path.join(outputDir, "descriptor.json");
    if (fs.existsSync(descriptorPath)) fs.unlinkSync(descriptorPath);
    fs.writeFileSync(descriptorPath, JSON.stringify(faust2WamDescriptor(dspMeta, effectMeta, poly), null, 4));
};

export { faust2WamDescriptor };

export default faust2wamFiles;

