Game.levels = [
{ id: 1, data: [
"____________",
"____________",
"Y___________",
"____________",
"____________",
"____________",
"____________",
"______EW____"
]},
{ id: 2, data: [
"____________",
"Y___________",
"____________",
" __________W",
"____________",
"____________",
"___W_______E",
"____________"
]},
{ id: 3, data: [
"____________",
"B___________",
"____________",
" __________W",
"____________",
"____________",
"___W_______E",
"____________"
]},
{ id: 4, data: [
"____________",
"Y___________",
"____________",
" __________W",
"____________",
"____________",
"___W_______E",
"____________"
]}
];

// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  // Put your game code here...
  Game.state_machine.loaded();
}, function() {
  // Here is where you can unbind event listeners and other things you
  //  need to do to allow restarting/loading multiple levels to work...

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

  // Load our assets then initialize the game
  Crafty.load(Game.assets, function(){
    Game.loadSprites();
    Game.loadAudio();

    // Now that our sprites are ready to draw, start the game
    Game.loadLevel();
  })
});

// Victory scene
// -------------
// Let's you see how you did and allows you to move to the next level
Crafty.scene('Victory', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Helpers.centeredText("You did it! Congratulations!");
  Helpers.centeredText("Now try the next level!", { y_offset: 30 });

  // After a short delay, watch for the player to press a key, then restart
  // the game when a key is pressed
  var delay = true;
  setTimeout(function() { delay = false; }, 1000);
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