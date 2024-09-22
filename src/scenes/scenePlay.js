class scenePlay extends Phaser.Scene {
  constructor() {
    super({ key: "scenePlay" });
  }

  create() {
    this.road1 = this.add.image(250, 250, "road");

    this.road1.setScale(1);

    this.car = this.physics.add.sprite(250, 350, "player").setScale(1);
    this.car.setCollideWorldBounds(true);
    this.car.setOrigin(0.5, 0.5);

    // Ajustar el tamaño de la hitbox del auto
    this.car.body.setSize(5, 5);
    this.car.body.setOffset(5, 5);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.carSpeed = 0; // Velocidad inicial del auto
    this.acceleration = 5.05; // Aumento porcentual de la velocidad
    this.deceleration = 0.95; // Disminución porcentual de la velocidad
    this.maxSpeed = 200; // Velocidad máxima
    this.minSpeed = -50; // Velocidad mínima

    this.steeringAngle = 0; // Giro inicial
    this.maxSteeringAngle = Math.PI / 4; // Angulo giro máximo
    this.wheelBase = 50; // Distancia entre ejes

    this.speedText = this.add.text(10, 10, "Velocidad: 100", {
      fontSize: "20px",
      fill: "#fff",
    });
    this.accelerationText = this.add.text(10, 40, "Aceleración: 1.05", {
      fontSize: "20px",
      fill: "#fff",
    });

    // Crear un mapa de bits a partir de la imagen 'road'
    let roadBitmap = this.textures.get("road").getSourceImage();
    let roadCanvas = this.textures.createCanvas(
      "roadCanvas",
      roadBitmap.width,
      roadBitmap.height
    );
    roadCanvas.draw(0, 0, roadBitmap);

    // Crear un gráfico para dibujar los bordes
    this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0xff0000 } });

    // Crear un gráfico para dibujar la hitbox del auto
    this.carGraphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });    

    // Detectar las áreas rojas y crear zonas de colisión
    this.createCollisionZones(roadCanvas);
  }

  createCollisionZones(roadCanvas) {
    let context = roadCanvas.context;
    let imageData = context.getImageData(0, 0, roadCanvas.width, roadCanvas.height);
    let data = imageData.data;
  
    let collisionZones = this.physics.add.staticGroup();
  
    for (let y = 0; y < roadCanvas.height; y++) {
      for (let x = 0; x < roadCanvas.width; x++) {
        let index = (y * roadCanvas.width + x) * 4;
        let red = data[index];
        let green = data[index + 1];
        let blue = data[index + 2];
  
        // Detectar píxeles rojos
        if (red > 200 && green < 50 && blue < 50) {
          // Crear una zona de colisión en la posición detectada
          let zone = this.add.zone(x, y, 1, 1).setOrigin(0, 0);
          collisionZones.add(zone);

          this.graphics.strokeRect(x, y, 1, 1);
        }
      }
    }
  
    // Habilitar la física para las zonas de colisión
    this.physics.world.enable(collisionZones);
  
    // Configurar la colisión entre el auto y las zonas de colisión
    this.physics.add.collider(this.car, collisionZones, this.handleCollision, null, this);
  }

  handleCollision(car, zone) {
    // Manejar la colisión entre el auto y los bordes de la pista
    console.log('Colisión con el borde de la pista');
    this.carSpeed = 0; // Detener el auto en caso de colisión
  }

  update(time, delta) {
    let deltaTime = delta / 1000;

    // AUTO

    console.log(this.carSpeed);
    console.log(this.acceleration);

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

    // this.car.setVelocity(0, -this.carSpeed);

    if (this.cursors.left.isDown) {
      this.steeringAngle = -this.maxSteeringAngle;
    } else if (this.cursors.right.isDown) {
      this.steeringAngle = this.maxSteeringAngle;
    } else {
      this.steeringAngle = 0;
    }

    let turningRadius = this.wheelBase / Math.tan(this.steeringAngle);
    let angularVelocity = this.carSpeed / turningRadius;

    this.car.rotation += angularVelocity * deltaTime;

    this.car.setVelocity(
      this.carSpeed * Math.sin(this.car.rotation),
      -this.carSpeed * Math.cos(this.car.rotation)
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
        this.car.body.x,
        this.car.body.y,
        this.car.body.width,
        this.car.body.height
    );    
  }
}

export default scenePlay;
