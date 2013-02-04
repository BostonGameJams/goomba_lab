(function(window, undefined) {
  function GameBoard(opts) {
    if (!(this instanceof GameBoard)) {
      return new GameBoard.init(opts);
    }

    return GameBoard.init(opts);
  }

  GameBoard.init = function(opts) {
    opts = opts || {};

    return {
      grid: {
        width:  opts.width || 16,
        height: opts.height || 16,
        tile: opts.tile || {
          width:  64,
          height: 64
        }
      },

      width: function() {
        return this.grid.width * this.grid.tile.width;
      },

      height: function() {
        return this.grid.height * this.grid.tile.height;
      }
    };
  };

  window.GameBoard = GameBoard;
})(window);
