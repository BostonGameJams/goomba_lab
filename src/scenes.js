Game.levels = [
{ id: 1, data: [
"G_____W_____",
"WWWWW_W_____",
"______W_____",
" WWWWWW_____",
"_____EW_____",
"WWWWWWW_____",
"____________",
"____________"
]},
{ id: 2, data: [
"G______W____",
"WWWWWW_W____",
"_______W____",
" WWWWWWW____",
"______EW____",
"WWWWWWWW____",
"____________",
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