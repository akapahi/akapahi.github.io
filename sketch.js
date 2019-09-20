let dots=[];


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(250);
	frameRate(19);
	for(let i =0; i<25; i++){
		dots[i] = new Dot();
	}
}

function draw() {
	background(250);
	for(let i =0; i<25; i++){
		dots[i].display();
	}
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
		point(this.x,this.y);
		this.grow();
    }
    
    getRandomInt(i,j=null){
        if(j===null) return Math.ceil(random(i))
        else return Math.ceil(random(i,j))
    }
	
	
}

	
