// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});

// A Tree is just an Actor with a certain sprite
Crafty.c('Goomba', {
  init: function() {
    this.requires('Actor, Solid');
  },
});

// A Bush is just an Actor with a certain sprite
Crafty.c('YellowGoomba', {
  init: function() {
    this.requires('Goomba, Color')
      .color('yellow');
  },
});

// A Rock is just an Actor with a certain sprite
Crafty.c('Wall', {
  init: function() {
    this.requires('Actor, Solid, Color')
      .color('gray');
  },
});

// A Rock is just an Actor with a certain sprite
Crafty.c('Exit', {
  init: function() {
    this.requires('Actor, Solid, Color')
      .color('white');
  },
});