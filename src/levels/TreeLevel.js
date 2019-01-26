"use strict";

class TreeLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'TreeLevel' })
    }

    preload() {
        // Images
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.image('branch', 'assets/images/TreeLevel/branch_20px.png');
        this.load.image('ground', 'assets/images/TreeLevel/bottom_green_60px.png');
        this.load.image('bird', 'assets/images/bird_flying_left.png');
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('wool', 'assets/images/ball_wool.png');
        this.load.image('birddroppings', 'assets/images/birddroppings.png');
        this.load.image('goal', 'assets/images/StreetLevel/house.png');

        // Sound
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
    }

    create() {
        // This are the bounds of our world
        const worldheight = this.game.config.height*4;
        this.physics.world.setBounds(0, 0, this.game.config.width, worldheight, true, true, true, true);

        // Background
        this.cameras.main.setBackgroundColor('#89C0FF');
        this.cameras.main.setBounds(0, 0, this.game.config.width, worldheight);

        // Our platforms and ground, all static in a group
        const platforms = this.physics.add.staticGroup();

        // Create the ground
        platforms.create(this.game.config.width/2, worldheight, 'ground').setScale(2).refreshBody();

        // Our goal
        this.goal = this.physics.add.sprite(this.game.config.width-64, worldheight-100, 'goal');
        this.goal.body.setAllowGravity(0, 0);

        // Create the branches
        platforms.create(20, 100, 'branch');
        platforms.create(100, 400, 'branch');
        platforms.create(300, 700, 'branch');
        platforms.create(500, 1000, 'branch');
        platforms.create(50, 1300, 'branch');
        platforms.create(200, 1600, 'branch');
        platforms.create(700, 1900, 'branch');
        platforms.create(100, 2200, 'branch');

        // Our cat
        this.cat = this.physics.add.sprite(100, 0, 'cat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 300;

        // Birds
        this.bird = this.physics.add.sprite(100, 0, 'bird');
        this.bird.setBounceY(0);
        this.bird.body.allowGravity = false;
        this.bird.body.setCollideWorldBounds(true);
        this.bird.flying = false;

        // Mice
        this.mice = this.physics.add.group({
            key: 'mouse',
            repeat: 11,
            setXY: { x: 12, y: 20, stepX: 120 },
        });
        this.mice.children.iterate(function (mouse) {
            mouse.body.setCollideWorldBounds(true);
        });

        // Colide events
        this.physics.add.collider(this.cat, platforms);
        this.physics.add.collider(this.cat, this.mice, (cat, mouse) => { this.addScore(); mouse.disableBody(true, true); this.sound.play("meow"); });
        this.physics.add.collider(this.mice, platforms);
        this.physics.add.collider(this.cat, this.goal, () => {
            this.addScore(100);
            this.startNextLevel();
        });

        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        // Mice run
        this.mice.children.iterate(function (mouse) {
            let x = Phaser.Math.Between(1, 3);
            if (x === 1) {
                mouse.setVelocityX(0);
            } else if (x === 2) {
                mouse.setVelocityX(-500);
            } else {
                mouse.setVelocityX(500);
            }
        });

        // Birds fly
        /* Do we have a bird? */
        if (this.bird.flying) {


        } else if (Phaser.Math.Between(1, 100) < 2) {
            /* start the bird */
            if (Phaser.Math.Between(1, 2) == 1) {
                this.bird.x = 0;
                this.bird.setVelocityX(100);
            } else {
                this.bird.x = this.game.config.width;
                this.bird.x = 0;
                this.bird.setVelocityX(-100);
            }
            this.bird.flying = true;
        }
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-500);
        } else {
            this.cat.setVelocityX(0);
        }

        if (this.cat.flipX === false) {
            this.cat.flipX = true;
        }
    }

    buttonPressedRight(pressed) {
        if (pressed) {
            this.cat.setVelocityX(500);
        } else {
            this.cat.setVelocityX(0);
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
