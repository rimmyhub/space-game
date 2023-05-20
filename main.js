
//캔버스 세팅
let canvas
let ctx
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width = 400
canvas.height = 700
document.body.appendChild(canvas)

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameoverImage
let gameOver=false
let score=0

//우주선 좌표
let spaceshipX = canvas.width/2-24
let spaceshipY = canvas.height-48

let bulletList = [] //총알을 저장하는 리스트
function Bullet(){
    this.x= 0
    this.y= 0
    this.init=function(){
        this.x = spaceshipX+16
        this.y = spaceshipY
        this.alive = true

        bulletList.push(this)
    }
    this.update = function(){
        this.y-=7
    }

    this.checkHit=function(){
        for(let i=0; i<enemyList.length;i++){
            if(this.y <= enemyList[i].y && this.x>=enemyList[i].x&& this.x<=enemyList[i].x+40){
                score++
                this.alive = false
                enemyList.splice(i,1)


            }

        }
    }
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let enemyList=[]
function Enemy(){
    this.x= 0
    this.y= 0
    this.init=function(){
        this.y = 0
        this.x = generateRandomValue(0,canvas.width-48)
        enemyList.push(this)
    }
    this.update=function(){
        this.y += 2 // 적군의 속도 조절 

        if(this.y >=canvas.height-48){
            gameOver = true
            console.log("game over")
        }
    }
}



function loadImage(){
    backgroundImage = new Image()
    backgroundImage.src = "images/background.png"

    spaceshipImage = new Image()
    spaceshipImage.src = "images/spaceship.png"

    bulletImage = new Image()
    bulletImage.src = "images/bullet.png"
    
    enemyImage = new Image()
    enemyImage.src = "images/enemy.png"

    gameoverImage = new Image()
    gameoverImage.src = "images/gameover.png"
}


let keysDown={}
function setupkeyboardListener(){
    document.addEventListener("keydown", function (event){
      keysDown[event.keyCode] = true
    })
    document.addEventListener("keyup",function(event){
     delete keysDown[event.keyCode]

     if(event.keyCode == 32){
        createbullet() //총알 생성
     }
    })
}

function createbullet(){
    console.log("총알 생성!")
    let b =new Bullet() //총알 하나 생성 
    b.init()
    // console.log("새로운 총알 리스트", bulletList)
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    },1000)
}

function update(){
    if(39 in keysDown) {
        spaceshipX += 5 //우주선의 속도
    } //right

    if(37 in keysDown) {
        spaceshipX -= 5 //우주선의 속도
    } //left

    if(spaceshipX <=0){
        spaceshipX=0
    }

    if(spaceshipX >= canvas.width-48){
        spaceshipX = canvas.width-48
    }

    //경기장 안에만 있게 하고 싶어

    //총알 y 좌표 업데이트
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            bulletList[i].update()
            bulletList[i].checkHit()
        }
    }

    for(let i=0;i<enemyList.length;i++){
        enemyList[i].update()
    }

}

function render(){
    ctx.drawImage (backgroundImage ,0, 0, canvas.width, canvas.height)
    ctx.drawImage (spaceshipImage, spaceshipX, spaceshipY)
    ctx.fillText(`Score:${score}`,20,40)
    ctx.fillStyle="white"
    ctx.font = "20px Arial"
    
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y)
        }
    }
    
    for(let i=0;i<enemyList.length;i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y)
    }
}

function main(){
     if(!gameOver){
    update() //좌표값을 업데이트하고
    render() // 그려주고
    requestAnimationFrame(main)
    }else{
        ctx.drawImage(gameoverImage,10,100,380,380)
    }
}

loadImage()
setupkeyboardListener()
createEnemy()
main()