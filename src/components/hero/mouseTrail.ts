import * as THREE from "three";

/** Must match the literal "128" in the wave vertex shader texture lookup. */
const MAX_TRAIL = 128;

type TrailPoint = { x: number; z: number; age: number; distDelta: number };

type MouseTrailParams = {
  fadeTime: number;
  trailSpacing: number;
};

/**
 * Mouse trail → DataTexture for the wave shader.
 * Adapted from franky-adl/3d-wave-grid (MIT).
 */
export class MouseTrail {
  readonly params: MouseTrailParams = {
    fadeTime: 2.0,
    trailSpacing: 0.1,
  };

  private trail: TrailPoint[] = [];
  private lastPoint: { x: number; z: number } | null = null;
  private timeSinceLastMove = 0;
  private randomPointTimer = 0;
  private isPlacingRandomPoints = true;
  private randomPointStrength = 0.8;

  private mouseCoords = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private rayPlane: THREE.Mesh;
  private trailData: Float32Array;
  private trailTexture: THREE.DataTexture;
  private _uniforms: {
    uTrailTexture: { value: THREE.DataTexture };
    uTrailCount: { value: number };
    uFadeTime: { value: number };
  };

  private camera: THREE.Camera;
  private element: HTMLElement;
  private bounds: number;
  private rect: DOMRect;
  private onPointerMove: (e: PointerEvent) => void;
  private onResize: () => void;

  constructor(camera: THREE.Camera, element: HTMLElement, bounds: number) {
    this.camera = camera;
    this.element = element;
    this.bounds = bounds;

    this.rayPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(bounds, bounds),
      new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false,
      }),
    );
    this.rayPlane.rotation.x = -Math.PI / 2;
    this.rayPlane.updateMatrixWorld(true);

    this.trailData = new Float32Array(MAX_TRAIL * 4);
    this.trailTexture = new THREE.DataTexture(
      this.trailData,
      MAX_TRAIL,
      1,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    this.trailTexture.needsUpdate = true;

    this._uniforms = {
      uTrailTexture: { value: this.trailTexture },
      uTrailCount: { value: 0 },
      uFadeTime: { value: this.params.fadeTime },
    };

    this.rect = element.getBoundingClientRect();
    this.onResize = () => {
      this.rect = this.element.getBoundingClientRect();
    };
    window.addEventListener("resize", this.onResize);

    this.onPointerMove = (e) => {
      this.mouseCoords.set(
        ((e.clientX - this.rect.left) / this.rect.width) * 2 - 1,
        -((e.clientY - this.rect.top) / this.rect.height) * 2 + 1,
      );

      this.raycaster.setFromCamera(this.mouseCoords, this.camera);
      const hits = this.raycaster.intersectObject(this.rayPlane);
      if (hits.length === 0) return;

      const { x, z } = hits[0].point;

      let distDelta = 0;
      if (this.lastPoint) {
        const dx = x - this.lastPoint.x;
        const dz = z - this.lastPoint.z;
        distDelta = Math.sqrt(dx * dx + dz * dz);
        if (distDelta < this.params.trailSpacing) return;
      }

      if (this.trail.length >= MAX_TRAIL) this.trail.shift();

      this.trail.push({ x, z, age: 0, distDelta });
      this.lastPoint = { x, z };
      this.timeSinceLastMove = 0;
      this.isPlacingRandomPoints = false;
      this.randomPointTimer = 0;
    };

    element.addEventListener("pointermove", this.onPointerMove);
  }

  get uniforms() {
    return this._uniforms;
  }

  setCamera(camera: THREE.Camera) {
    this.camera = camera;
  }

  update(delta: number) {
    const expiry = this.params.fadeTime * 4;

    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].age += delta;
      if (this.trail[i].age > expiry) this.trail.splice(i, 1);
    }

    this.timeSinceLastMove += delta;

    if (this.timeSinceLastMove >= 3.0 && !this.isPlacingRandomPoints) {
      this.isPlacingRandomPoints = true;
      this.randomPointTimer = 0;
    }

    if (this.isPlacingRandomPoints) {
      this.randomPointTimer += delta;
      if (this.randomPointTimer >= 1.5) {
        this.addRandomPoint();
        this.randomPointTimer = 0;
      }
    }

    const count = Math.min(this.trail.length, MAX_TRAIL);
    if (count > 0 || this._uniforms.uTrailCount.value > 0) {
      for (let i = 0; i < count; i++) {
        const ti = i * 4;
        this.trailData[ti] = this.trail[i].x;
        this.trailData[ti + 1] = this.trail[i].z;
        this.trailData[ti + 2] = this.trail[i].age;
        this.trailData[ti + 3] = this.trail[i].distDelta;
      }
      this.trailTexture.needsUpdate = true;
      this._uniforms.uTrailCount.value = count;
    }
  }

  dispose() {
    this.element.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("resize", this.onResize);
    this.trailTexture.dispose();
    this.rayPlane.geometry.dispose();
    (this.rayPlane.material as THREE.Material).dispose();
  }

  private addRandomPoint() {
    const x = (Math.random() * 0.5 - 0.25) * this.bounds;
    const z = (Math.random() * 0.5 - 0.25) * this.bounds;
    const distDelta = this.randomPointStrength + Math.random() * 0.2;
    if (this.trail.length >= MAX_TRAIL) this.trail.shift();
    this.trail.push({ x, z, age: 0, distDelta });
  }
}
