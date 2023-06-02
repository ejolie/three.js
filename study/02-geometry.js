import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement); // canvas 타입의 dom 객체
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this); // 창 크기 변경될 때 resize
        this.resize(); // 렌더러와 카메라의 속성을 창 크기에 맞게 설정

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupCamera() {
        // 3차원 영역을 출력할 영역(가로, 세로)
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight() {
        // 광원 생성
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        // scene 객체의 구성 요소로 추가
        this._scene.add(light);
    }

    _setupModel() {
        // const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2); // 가로, 세로, 깊이에 대한 분할 수
        const geometry = new THREE.ConeGeometry(0.5, 1.6, 3);
        const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
        const cube = new THREE.Mesh(geometry, fillMaterial);

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            lineMaterial
        );

        // 하나의 오브젝트로 묶음
        const group = new THREE.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._cube = group;
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        // time: 렌더링 시작 이후 경과한 시간(ms)
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        time *= 0.001; // secondunit

        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
    }
}

window.onload = function () {
    new App();
};
