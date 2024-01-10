//@ts-check
import path from "path";
import url from "url";
import { cpSync, rmSync } from "./fileutils.js";

// @ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

cpSync(path.join(__dirname, "./node_modules/@shren/fftw-js/dist/cjs-bundle/index.js"), "./src/fftw.txt");
