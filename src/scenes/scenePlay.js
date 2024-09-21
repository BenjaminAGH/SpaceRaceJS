class scenePlay extends Phaser.Scene {
  constructor() {
    super({ key: "scenePlay" });
  }

  create() {
    this.road1 = this.add.image(
      250, 
      250, 
      "road"
    );

    this.road1.setScale(8.5);

    
    this.car = this.physics.add.sprite(250, 400, "player").setScale(3);
    this.car.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.carSpeed = 0;  // Velocidad inicial del auto
    this.acceleration = 5.05; // Aumento porcentual de la velocidad
    this.deceleration = 0.95; // Disminución porcentual de la velocidad
    this.maxSpeed = 50; // Velocidad máxima
    this.minSpeed = -50;  // Velocidad mínima 

    this.speedText = this.add.text(10, 10, 'Velocidad: 100', { fontSize: '20px', fill: '#fff' });
    this.accelerationText = this.add.text(10, 40, 'Aceleración: 1.05', { fontSize: '20px', fill: '#fff' });
  }

  update(time, delta) {

    let deltaTime = delta / 1000;

    // AUTO

    console.log(this.carSpeed);
    console.log(this.acceleration);
    
    if (this.cursors.up.isDown) {
      // Aceleración hacia adelante
      this.carSpeed += this.acceleration * deltaTime;
      if (this.carSpeed > this.maxSpeed) {
        this.carSpeed = this.maxSpeed;
      }
    } else if (this.cursors.down.isDown) {
      // Aceleración hacia atrás
      this.carSpeed -= this.acceleration * deltaTime;
      if (this.carSpeed < this.minSpeed) {
        this.carSpeed = this.minSpeed;
      }
    } else {
      if (this.carSpeed > 0) {
        this.carSpeed -= this.deceleration * deltaTime;
        if (this.carSpeed < 0) {
          this.carSpeed = 0;
        }
      } else if (this.carSpeed < 0) {
        this.carSpeed += this.deceleration * deltaTime;
        if (this.carSpeed > 0) {
          this.carSpeed = 0;
        }
      }
    }

    this.car.setVelocity(0, -this.carSpeed);


    if (this.cursors.left.isDown) {
      this.car.setVelocityX(-50);
    } else if (this.cursors.right.isDown) {
      this.car.setVelocityX(50);
    }

    if (this.cursors.space.isDown) {
      this.carSpeed *= this.deceleration;
      if (this.carSpeed < this.minSpeed) {
        this.carSpeed = this.minSpeed;
      }
    }

    this.speedText.setText('Velocidad: ' + this.carSpeed.toFixed(2));
    this.accelerationText.setText('Aceleración: ' + (this.carSpeed >= this.minSpeed ? this.acceleration : this.deceleration).toFixed(2));
  }
}

export default scenePlay;
