import compile from "./compile";
import generateWam from "./generateWam";

const generate = async (code: string, name = "FaustDSP", argv = ["-I", "libraries/"], poly = false) => {
    const dsp = await compile(code, name, argv, poly);
    return generateWam(dsp);
};

export default generate;
