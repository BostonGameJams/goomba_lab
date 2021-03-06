Game = {
  game_board: new GameBoard({
    width:  12,
    height: 8,
    tile: {
      width:  64,
      height: 64
    }
  }),

  state_machine: StateMachine.create({
    initial: 'loading',
    events: [
      { name: 'game_scene_loaded', from: '*',                           to: 'loaded' },
      { name: 'become_ready',      from: 'loaded',                      to: 'ready' },
      { name: 'run',               from: ['loaded', 'paused', 'ready'], to: 'running' },
      { name: 'reset',             from: ['running', 'paused'],         to: 'ready' },
      { name: 'reload',            from: ['ready'],                     to: 'loaded' },
      { name: 'loading',           from: '*',                           to: 'loading' },
      { name: 'pause',             from: 'running',                     to: 'paused' },
      { name: 'win',               from: 'running',                     to: 'victory' }
    ],
    callbacks: {
      onloaded:  function(event, from, to, msg) {
        Crafty.trigger('LevelLoaded', Game.current_level.inventory);
        Game.yummiesEaten = []; //Reset eaten yummies
        Game.state_machine.become_ready();
      },
      onbecome_ready: function() {
        Crafty.trigger('InventoryUpdated', Game.getRemainingInventory());
      },
      onwin: function() {
        Crafty.scene('Victory');
      },
      onreload: function() {
        console.log('Game [reloading level]');
        Game.yummiesEaten = [];
        Game.loadLevel();
      },
      onreset: function() {
        console.log('Game [reseting simulation]');

        // Replace eaten yummies
        for (var i = 0; i < Game.yummiesEaten.length; i++) {
          var state = Game.yummiesEaten[i];
          var yummy = Crafty.e(state.yummyType).at(state.x, state.y);
          if (state.fromEditor) {
            yummy.addComponent('FromEditor');
          }
        }
        Game.yummiesEaten = [];
      },
      ongame_scene_loaded: function() {
      }
    }
  }),

  yummiesEaten : [],

  // The total width of the game screen.
  width: function() { return this.game_board.width(); },

  // The total height of the game screen.
  height: function() { return this.game_board.height(); },

  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(this.width(), this.height());

    Game.current_level = Game.levels[0];

    Controls.watchKeyPresses();

    Game.watchEvents();

    // Simply start the "Loading" scene to get things going
    Crafty.scene('Loading');
  },

  watchEvents: function() {
    Crafty.bind('startSimulation', function() {
      console.log('Game [running]');
      Game.state_machine.run();
    });

    Crafty.bind('pauseSimulation', function() {
      console.log('Game [pausing]');
      Game.state_machine.pause();
    });

    Crafty.bind('reloadLevel', function() {
      Game.state_machine.reload();
    });

    Crafty.bind('reloadLevel', function() {
      Game.state_machine.reload();
    });

    Crafty.bind('resetSimulation', function() {
      Game.state_machine.reset();
    });

    Crafty.bind('ReachedExit', function() {
      Game.state_machine.win();
    });

    Crafty.bind('placeTile', function(event_data) {
      var tile_x = Math.floor(event_data.x / Game.game_board.grid.tile.width),
          tile_y = Math.floor(event_data.y / Game.game_board.grid.tile.height);

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
      })) {
        //Do this if true
        //No-op
      } else {
        //Do this if false
        Crafty.e(event_data.id).at(tile_x, tile_y);
      }

      Crafty.trigger('InventoryUpdated', Game.getRemainingInventory());
    }); //end bound function

    jQuery('#cr-stage').click(function() {
      Crafty.trigger('gameClick');
    });
  },

  getLevel: function(level_id) {
    return _.find(Game.levels, function(level) {
      if (level.id == level_id) {
        return level;
      }
    }) || { data: null };
  },

  // Gets the next level, if there is one; else returns false
  getNextLevel: function(level_id) {
    var current_index = _.indexOf(Game.levels, Game.current_level),
        next_level    = this.getLevel(current_index + 2);

    if (next_level.data) {
      return next_level;
    } else {
      return null;
    }
  },

  // Gets the previous level, if there is one; else returns false
  getPrevLevel: function(level_id) {
    var current_index = _.indexOf(Game.levels, Game.current_level),
        prev_level    = this.getLevel(current_index);

    if (prev_level.data) {
      return prev_level;
    } else {
      return null;
    }
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
    }
    level_data = level.data;

    // Return if for whatever reason we have not located level data
    if (!level_data) {
      console.log('Level data not found!');
      return;
    }

    Game.current_level = level;

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
            Crafty.e('RedGoomba').at(x, y).addComponent('FromEditor');
            break;
          case 'W':
            Crafty.e('Wall').at(x, y).addComponent('FromEditor');
            break;
          case 'F':
            Crafty.e('Fire').at(x, y).addComponent('FromEditor');
            break;
          case 'T':
            Crafty.e('Water').at(x, y).addComponent('FromEditor');
            break;
          case 'U':
            Crafty.e('Bug').at(x, y).addComponent('FromEditor');
            break;
          case 'E':
            Crafty.e('Exit').at(x, y).addComponent('FromEditor');
            break;
          default:
            break;
        }
      });
    });

    // Init metadata for Goombas
    Crafty('Goomba').each(function() {
      this.startPosition = { x: this.at().x, y: this.at().y };
    });

    console.log('Loaded level ' + level.id);
  },

  // Move on to the next level
  loadNextLevel: function() {
    var next_level = this.getNextLevel();
    if (next_level) {
      this.loadLevel(next_level);
    } else {
      Crafty.scene('Final');
    }
  },

  // Jump back to the previous level
  loadPrevLevel: function() {
    var prev_level = this.getPrevLevel();
    if (prev_level) {
      this.loadLevel(prev_level);
    }
  },

  getNumUserPlaced: function(unit_type) {
    return Crafty(unit_type).length - Crafty(unit_type + ' FromEditor').length;
  },

  getRemainingInventory: function() {
    var remaining = {};
    var self = this;
    _.each('Fire Water Wall Bug'.split(' '), function(unit) {
      remaining[unit] = (Game.current_level.inventory[unit] || 0) - self.getNumUserPlaced(unit);
    });
    return remaining;
  }
};
Game.start = Game.start.bind(Game);

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' };