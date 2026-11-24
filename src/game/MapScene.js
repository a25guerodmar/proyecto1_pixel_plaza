import Phaser from 'phaser';

export class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    preload() {
        this.load.image('tiles_plaza', 'assets/tileset.png');
        this.load.tilemapTiledJSON('mapa_plaza', 'assets/mapa.json');
    }

    create() {
        const map = this.make.tilemap({
            key: "mapa_plaza"
        });

        // Conectar el tileset con la imagen
        const tileset = map.addTilesetImage('tileset_tiled', 'tiles_plaza');

        if(!tileset) {
            console.error('Error: revisa el nombre tileset_tiled');
            return;
        }

        // Crear las capas en el orden correcto
        const capaTerra = map.createLayer('terra', tileset, 0, 0);
        const capaParets = map.createLayer('parets', tileset, 0, 0);

        // Colision de las paredes

        capaParets?.setCollisionByProperty({ collides: true });


        // Leer los objetos del Tiled

        const capaObjectes = map.getObjectLayer('Objectes');

        const elementsDetectats = [];

        capaObjectes?.objects.forEach((obj) => {
            
            //Leer las propiedades personalizadas
            const propietats = this.obtenirPropietats(obj);

            // Calcular el centro del obj
            const cx = obj.x + (obj.width || 0) / 2;
            const cy = obj.y + (obj.height || 0) / 2;

            // SPAWN

            if(propietats.tipus === 'spawn') {
                this.avatar = this.add.circle(
                    cx,
                    cy,
                    14,
                    0x10b981
                ).setStrokeStyle(2, 0xffffff);
            }

            // ZONA : Sala de Reunions

            if(propietats.tipus === 'zona') {
                this.add.rectangle(
                    cx,
                    cy,
                    obj.width,
                    obj.height,
                    0x10b981,
                    0.22
                ).setSrokeStyle(2, 0x10b981);

                this.add.text(
                    cx,
                    cy,
                    propietats.nomSala || 'Zona',
                    {
                        fontSize: '13px',
                        color: '#a7f3d0'
                    }
                ).setOrigin(0.5);

                elementsDetectats.push({
                    tipus: 'Zona',
                    nom: propietats.nomSala || 'Sense nom',
                    aforament: propietats.aforament || 0
                });
            }

        });

        // Enviar los elementos detectados a Vue
        this.game.events.emit('mapa-carregat', elementsDetectats);
    }

    obtenirPropietats(obj) {
        const resultat = {};

        (obj.properties || []).forEach((p) => {
            resultat[p.name] = p.value;
        })

        return resultat;
    }
}