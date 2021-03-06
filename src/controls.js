Controls = {
  watchKeyPresses: function() {
    Crafty.bind('KeyDown', function(e) {
      // console.log(e);

      if (e.shiftKey) {
        '1 2 3 4 5 6 7 8 9'.split(' ').forEach(function(i) {
          if (e.key == Crafty.keys[i]) {
            Game.loadLevel(i);
          }
        });

        if (e.key == Crafty.keys['LEFT_ARROW']) {
          Game.loadPrevLevel();
        } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
          Game.loadNextLevel();
        }
      }

      if (e.key == Crafty.keys['R']) {
        Game.loadLevel(1);
      } else if (e.key == Crafty.keys['M']) {
        Crafty.audio.toggleMute();
      }
    });
  }
}