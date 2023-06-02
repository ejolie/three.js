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
        this._setupModel3();
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
        camera.position.z = 3;
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

    /* PointsMaterial */
    _setupModel1() {
        /* 10000개의 좌표를 vertices 배열에 추가 */
        const vertices = [];
        for (let i = 0; i < 10000; i++) {
            /* THREE.Math.randFloatSpread(5) : -5~5 사이의 난수값 생성 */
            const x = THREE.MathUtils.randFloatSpread(5);
            const y = THREE.MathUtils.randFloatSpread(5);
            const z = THREE.MathUtils.randFloatSpread(5);

            vertices.push(x, y, z);
        }

        const geometry = new THREE.BufferGeometry();
        /* geometry.setAttribute()을 통해 geometry의 position 속성에 vertices 배열을 Float32BufferAttribute 로 랩핑하여 전달 */
        /* new THREE.Float32BufferAttribute(vertices, 3) : vertices 배열에 저장된 좌표가 xyz로 하나의 좌표라는 의미 */
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        //console.log(geometry.attributes.position)

        /* 원 이미지 */
        const sprite = new THREE.TextureLoader().load('../examples/textures/sprites/disc.png');

        /* PointsMaterial 재질 생성 */
        /* map : 렌더링, alphaTest : 이미지의 픽셀 값 중 알파값이 이 alphaTest 보다 클때만 픽셀이 렌더링 되도록 함, color : 포인트의 색상 값, size : 포인트의 크기, sizeAttenuation : 포인트가 카메라의 거리에 따라 크기가 감쇄되도록 하는 여부 */
        const material = new THREE.PointsMaterial({ map: sprite, alphaTest: 0.5, color: 0x00ffff, size: 0.1, sizeAttenuation: true });

        /* Points 타입의 Object3D 생성 */
        const points = new THREE.Points(geometry, material);
        this._scene.add(points);
    }

    /* LineBasicMaterial */
    _setupModel2() {
        /* line 에 대한 좌표 */
        const vertices = [
            -1, 1, 0,
            1, 1, 0,
            -1, -1, 0,
            1, -1, 0,
        ];

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        // const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const material = new THREE.LineDashedMaterial({ color: 0xffff00, dashSize: 0.2, gapSize: 0.1, scale: 2 });

        //const line = new THREE.Line(geometry, material);
        //const line = new THREE.LineSegments(geometry, material);
        const line = new THREE.LineLoop(geometry, material);
        line.computeLineDistances();
        this._scene.add(line);
    }


    /* Mesh Material */
    _setupModel3() {
        const material = new THREE.MeshPhysicalMaterial({
            /* material */
            visible: true,
            transparent: false,
            opacity: 1,
            depthTest: true, // z buffer 검사 여부
            depthWrite: true,
            side: THREE.FrontSide, // 어느쪽 면을 렌더링할 건지

            /* MeshBasicMaterial */
            /* color: 0xffff00,  //mesh 의 색상,
            wireframe: true //mesh 를 선형태로 렌더링 할것인지에 대한 여부 */

            /* MeshLambertMaterial */
            /* 
            color: 0xffffff,
            emissive: 0x00000, //광원에 영향을 받지 않는 재질 자체에서 방출하는 색상 값
            wireframe: false, 
            */

            /* MeshPhongMaterial */
            /* 
            color: 0xff0000,
            emissive: 0x00000,
            specular: 0xffff00, // 광원에 의해 반사 되는 색상
            shininess: 10, // 반사되는 정도
            flatShading: false, // 평편하게 렌더링 할지에 대한 여부
            wireframe: false, 
            */

            /* MeshStandardMaterial */
            /* 
            color: 0xff0000,
            emissive: 0x00000, // 재질 자체에서 발광하는 색상
            roughness: 0.25, // 거칠기
            metalness: 0.6, // 금속성
            wireframe: false,
            flatShading: false,
            */

            /* MeshPhysicalMaterial  */
            color: 0xff0000,
            emissive: 0x00000,
            roughness: 1,
            metalness: 0,
            clearcoat: 0.4, // 표면에 코팅 효과가 적용되는 정도
            clearcoatRoughness: 0, // 코팅에 대한 거칠기 값
            wireframe: false,
            flatShading: false,
        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        box.position.set(-1, 0, 0);
        this._scene.add(box);

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material);
        sphere.position.set(1, 0, 0);
        this._scene.add(sphere);
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
    }
}

window.onload = function () {
    new App();
};
