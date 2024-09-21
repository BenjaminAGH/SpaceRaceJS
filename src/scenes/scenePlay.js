class scenePlay extends Phaser.Scene {
  constructor() {
    super({ key: "scenePlay" });
  }

  create() {
    this.road1 = this.add.image(250, 500, "road");
    this.road1.setScale(8.5);

    this.road2 = this.add.image(
      250,
      this.road1.y - this.road1.displayHeight,
      "road"
    );
    this.road2.setScale(8.5);

    this.car = this.physics.add.sprite(250, 400, "player").setScale(3);
    this.car.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.backgroundSpeed = 5;
    this.carSpeed = 50;  // Velocidad inicial del auto
    this.acceleration = 1.05; // Aumento porcentual de la velocidad
    this.deceleration = 0.95; // Disminución porcentual de la velocidad
    this.maxSpeed = 500; // Velocidad máxima
    this.minSpeed = -100;  // Velocidad mínima para moverse hacia atrás

     // Crear textos para mostrar la velocidad y aceleración en pantalla
    this.speedText = this.add.text(10, 10, 'Velocidad: 100', { fontSize: '20px', fill: '#fff' });
    this.accelerationText = this.add.text(10, 40, 'Aceleración: 1.05', { fontSize: '20px', fill: '#fff' });
  }

  update() {
    // FONDO
    //this.road1.y += this.backgroundSpeed;
    //this.road2.y += this.backgroundSpeed;

    //if (this.road1.y >= 500 + this.road1.displayHeight / 2) {
    //  this.road1.y = this.road2.y - this.road1.displayHeight;
    //}
    //if (this.road2.y >= 500 + this.road2.displayHeight / 2) {
    //  this.road2.y = this.road1.y - this.road2.displayHeight;
    //}

    // AUTO
    
    if (this.cursors.up.isDown) {
      this.carSpeed *= this.acceleration;
      if (this.carSpeed > this.maxSpeed) {
        this.carSpeed = this.maxSpeed;
      }

      this.car.setVelocity(0, -this.carSpeed);

    } else if (this.cursors.down.isDown) {
      this.carSpeed *= this.acceleration;

      if (this.carSpeed > this.maxSpeed) {
        this.carSpeed = this.maxSpeed;
      }
  
      this.car.setVelocity(0, this.carSpeed);
    } 

    if (this.cursors.left.isDown) {
      this.car.setVelocityX(-100);
    } else if (this.cursors.right.isDown) {
      this.car.setVelocityX(100);
    }

    if (this.cursors.space.isDown) {
      this.carSpeed *= this.deceleration;
      if (this.carSpeed < this.minSpeed) {
        this.carSpeed = this.minSpeed;
      }
    }

    // Actualizar los textos de velocidad y aceleración
    this.speedText.setText('Velocidad: ' + this.carSpeed.toFixed(2));
    this.accelerationText.setText('Aceleración: ' + (this.carSpeed >= this.minSpeed ? this.acceleration : this.deceleration).toFixed(2));
  }
}

export default scenePlay;
