
class CarPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      scene.add.existing(this);
      scene.physics.add.existing(this);
  
      this.setCollideWorldBounds(true);
      this.setOrigin(0.5, 0.5);
  
      // Ajustar el tamaño de la hitbox del auto
      this.body.setSize(5, 5); // Ajusta estos valores según sea necesario
      this.body.setOffset(5, 5); // Ajusta estos valores según sea necesario
  
      this.cursors = scene.input.keyboard.createCursorKeys();
  
      this.carSpeed = 0; // Velocidad inicial del auto
      this.acceleration = 10.05; // Aumento porcentual de la velocidad
      this.deceleration = 5.95; // Disminución porcentual de la velocidad
      this.maxSpeed = 200; // Velocidad máxima
      this.minSpeed = -50; // Velocidad mínima
  
      this.steeringAngle = 0; // Giro inicial
      this.maxSteeringAngle = Math.PI / 4; // Angulo giro máximo
      this.wheelBase = 50; // Distancia entre ejes
  
      this.speedText = scene.add.text(10, 10, "Velocidad: 100", {
        fontSize: "20px",
        fill: "#fff",
      });
      this.accelerationText = scene.add.text(10, 40, "Aceleración: 1.05", {
        fontSize: "20px",
        fill: "#fff",
      });
  
      // Crear un gráfico para dibujar la hitbox del auto
      this.carGraphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
       // Crear un gráfico para el cono de visión
      this.visionCone = scene.add.graphics({ fillStyle: { color: 0xffff00, alpha: 0.5 } });
    }
  
    update(deltaTime) {
      // AUTO
      if (this.cursors.up.isDown) {
        this.carSpeed += this.acceleration * deltaTime;
        if (this.carSpeed > this.maxSpeed) {
          this.carSpeed = this.maxSpeed;
        }
      } else if (this.cursors.down.isDown) {
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
  
      if (this.cursors.left.isDown) {
        this.steeringAngle = -this.maxSteeringAngle;
      } else if (this.cursors.right.isDown) {
        this.steeringAngle = this.maxSteeringAngle;
      } else {
        this.steeringAngle = 0;
      }
  
      let turningRadius = this.wheelBase / Math.tan(this.steeringAngle);
      let angularVelocity = this.carSpeed / turningRadius;
  
      this.rotation += angularVelocity * deltaTime;
  
      this.setVelocity(
        this.carSpeed * Math.sin(this.rotation),
        -this.carSpeed * Math.cos(this.rotation)
      );
  
      if (this.cursors.space.isDown) {
        this.carSpeed *= this.deceleration;
        if (this.carSpeed < this.minSpeed) {
          this.carSpeed = this.minSpeed;
        }
      }
  
      // VELOCÍMETRO
      this.speedText.setText("Velocidad: " + this.carSpeed.toFixed(2));
      this.accelerationText.setText(
        "Aceleración: " +
          (this.carSpeed >= this.minSpeed
            ? this.acceleration
            : this.deceleration
          ).toFixed(2)
      );
  
      // Dibujar la hitbox del auto
      this.carGraphics.clear();
      this.carGraphics.strokeRect(
        this.body.x,
        this.body.y,
        this.body.width,
        this.body.height
      );
    }
  
    handleCollision() {
      // Manejar la colisión entre el auto y los bordes de la pista
      console.log('Colisión con el borde de la pista');
      this.carSpeed = 0; // Detener el auto en caso de colisión
    }
  }
  
  export default CarPlayer;