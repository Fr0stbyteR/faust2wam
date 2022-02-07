# Faust2Wam
Statically/Dynamically generate [WebAudioModule](https://github.com/webaudiomodules/api) from a Faust DSP code.

## Usage

Please use a stable version of [Node.js](https://nodejs.org) 16+ to work with this project.

### Use the command line interface

Clone and get into this project:
```bash
git clone https://github.com/fr0stbyter/faust2wam
cd faust2wam
```

#### Generate static WAM files from a Faust DSP
For example:
```bash
rm -rf test/out # make sure you are under the faust2wam directory.
node faust2wam.js test/rev.dsp test/out
```
or
```bash
rm -rf test/out # make sure you are under the faust2wam directory.
node faust2wam.js test/poly.dsp test/out -poly
```

#### Dynamically generate WAMs from a Faust DSP code in a browser

```JavaScript
	// Load the WAM
	const { default: generate } = await import("./dist/index.js");
	// Load the DSP file
	const dspResp = await fetch("./test/rev.dsp");
    // Generate the WAM
	const WAM = await generate(await dspResp.text(), "Reverb");
```

