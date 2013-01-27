const DIR_RIGHT = 0;
const DIR_UP = 1;
const DIR_LEFT = 2;
const DIR_DOWN = 3;

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
	init : function() {
		this.attr({
			w : Game.map_grid.tile.width,
			h : Game.map_grid.tile.height
		})
	},
	// Locate this entity at the given position on the grid
	at : function(x, y) {
		if(x === undefined && y === undefined) {
			return {
				x : this.x / Game.map_grid.tile.width,
				y : this.y / Game.map_grid.tile.height
			}
		} else {
			this.attr({
				x : x * Game.map_grid.tile.width,
				y : y * Game.map_grid.tile.height
			});
			return this;
		}
	}
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
	init : function() {
		this.requires('2D, Canvas, Grid');
	},
});

Crafty.c('FromEditor', {
	//Just a trait
});

Crafty.c('Goomba', {
	init : function() {
		this.requires('Actor').bind("pauseSimulation", function() {
			this.unbind("EnterFrame");
		}).bind("startSimulation", function() {
			var at = this.at();
			this.currentGridX = at.x;
			this.currentGridY = at.y;
			this.nextGridX = at.x + 1;
			this.nextGridY = at.y;
			this.tweenStart = new Date().getTime();
			this.bind("EnterFrame", this.enterFrame);
		});
	},
	currentGridX : 0,
	currentGridY : 1,
	moveDir : DIR_RIGHT,
	msPerTile : 500,
	nextGridX : 1,
	nextGridY : 1,
	tweenStart : new Date().getTime(),

	// use direction constants as indexes into these
	leftTurn : [DIR_UP, DIR_LEFT, DIR_DOWN, DIR_RIGHT],
	rightTurn : [DIR_DOWN, DIR_RIGHT, DIR_UP, DIR_LEFT],
	reverseDir : [DIR_LEFT, DIR_DOWN, DIR_RIGHT, DIR_UP],

	enterFrame : function() {
		var tweenDiff = new Date().getTime() - this.tweenStart;
		if(tweenDiff < this.msPerTile) {
			// update tweening
			this.x = Game.map_grid.tile.width * ((this.nextGridX - this.currentGridX) * tweenDiff / this.msPerTile + this.currentGridX);
			this.y = Game.map_grid.tile.height * ((this.nextGridY - this.currentGridY) * tweenDiff / this.msPerTile + this.currentGridY);
		} else {
			// finalize destination, process game logic, and set new one
			this.currentGridX = this.nextGridX;
			this.currentGridY = this.nextGridY;
			this.x = Game.map_grid.tile.width * this.nextGridX;
			this.y = Game.map_grid.tile.height * this.nextGridY;
			// check for win
			var exits = Crafty("Exit");
			if(_.find(exits, function(exit) {
				var at = Crafty(exit).at();
				return at.x == this.currentGridX && at.y == this.currentGridY;
			})) {
				Crafty.trigger("ReachedExit");
			}
			// we'll be moving to another tile, so set it up
			this.moveDir = this.getNextDir();
			// we trust getNextDir implicitly to give us a valid direction
			switch(this.moveDir) {
				case DIR_RIGHT:
					this.nextGridX = this.currentGridX + 1;
					this.nextGridY = this.currentGridY;
					break;
				case DIR_UP:
					this.nextGridX = this.currentGridX;
					this.nextGridY = this.currentGridY - 1;
					break;
				case DIR_LEFT:
					this.nextGridX = this.currentGridX - 1;
					this.nextGridY = this.currentGridY;
					break;
				case DIR_DOWN:
					this.nextGridX = this.currentGridX;
					this.nextGridY = this.currentGridY + 1;
					break;
			}
			this.tweenStart = new Date().getTime();
		}
	},
	checkAttractor : function(attractor) {
		var attractionDir;
		var at = Crafty(attractor).at();
		// we need to first check for collision, then if it's in the same column or row as us, then check for line of sight.
		if(this.currentGridX == at.x && this.currentGridY == at.y) {
			// collision, so eat the entity and continue looking for additional attractors
			attractor.destroy();
		} else if(this.currentGridX == at.x) {
			// same column, check for pathing
			var reachable = true;
			if(this.currentGridY > at.y)// attractor is above goomba
			{
				attractionDir = DIR_UP;
				for(var i = at.y; i <= this.currentGridY; i++) {
					if(!pathingGrid[at.x][i]) {
						reachable = false;
						break;
					}
				}
			} else// attractor is below goomba
			{
				attractionDir = DIR_DOWN;
				for(var i = this.currentGridY; i <= at.y; i++) {
					if(!pathingGrid[at.x][i]) {
						reachable = false;
						break;
					}
				}
			}
			if(reachable) {
				return true;
			}
		} else if(this.currentGridY == at.y) {
			// same row, check for pathing
			var reachable = true;
			if(this.currentGridX > at.x)// attractor is left of goomba
			{
				attractionDir = DIR_LEFT;
				for(var i = at.x; i <= this.currentGridX; i++) {
					if(!pathingGrid[i][at.y]) {
						reachable = false;
						break;
					}
				}
			} else// attractor is right of goomba
			{
				attractionDir = DIR_RIGHT;
				for(var i = this.currentGridX; i <= at.x; i++) {
					if(!pathingGrid[i][at.y]) {
						reachable = false;
						break;
					}
				}
			}
			if(reachable) {
				this.moveDir = attractionDir;
				return true;
			}
		}
		return false;
	}
});

