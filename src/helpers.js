Helpers = {
  centeredText: function(text, opts) {
    opts = opts || {};
    _.defaults(opts, {
      y_offset: 0
    });

    Crafty.e('2D, DOM, Text')
      .text(text)
      .attr({ x: 0, y: Game.height()/2 - 24 + opts.y_offset, w: Game.width() })
      .css($text_css);
  },

  simpleText: function(text, opts) {
    opts = opts || {};
    _.defaults(opts, {
      x:   0,
      css: {}
    });
    _.defaults(opts.css, {
      'font-size':   '24px',
      'font-family': 'Arial',
      'color':       'white',
      'text-align':  'center'
    });

    Crafty.e('2D, DOM, Text')
      .text(text)
      .attr({ x: opts.x, y: opts.y, w: opts.width })
      .css(opts.css);
  }
}