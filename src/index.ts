import compile from "./compile";
import generateWam from "./generateWam";

const generate = async (code: string, name = "FaustDSP", argv = ["-I", "libraries/"], polyOrFFT: boolean | "fft" = false) => {
    const dsp = await compile(code, name, argv, polyOrFFT === true);
    return generateWam(dsp, polyOrFFT === "fft");
};

export default generate;
