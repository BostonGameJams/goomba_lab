// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  // Put your game code here...
  Crafty.background('url("assets/t_env_bgA.png") no-repeat 0 0');

  Crafty.e('2D, DOM, Image').image('assets/t_env_bgB.png');
  Game.state_machine.game_scene_loaded();
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  Game.state_machine.loading();

  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading; please wait...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);

  // Hide the lab kit until the game is loaded
  $('.editor-panel').css({ visibility: 'hidden', width: '48px' });

  // Load our assets then initialize the game
  Crafty.load(Game.assets, function(){
    Game.loadSprites();
    Game.loadAudio();

    Crafty.scene('Start');
  });
});

// Victory scene
// -------------
// Let's you see how you did and allows you to move to the next level
Crafty.scene('Victory', function(){
  Crafty.audio.play('exit_win');

  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Helpers.centeredText("Congratulations!");
  Helpers.centeredText("Click to go to the next Goomba habitat!", { y_offset: 30 });

  // After a short delay, watch for the player to press a key, then restart
  // the game when a key is pressed
  var delay = true;
  setTimeout(function() { delay = false; }, 500);
  this.watch_for_next_level_click = Crafty.bind('gameClick', function(params) {
    // console.log('[Editor] gameClick: x:' + params.x + ' y:' + params.y);
    if (!delay) {
      Game.loadNextLevel();
    }
  });
}, function() {
  this.unbind('gameClick', this.watch_for_next_level_click);
});

// Final, end scene
// -------------
// The final scene after all levels are finished
Crafty.scene('Final', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Helpers.centeredText("You finished all the levels!");
  Helpers.centeredText("Now try to go back and find a better solution for all the levels!", { y_offset: 30 });
});

// Start scene
// -------------
// Show the intro screen
Crafty.scene('Start', function() {
  Crafty.e('2D, DOM, Image').image('assets/goomba_lab_splash.png');

  Helpers.simpleText('Click to start', { x: 450, y: 310, width: 200, css: { color: 'black' } });

  this.watch_for_start_click = Crafty.bind('gameClick', function(params) {
    Crafty.audio.play('background', -1, 0.8);

    $('.editor-panel').css({ visibility: 'visible', width: '128px' });

    // Now that our sprites are ready to draw, start the game
    Game.loadLevel();
  });
}, function() {
  this.unbind('gameClick', this.watch_for_start_click);
});