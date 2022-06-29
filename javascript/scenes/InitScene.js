class InitScene extends Phaser.Scene {
    constructor() {
        super("initScene");
    }

    preload() {
        this.load.image("backgroundInit", "../../assets/images/backgroundInit.jpg");
        this.load.image("btnStart", "../../assets/images/btnStart.png");
        this.load.json("gameConfig", "../../data/gameConfig.json");
    }

    create() {
        this.gameConfig = this.cache.json.entries.entries.gameConfig;
        this.add.image(this.gameConfig.gameWidth / 2, this.gameConfig.gameHeight / 2, "backgroundInit").setScale(0.6);
        this.startBtn = this.add.image(this.gameConfig.gameWidth / 2, this.gameConfig.gameHeight / 2, "btnStart").setScale(0.5);
        this.startBtn.setInteractive();
        this.startBtn.on("pointerdown", this.startGame, this);
    }

    startGame() {
        this.scene.start("startGame");
    }
}

export default InitScene;
