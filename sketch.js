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
		this.x = Math.ceil(random(windowWidth))
		this.y = Math.ceil(random(windowHeight))
		this.GoalStroke = Math.ceil(random(10,150))
		this.CurrStroke = 0;
		this.r = Math.ceil(random(255))
		this.g = Math.ceil(random(255))
		this.b = Math.ceil(random(255))
		this.a = 0.4
		this.speed = Math.ceil(random(1,3))
	}
	
	display(){
		let dotColor = 'rgba('+this.r +','+ this.g+','+ this.b+','+ this.a+')';
		strokeWeight(this.CurrStroke);
		stroke(dotColor);
		point(this.x,this.y);
		this.grow();
	}
	
	
}

	
