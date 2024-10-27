import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {TransformControls} from "three/examples/jsm/controls/TransformControls"
import dat from 'dat.gui'
import Input from "./Input"

export default class GameScene {
    constructor({canvas}) {
        this.canvas = canvas;
        this.init();
        this.render();
    }
    
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 20, 50);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.resize();
        this.setUpEvents();
        this.setupLight();
        this.setupControl();
        this.setUpGui();
        this.setup();
        Input.init();
    }

    render() {
        this.OrbitControls.update();
        this.renderer.render(this.scene, this.camera);
        this.update();
        Input.clear();

        requestAnimationFrame( () => {
            this.render();
        });
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setUpEvents() {
        window.addEventListener('resize', ()=> {
            this.resize();
        })
    }

    setupControl() {
        this.OrbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    setupLight() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(this.ambientLight);

        this.pointLight = new THREE.PointLight(0xffffff, 5000.0);
        this.pointLight.position.set(20, 80, 30);
        this.scene.add(this.pointLight);


    }

    setUpGui() {
        this.gui = new dat.GUI();
    }

}