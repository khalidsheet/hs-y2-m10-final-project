import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  MathUtils,
  Vector3,
  SRGBColorSpace,
  ShaderMaterial,
  RepeatWrapping,
} from "three";
import resources, { ASSETS } from "../Resources/Resource";
import { damp } from "maath/easing";

import vertex from "./shaders/index.vert";
import fragment from "./shaders/index.frag";

export default class Tiles extends Group {
  constructor() {
    super();

    this._isDragging = false;
    this._width = 400;

    // DRAG HORIZONTALLY
    this._dragSpeed = {
      prev: 0,
      current: 0,
    };

    // HOLDING
    this._holdingSpeed = {
      prev: 0,
      current: 0,
    };

    this._els = [];

    this._init();
  }

  _init() {
    const geometry = new PlaneGeometry(1, 1, 40, 40);

    for (
      let i = 0;
      i < ASSETS.filter((a) => a.type === "texture").length;
      i++
    ) {
      // LOAD MAP
      const map = resources.get(`t-${i + 1}`);
      map.colorSpace = SRGBColorSpace;
      map.wrapT = map.wrapS = RepeatWrapping;

      // GET THE RATIO OF THE ASSETS
      const ratio = map.image.naturalWidth / map.image.naturalHeight;

      // MATERIAL
      let material = new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uMap: { value: map },
          uBendFactor: { value: 0 },
          uHoldingSpeed: { value: 0 },
        },
      });

      //material = new MeshBasicMaterial({ map });
      const mesh = new Mesh(geometry, material);

      // SCALE
      const meshWidth = this._width;
      const meshHeight = this._width / ratio;
      mesh.scale.set(meshWidth, meshHeight, 1);

      // X, Y, Z
      mesh.position.x = this._width * i * 1.4 + MathUtils.randFloat(60, 80);
      mesh.position.y = MathUtils.randFloat(-30, 30);
      mesh.position.z = MathUtils.randFloat(-20, 20);
      mesh.userData.destinationPosition = mesh.position.clone();
      mesh.userData.initialPosition = mesh.position.clone();

      mesh.userData.dragPosition = mesh.position.clone();
      mesh.userData.dragPosition.z += MathUtils.randFloat(-30, -70);

      this.add(mesh);
      this._els.push(mesh);
    }
  }

  onDrag(e, delta) {
    this._isDragging = e.dragging;
    this._els.forEach((el) => {
      el.userData.destinationPosition.x += delta;
    });
  }

  update(delta) {
    const fixedDelta = 0.015;
    // CALC SPEED ON X
    this._dragSpeed.current = this._els[0].position.x;
    const speedX = this._dragSpeed.current - this._dragSpeed.prev;

    // CALC SPEED FOR HOLDING
    damp(
      this._holdingSpeed,
      "current",
      this._isDragging ? 1 : 0,
      0.28,
      fixedDelta
    );

    const holdingSpeed = this._holdingSpeed.current - this._holdingSpeed.prev;
    this._holdingSpeed.prev = this._holdingSpeed.current;

    // UPDATE MESHES
    this._els.forEach((el) => {
      //UPDATE UNIFORMS
      el.material.uniforms.uBendFactor.value = speedX;
      el.material.uniforms.uHoldingSpeed.value = holdingSpeed;

      // X
      damp(
        el.position,
        "x",
        el.userData.destinationPosition.x,
        0.28,
        fixedDelta
      );

      // Z
      const zTarget = this._isDragging
        ? el.userData.dragPosition.z
        : el.userData.initialPosition.z;

      damp(el.position, "z", zTarget, 0.28, fixedDelta);
    });

    this._dragSpeed.prev = this._dragSpeed.current;
  }
}
