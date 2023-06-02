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
        camera.position.z = 25;
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
        // Object3D 타입의 solarSystem 객체 생성
        const solarSystem = new THREE.Object3D();
        this._scene.add(solarSystem);

        // 구 모양 지오메트리 생성
        const radius = 1;
        const widthSegments = 12;
        const heightSegments = 12;
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

        // 태양
        const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00, flatShading: true });
        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        // xyz에 대해 3,3,3 설정 -> 원래 지오메트리 크기보다 3배의 크기로 표시
        sunMesh.scale.set(3, 3, 3);
        solarSystem.add(sunMesh);

        // Object3D 타입의 earthOrbit 객체 생성
        const earthOrbit = new THREE.Object3D();
        // 생성한 earthOrbit 객체를 solarSystem의 자식으로 추가함 
        solarSystem.add(earthOrbit);

        // 지구
        const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233ff, emissive: 0x112244, flatShading: true });
        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        // 태양에서 x축으로 거리 10만큼 떨어진 위치에 지구가 배치되도록 하기 위함
        earthOrbit.position.x = 10;
        // earthMesh 객체를 earthOrbit의 자식으로 추가
        earthOrbit.add(earthMesh);

        // Object3D 타입의 moonOrbit 객체 생성
        const moonOrbit = new THREE.Object3D();
        /* 
        moonorbit은 earthOrbit의 자식이므로, earthOrbit 기준으로 x축 거리 2만큼 떨어진 곳에 배치됨
        태양 관점에서 보면 moonOrbit은 거리 12만큼 떨어진 곳에 배치됨
        */
        moonOrbit.position.x = 2;
        // 생성한 moonOrbit 객체를 earthOrbit의 자식으로 추가함
        earthOrbit.add(moonOrbit);

        // 달
        const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222, flatShading: true });
        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
        // 원래 구 반지름 절반 크기로 달이 생성됨
        moonMesh.scale.set(0.5, 0.5, 0.5);
        // moonMesh를 moonOrbit의 자식으로 추가
        moonOrbit.add(moonMesh);

        // 객체를 다른 메서드에서 참조할수 있도록함
        this._solarSystem = solarSystem;
        this._earthOrbit = earthOrbit;
        this._moonOrbit = moonOrbit;
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

        this._solarSystem.rotation.y = time / 2;
        this._earthOrbit.rotation.y = time * 2;
        this._moonOrbit.rotation.y = time * 5;
    }
}

window.onload = function () {
    new App();
};
