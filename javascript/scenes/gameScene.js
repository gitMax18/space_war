class GameScene extends Phaser.Scene {
    constructor() {
        super("startGame");
    }

    preload() {
        this.load.image("background", "../../assets/images/bg2.jpg");
        this.load.image("meteor", "../../assets/images/meteor_big.png");
        this.load.image("player", "../../assets/images/player.png");
        this.load.image("laser1", "../../assets/images/laser1.png");
        this.load.image("star", "../../assets/images/star.png");
        this.load.spritesheet("explosion", "../../assets/images/spriteMeteorExplode.png", {
            frameWidth: 392,
            frameHeight: 364,
        });
        this.load.audio("destroy", "../../assets/audio/destroy.wav");
        this.load.audio("getStar", "../../assets/audio/getStar.wav");
        this.load.audio("loosing", "../../assets/audio/loosing.wav");
        this.load.audio("destroyStar", "../../assets/audio/destroyStar.wav");
        this.load.json("gameConfig", "../../data/gameConfig.json");
    }

    create() {
        this.gameConfig = this.cache.json.entries.entries.gameConfig;
        this.isGameOver = false;
        this.score = 0;
        this.background = this.add.image(this.gameConfig.gameWidth / 2, this.gameConfig.gameHeight / 2, "background").setScale(0.6);
        this.player = this.physics.add.image(this.gameConfig.gameWidth / 2, this.gameConfig.gameHeight, "player");
        this.player.setCollideWorldBounds(true);

        this.meteors = this.physics.add.group({
            key: "meteor",
            x: 0,
            y: 0,
            repeat: this.gameConfig.meteorCount - 1,
            setXY: {
                stepX: this.generateRandX(),
                stepY: Phaser.Math.Between(0, 200),
            },
        });
        this.setObjVelocity(this.meteors);

        this.destroyAudio = this.sound.add("destroy");
        this.getStarAudio = this.sound.add("getStar");
        this.loosingAudio = this.sound.add("loosing");
        this.destroyStarAudio = this.sound.add("destroyStar");

        this.cursor = this.input.keyboard.createCursorKeys();
        this.input.on("pointerdown", this.shoot, this);

        this.stars = this.physics.add.group({
            key: "star",
            x: 0,
            y: 0,
            repeat: this.gameConfig.starCount - 1,
            setXY: {
                stepX: this.generateRandX(),
                stepY: Phaser.Math.Between(0, 200),
            },
        });

        this.setObjVelocity(this.stars);

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 9,
            hideOnComplete: true,
        });

        this.physics.add.collider(this.player, this.stars, this.addPoint, null, this);
        this.physics.add.collider(this.player, this.meteors, this.gameOver, null, this);

        this.scoreText = this.add.text(10, 10, "Score : 0", { fontSize: 32, color: "green" });

        this.increaseGravity = setInterval(() => {
            this.physics.world.gravity.y = this.physics.world.gravity.y + this.gameConfig.increaseGravityVal;
        }, 1000 * this.gameConfig.increaseInterval);
    }

    update() {
        if (this.isGameOver) {
            this.scene.start("endScene", { score: this.score });
        }
        if (this.cursor.left.isDown) {
            this.player.setVelocityX(-this.gameConfig.playerVelocity);
        } else if (this.cursor.right.isDown) {
            this.player.setVelocityX(this.gameConfig.playerVelocity);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursor.up.isDown) {
            this.player.setVelocityY(-this.gameConfig.playerVelocity);
        } else if (this.cursor.down.isDown) {
            this.player.setVelocityY(this.gameConfig.playerVelocity);
        } else {
            this.player.setVelocityY(0);
        }

        this.listenBottomPosition(this.meteors);
        this.listenBottomPosition(this.stars);
    }

    shoot() {
        this.laser1 = this.physics.add.image(this.player.x, this.player.y, "laser1");
        this.laser1.setVelocityY(-this.gameConfig.laserVelocity);
        this.laser1.body.setAllowGravity(false);
        this.physics.add.collider(this.laser1, this.meteors, this.destroyMeteor, null, this);
        this.physics.add.collider(this.laser1, this.stars, this.removeStar, null, this);
    }

    destroyMeteor(laser1, meteor) {
        this.explosion = this.add.sprite(meteor.x, meteor.y, "explosion");
        this.explosion.setScale(0.5);
        this.explosion.play("explode");
        this.destroyAudio.play();
        meteor.disableBody(true, true);
        laser1.disableBody(true, true);
        const randX = this.generateRandX();
        meteor.enableBody(true, randX, -100, true, true);
        this.setRandVelocity(meteor);
    }

    addPoint = (player, star) => {
        this.getStarAudio.play();
        this.resetObject(star);
        this.score += 1;
        this.scoreText.setText("Score : " + this.score);
    };

    removeStar = (laser, star) => {
        this.destroyStarAudio.play();
        laser.disableBody(true, true);
        this.resetObject(star);
        this.score -= this.gameConfig.starPenality;
        this.scoreText.setText("Score : " + this.score);
    };

    resetObject = (object) => {
        object.disableBody(true, true);
        const randX = this.generateRandX();
        object.enableBody(true, randX, -100, true, true);
        this.setRandVelocity(object);
    };

    setObjVelocity(objects) {
        objects.children.iterate((child) => {
            this.setRandVelocity(child);
        });
    }

    setRandVelocity(object) {
        const velX = Phaser.Math.Between(-this.gameConfig.objectVelocityX, this.gameConfig.objectVelocityX);
        const velY = Phaser.Math.Between(-this.gameConfig.objectVelocityY, this.gameConfig.objectVelocityY);

        object.setVelocity(velX, velY);
    }

    listenBottomPosition(objects) {
        objects.children.iterate((child) => {
            if (child.y > this.gameConfig.gameHeight) {
                this.resetPosition(child);
            }
        });
    }

    generateRandX() {
        return Phaser.Math.Between(10, this.gameConfig.gameWidth - 10);
    }

    resetPosition(object) {
        this.setRandVelocity(object);
        object.y = -50;
        const randX = this.generateRandX();
        object.x = randX;
    }

    gameOver(player, meteor) {
        this.loosingAudio.play();
        this.physics.pause();
        this.player.disableBody(true, true);
        this.isGameOver = true;
        this.explosion = this.add.sprite(player.x, player.y, "explosion");
        this.explosion.setScale(0.5);
        this.explosion.play("explode");
        clearInterval(this.increaseGravity);
    }
}

export default GameScene;
