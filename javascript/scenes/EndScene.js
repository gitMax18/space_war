class EndScene extends Phaser.Scene {
    constructor() {
        super("endScene");
    }
    init(data) {
        this.score = data.score;
    }
    preload() {
        this.load.image("backgroundEnd", "../../assets/images/gameOver.jpg");
        this.load.image("gameOverText", "../../assets/images/gameOverText.png");
        this.load.image("btnStart", "../../assets/images/btnStart.png");
        this.load.json("gameConfig", "../../data/gameConfig.json");
    }
    create() {
        this.gameConfig = this.cache.json.entries.entries.gameConfig;
        this.add.image(this.gameConfig.gameWidth / 2, this.gameConfig.gameHeight / 2, "backgroundEnd").setScale(0.7);
        this.add
            .text(this.gameConfig.gameWidth / 2, 100, "votre score: " + this.score, { fontSize: 48, fill: "green", fontFamily: "Orbitron", backgroundColor: "white" })
            .setPadding(10)
            .setOrigin(0.5, 0.5);
        this.add.image(this.gameConfig.gameWidth / 2, this.gameConfig.gameHeight / 2, "gameOverText");
        this.startBtn = this.add.image(this.gameConfig.gameWidth / 2, this.gameConfig.gameHeight - 100, "btnStart").setScale(0.3);
        this.startBtn.setInteractive();
        this.startBtn.on("pointerdown", this.startGame, this);
    }
    update() {}

    startGame() {
        this.scene.start("startGame");
    }
}

export default EndScene;
