Helpers = {
  centeredText: function(text, opts) {
    opts = opts || {}
    _.defaults(opts, {
      y_offset: 0
    });

    Crafty.e('2D, DOM, Text')
      .text(text)
      .attr({ x: 0, y: Game.height()/2 - 24 + opts.y_offset, w: Game.width() })
      .css($text_css);
  }
}