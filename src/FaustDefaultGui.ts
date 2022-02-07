import { FaustUI } from "@shren/faust-ui";
import { FaustAudioWorkletNode } from "@shren/faustwasm";
import { ParamMgrNode } from "@webaudiomodules/sdk-parammgr";
import style from "@shren/faust-ui/dist/esm/index.css";

class FaustDefaultGui extends HTMLElement {
    wamNode: ParamMgrNode;
    faustNode: FaustAudioWorkletNode;
    root: ShadowRoot;
    faustUI: FaustUI;

	constructor(wamNode: ParamMgrNode, faustNode: FaustAudioWorkletNode, styleIn = style) {
		super();
		this.wamNode = wamNode;
		this.faustNode = faustNode;
		this.root = this.attachShadow({ mode: 'open' });
		const $style = document.createElement('style');
		$style.innerHTML = styleIn;
		this.root.appendChild($style);
		const $container = document.createElement('div');
		$container.style.margin = '0';
		$container.style.position = 'relative';
		$container.style.overflow = 'auto';
		$container.style.display = 'flex';
		$container.style.flexDirection = 'column';
		this.faustUI = new FaustUI({
			ui: faustNode.getUI(),
			root: $container,
			listenWindowMessage: false,
			listenWindowResize: false,
		});
		this.faustUI.paramChangeByUI = (path, value) => {
			wamNode.setParamValue(path, value);
		};
		faustNode.setOutputParamHandler((path, value) => this.faustUI.paramChangeByDSP(path, value));
		$container.style.width = `${this.faustUI.minWidth}px`;
		$container.style.height = `${this.faustUI.minHeight}px`;
		this.root.appendChild($container);

		window.requestAnimationFrame(this.handleAnimationFrame);
	}

	handleAnimationFrame = async () => {
		const values = await this.wamNode.getParameterValues();
		for (const key in values) {
			const { value } = values[key];
			this.faustUI.paramChangeByDSP(key, value);
		}
		window.requestAnimationFrame(this.handleAnimationFrame);
	}

	connectedCallback() {
		this.faustUI.resize();
	}
}

export default FaustDefaultGui;
