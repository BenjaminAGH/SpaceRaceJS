
class carPlayer extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        this.body.setOrigin(0.5, 0.5);

        // VARIABLES - Set Hitbox
        this.car.body.setSize(5, 5);
        this.car.body.setOffset(5, 5);

        this.cursors = scene.input.keyboard.createCursorKeys();

        // VARIABLES - Control de Vehículo
        this.carSpeed = 0; // Velocidad inicial del auto

    }
}

export default carPlayer;