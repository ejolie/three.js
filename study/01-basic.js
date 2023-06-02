import * as THREE from "../build/three.module.js";

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

        window.onresize = this.resize.bind(this); // 창 크기 변경될 때 resize
        this.resize(); // 렌더러와 카메라의 속성을 창 크기에 맞게 설정

        requestAnimationFrame(this.render.bind(this));
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
        // 파란색 정육면체 메쉬를 생성
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });
        // const material = new THREE.MeshBasicMaterial({ color: 0x44a88 });

        const cube = new THREE.Mesh(geometry, material);

        this._scene.add(cube);
        this._cube = cube;
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
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
        this._cube.rotation.z = time;
    }
}

window.onload = function () {
    new App();
};
