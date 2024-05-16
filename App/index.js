import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Color,
  MathUtils,
  Clock,
  DirectionalLight,
  DirectionalLightHelper,
} from "three";
import Stats from "stats.js";
import Tiles from "./Plane/Plane";
import resouces from "./Resources/Resource";
import Postprocessing from "./Postprocessing";

export class App {
  constructor() {
    this._init();
  }

  async _init() {
    // RENDERER
    this._gl = new WebGLRenderer({
      canvas: document.querySelector("#canvas"),
    });

    this._gl.setSize(window.innerWidth, window.innerHeight);

    // CAMERA
    const aspect = window.innerWidth / window.innerHeight;

    this._camera = new PerspectiveCamera(60, aspect, 1, 2000);
    this._camera.position.z = 990;
    this._resize();

    // LOAD EVERYTHING
    await resouces.load();

    // SCENE
    this._scene = new Scene();
    this._scene.background = new Color(0x16201f);

    // COMPOSER
    this._composer = new Postprocessing({
      gl: this._gl,
      scene: this._scene,
      camera: this._camera,
    });

    // PLANES
    this._initBall();
    this._initScene();
    this._initBallLight();
    this._initBallLight2();

    // STATS
    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);

    // CLOCK
    this._clock = new Clock();

    this._animate();

    this._initEvents();
  }

  _initScene() {
    const tiles = new Tiles();
    this._tiles = tiles;

    this._scene.add(tiles);
  }

  onDrag(e, delta) {
    this._rotateBall(e, delta);
    this._tiles.onDrag(e, delta);
  }

  _initEvents() {
    window.addEventListener("resize", this._resize.bind(this));
  }

  _initBall() {
    this._ball = resouces.get("ball");
    this._ball.scene.position.set(0, 450, 0);
    this._ball.scene.scale.set(60, 60, 60);
    this._scene.add(this._ball.scene);
  }

  _rotateBall(e, delta) {
    if (!this._scene.children[1]) return;

    if (e.isFirst) {
      this._scene.children[1].rotation.y = 0;
    }

    if (e.isFinal) {
      this._scene.children[1].rotation.y = 0;
    }

    console.log(delta);

    this._ball.scene.rotation.y += delta * 0.005;
    this._light.position.x += delta * 0.44433;
    this._light.position.z += delta * 0.5;

    this._light2.position.x += delta * 0.44433;
    this._light2.position.z += delta * 0.5;

    // get the ball to move to the end of the screen and lock it there
    if (
      this._ball.scene.position.x >= 500 ||
      this._ball.scene.position.x <= -500
    ) {
      this._ball.scene.position.x =
        this._ball.scene.position.x > 0 ? 500 : -500;
    }

    this._ball.scene.position.x += delta * 0.1;
  }

  _initBallLight() {
    this._light = new DirectionalLight(0xff00ff, 10);
    this._light.position.set(90, 0, -10);
    this._scene.add(this._light);
  }

  _initBallLight2() {
    this._light2 = new DirectionalLight(0x00ffff, 10);
    this._light2.position.set(-90, 0, -10);
    this._scene.add(this._light2);
  }

  _resize() {
    this._gl.setSize(window.innerWidth, window.innerHeight);

    // CHANGE FOV
    // let fov = Math.atan(window.innerHeight / 2 / this._camera.position.z) * 2;
    // fov = MathUtils.radToDeg(fov);
    // this._camera.fov = fov;

    const aspect = window.innerWidth / window.innerHeight;
    this._camera.aspect = aspect;
    this._camera.updateProjectionMatrix();
  }

  _animate() {
    this._stats.begin();

    this._clock.delta = this._clock.getDelta();
    this._tiles.update();

    //this._gl.render(this._scene, this._camera);
    this._composer.render();
    this._stats.end();
    window.requestAnimationFrame(this._animate.bind(this));
  }
}
