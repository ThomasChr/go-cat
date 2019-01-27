class DDaveLevel extends BaseLevelScene {

    constructor() {
        super({ key: 'DDaveLevel' })
    }

    preload() {
        super.preload();

        this.load.tilemapTiledJSON("mapDave","assets/maps/DDaveLevel/dave.json");
        this.load.image('tilesDave',"assets/images/DDaveLevel/DDaveTileset.png");
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('dogImage', 'assets/images/SpaceLevel/dog.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.spritesheet('animcat', 'assets/images/cat_walking_animated.png', { frameWidth: 97, frameHeight: 101 });
        this.load.image('cape', 'assets/images/cape.png');
        this.load.spritesheet('animcape', 'assets/images/capeSprite.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('home', 'assets/images/house_home_transparent.png');
        this.load.image('wool', 'assets/images/ball_wool.png');

        // Audio
        this.load.audio('backgroundmusidave', 'assets/sounds/songs/Industrial_Cinematic.mp3');
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("bark", "assets/sounds/animals/dog_bark_short.ogg");
        this.load.audio("dogLong", "assets/sounds/animals/dog_bark_long.ogg");
        this.load.audio("jump", "assets/sounds/movement/jump_sfx_movement_jump8.wav");
        this.load.audio("land", "assets/sounds/movement/land_sfx_movement_jump9_landing.wav");
        this.load.audio("whining", "assets/sounds/animals/dog_whining.ogg");
    }

    create() {
        // Music!
        this.music = this.sound.add('backgroundmusidave');
        try {
            this.music.play();
        } catch {
            console.log('no audio possible');
        }

        // layer and mapDave for the TilemapDave
        let mapDave = this.make.tilemap({ key: "mapDave", tileWidth: 16, tileHeight: 16 });
        let tileset = mapDave.addTilesetImage("dave","tilesDave");

        let collisionLayer = mapDave.createStaticLayer("obstacles", tileset, 0, 0);
        collisionLayer.setCollisionByProperty({ collides: true });

        // bounds
        this.physics.world.setBounds(0,0,3200,3200, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 3200, 3200);

        // Variables
        this.millis = 0;
        this.timeout = 1000;
        this.shootFlag = false;
        this.shootMillis = 0;
        this.shootDirection = 1;

        // The cat and its settings
        this.cat = this.physics.add.sprite(200, 3000, 'cat');
        this.cat.setBounce(0.1);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 500;
        this.cat.scaleY=0.6;
        this.cat.scaleX=0.6;

        this.anims.remove('walk');
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('animcat', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.remove('stand');
        this.anims.create({
            key: 'stand',
            frames: [ { key: 'animcat', frame: 0 } ],
            frameRate: 20,
        });

        // Cape
        this.anims.remove('cape');
        this.anims.create({
            key: 'cape',
            frames: this.anims.generateFrameNumbers('animcape', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        // "Read" the Object-Layers
        this.dogSpawnLayer =  mapDave.objects.filter((mapDavelayer)=> {
            return mapDavelayer.name == "dogspawn";
        })[0];
        this.miceSpawnLayer =  mapDave.objects.filter((mapDavelayer)=> {
            return mapDavelayer.name == "micespawn";
        })[0];
        this.safezoneLayer =  mapDave.objects.filter((mapDavelayer)=> {
            return mapDavelayer.name == "safezone";
        })[0];

        // Create a Dogs-Object-Array
        this.dogs = [];
        this.dogsSprites = this.physics.add.group();
        this.createDogs();


        // Create HiddenCape
        this.cape = this.physics.add.sprite(95*32,96*32,"cape");
        this.cape.body.allowGravity = false;
        this.capeMode = false

        // Create a Mice-Object-Array
        this.mice = [];
        this.miceSprites = this.physics.add.group();
        for(let i = 0; i < this.miceSpawnLayer.objects.length; i++){
            let mouseStartX = this.miceSpawnLayer.objects[i].x ;
            let mouseStartY = this.miceSpawnLayer.objects[i].y-20;
            let mousePath = this.miceSpawnLayer.objects[i].width;
            let mouseSpeed = Phaser.Math.Between(50, 80);
            let sprite = this.physics.add.sprite(mouseStartX, mouseStartY,"mouse");
            sprite.flipX = true;
            sprite.body.gravity.y=1000;
            this.miceSprites.add(sprite);
            sprite.setVelocityX(mouseSpeed);
            this.mice.push({"sprite" : sprite ,"path": mousePath, "startX": mouseStartX, "speed": mouseSpeed});
        }

        let lay = this.safezoneLayer.objects[0];
        this.safezone = this.physics.add.image(lay.x + lay.width/2 , lay.y + lay.height/2 ,"home");
        this.safezone.body.allowGravity = false;
        this.safezone.displayHeight = lay.height;
        this.safezone.displayWidth = lay.width;

        //  Collide the cat and the mice with the platforms
        this.physics.add.collider(this.cat, collisionLayer);
        this.physics.add.collider(this.miceSprites, collisionLayer);
        this.physics.add.collider(this.dogsSprites, collisionLayer);
        this.physics.add.collider(this.cat, this.dogsSprites, this.hitDog, null, this);


        this.physics.add.overlap(this.cat, this.miceSprites, this.collectMouse, null, this);
        this.physics.add.overlap(this.cat, this.cape, () =>{
            this.capeMode = true;
            }, null, this);
        this.physics.add.overlap(this.cat, this.safezone, () => {
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
            }, null, this);

        this.cameras.main.startFollow(this.cat);
        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        for(let i =0; i<this.mice.length; i++){
            let currentMouse = this.mice[i];
            if (currentMouse["sprite"].x > currentMouse["startX"]+currentMouse["path"]) {
                currentMouse["sprite"].setVelocityX(-currentMouse["speed"]);
                if (currentMouse["sprite"].flipX === true) {
                    currentMouse["sprite"].flipX = false;
                }
            }
            if (currentMouse["sprite"].x < currentMouse["startX"]){
                currentMouse["sprite"].setVelocityX(currentMouse["speed"]);
                if (currentMouse["sprite"].flipX === false  ) {
                    currentMouse["sprite"].flipX = true;
                }
            }
        }

        if (this.capeMode){
            this.cape.anims.play('cape', true);
            this.cape.setX(-this.shootDirection * 12 +this.cat.x);
            this.cape.setY(this.cat.y-5);
        }
        if (this.cat.velocity < 10){
            try {
                this.sound.play("land");
            } catch {
                console.log('no audio possible');
            }
        }

        if (this.millis > this.timeout){
            this.createDogs();
            try {
                this.sound.play("bark");
            } catch {
                console.log('no audio possible');
            }
            this.millis = 0;
            this.timeout = Phaser.Math.Between(400, 4000);
        }
        this.millis +=1;

        if (this.shootMillis > 50){
            this.shootFlag = false;
            this.shootMillis = 0;
        }
        this.shootMillis += 1;

        // kill dogs older than 20 sec
        for(let i = 0; i < this.dogs.length; i++) {
            let currentDog = this.dogs[i];
            currentDog.time -= delta;
            if (currentDog.time < 0) {
                currentDog.sprite.disableBody(true, true);
                console.log ("dogs killed")
            }
        }
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-260);
            this.cat.anims.play('walk', true);
            this.shootDirection = -1;
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('stand');
        }

        if (this.cat.flipX === false) {
            this.cat.flipX = true;
            this.cape.flipX = false;
        }
    }

    buttonPressedRight(pressed) {
        if (pressed) {
            this.cat.setVelocityX(260);
            this.cat.anims.play('walk', true);
            this.shootDirection = 1;
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('stand', true);
        }

        if (this.cat.flipX === true) {
            this.cat.flipX = false;
            this.cape.flipX = true;
        }
    }

    buttonPressedUp(pressed) {
        if (pressed && Math.abs(this.cat.body.velocity.y) < 2) {
            this.cat.setVelocityY(-400);
            try {
                this.sound.play("jump");
            } catch {
                console.log('no audio possible');
            }
        }
    }
    buttonPressedDown(pressed) {
        this.shoot();
    }


    collectMouse(cat, mouse) {
        mouse.disableBody(true, true);
        try {
            this.sound.play("meow");
        } catch {
            console.log('no audio possible');
        }
        //  Add and update the score
        this.addScore();
    }


    hitDog(cat, dog) {
        try {
            this.sound.play("dogLong");
            this.sound.play("angry_cat");
        } catch {
            console.log('no audio possible');
        }

        this.catDies(cat);
    }

    createDogs() {
        for (let i = 0; i < this.dogSpawnLayer.objects.length; i++) {
            let dogStartX = this.dogSpawnLayer.objects[i].x;
            let dogStartY = this.dogSpawnLayer.objects[i].y - 40;
            let dogSpeed = Phaser.Math.Between(30, 100);
            let sprite = this.physics.add.sprite(dogStartX, dogStartY, "dogImage");
            let dogDirection = 1;
            if (this.dogSpawnLayer.objects[i].properties.left === true) {
                dogDirection = -1;
                sprite.flipX = true;
            }
            sprite.setSize(sprite.width * 0.8, sprite.height * 0.8);
            sprite.body.gravity.y = 1000;
            this.dogsSprites.add(sprite);
            sprite.setVelocityX(dogSpeed * dogDirection);
            sprite.scaleY = 0.6;
            sprite.scaleX = 0.6;
            this.dogs.push({"sprite": sprite, "startX": dogStartX, "speed": dogSpeed, "time" : 40000});
        }
        console.log ("dogs created FINISH")
    }

    shoot(){
        if (!this.shootFlag){
            this.wool = this.physics.add.sprite(this.cat.x,this.cat.y,"wool");
            this.wool.body.allowGravity = false;
            this.wool.setVelocityX (1000*this.shootDirection);//this.cat.velocityX*10);
            this.wool.setVelocityY = this.cat.velocityY*10;
            this.shootFlag = true;
            this.physics.add.overlap(this.wool, this.dogsSprites, this.woolHitDog, null, this);
        }
    }

    woolHitDog(wool, dog){
        try {
            this.sound.play("whining");
        } catch {
            console.log('no audio possible');
        }
        dog.disableBody(true, true);
        wool.disableBody(true, true);
        this.shootFlag = false;
    }
}