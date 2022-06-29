import InitScene from "./scenes/InitScene.js";
import GameScene from "./scenes/gameScene.js";
import EndScene from "./scenes/EndScene.js";
import listenForm from "./formManager.js";

const gameContainer = document.querySelector(".game-container");

const config = {
    type: Phaser.AUTO,
    parent: gameContainer,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 100 },
        },
    },
    scene: [InitScene, GameScene, EndScene],
};

new Phaser.Game(config);

listenForm();
