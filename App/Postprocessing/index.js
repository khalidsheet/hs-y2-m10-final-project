import { ShaderMaterial } from "three";
import { EffectComposer, RenderPass, ShaderPass } from "postprocessing";

import vertex from "./shaders/index.vert";
import fragment from "./shaders/index.frag";

export default class Postprocessing {
  constructor({ gl, scene, camera }) {
    this._gl = gl;
    this._scene = scene;
    this._camera = camera;

    this._init();
  }

  _init() {
    // COMPOSER
    const composer = new EffectComposer(this._gl);
    this._composer = composer;

    // RENDERPASS
    const rp = new RenderPass(this._scene, this._camera);
    composer.addPass(rp);

    // SHADERPASS
    const sm = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uPrevInput: { value: null },
      },
    });
    const shaderPass = new ShaderPass(sm, "uPrevInput");
    composer.addPass(shaderPass);
  }

  render() {
    this._composer.render();
  }
}
