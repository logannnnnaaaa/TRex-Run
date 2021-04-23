var trex ,trex_running, ground;
var play = 1
var end = 0
var gameState = play
function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  trex_collided = loadAnimation("trex_collided.png")
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkSound = loadSound("checkPoint.mp3")
}

function setup(){
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("trex_collided",trex_collided)
  trex.scale = 0.5
  trex.x = 50 
  edges = createEdgeSprites();
  ground = createSprite(200,180,400,20)
  ground.addImage("ground",groundImage)
  invisibleGround = createSprite(200,190,400,10)
  invisibleGround.visible = false 
  gameOver = createSprite(300,100)
  gameOver.addImage("gameOver",gameOverImage)
  gameOver.scale = 0.5
  restart = createSprite(300,130)
  restart.addImage("restart",restartImage)
  restart.scale = 0.5
  score = 0
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  } 

function draw(){
  background("white")
  text("Score="+score,500,50)

  if(gameState === play){
    gameOver.visible = false
    restart.visible = false
    ground.velocityX = -(4+3*score/100)
    score = score+ Math.round(getFrameRate()/50)
  if(keyDown("space") && trex.y>160){
    trex.velocityY = -9
    jumpSound.play();
  }
    if(ground.x<0){
    ground.x = ground.width/2
  }
    if(score%100 === 0 && score>1){
      checkSound.play()
    }
  trex.velocityY = trex.velocityY+0.5
  spawnObstacles(); 
  spawnClouds();
     
    if(obstaclesGroup.isTouching(trex)){ 
      gameState = end
      dieSound.play()
    }
  }
  else if(gameState === end){
    //text("GAME OVER",260,100)
    gameOver.visible = true
    restart.visible = true
    ground.velocityX = 0
    trex.velocityY = 0
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0) 
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    trex.changeAnimation("trex_collided",trex_collided)
    if(mousePressedOver(restart)){
      resetSprites();
    }
  }
  
  
  //console.log(trex.y) 
  
  
  trex.collide(invisibleGround)
  
  drawSprites();
}
function spawnClouds(){
  if(frameCount%60 === 0){
  cloud = createSprite(600,100,40,10)
  cloud.velocityX = -3 
  cloud.y = Math.round(random(10,60))
    cloud.addImage(cloudImage)
    cloud.scale = 0.5
    cloud.depth = trex.depth
    trex.depth = trex.depth+1   
    cloud.lifetime = 200
    cloudsGroup.add(cloud)
  }
  
}
function spawnObstacles(){
  if(frameCount%60 === 0){
    var obstacle = createSprite(600,165,20,10)
    obstacle.velocityX = -(6+score/100)
    var r = Math.round(random(1,6))
    switch(r){
        case 1:obstacle.addImage(obstacle1)
        break
        case 2:obstacle.addImage(obstacle2)
        break
        case 3:obstacle.addImage(obstacle3)
        break
        case 4:obstacle.addImage(obstacle4)
        break
        case 5:obstacle.addImage(obstacle5)
        break
        case 6:obstacle.addImage(obstacle6)
        break
        default: break
    }
        obstacle.scale = 0.5
        obstacle.lifetime = 100
        obstaclesGroup.add(obstacle)
  }
}
function resetSprites(){
  gameState = play
  gameOver.visible = false
  restart.visible = false
  score = 0
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running)
}