var level_one = [
"G_____W_____",
"WWWWW_W_____",
"______W_____",
" WWWWWW_____",
"_____EW_____",
"WWWWWWW_____",
"____________",
"____________"
];

// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  // Put your game code here...

  // level_rows = level_one.split('\n');
  level_one.forEach(function(row, y) {
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
}, function() {
  // Here is where you can unbind event listeners and other things you
  //  need to do to allow restarting/loading multiple levels to work...

});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
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
    Crafty.scene('Game');
  })
});