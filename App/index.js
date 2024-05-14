import { MathUtils, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import Stats from "stats.js";
export class App {
  constructor() {
    this.init();
  }

  init() {
    this._gl = new WebGLRenderer({
      canvas: document.querySelector("#canvas"),
    });

    this._gl.setSize(window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;

    this._camera = new PerspectiveCamera(60, aspect, 1, 1000);
    this._camera.position.z = 100;
    this._resize();

    this._scene = new Scene();

    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);
  }

  _resize() {
    this._gl.setSize(window.innerWidth, window.innerHeight);

    // CHANGE FOV
    let fov = Math.atan(window.innerHeight / 2 / this._camera.position.z) * 2;
    fov = MathUtils.radToDeg(fov);
    this._camera.fov = fov;

    const aspect = window.innerWidth / window.innerHeight;
    this._camera.aspect = aspect;
    this._camera.updateProjectionMatrix();
  }

  _animate() {
    this._stats.begin();
    this._gl.render(this._scene, this._camera);
    this._stats.end();
    window.requestAnimationFrame(this._animate.bind(this));
  }
}
