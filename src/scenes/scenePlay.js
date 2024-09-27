import CarPlayer from '../gameObjects/CarPlayer.js';

class scenePlay extends Phaser.Scene {
  constructor() {
    super({ key: "scenePlay" });
  }

  preload() {
    // Cargar el sprite del auto
    this.load.image('player', 'path/to/player.png');
    this.load.image('road', 'path/to/road.png');
  }

  create() {
    this.road1 = this.add.image(250, 250, "road");
    this.road1.setScale(1);

    this.carPlayer = new CarPlayer(this, 89, 200, "player");

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
    this.physics.add.collider(this.carPlayer, collisionZones, this.carPlayer.handleCollision, null, this.carPlayer);
  }

  update(time, delta) {
    let deltaTime = delta / 1000;
    this.carPlayer.update(deltaTime);
  }
}

export default scenePlay;