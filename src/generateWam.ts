import { FaustMonoDspGenerator, FaustPolyDspGenerator, FaustAudioWorkletNode } from "@shren/faustwasm/dist/esm-bundle";
import { CompositeAudioNode, ParamMgrNode, ParamMgrFactory } from "@webaudiomodules/sdk-parammgr";
import { WebAudioModule } from "@webaudiomodules/sdk";
import faust2WamDescriptor from "./faust2WamDescriptor";
import FaustDefaultGui from "./FaustDefaultGui";
import type { FaustDspDistribution } from "./types";

const generateWam = (faustDsp: FaustDspDistribution) => {
    class FaustCompositeAudioNode extends CompositeAudioNode {
        _wamNode: ParamMgrNode;
        _output: FaustAudioWorkletNode;
        setup(output: FaustAudioWorkletNode, paramMgr: ParamMgrNode) {
            if (output.numberOfInputs > 0) this.connect(output, 0, 0);
            paramMgr.addEventListener('wam-midi', (e) => output.midiMessage(e.detail.data.bytes));
            this._wamNode = paramMgr;
            this._output = output;
        }
        destroy() {
            super.destroy();
            if (this._output) this._output.destroy();
        }
        getParamValue(name: string) {
            return this._wamNode.getParamValue(name);
        }
        setParamValue(name: string, value: number) {
            return this._wamNode.setParamValue(name, value);
        }
    }
    
    const WAM = class extends WebAudioModule<ParamMgrNode> {
        faustNode: FaustAudioWorkletNode;
        async _loadDescriptor() {
            return Object.assign(this._descriptor, faust2WamDescriptor(faustDsp.dspMeta, faustDsp.effectMeta, !!faustDsp.mixerModule))
        }
        async initialize(state: any) {
            await this._loadDescriptor();
            return super.initialize(state);
        }
        async createAudioNode(initialState: any) {
            const voices = faustDsp.mixerModule ? 64 : 0;
    
            if (voices) {
                const generator = new FaustPolyDspGenerator();
                this.faustNode = await generator.createNode(
                    this.audioContext,
                    voices,
                    this.moduleId + "Faust",
                    { module: faustDsp.dspModule, json: JSON.stringify(faustDsp.dspMeta) },
                    faustDsp.mixerModule,
                    faustDsp.effectModule ? { module: faustDsp.effectModule, json: JSON.stringify(faustDsp.effectMeta) } : undefined
                );
            } else {
                const generator = new FaustMonoDspGenerator();
                this.faustNode = await generator.createNode(
                    this.audioContext,
                    this.moduleId + "Faust",
                    { module: faustDsp.dspModule, json: JSON.stringify(faustDsp.dspMeta) }
                );
            }
            const paramMgrNode = await ParamMgrFactory.create(this, { internalParamsConfig: Object.fromEntries(this.faustNode.parameters) });
            const node = new FaustCompositeAudioNode(this.audioContext);
            node.setup(this.faustNode, paramMgrNode);
            if (initialState) node.setState(initialState);
            return node;
        }
    
        async createGui() {
            const elementId = `${this.moduleId.toLowerCase().replace(/\W/g, "")}-ui`;
            try {
                customElements.define(elementId, FaustDefaultGui);
            } catch (e) {
                console.warn(e);
            }
            return new FaustDefaultGui(this.audioNode, this.faustNode);
        }
    }
    return WAM;
};

export default generateWam;
