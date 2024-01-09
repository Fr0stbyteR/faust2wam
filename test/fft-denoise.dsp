import("stdfaust.lib");

fftSize = hslider("fftSize", 1024, 2, 16384, 1); // global variable set by the processor itself
fftHopSize = hslider("fftHopSize", 1024, 2, 16384, 1); // global variable set by the processor itself
bufferSize = fftSize / 2 + 1; // Bins from 0Hz to Nyquist freq
freqPerBin = ma.SR / fftSize;
binToFreq = *(freqPerBin);
freqToBin = /(freqPerBin);

cartopol(x, y) = x * x + y * y : sqrt, atan2(y, x); // cartesian to polar
poltocar(r, theta) = r * cos(theta), r * sin(theta); // polar to cartesian

freezeBtn = checkbox("Capture");
reduceSld = hslider("Reduce", 0, 0, 2, 0.01);

freeze(rIn, iIn, bin) = out with { // 3 inputs for each audio channel: real, imaginary, current bin
    freezeSignal(sig, frz) = orig + freezed with {
        orig = sig * (1 - frz);
        freezed = orig : @(bufferSize) : + ~ (*(frz) : @(bufferSize - 1)) * frz;
    };
    out = freezeSignal(rIn, freezeBtn), freezeSignal(iIn, freezeBtn);
};
fftproc(rIn, iIn, bin) = out, out with { // 3 inputs for each audio channel: real, imaginary, current bin
    pol = cartopol(rIn, iIn);
    mag = pol : _, !;
    phase = pol : !, _;
    pol_freezed = freeze(rIn, iIn, bin) : cartopol;
    mag_freezed = pol_freezed : _, !;
    phase_freezed = pol_freezed : !, _;

    out = poltocar(mag * (1 - freezeBtn) + (mag - mag_freezed * reduceSld) * freezeBtn : max(0), phase);
};
process = fftproc;