Crafty.c('YellowGoomba', {
	init : function() {
		this.requires('Goomba, Color').color('yellow');
	},
	getNextDir : function() {
		var walls = Crafty("Wall");
		var bugs = Crafty("Bug");
		var fires = Crafty("Fire");
		var waters = Crafty("Water");

		// true if tile is walkable for this variety of Goomba
		var pathingGrid = new Array();

		// grid is walkable by default
		for(var x = 0; x < Game.map_grid.width; x++) {
			pathingGrid[x] = new Array();
			for(var y = 0; y < Game.map_grid.width; y++) {
				pathingGrid[x][y] = true;
			}
		}

		// walls are 1-tile obstacles
		_.each(walls, function(wall) {
			var at = Crafty(wall).at();
			pathingGrid[at.x][at.y] = false;
		});
		// fires are 3x3 obstacles for yellows
		_.each(fires, function(fire) {
			var at = Crafty(fire).at();
			for(var x = at.x - 1; x <= at.x + 1; x++) {
				for(var y = at.y - 1; y <= at.y + 1; y++) {
					pathingGrid[x][y] = false;
				}
			}
		});
		// check for attractions overriding normal movement
		var attractor;
		var attractionDir;
		// WATER
		if( attractor = _.find(waters, this.checkAttractor)) {
			// attract towards attractor!
			return this.moveDir;
		}
		// BUGS
		if( attractor = _.find(bugs, this.checkAttractor)) {
			// attract towards attractor!
			return this.moveDir;
		}

		// no attraction, so move normally, checking for obstacles
		var testMoveDir = this.moveDir;
		do {
			// get the next X,Y and direction to test
			var testNextX = this.currentGridX;
			var testNextY = this.currentGridY;
			switch(testMoveDir) {
				case DIR_RIGHT:
					testNextX++;
					break;
				case DIR_UP:
					testNextY--;
					break;
				case DIR_LEFT:
					testNextX--;
					break;
				case DIR_DOWN:
					testNextY++;
					break;
			}

			// check bounds of grid
			if(testNextX >= Game.map_grid.width || testNextX < 0 || testNextY >= Game.map_grid.height || testNextY < 0) {
				// fail because of bounds
			}
			// OBSTACLES
			else if(!pathingGrid[testNextX][testNextY]) {
				// fail because there's an obstacle in the way
			} else {
				// looks like we're good to go!
				return testMoveDir;
			}

			// if fail, make right turn
			testMoveDir = this.rightTurn[testMoveDir];
			// TODO: handle case where no movement is possible rather than looping forever (or just smack the designer responsible)
		} while(true)
	}
});

