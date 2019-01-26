"use strict";

class TreeLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'TreeLevel' })
    }

    preload() {
        super.preload();

        // Images
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.spritesheet('animcat', 'assets/images/cat_walking_animated.png', { frameWidth: 97, frameHeight: 101 });
        this.load.image('cathump', 'assets/images/cats_hump.png');
        this.load.image('branch', 'assets/images/TreeLevel/branch.png');
        this.load.image('ground', 'assets/images/TreeLevel/bottom_green_60px.png');
        this.load.spritesheet('bird', 'assets/images/bird_flying_animated.png', { frameWidth: 30, frameHeight: 30 } );
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('birddropping', 'assets/images/bird_dropping.png');
        this.load.image('goal', 'assets/images/house_home_transparent.png');

        // Sound
        this.load.audio('backgroundmusic', 'assets/sounds//songs/A_Mission.mp3');
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
    }

    create() {
        // Music!
        this.music = this.sound.add('backgroundmusic');
        this.music.play();

        // This are the bounds of our world
        const worldheight = this.game.config.height*10;
        this.physics.world.setBounds(0, 0, this.game.config.width, worldheight, true, true, true, true);

        // Background
        this.cameras.main.setBackgroundColor('#89C0FF');
        this.cameras.main.setBounds(0, 0, this.game.config.width, worldheight);

        // Our platforms static in a group
        const platforms = this.physics.add.staticGroup();

        // Create the ground
        this.ground = this.physics.add.image(this.game.config.width/2, worldheight, 'ground');
        this.ground.body.setAllowGravity(0, 0);
        this.ground.body.immovable = true;

        // Our goal
        this.goal = this.physics.add.image(this.game.config.width-64, worldheight-75, 'goal');
        this.goal.body.setAllowGravity(0, 0);

        // Create the branches
        platforms.create(50, 100, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 200, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 500, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 700, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 800, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 1000, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 1100, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 1300, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 1550, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 1700, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 2000, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 2150, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 2300, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 2500, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 2750, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 3000, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 3100, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 3250, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 3400, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 3800, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 4000, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 4200, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 4500, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 4600, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 4900, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 5100, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 5200, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 5500, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 5750, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 6000, 'branch');
        platforms.create(Phaser.Math.Between(0, this.game.config.width), 6200, 'branch');        

        // Our cat
        this.cat = this.physics.add.sprite(100, 0, 'animcat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 300;
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

        // Bird
        this.bird = this.physics.add.sprite(-100, -100, 'bird');
        this.bird.setBounceY(0);
        this.bird.body.allowGravity = false;
        this.bird.body.setCollideWorldBounds(false);
        this.bird.flying = false;
        this.anims.remove('fly');
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.bird.anims.play('fly');

        // Birds do poop
        this.birdpoops = this.physics.add.group();

        // Mice
        this.mice = this.physics.add.group();
	    for (let i = 0; i < 20; i++) {
	    	let x = Phaser.Math.Between(0, this.game.config.width);
	    	let y = Phaser.Math.Between(600, worldheight);
            let mouse = this.mice.create(x, y, 'mouse');
            mouse.body.setCollideWorldBounds(true);
	    }           
        

        // Colide events
        // The cat
        this.physics.add.collider(this.cat, platforms);
        this.physics.add.collider(this.cat, this.ground)
        this.physics.add.overlap(this.cat, this.mice, (cat, mouse) => {
            this.addScore();
            mouse.disableBody(true, true);
            this.sound.play("meow");
        });
        this.physics.add.collider(this.cat, this.birdpoops, () => {
            this.catDies(this.cat);
        });
        this.physics.add.collider(this.cat, this.goal, () => {
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        });
        // The mice
        this.physics.add.collider(this.mice, platforms);
        this.physics.add.collider(this.mice, this.ground);
        // The ground
        this.physics.add.collider(this.ground, this.birdpoops, (ground, poop) => {
            poop.disableBody(true, true);
        });

        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        // Birds fly
        /* Do we have a bird? */
        if (this.bird.flying) {
            /* should he poop? */
            if (Phaser.Math.Between(1, 1000) < 20 && this.bird.y > 250) {
                let birdpoop = this.birdpoops.create(this.bird.x, this.bird.y, 'birddropping').setScale(2);
                birdpoop.setBounceY(0);
                birdpoop.setMass(0.1);
                birdpoop.body.allowGravity = true;
                birdpoop.body.setCollideWorldBounds(false);
            }
            /* bird is gone */
            if (this.bird.x < 0 || this.bird.x > this.game.config.width) {
                this.bird.flying = false;
            }
        } else if (Phaser.Math.Between(1, 100) < 10) {
            /* start the bird */
            if (Phaser.Math.Between(1, 2) == 1) {
                this.bird.x = 0;
                this.bird.y = this.cameras.main.scrollY + Phaser.Math.Between(10, 300);
                this.bird.setVelocityX(400);
                this.bird.flipX = true;
            } else {
                this.bird.x = this.game.config.width;
                this.bird.y = this.cameras.main.scrollY + Phaser.Math.Between(10, 300);
                this.bird.setVelocityX(-400);
                this.bird.flipX = false;
            }
            this.bird.flying = true;
        }
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-500);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('stand');
        }

        if (this.cat.flipX === false) {
            this.cat.flipX = true;
        }
    }

    buttonPressedRight(pressed) {
        if (pressed) {
            this.cat.setVelocityX(500);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('stand', true);
        }

        if (this.cat.flipX === true) {
            this.cat.flipX = false;
        }
    }

    buttonPressedUp(pressed) {
        if (pressed && Math.abs(this.cat.body.velocity.y) < 2) {
            this.cat.setVelocityY(-350);
        }
    }
}
