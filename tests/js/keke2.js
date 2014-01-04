var stage = {
	// width: 800,
	// height: 500
	width: document.documentElement.clientWidth - 10,
	height: document.documentElement.clientHeight - 10
};
var platforms;
var cursors;
var player;
var playerConfig = {
	bounce: 0.2,
	gravity: 15,
	speed: 150,
	jumpSpeed: 350,
	jumping: false,
	currentAnimation: ''
};

var facingForward = true;

var game = new Phaser.Game(stage.width, stage.height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('sky', 'images/night_sky.jpg');
  game.load.image('mountains', 'images/hills03_grey.png');
  game.load.image('treesBack', 'images/trees_back01.png');
  game.load.image('treesFore', 'images/trees_fore01.png');
  game.load.image('grass', 'images/grass01.png');
  // game.load.image('keke', 'images/keke_tiny.png');

  game.load.spritesheet('keke', 'images/keke_character2.png', 76, 128, 35);

  cursors = game.input.keyboard.createCursorKeys();
}

function create() {
	var sky = game.add.sprite(0, 0, 'sky');
	sky.fixedToCamera = true;
	
	game.add.sprite(0, 0, 'mountains');
	game.add.sprite(0, (stage.height - 490), 'treesBack');
	game.add.sprite(0, 0, 'treesFore');
	
  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();
  var ground = platforms.create(0, game.world.height - 64, 'grass');
  //  This stops it from falling away when you jump on it
  ground.scale.setTo(2, 1);
  ground.body.immovable = true;

  game.world.setBounds(0, 0, 2048, 500);

  player = game.add.sprite((stage.width/2 - 76/2), (stage.height - 148), 'keke');
  player.anchor.setTo(0.5, 0.5);

	player.animations.add('idleR', [0], 14);
	player.animations.add('idleL', [1], 14);
	player.animations.add('runR', [7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 19], 14);
	player.animations.add('runL', [21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33], 14);
	player.animations.add('jumpR', [2], 14);
	player.animations.add('jumpL', [3], 14);
		
	//  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = playerConfig.bounce;
  player.body.gravity.y = playerConfig.gravity;
  player.body.collideWorldBounds = true;
	
  game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

	game.add.sprite(0, (stage.height - 220), 'grass');

  key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
  key1.onDown.add(quit, this);

  // Init game controller with left thumb stick
   GameController.init({
        left: {
            type: 'joystick',
            joystick: {
                touchStart: function() {
                    // Don't need this, but the event is here if you want it.
                },
                touchMove: function(joystick_details) {
                    game.input.joystickLeft = joystick_details;
                },
                touchEnd: function() {
                    game.input.joystickLeft = null;
                }
            }
        },
        right: {
            // We're not using anything on the right for this demo, but you can add buttons, etc.
            // See https://github.com/austinhallock/html5-virtual-game-controller/ for examples.
            type: 'none'
        }
    });
    
    // This is an ugly hack to get this to show up over the Phaser Canvas
    // (which has a manually set z-index in the example code) and position it in the right place,
    // because it's positioned relatively...
    // You probably don't need to do this in your game unless your game's canvas is positioned in a manner
    // similar to this example page, where the canvas isn't the whole screen.
    $('canvas').last().css('z-index', 20);
    $('canvas').last().offset( $('canvas').first().offset() );
 }

function update() {

  game.physics.collide(player, platforms);
 
 //  Reset the players velocity (movement)
   player.body.velocity.x = 0;

   if (cursors.left.isDown)
   {
       //  Move to the left
       player.body.velocity.x = -playerConfig.speed;

		// console.log('play run left');
		//        player.animations.play('runL');
			facingForward = false;
   }
   else if (cursors.right.isDown)
   {
       //  Move to the right
       player.body.velocity.x = playerConfig.speed;

		// console.log('play run right');
       // player.animations.play('runR');
			facingForward = true;
   }
   
   //  Allow the player to jump if they are touching the ground.
	if (cursors.up.isDown && player.body.touching.down)
	{
		player.body.velocity.y = -playerConfig.jumpSpeed;
		playerConfig.jumping = true;
	} else {
		playerConfig.jumping = false;
	}

   // Check key states every frame.
   if (game.input.joystickLeft) {
		var jl = game.input.joystickLeft;
	// console.log('joystickLeft, nX/nY = ' + jl.normalizedY);
       // Move the ufo using the joystick's normalizedX and Y values,
       // which range from -1 to 1.
		// var velX = jl.normalizedX * playerConfig.speed;
		console.log(jl.normalizedX);
		if(jl.normalizedX > 0) {
			player.body.velocity.x = playerConfig.speed;
			facingForward = true;
		} else if(jl.normalizedX < 0) {
			player.body.velocity.x = -playerConfig.speed;
			facingForward = false;
		}
		
		playerConfig.jumping = false;
		if(player.body.touching.down) {
			// console.log('grounded');
			if(jl.normalizedY > 0.5) {
				console.log(jl.normalizedY);
				player.body.velocity.y = -playerConfig.jumpSpeed;
				// console.log('touching ground, velY = ' + velY);
				playerConfig.jumping = true;
			}
		}
       // player.body.velocity.setTo(velX, 0);
		// player.body.velocity.x = velX;
		// player.body.velocity.setTo(game.input.joystickLeft.normalizedX * playerConfig.speed * -1);
		// console.log('velocity = ' + player.body.velocity.x + '/' + player.body.velocity.y);
		// _setPlayerAnimations();
   } else {
       // player.body.velocity.setTo(0, 0);
      // player.animations.stop();
	// if(facingForward) {
	//        player.frame = 0;
	// } else {
	// 	player.frame = 1;
	// }
   }
 	_setPlayerAnimations();

}

function _setPlayerAnimations() {
	// console.log('player vel x = ' + player.body.velocity.x);
	if(playerConfig.jumping) {
		// jumping
		if(facingForward) {
			// player.animations.play('jumpR', 1, false);
			// player.frame = 9;
			player.frame = 2;
			playerConfig.currentAnimation = 'jumpR';
		} else {
			// player.animations.play('jumpL', 1, false);
			// player.frame = 24;
			player.frame = 3;
			playerConfig.currentAnimation = 'jumpL';
		}
	} else if(player.body.touching.down) {
		if(player.body.velocity.x > 0) {
			if(playerConfig.currentAnimation !== 'runR') {
		 		console.log('play run right');
				player.animations.play('runR', 15, true);
				playerConfig.currentAnimation = 'runR';
				facingForward = false;
			}
		} else if(player.body.velocity.x < 0) {
			if(playerConfig.currentAnimation !== 'runL') {
		 		console.log('play run left');
				player.animations.play('runL', 15, true);
				playerConfig.currentAnimation = 'runL';
				facingForward = false;
			}
		} else if(player.body.velocity.x === 0) {
			player.animations.stop();
			if(facingForward) {
				playerConfig.currentAnimation = 'idleR';
				player.frame = 0;
			} else {
				playerConfig.currentAnimation = 'idleL';
				player.frame = 1;
			}
		}
	}

	
}
function quit() {
	console.log('quit');
	game.destroy();
}
