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
  _.each('fire water'.split(' '), function(unit) {
    var sprite_name = 'spr_' + unit
    var sprite_map_obj = {}
    sprite_map_obj[sprite_name] = [0, 0];
    Crafty.sprite(64, 'assets/t_env_' + unit + 'A.png', sprite_map_obj);
  });

  Crafty.sprite(64, 'assets/t_env_pitA.png', {
    spr_wall: [0, 0]
  });

  Crafty.sprite(64, 'assets/t_chr_yellowA_walk.png', {
    spr_goomba_yellow: [0, 3]
  });

  Crafty.sprite(64, 'assets/t_chr_blueA_walk.png', {
    spr_goomba_blue: [0, 3]
  });

  Crafty.sprite(64, 'assets/t_chr_redA_walk.png', {
    spr_goomba_red: [0, 3]
  });

  Crafty.sprite(64, 'assets/t_chr_yellowA_eat.png', {
    spr_goomba_yellow_eat: [0, 3]
  });

  Crafty.sprite(64, 'assets/t_chr_blueA_eat.png', {
    spr_goomba_blue_eat: [0, 3]
  });

  Crafty.sprite(64, 'assets/t_chr_redA_eat.png', {
    spr_goomba_red_eat: [0, 3]
  });

  Crafty.sprite(64, 'assets/t_chr_yellowA_scare.png', {
    spr_goomba_yellow_scare: [0, 3]
  });

  Crafty.sprite(64, 'assets/t_chr_blueA_scare.png', {
    spr_goomba_blue_scare: [0, 3]
  });

  Crafty.sprite(64, 'assets/t_chr_redA_scare.png', {
    spr_goomba_red_scare: [0, 3]
  });

  Crafty.sprite(64, 'assets/t_env_bugA.png', {
    spr_bug: [0, 0]
  });

  Crafty.sprite(64, 'assets/t_env_exitA.png', {
    spr_exit: [0, 0]
  });
},

loadAudio: function() {
  Crafty.audio.add({
    background: [
      'assets/GGJ13-GoombaLab-BGM.mp3',
      'assets/GGJ13-GoombaLab-BGM.ogg',
    ],
    colliding: [
      'assets/GGJ13-GoombaLab-SFX-Colliding.mp3',
      'assets/GGJ13-GoombaLab-SFX-Colliding.ogg',
    ],
    eating: [
      'assets/GGJ13-GoombaLab-SFX-Eating.mp3',
      'assets/GGJ13-GoombaLab-SFX-Eating.ogg',
    ],
    exit_win: [
      'assets/GGJ13-GoombaLab-SFX-Exit&Win.mp3',
      'assets/GGJ13-GoombaLab-SFX-Exit&Win.ogg',
    ],
    fear: [
      'assets/GGJ13-GoombaLab-SFX-Fear.mp3',
      'assets/GGJ13-GoombaLab-SFX-Fear.ogg',
    ],
    footsteps: [
      'assets/GGJ13-GoombaLab-SFX-Footsteps.mp3',
      'assets/GGJ13-GoombaLab-SFX-Footsteps.ogg',
    ],
    happy_1: [
      'assets/GGJ13-GoombaLab-SFX-HappyNoise1.mp3',
      'assets/GGJ13-GoombaLab-SFX-HappyNoise1.ogg',
    ],
    happy_2: [
      'assets/GGJ13-GoombaLab-SFX-HappyNoise2.mp3',
      'assets/GGJ13-GoombaLab-SFX-HappyNoise2.ogg',
    ]
  });
}
});