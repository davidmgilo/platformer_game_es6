/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () {}
  preload () {
    game.stage.backgroundColor = '#00BFFF'
    this.game.load.spritesheet('player', 'assets/player.png', 28, 22)
    this.game.load.image('ground','./assets/ground.png')
    this.game.load.image('wall','./assets/wall.png')
    this.game.load.image('enemy','./assets/enemy.png')
    this.game.load.image('coin','./assets/coin.png')
    this.game.load.image('exp','./assets/exp.png')
    this.game.load.audio('jump',['./assets/jump.wav','./assets/jump.mp3'])
    this.game.load.audio('dead',['./assets/dead.wav','./assets/dead.mp3'])
    this.game.load.audio('coin',['./assets/coin.wav','./assets/coin.mp3'])
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    // this.player = this.game.add.sprite(350, 101, 'player')

    this.spawnPlayer()

    this.loadlevel()

    this.enemy = this.game.add.sprite(450,400/2-20,'enemy')

    this.putCoinsOnLevel()

    this.setParticles()

    this.jumpSound = this.game.add.audio('jump')
    this.coinSound = this.game.add.audio('coin')
    this.deadSound = this.game.add.audio('dead')

    game.physics.arcade.enable(this.player)
    game.physics.arcade.enable(this.enemy)

    this.player.body.gravity.y = 600
    this.player.body.setSize(20,20,0,0)

    this.player.animations.add('idle',[3,4,5,4],5,true)

    this.player.animations.play('idle')

    this.cursor = this.game.input.keyboard.createCursorKeys()

  }

  update () {
    this.game.physics.arcade.collide(this.player,this.level)
    this.game.physics.arcade.overlap(this.player,this.coins, this.takeCoin, null, this)
    this.game.physics.arcade.overlap(this.player,this.enemy, this.die, null, this)

    this.inputs()

    if (this.player.body.touching.down){
        this.hasJumped = false
    }

    if(this.player.y < 100){
        this.player.body.velocity.y = 0
    }
  }

  inputs () {
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x = -100 //TODO moure a la dreta + colisió amb les parets + inèrcia per parar
      this.player.frame = 2
    } else if(this.cursor.right.isDown) {
        this.player.body.velocity.x = 100
        this.player.frame = 1
    }
    else {
      this.player.body.velocity.x = 0
    }

    if (this.cursor.up.isDown) {
      this.jumpPlayer()
    }
  }

  putCoinsOnLevel () {
      this.coins = this.game.add.group()
      this.coin1 = this.game.add.sprite(260,400/2-20,'coin',0,this.coins)
      this.coin2 = this.game.add.sprite(290,400/2-20,'coin',0,this.coins)
      this.coin3 = this.game.add.sprite(320,400/2-20,'coin',0,this.coins)
      this.coins.enableBody = true
      game.physics.arcade.enable(this.coins)
  }

  takeCoin (player, coin) {
    //TODO Reproduir coin

    console.log('moneda tocada')
    coin.body.enable = false
    game.add.tween(coin).to({width:0},100).start()

    this.coinSound.play()

  }

  jumpPlayer () {
      if(!this.hasJumped) {
        this.player.body.velocity.y = -220
        this.jumpSound.play()
        this.hasJumped = true
      }
  }

  loadlevel () {
    this.level = this.game.add.group()
    this.level.enableBody = true
    this.ground = this.game.add.sprite(760/2-160,400/2,'ground',0, this.level)
    this.wall1 = this.game.add.sprite(760/2-160,480/2-80,'wall',0, this.level)
    this.wall2 = this.game.add.sprite(760/2+140,400/2-80,'wall',0, this.level)
    // game.physics.arcade.enable(this.level)
    this.level.setAll('body.immovable', true)
  }

  die (player, enemy) {
    // Effect
      game.camera.shake(0.05,200)
    // So de morir
      this.deadSound.play()
    // Descomptar vides
    // Tornar a colocar usuari en posicio inicial
      this.playerIsDead = true

      this.explosion.x = this.player.x
      this.explosion.y = this.player.y+10
      this.explosion.start(true, 300, null, 20)

      this.spawnPlayer()
  }

  spawnPlayer () {
    if(this.playerIsDead){
        this.player.x = 350
        this.player.y = 101
        this.playerIsDead = false
    }else {
        this.player = new Player({
            game: this.game,
            x: 350,
            y: 101,
            asset: 'player'
        })
        this.game.add.existing(this.player)
    }
  }

  setParticles () {
    this.explosion = game.add.emitter(0,0,20)
      this.explosion.makeParticles('exp')
      this.explosion.setYSpeed(-150,150)
      this.explosion.setXSpeed(-150,150)
      // this.explosion.gravity.set(0,200)
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
