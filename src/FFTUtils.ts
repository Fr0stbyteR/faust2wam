export const FFTUtils = class {
    static get windowFunctions() {
        return [
            // hamming
            (i: number, N: number) => 0.54 - 0.46 * Math.cos(6.283185307179586 * i / (N - 1)),
            // hann
            (i: number, N: number) => 0.5 * (1 - Math.cos(6.283185307179586 * i / (N - 1))),
            // blackman
            (i: number, N: number) => {
                const a0 = 0.42;
                const a1 = 0.5;
                const a2 = 0.08;
                const f = 6.283185307179586 * i / (N - 1);
                return a0 - a1 * Math.cos(f) + a2 * Math.cos(2 * f);
            },
            // triangular
            (i: number, N: number) => 1 - Math.abs(2 * (i - 0.5 * (N - 1)) / N)
        ];
    }
    static async getFFT() {
        // eslint-disable-next-line
        const { instantiateFFTWModule, FFTW } = (globalThis as any).fftwwasm;
        const Module = await instantiateFFTWModule();
        const fftw = new FFTW(Module);
        return fftw.r2r.FFT1D;
    }
    static fftToSignal(f: Float32Array, r: Float32Array, i: Float32Array, b: Float32Array) {
        const fftSize = f.length - 2;
        const len = fftSize / 2 + 1;
        const invFFTSize = 1 / fftSize;
        for (let j = 0; j < len; j++) {
            r[j] = f[2 * j] * invFFTSize;
            if (i) i[j] = f[2 * j + 1] * invFFTSize;
            if (b) b[j] = j;
        }
    }
    static signalToFFT(r: Float32Array, i: Float32Array, f: Float32Array) {
        for (let j = 0; j < r.length; j++) {
            f[2 * j] = r[j];
            f[2 * j + 1] = i[j];
        }
    }
    static signalToNoFFT(r: Float32Array, i: Float32Array, f: Float32Array) {
        f.set(r.subarray(1, r.length));
        f.set(i.subarray(0, i.length - 1), r.length - 1);
    }
};
