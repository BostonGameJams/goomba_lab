_.extend(Game, {

assets: [
  'assets/t_env_bugA.png',
  'assets/t_env_bugB.png',
  'assets/t_env_fireB.png',
  'assets/t_env_waterB.png',
  'assets/t_env_waterA.png',
  'assets/t_chr_redA_walk.png',
  'assets/t_chr_yellowA_walk.png',
  'assets/t_chr_blueA_walk.png',
  'assets/GGJ13-GoombaLab-BGM.mp3',
  'assets/GGJ13-GoombaLab-BGM.ogg',
  'assets/GGJ13-GoombaLab-SFX-Colliding.mp3',
  'assets/GGJ13-GoombaLab-SFX-Colliding.ogg',
  'assets/GGJ13-GoombaLab-SFX-Eating.mp3',
  'assets/GGJ13-GoombaLab-SFX-Eating.ogg',
  'assets/GGJ13-GoombaLab-SFX-Exit&Win.mp3',
  'assets/GGJ13-GoombaLab-SFX-Exit&Win.ogg',
  'assets/GGJ13-GoombaLab-SFX-Fear.mp3',
  'assets/GGJ13-GoombaLab-SFX-Fear.ogg',
  'assets/GGJ13-GoombaLab-SFX-Footsteps.mp3',
  'assets/GGJ13-GoombaLab-SFX-Footsteps.ogg',
  'assets/GGJ13-GoombaLab-SFX-HappyNoise1.mp3',
  'assets/GGJ13-GoombaLab-SFX-HappyNoise1.ogg',
  'assets/GGJ13-GoombaLab-SFX-HappyNoise2.mp3',
  'assets/GGJ13-GoombaLab-SFX-HappyNoise2.ogg'
],

loadSprites: function() {
  sprite_64 = function(name, path, start_loc) {
    start_loc = start_loc || [0, 0];
    var def = {}; def[name] = start_loc;
    Crafty.sprite(64, 'assets/' + path, def);
  };

  _.each('fire water'.split(' '), function(unit) {
    var sprite_name = 'spr_' + unit
    var sprite_map_obj = {}
    sprite_map_obj[sprite_name] = [0, 0];
    Crafty.sprite(64, 'assets/t_env_' + unit + 'A.png', sprite_map_obj);
  });

  plain_sprites = {
    'spr_wall': 't_env_pitA.png',
    'spr_bug':  't_env_bugA.png',
    'spr_exit': 't_env_exitA.png'
  }
  for (sprite in plain_sprites) {
    sprite_64(sprite, plain_sprites[sprite]);
  }

  animated_sprites = {
    'spr_goomba_red_eat':      't_chr_redA_eat.png',
    'spr_goomba_blue_eat':     't_chr_blueA_eat.png',
    'spr_goomba_yellow_eat':   't_chr_yellowA_eat.png',
    'spr_goomba_red_scare':    't_chr_redA_scare.png',
    'spr_goomba_blue_scare':   't_chr_blueA_scare.png',
    'spr_goomba_yellow_scare': 't_chr_yellowA_scare.png',
    'spr_goomba_red_walk':     't_chr_redA_walk.png',
    'spr_goomba_blue_walk':    't_chr_blueA_walk.png',
    'spr_goomba_yellow_walk':  't_chr_yellowA_walk.png'
  }
  for (sprite in animated_sprites) {
    sprite_64(sprite, animated_sprites[sprite], [0, 3]);
  }
},

loadAudio: function() {
  audioGroup = function(file_name_base) {
    return [
      'assets/' + file_name_base + '.mp3',
      'assets/' + file_name_base + '.ogg'
    ];
  }
  Crafty.audio.add({
    background: audioGroup('GGJ13-GoombaLab-BGM'),
    colliding:  audioGroup('GGJ13-GoombaLab-SFX-Colliding'),
    eating:     audioGroup('GGJ13-GoombaLab-SFX-Eating'),
    exit_win:   audioGroup('GGJ13-GoombaLab-SFX-Exit&Win'),
    fear:       audioGroup('GGJ13-GoombaLab-SFX-Fear.mp3'),
    footsteps:  audioGroup('GGJ13-GoombaLab-SFX-Footsteps'),
    happy_1:    audioGroup('GGJ13-GoombaLab-SFX-HappyNoise1'),
    happy_2:    audioGroup('GGJ13-GoombaLab-SFX-HappyNoise2')
  });
}
});