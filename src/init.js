import bootloader from "./bootloader.js";
import scenePlay from "./scenes/scenePlay.js";

const config = {
    width:500,
    height:500,
    parent: "container",
    pixelArt: true,
    physics: {
        default: "arcade"
    },
    scene: [
        bootloader,
        scenePlay
    ]
}

new Phaser.Game(config);

