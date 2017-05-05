/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {}
  preload () {
    game.stage.backgroundColor = '#EDEEC9'
    this.game.load.spritesheet('player', 'assets/player.png', 28, 22)
    this.game.load.image('ground','./assets/ground.png')
    this.game.load.image('wall','./assets/wall.png')
    this.game.load.image('enemy','./assets/enemy.png')
    this.game.load.image('coin','./assets/coin.png')
    this.game.load.audio('jump',['./assets/jump.wav','./assets/jump.mp3'])
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.player = this.game.add.sprite(350, 101, 'player')

    this.ground = this.game.add.sprite(760/2-160,400/2,'ground')
    this.wall1 = this.game.add.sprite(760/2-160,400/2-80,'wall')
    this.wall2 = this.game.add.sprite(760/2+140,400/2-80,'wall')
    this.enemy = this.game.add.sprite(450,400/2-20,'enemy')
    this.coin1 = this.game.add.sprite(260,400/2-20,'coin')
    this.coin2 = this.game.add.sprite(290,400/2-20,'coin')
    this.coin3 = this.game.add.sprite(320,400/2-20,'coin')

    this.jumpSound = this.game.add.audio('jump')

    game.physics.arcade.enable(this.player)
    game.physics.arcade.enable(this.ground)
    game.physics.arcade.enable(this.enemy)

    this.player.body.gravity.y = 600
    this.player.body.setSize(20,20,0,0)

    this.ground.body.immovable = true

    this.player.animations.add('idle',[3,4,5,4],5,true)

    this.player.animations.play('idle')

    this.cursor = this.game.input.keyboard.createCursorKeys()
  }

  update () {
    this.game.physics.arcade.collide(this.player,this.ground)
    this.game.physics.arcade.overlap(this.player,this.enemy)

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

  jumpPlayer () {
      if(!this.hasJumped) {
        this.player.body.velocity.y = -220
        this.jumpSound.play()
        this.hasJumped = true
      }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
