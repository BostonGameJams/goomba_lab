Game.levels = [
{ id: 1, data: [
"------------",
"------------",
"Y-----------",
"------------",
"------------",
"------------",
"------------",
"--------EW--"
], inventory: {
  'Wall': 10
}},
{ id: 2, data: [
"------------",
"Y-----------",
"------------",
"-----------W",
"------------",
"------------",
"---W-------E",
"------------"
], inventory: {
  'Fire':  1,
  'Water': 1,
  'Bug':   1,
  'Wall':  1
}},
{ id: 3, data: [
"____________",
"B___________",
"____________",
" __________W",
"____________",
"____________",
"___W_______E",
"___W________"
], inventory: {
  'Fire':  1,
  'Water': 1,
  'Bug':   1,
  'Wall':  1
}},
{ id: 4, data: [
"____________",
"R___________",
"____________",
" __________W",
"____________",
"____________",
"___W_______E",
"____________"
], inventory: {
  'Fire':  6,
  'Water': 6,
  'Bug':   6,
  'Wall':  6
}},
{ id: 5, data: [
"------------",
"Y----W------",
"------------",
"-----------F",
"------------",
"-----------E",
"----W-------",
"------------"
], inventory: {
  'Fire':  2
}},
{ id: 6, data: [
"--W------W--",
"--W--FF--W--",
"--W--F---W--",
"-----F------",
"R----------E",
"------------",
"------------",
"------------"
], inventory: {
  'Fire':  4,
  'Water': 4,
  'Bug':   4
}},
{ id: 7, data: [
"------------",
"------------",
"-----------F",
"------------",
"Y------W---E",
"------------",
"-----------F",
"------------"
], inventory: {
  'Fire': 6
}},
{ id: 8, data: [
"R-------F---",
"------------",
"----F------E",
"------------",
"---------F--",
"--F---------",
"------------",
"------------"
], inventory: {
  'Fire':  1,
  'Water': 1,
  'Bug':   1
}},
{ id: 9, data: [
"--W------W--",
"--W--FF--W--",
"--W--F---W--",
"-----F------",
"R----------E",
"------------",
"------------",
"------------"
], inventory: {
  'Bug': 3
}},
{ id: 10, data: [
"------------",
"------------",
"------------",
"------------",
"------------",
"------------",
"------------",
"B---WEW-----"
], inventory: {
  'Fire':  2,
  'Water': 2,
  'Bug':   2,
  'Wall':   2
}},
{ id: 11, data: [
"B-W--------E",
"--W---------",
"----------WW",
"------------",
"------------",
"------------",
"------------",
"------------"
], inventory: {
  'Bug': 3
}},
{ id: 12, data: [
"Y----------T",
"-----------T",
"-----------T",
"-----------T",
"WWW-WWW-WWWT",
"-----------T",
"--------F--T",
"------E----T"
], inventory: {
  'Fire':  3,
  'Water': 2
}},
{ id: 13, data: [
"R-----------",
"------------",
"---W--W--W--",
"------------",
"-W--W--W--W-",
"------------",
"---W--W--W--",
"-----------E"
], inventory: {
  'Fire': 3,
  'Bug':  3
}},
{ id: 14, data: [
"-W---W---W--",
"---W---W---W",
"-W---R---W--",
"---W---W---W",
"-W---W---W--",
"---W---W---W",
"-W---W---W--",
"---W---W---E"
], inventory: {
  'Fire':  2,
  'Water': 2
}}
];

// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  // Put your game code here...
  Game.state_machine.game_scene_loaded();
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

    Crafty.audio.play('background', -1, 0.8);

    // Now that our sprites are ready to draw, start the game
    Game.loadLevel();
  })
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