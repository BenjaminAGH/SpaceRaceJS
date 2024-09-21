
class bootloader extends Phaser.Scene {
    constructor(){
        super({key: "Bootloader"});
    }

    preload(){
        this.load.on("complete", () => {
            this.scene.start("scenePlay");
        });

        this.load.path = "./assets/Cars/";
        this.load.atlas("player", "player_blue.png", "player_blue_atlas.json"); 

        this.load.path = "./assets/Levels/";
        this.load.image("road", "Summer_road.png");


    }
    
}

export default bootloader;