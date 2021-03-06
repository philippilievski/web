
    this.xy = 2;
    var timedEvent;
    var playerlives = 3;
    var floor;
    var maxSpeedLeft = -500;
    var maxSpeedRight = 500;

    var velocityObjects = 5;

    var currentPositionPlayer = 70;
    var leftflipFlop;
    var rightflipFlop;
    
    var score = 0;

    var isDown;
    var keyObj;

    var shieldCounter = 0;
    var shieldPlaying = false;
    var shield;

    var enemyEntities = [
        'beckhoff', 
        'lightning',
        'siemens'
    ];

    var boosterEntities = [
        'plug',
        'profinet',
        'ethercat'
    ];

var StartScreen = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function StartScreen ()
    {
        Phaser.Scene.call(this, { key: 'StartScreen' });
    },

    preload: function ()
    {
        this.load.spritesheet('mainMenu', 'assets/logo-Sheet.png', {frameWidth: 600, frameHeight: 500});
    },

    create: function ()
    {
        this.anims.create({
        key: 'mainMenu',
        frames: this.anims.generateFrameNumbers('mainMenu', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
        });

        const sprite = this.add.sprite(300, 250, 'mainMenu');
        sprite.play('mainMenu');

        this.input.once('pointerdown', function () {

            console.log('From SceneA to SceneB');

            this.scene.start('MainGame');

        }, this);
    },
});

var MainGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainGame ()
    {
        Phaser.Scene.call(this, { key: 'MainGame' });
    },

    getRandomEntry: function(entities) {
    var n = Math.floor(Math.random() * entities.length)
    return entities[n]
    },

    preload: function()
    {
        this.load.image('sky', 'assets/background.png');
        this.load.image('player', 'assets/MX_Idle.png')
        this.load.image('beckhoff', 'assets/Beckhoff_Idle.png')
        this.load.image('floor', 'assets/Floor.png')
        this.load.image('lightning', 'assets/lightning.png')
        this.load.image('plug', 'assets/plug.png');
        this.load.image('siemens', 'assets/Siemens_Idle.png');
        this.load.image('ethercat', 'assets/Ethercat.png');
        this.load.image('profinet', 'assets/Profinet.png');
        this.load.image('gameover', 'assets/gameover.png');
        this.load.spritesheet('shield', 'assets/shield.png', {frameWidth: 80, frameHeight: 90});
    },

    create: function ()
    {
        var background = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'sky');
        var scaleX = this.cameras.main.width / background.width
        var scaleY = this.cameras.main.height / background.height
        var scale = Math.max(scaleX, scaleY)
        background.setScale(scale).setScrollFactor(0);   
        enemies = this.physics.add.group();
        boosters = this.physics.add.group();

        runFasterBooster = new Phaser.Time.TimerEvent({delay: 3000});

        timedEvent = this.time.addEvent({ delay: 800, callback: this.onEvent, callbackScope: this, repeat: 2000 });

        floor = this.physics.add.image(300, 500, 'floor');
        floor.setCollideWorldBounds(true);

        player = this.physics.add.image(70, 500, 'player');
        player.setCollideWorldBounds(true);
        if(document.getElementById('playername') != null)
        {
            playerName = this.add.text(50, 20, String(document.getElementById('playername').value), {fontfamily: "Courier New", fontSize: 32});
            document.getElementById("playername").remove();
        }
        textScore = this.add.text(50,50, String("Score: "  + score) , {fontfamily: "Courier New", fontSize: 32});
        textLives = this.add.text(50,80, String("Lives: " + playerlives),{fontfamily: "Courier New", fontSize: 32});
        textShield = this.add.text(50, 110, String("Shield: inactive"),{fontfamily: "Courier New", fontSize: 32});

        this.physics.add.collider(enemies, player, this.hitEnemy, null, this);
        this.physics.add.collider(enemies, floor, this.hitFloor, null, this);
        this.physics.add.collider(boosters, player, this.hitBooster, null, this);
        this.physics.add.collider(boosters, floor, this.hitFloor, null, this);
        cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointerdown', function (pointer) {
            if (pointer.leftButtonDown())
            {
                this.scene.restart();
                this.restartTheScene();
            }
        }, this);

        keyObj = this.input.keyboard.addKey('W');
        isDown = keyObj.isDown;

        this.anims.create({
            key: 'shield',
            frames: this.anims.generateFrameNumbers('shield', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
            });

    },

    update: function()
    {
        if (cursors.left.isDown && currentPositionPlayer != 70)
        {
            if(!leftflipFlop)
            {
                currentPositionPlayer -= 70;
                player.setPosition(currentPositionPlayer, 490);
                if(shield != null)
                {
                    console.log(shield);
                    shield.x = currentPositionPlayer;
                }
                leftflipFlop = true;
            }
            //player.setVelocityX(maxSpeedLeft);
        }
        else if (cursors.right.isDown && currentPositionPlayer != 560)
        {
            if(!rightflipFlop)
            {
                currentPositionPlayer += 70;
                player.setPosition(currentPositionPlayer, 490);
                if(shield != null)
                {
                    console.log(shield);
                    shield.x = currentPositionPlayer;
                }

                rightflipFlop = true;
            }
            //player.setVelocityX(maxSpeedRight);
        }
        else
        {
            player.setVelocityX(0);
        }

        if(cursors.left.isUp)
        {
            leftflipFlop = false;
        }
        if(cursors.right.isUp)
        {
            rightflipFlop = false;
        }
    },

    restartTheScene: function()
    {
        playerlives = 3;

        maxSpeedLeft = -500;
        maxSpeedRight = 500;

        velocityObjects = 5;

        currentPositionPlayer = 70;
    
        score = 0;
    },

    hitBooster: function(player, booster)
    {
        shieldCounter++;
        if(booster.texture.key == "ethercat")
        {
            score+= 20;
        }
        else if(booster.texture.key == "profinet")
        {
            score+= 10;
            velocityObjects -= 2;
        }
        else
        {
            score++;
        }

        if(shieldCounter >= 5)
        {
            if(shieldPlaying == false){
                shield = this.add.sprite(currentPositionPlayer, 450, 'shield');
                shield.play('shield');
                shieldPlaying = true;
            }
            textShield.setText("Shield: Active");
            console.log("shield active");
        }
        else
        {
            if(shield != null)
            {
                shield.destroy();
                textShield.setText("Shield: inactive");
                console.log("shield inactive");
                shieldPlaying = false;
            }
        }


        textScore.setText("Score: " + score);
        maxSpeedLeft = -1000;
        maxSpeedRight = 1000;
        booster.destroy();
        velocityObjects += 2;
        console.log("Velocity: " + velocityObjects);
    },

    hitFloor: function(floor, enemy)
    {
        console.log('Hitfloor');
        enemy.destroy();
    },

    hitEnemy: function(player, enemy)
    {
        if(shieldCounter >= 5)
        {
            textShield.setText("Shield: inactive");
        }
        else
        {
            playerlives--;
        }
        shieldCounter = 0;

        textLives.setText("Lives: " + playerlives);
        if(enemy.texture.key == "beckhoff")
        {
            velocityObjects += 50;
        }
        else if(enemy.texture.key == "siemens")
        {
            score-= 20;
        }
        if(playerlives == 0)
        {
            this.physics.pause();
            console.log('game over');
            this.scene.start('HighScore');
        }
        console.log(playerlives);
        console.log(enemy.texture.key);
        enemy.destroy();
    },

    onEvent: function()
    {
        var randomNumber;
        var enemyOrBooster;
        var boosterCounter = 0;
        var enemyCounter = 0;

        var positionX = 0;
        if(playerlives > 0)
        {
            for(i=0; i < 9; i++)
            {
                positionX += 70;
                enemyOrBooster = Math.floor(Math.random()*2) + 1;

                if(enemyOrBooster == 1 && enemyCounter < 5)
                {
                    enemyCounter++;
                    var enemy = enemies.create(positionX, 120, this.getRandomEntry(enemyEntities));
                    enemy.setVelocity(0, velocityObjects);
                    enemy.allowGravity = false;
                }
                else if(enemyOrBooster == 2 && boosterCounter < 5)
                {
                    boosterCounter++;
                    var booster = boosters.create(positionX, 120, this.getRandomEntry(boosterEntities));
                    booster.setVelocity(0, velocityObjects);
                    booster.allowGravity = false;
                }
                else if(enemyCounter >= 5)
                {
                    boosterCounter++;
                    console.log("Booster Counter: " + boosterCounter);
                    var booster = boosters.create(positionX, 120, this.getRandomEntry(boosterEntities));
                    booster.setVelocity(0, velocityObjects);
                    booster.allowGravity = false;

                }
                else if(boosterCounter >= 5)
                {
                    enemyCounter++;
                    console.log("Enemy Counter: " + enemyCounter);
                    var enemy = enemies.create(positionX, 120, this.getRandomEntry(enemyEntities));
                    enemy.setVelocity(0, velocityObjects);
                    enemy.allowGravity = false;

                }
            }
        }
    }

});

var HighScore = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneC ()
    {
        Phaser.Scene.call(this, { key: 'HighScore' });
    },

    preload: function ()
    {
        this.load.image('gameoverscreen', 'assets/GameOverScreen.png');
    },

    create: function ()
    {
                        //this.test();
        textScore = this.add.text(50,50, String("Score: "  + score) , {fontfamily: "Courier New", fontSize: 32});
        textLives = this.add.text(50,80, String("Lives: " + playerlives),{fontfamily: "Courier New", fontSize: 32});
        this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'gameoverscreen');
        this.input.once('pointerdown', function (event) {
            console.log('From SceneA to SceneB');
            this.test();
            this.scene.start('MainGame');

        }, this);
    },

    test: function ()
    {
        playerlives = 3;

        maxSpeedLeft = -500;
        maxSpeedRight = 500;

        velocityObjects = 10;

        currentPositionPlayer = 70;

        score = 0;
    }

});

var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 500,
    autoCenter: true,
    backgroundColor: '#000000',
    parent: 'mygame',
    physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 600 },
                debug: false
            }
        },
    scene: [ StartScreen, MainGame, HighScore ]
};
var game = new Phaser.Game(config);
