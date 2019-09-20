let dots=[];
let pressed = false;
let noOfDots = 50;


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(250);
	frameRate(20);
	for(let i =0; i<noOfDots; i++){
		dots[i] = new Dot();
	}
}

function draw() {
	background(250);
	for(let i=0; i<noOfDots; i++){
		dots[i].display();
	}
}



function touchStarted(){
    pressed = true;
}

function touchEnded(){
    pressed = false;
}


class Dot{
	constructor(){
		this.reset();
	}
	
	grow(){
		this.CurrStroke+= this.speed;
		if(this.CurrStroke > this.GoalStroke){
			this.reset()
		}
	}
    
	reset(){
		this.x = this.getRandomInt(windowWidth)
		this.y = this.getRandomInt(windowHeight)
		this.GoalStroke = this.getRandomInt(10,150)
		this.CurrStroke = 0;
		this.r = this.getRandomInt(255)
		this.g = this.getRandomInt(255)
		this.b = this.getRandomInt(255)
		this.a = 0.4
		this.speed = this.getRandomInt(1,4)
	}
	
	display(){
		let dotColor = 'rgba('+this.r +','+ this.g+','+ this.b+','+ this.a+')';
		strokeWeight(this.CurrStroke);
        stroke(dotColor);
        if(pressed) this.moveToMouse();
		point(this.x,this.y);
		this.grow();
    }
    
    getRandomInt(i,j=null){
        if(j===null) return Math.ceil(random(i))
        else return Math.ceil(random(i,j))
    }

    moveToMouse(){
        console.log("mouse",mouseX, mouseY)
        console.log("this", this.x, this.y)

        //move towards mouse
        if(this.x-this.speed > mouseX) this.x -= this.speed;
        else if(this.x+this.speed < mouseX) this.x += this.speed;
        else {}

        if(this.y-this.speed > mouseY) this.y -= this.speed;
        else if(this.y+this.speed < mouseY) this.y += this.speed;
        else {}

        //pop
        //if(Math.abs(mouseX-this.x) < this.CurrStroke && Math.abs(mouseY-this.y) < this.CurrStroke) this.reset();
    }
	
	
}

	
