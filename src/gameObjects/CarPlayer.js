
class CarPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      scene.add.existing(this);
      scene.physics.add.existing(this);

      // INTERACCIÓN CON MUNDO
      this.setCollideWorldBounds(true);
      this.setOrigin(0.5, 0.5);
      
      // CONFIGURACIÓN DE HITBOX
      this.body.setSize(5, 10);
      this.body.setOffset(6, 3);
      
      this.cursors = scene.input.keyboard.createCursorKeys();
      
      /**  
      *  VARIABLES FÍSICAS DEL AUTO 
      *  1. velocidad y aceleración en píxeles por segundo 
      *  2. ángulo de giro en radianes
      */

      this.carSpeed = 0; // Velocidad inicial del auto
      this.acceleration = 10.05; // Aumento porcentual de la velocidad
      this.deceleration = 0.95; // Disminución porcentual de la velocidad
      this.maxSpeed = 200; // Velocidad máxima
      this.minSpeed = -50; // Velocidad mínima
      
      this.steeringAngle = 0; // Giro inicial
      this.maxSteeringAngle = Math.PI / 4; // Angulo giro máximo
      this.wheelBase = 40; // Distancia entre ejes

      // VELOCÍMETRO
      
      this.speedText = scene.add.text(10, 10, "Velocidad: 100", {
        fontSize: "20px",
        fill: "#fff",
      });
      this.accelerationText = scene.add.text(10, 40, "Aceleración: 1.05", {
        fontSize: "20px",
        fill: "#fff",
      });
  
      // DIBUJADO HITBOX
      this.carGraphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });

    }
    
    update(deltaTime) {

      /**
      *  LÓGICA MANEJO MANUAL DEL AUTO
      *  1. aceleración y desaceleración.
      *  2. giro del auto.
      */

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
    
      // VISUALIZACIÓN VELOCIMETRO
      this.speedText.setText("Velocidad: " + this.carSpeed.toFixed(2));
      this.accelerationText.setText(
        "Aceleración: " +
          (this.carSpeed >= this.minSpeed
            ? this.acceleration
            : this.deceleration
          ).toFixed(2)
      );
    
      // LÓGICA HITBOX DEL AUTO
      this.carGraphics.clear();
      const halfWidth = this.body.width / 2;
      const halfHeight = this.body.height / 2;
      const cosRotation = Math.cos(this.rotation);
      const sinRotation = Math.sin(this.rotation);
      
      // LÓGICA POSICIONES DEL AUTO
      const topLeft = {
        x: this.x - halfWidth * cosRotation + halfHeight * sinRotation,
        y: this.y - halfWidth * sinRotation - halfHeight * cosRotation
      };
      const topRight = {
        x: this.x + halfWidth * cosRotation + halfHeight * sinRotation,
        y: this.y + halfWidth * sinRotation - halfHeight * cosRotation
      };
      const bottomLeft = {
        x: this.x - halfWidth * cosRotation - halfHeight * sinRotation,
        y: this.y - halfWidth * sinRotation + halfHeight * cosRotation
      };
      const bottomRight = {
        x: this.x + halfWidth * cosRotation - halfHeight * sinRotation,
        y: this.y + halfWidth * sinRotation + halfHeight * cosRotation
      };
    
      this.carGraphics.strokeLineShape(new Phaser.Geom.Line(topLeft.x, topLeft.y, topRight.x, topRight.y));
      this.carGraphics.strokeLineShape(new Phaser.Geom.Line(topRight.x, topRight.y, bottomRight.x, bottomRight.y));
      this.carGraphics.strokeLineShape(new Phaser.Geom.Line(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y));
      this.carGraphics.strokeLineShape(new Phaser.Geom.Line(bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y));
    }
    
    handleCollision() {
      // Manejar la colisión entre el auto y los bordes de la pista
      console.log('Colisión con el borde de la pista');
      this.carSpeed = 0;
    }
  }
  
  export default CarPlayer;