Crafty.c('BlueGoomba', {
	init : function() {
		this.requires('Goomba, Color').color('blue');
	},
	getNextDir : function() {
		var walls = Crafty("Wall");
		var bugs = Crafty("Bug");
		var fires = Crafty("Fire");
		var waters = Crafty("Water");

		// true if tile is walkable for this variety of Goomba
		var pathingGrid = new Array();

		// grid is walkable by default
		for(var x = 0; x < Game.map_grid.width; x++) {
			pathingGrid[x] = new Array();
			for(var y = 0; y < Game.map_grid.width; y++) {
				pathingGrid[x][y] = true;
			}
		}

		// walls are 1-tile obstacles
		_.each(walls, function(wall) {
			var at = Crafty(wall).at();
			pathingGrid[at.x][at.y] = false;
		});
		
		// check for attractions overriding normal movement
		var attractor;
		var attractionDir;
		// BUGS
		if( attractor = _.find(bugs, this.checkAttractor)) {
			// attract towards attractor!
			return this.moveDir;
		}

		// no attraction, so move normally, checking for obstacles
		var testMoveDir = this.moveDir;
		do {
			// get the next X,Y and direction to test
			var testNextX = this.currentGridX;
			var testNextY = this.currentGridY;
			switch(testMoveDir) {
				case DIR_RIGHT:
					testNextX++;
					break;
				case DIR_UP:
					testNextY--;
					break;
				case DIR_LEFT:
					testNextX--;
					break;
				case DIR_DOWN:
					testNextY++;
					break;
			}

			// check bounds of grid
			if(testNextX >= Game.map_grid.width || testNextX < 0 || testNextY >= Game.map_grid.height || testNextY < 0) {
				// fail because of bounds
			}
			// OBSTACLES
			else if(!pathingGrid[testNextX][testNextY]) {
				// fail because there's an obstacle in the way
			} else {
				// looks like we're good to go!
				return testMoveDir;
			}

			// if fail, make right turn
			testMoveDir = this.leftTurn[testMoveDir];
			// TODO: handle case where no movement is possible rather than looping forever (or just smack the designer responsible)
		} while(true)
	}
});

Crafty.c('RedGoomba', {
	init : function() {
		this.requires('Goomba, Color').color('red');
	},
	getNextDir : function() {
		var walls = Crafty("Wall");
		var bugs = Crafty("Bug");
		var fires = Crafty("Fire");
		var waters = Crafty("Water");

		// true if tile is walkable for this variety of Goomba
		var pathingGrid = new Array();

		// grid is walkable by default
		for(var x = 0; x < Game.map_grid.width; x++) {
			pathingGrid[x] = new Array();
			for(var y = 0; y < Game.map_grid.width; y++) {
				pathingGrid[x][y] = true;
			}
		}

		// walls are 1-tile obstacles
		_.each(walls, function(wall) {
			var at = Crafty(wall).at();
			pathingGrid[at.x][at.y] = false;
		});
		// water and bugs are 3x3 obstacles for reds
		_.each(waters, function(water) {
			var at = Crafty(water).at();
			for(var x = at.x - 1; x <= at.x + 1; x++) {
				for(var y = at.y - 1; y <= at.y + 1; y++) {
					pathingGrid[x][y] = false;
				}
			}
		});
		_.each(bugs, function(bug) {
			var at = Crafty(bug).at();
			for(var x = at.x - 1; x <= at.x + 1; x++) {
				for(var y = at.y - 1; y <= at.y + 1; y++) {
					pathingGrid[x][y] = false;
				}
			}
		});
		// check for attractions overriding normal movement
		var attractor;
		var attractionDir;
		// FIRES
		if( attractor = _.find(fires, this.checkAttractor)) {
			// attract towards attractor!
			return this.moveDir;
		}

		// no attraction, so move normally, checking for obstacles
		var testMoveDir = this.moveDir;
		do {
			// get the next X,Y and direction to test
			var testNextX = this.currentGridX;
			var testNextY = this.currentGridY;
			switch(testMoveDir) {
				case DIR_RIGHT:
					testNextX++;
					break;
				case DIR_UP:
					testNextY--;
					break;
				case DIR_LEFT:
					testNextX--;
					break;
				case DIR_DOWN:
					testNextY++;
					break;
			}

			// check bounds of grid
			if(testNextX >= Game.map_grid.width || testNextX < 0 || testNextY >= Game.map_grid.height || testNextY < 0) {
				// fail because of bounds
			}
			// OBSTACLES
			else if(!pathingGrid[testNextX][testNextY]) {
				// fail because there's an obstacle in the way
			} else {
				// looks like we're good to go!
				return testMoveDir;
			}

			// if fail, make right turn
			testMoveDir = this.reverseDir[testMoveDir];
			// TODO: handle case where no movement is possible rather than looping forever (or just smack the designer responsible)
		} while(true)
	}
});

Crafty.c('Wall', {
	init : function() {
		this.requires('Actor, Solid, Color').color('gray');
	},
});

Crafty.c('Exit', {
	init : function() {
		this.requires('Actor, Solid, Color').color('white');
	},
});

Crafty.c('Fire', {
	init : function() {
		this.requires('Actor, Solid, Color').color('orange');
	},
});

Crafty.c('Water', {
	init : function() {
		this.requires('Actor, Solid, Color').color('blue');
	},
});

Crafty.c('Bug', {
	init : function() {
		this.requires('Actor, Solid, Color').color('brown');
	},
});
