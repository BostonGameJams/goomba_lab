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

  background: 'rgb(87, 109, 20)',

  assets: [
    'assets/16x16_sample.gif'
  ],

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

    Game.current_level = 1;

    Controls.watchKeyPresses();

    // Simply start the "Loading" scene to get things going
    Crafty.scene('Loading');
  },

  loadSprites: function() {
    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    // These components' names are prefixed with "spr_"
    //  to remind us that they simply cause the entity
    //  to be drawn with a certain sprite
    Crafty.sprite(16, 'assets/16x16_sample.gif', {
      spr_tree:    [0, 0],
      spr_bush:    [1, 0],
      spr_village: [0, 1],
      spr_rock:    [1, 1]
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
      level = Game.getLevel(level);
      level_data = level.data;
    }

    // Return if for whatever reason we have not located level data
    if (!level_data) {
      return;
    }

    Crafty.scene('Game');

    level_data.forEach(function(row, y) {
      // console.log(row, y);
      row.split('').forEach(function(col, x) {
        switch (col) {
          case 'G':
            Crafty.e('YellowGoomba').at(x, y);
            break;
          case 'W':
            Crafty.e('Wall').at(x, y);
            break;
          case 'E':
            Crafty.e('Exit').at(x, y);
            break;
          default:
            break;
        }
      })
    });

    Game.current_level = level;

    console.log('Loaded level ' + level.id)
  }
}
Game.start = Game.start.bind(Game);

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }