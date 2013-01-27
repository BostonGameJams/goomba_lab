Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  12,
    height: 8,
    tile: {
      width:  64,
      height: 64
    }
  },

  background: 'url("assets/background.png") no-repeat 0 0',

  assets: [
    'assets/t_env_bugB.png',
    'assets/t_env_fireB.png',
    'assets/t_env_waterB.png',
    'assets/env_wallA.png',
    'assets/t_chr_redA_walk.png',
    'assets/t_chr_yellowA_walk.png',
    'assets/t_chr_blueA_walk.png'
  ],

  state_machine: StateMachine.create({
    initial: 'loading',
    events: [
      { name: 'loaded',  from: ['loading', 'loaded'], to: 'loaded' },
      { name: 'run',     from: ['loaded', 'paused'],  to: 'running' },
      { name: 'reset',   from: ['running', 'paused'], to: 'loaded' },
      { name: 'reload',  from: ['loaded'],            to: 'loaded' },
      { name: 'loading', from: '*',                   to: 'loading' },
      { name: 'pause',   from: 'running',             to: 'paused' }
    ]
  }),

  yummiesEaten : [],

  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(this.width(), this.height());
    Crafty.background(this.background);

	//Crafty.e('Overlay').image('assets/overlay.png').at(1,1).z(100);

    Game.current_level = 1;

    Controls.watchKeyPresses();

    Game.watchEvents();

    // Simply start the "Loading" scene to get things going
    Crafty.scene('Loading');
  },

  watchEvents: function() {
    Crafty.bind('startSimulation', function() {
      Game.runSimulation();
    });

    Crafty.bind('pauseSimulation', function() {
      Game.pauseSimulation();
    });

	Crafty.bind('reloadLevel', function() {
		Game.reloadLevel();
	});
	
	Crafty.bind('resetSimulation', function() {
		Game.resetSimulation();
	});

    Crafty.bind('placeTile', function(event_data) {

      var tile_x = Math.floor(event_data.x / Game.map_grid.tile.width),
          tile_y = Math.floor(event_data.y / Game.map_grid.tile.height);
	
	
	var foundSomething = false;
	var tiles = Crafty('Actor');
	
	if(_.find(tiles, function(tile) {
		var at = Crafty(tile).at();
		var fromEd = Crafty(tile).has('FromEditor');
		var sameLocation = (at.x == tile_x && at.y == tile_y);
		if (sameLocation) {
			if(fromEd) {
				//Don't add item
				return true;
			} else {
				//Add item
				Crafty.e(event_data.id).at(tile_x, tile_y);
				Crafty(tile).destroy();
				return true;
			}
		}
		return false;
		
	}))	{
		//Do this if true
		//No-op
	} else {
		//Do this if false
		Crafty.e(event_data.id).at(tile_x, tile_y);
	}
	});	//end bound function
  },

  loadSprites: function() {
    _.each('bug fire water'.split(' '), function(unit) {
      var sprite_name = 'spr_' + unit
      var sprite_map_obj = {}
      sprite_map_obj[sprite_name] = [0, 0];
      Crafty.sprite(64, 'assets/t_env_' + unit + 'B.png', sprite_map_obj);
    });

    Crafty.sprite(64, 'assets/env_wallA.png', {
      spr_wall: [0, 0]
    });

    Crafty.sprite(64, 'assets/t_chr_yellowA_walk.png', {
      spr_goomba_yellow: [0, 3]
    });

    Crafty.sprite(64, 'assets/t_chr_blueA_walk.png', {
      spr_goomba_blue: [0, 3]
    });

    Crafty.sprite(64, 'assets/t_chr_redA_walk.png', {
      spr_goomba_red: [0, 3]
    });
  },

  loadAudio: function() {
    // Define our sounds and muic here for later use...

  },

  getLevel: function(level_id) {
    return _.find(Game.levels, function(level) {
      if (level.id == level_id) {
        return level;
      }
    }) || { data: null };
  },

  // Load the specified level, or load/reload the current level if no level
  //  is specified
  loadLevel: function(level) {
    // If no level was specified, default to loading/reloading the current level
    if (!level) {
      level = Game.current_level;
    }

    // Look up a level by its id
    if (!(level instanceof Object)) {
      console.log('Looking up level');
      level = Game.getLevel(level);
      level_data = level.data;
    } else {
      level_data = level.data;
    }
    console.log('level_data', level_data);

    // Return if for whatever reason we have not located level data
    if (!level_data) {
      console.log('Level data not found!');
      return;
    }

    Crafty.scene('Game');

    level_data.forEach(function(row, y) {
      // console.log(row, y);
      row.split('').forEach(function(col, x) {
        switch (col) {
          case 'Y':
            Crafty.e('YellowGoomba').at(x, y).addComponent('FromEditor');
            break;
		case 'B':
           Crafty.e('BlueGoomba').at(x, y).addComponent('FromEditor');
           break;
		case 'R':
            Crafty.e('RedGoomba').at(x, y).addComponent('FromEditor')
            break;
        case 'W':
            Crafty.e('Wall').at(x, y).addComponent('FromEditor')
            break;
		case 'F':
			Crafty.e('Fire').at(x, y).addComponent('FromEditor')
			break;
		case 'T':
			Crafty.e('Water').at(x, y).addComponent('FromEditor')
			break;
		case 'U':
			Crafty.e('Bug').at(x, y).addComponent('FromEditor')
			break;
        case 'E':
            Crafty.e('Exit').at(x, y).addComponent('FromEditor')
            break;
          default:
            break;
        }
      })
    });

    // Init metadata for Goombas, etc.
    Crafty('Goomba').each(function() {
      this.startPosition = { x: this.at().x, y: this.at().y };
    });

    Game.current_level = level;

    console.log('Loaded level ' + level.id)
  },

  reloadLevel: function() {
    Game.state_machine.reload();
    console.log('Game [reloading level]');
	Game.yummiesEaten = [];
    Game.loadLevel();
  },

  resetSimulation: function() {
    Game.state_machine.reset();

	//replace eaten yummies
	for (var i = 0; i < Game.yummiesEaten.length; i++) {
		var state = Game.yummiesEaten[i];
		var yummy = Crafty.e(state.yummyType).at(state.x, state.y);
		if (state.fromEditor) {
			yummy.addComponent('FromEditor');
		}
	}
	Game.yummiesEaten = [];
	
    console.log('Game [reseting simulation]');
  },

  runSimulation: function() {
    Game.state_machine.run();
    console.log('Game [running]');
  },

  pauseSimulation: function() {
    Game.state_machine.pause();
    console.log('Game [pausing]');
  }
}
Game.start = Game.start.bind(Game);

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }