let flock = []
let p;
var qtree;
const capacity = 6;
var state = 0;
var f = 0;
var af = 60;
var state = 0;
let shark = ['S', 'H', 'A', 'R', 'K'];
let boid_p_slider;
let boid_a_slider;
let boid_s_slider;
let boid_c_slider;
let boid_f_slider;
let boid_ms_slider;
let boid_ds_slider;
let song; 
let bg;
let birds;

function preload() {
	birds = [loadImage('assets/b1.png'),
		 loadImage('assets/b2.png'),
		 loadImage('assets/b3.png'),
		 loadImage('assets/b4.png'),
		 loadImage('assets/b5.png'),
	]
	bg= loadImage("assets/bg.png");
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	canvas.style('z-index','-1')
	background(240);
	for (var i = 0; i < 50; i++) {
		flock.push(new Boid());
	}
	p = new Predator();
	
	boid_p_slider = createSlider(0, 500, 100, 10);
	boid_s_slider = createSlider(0, 5, 1.5, 0.5);
	boid_a_slider = createSlider(0, 5, 1, 0.5);
	boid_c_slider = createSlider(0, 5, 1, 0.5);
	boid_f_slider = createSlider(0, 5, 5, 0.5);
	boid_ds_slider = createSlider(0, 100, 25, 5);
	boid_ms_slider = createSlider(1, 5, 3, 0.5);
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight)	
}

function updateValues() {
	for (let boid of flock) {
		boid.perception = boid_p_slider.value();
		boid.separationForce = boid_s_slider.value();
		boid.alignmentForce = boid_a_slider.value();
		boid.cohesionForce = boid_c_slider.value();
		boid.flightForce = boid_f_slider.value();
		boid.desiredSeparation = boid_ds_slider.value();
		boid.maxSpeed = boid_ms_slider.value();
	}
}

function displayDebug() {
	push();
	noStroke();
	fill(10);
	text('Press any key to exit debug', 0, height- 10);
	text('avg. frame rate: ' + af, 0,  height- 23);
	text('boids: ' + flock.length, 0,  height- 36);
	text('boids settings', 0, height-  60);
	text('perception radius: ' + boid_p_slider.value(), 0,  height - 75);
	text('alignment force: ' + boid_a_slider.value(), 0,  height - 90);
	text('cohesion force: ' + boid_c_slider.value(), 0,  height - 105);
	text('separation force: ' + boid_s_slider.value(), 0,  height - 120);
	text('flight force: ' + boid_f_slider.value(), 0,  height - 135);
	text('desired separation: ' + boid_ds_slider.value(), 0, height - 150);
	text('max speed: ' + boid_ms_slider.value(), 0, height - 165);
	pop();

	boid_p_slider.show();
	boid_p_slider.position(120, height - 90);
	boid_p_slider.style('width', '80px');
	boid_p_slider.input(updateValues);
  
  	boid_a_slider.show();
	boid_a_slider.position(120, height - 105);
	boid_a_slider.style('width', '80px');
	boid_a_slider.input(updateValues);
  
  	boid_c_slider.show();
	boid_c_slider.position(120, height - 120);
	boid_c_slider.style('width', '80px');
	boid_c_slider.input(updateValues);
  
  	boid_s_slider.show();
	boid_s_slider.position(120, height - 135);
	boid_s_slider.style('width', '80px');
	boid_s_slider.input(updateValues);
  
 	boid_f_slider.show();
	boid_f_slider.position(120, height - 150);
	boid_f_slider.style('width', '80px');
	boid_f_slider.input(updateValues);
	
	boid_ds_slider.show();
	boid_ds_slider.position(120, height - 165);
	boid_ds_slider.style('width', '80px');
	boid_ds_slider.input(updateValues);
	
	boid_ms_slider.show();
	boid_ms_slider.position(120, height - 180);
	boid_ms_slider.style('width', '80px');
	boid_ms_slider.input(updateValues);
}

function hideDebug() {
	boid_p_slider.hide();
	boid_a_slider.hide();
	boid_c_slider.hide();
	boid_s_slider.hide();
	boid_f_slider.hide();
	boid_ds_slider.hide();
	boid_ms_slider.hide();
}

function keyTyped() {
	console.log("key: " + key);
	console.log("state: " + state);
	switch (key) {
		case 'd': {
			state = 1;
			break;
		}
		case 'b': {
			if (state == 1) state++;
			else state = 0;
			break;
		}
		case 'u': {
			if (state == 2) state++;
			else state = 0;
			break;
		}
		case 'g': {
			if (state == 3) state++;
			else state = 0;
			break;
		}
		default: {
			state = 0;
		}
	}
}

function draw() {
	
	image(bg,0,0,width,height);

	if (state == 4) {
		let fr = floor(frameRate());
		f += fr;
		if (frameCount % 60 == 0) {
			af = f / 60;
			f = 0;
		}
		displayDebug();
	}else hideDebug();
	
	qtree = QuadTree.create();

	for (let boid of flock) {
		let point = new Point(boid.position.x, boid.position.y, boid);
		qtree.insert(point);
		boid.show();
	}
	
	for (let boid of flock) {
		boid.rollEdges();
		boid.flock(flock);
		boid.update();
	}

	p.show();
}

function mouseDragged(){
	if (state != 4) {
		flock.push(new Boid(mouseX, mouseY))
		if (flock.length > 200) flock.shift();
	}
}

class Predator {
	constructor(x = random(width), y = random(height)) {
		this.position = createVector(x, y);
		this.velocity = createVector(random(-1, 1), random(-1, 1));
		this.velocity.setMag(random(2, 4));
		this.acceleration = createVector();
		this.maxForce = 0.03;
		this.maxSpeed = 2;
		this.perception = 200;
	}

	show() {
		push();
		strokeWeight(2);
		fill(240, 100, 100);
		stroke(240, 100, 100);
		translate(this.position.x, this.position.y);
		rotate(this.velocity.heading());
		//triangle(0, -6, 0, 6, 8, 0);
		var i = 0, size = 16;
	    	for(var l of shark){
      			textSize(size);
    			text(l, i, 0);
      			i+= 7 + size/3;
      			size += 2;
    		}
		pop();
		p.move();
		p.update();
	}


	chase() {
		let steering = createVector();
		let count = 0;
		
		let range = new Circle(this.position.x, this.position.y, this.perception);
		let n = qtree.query(range)
		
		for (let y of n) {
			let other = y.userData;
			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
			if (d < this.perception) {
				steering.add(other.position);
				count++;
			}
		}
		if (count > 0) {
			steering.div(count);
			steering.sub(this.position);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	move() {
		this.acceleration.set(0, 0);
		let cohesion = this.chase().mult(1.0);
		this.acceleration.add(cohesion);
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.rollEdges();
	}

	rollEdges() {
		if (this.position.x > width) this.position.x = 0;
		if (this.position.x < 0) this.position.x = width;
		if (this.position.y > height) this.position.y = 0;
		if (this.position.y < 0) this.position.y = height;
	}
}

class Boid {
	constructor(x = random(width), y = random(height)) {
		this.position = createVector(x, y);
		this.img = random(birds);
		this.velocity = createVector(random(-1, 1), random(-1, 1));
		this.velocity.setMag(random(2, 4));
		this.acceleration = createVector();
		this.maxForce = 0.05;
		this.maxSpeed = 3;
		this.perception = 100;
		this.desiredSeparation = 25.0;
		this.separationForce = 1.5;
		this.alignmentForce = 1;
		this.cohesionForce = 1;
		this.flightForce = 5;
	}

	flock(boids) {
		this.acceleration.set(0, 0);
		let n = this.findNeighbors(boids);
		let alignment = this.align(n).mult(this.alignmentForce);
		let cohesion = this.cohesion(n).mult(this.cohesionForce);
		let separation = this.separation(n).mult(this.separationForce);
		let flightResponse = this.flight().mult(this.flightForce);
		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(separation);
		this.acceleration.add(flightResponse);
	}

	rollEdges() {
		if (this.position.x > width) this.position.x = 0;
		if (this.position.x < 0) this.position.x = width;
		if (this.position.y > height) this.position.y = 0;
		if (this.position.y < 0) this.position.y = height;
	}

	findNeighbors(boids) {
		let n = [];
		
		let range = new Circle(this.position.x, this.position.y, this.perception);
		let q = qtree.query(range)
		
		for (let other of q) {
			if (other.userData != this) {
				n.push(other.userData);
			}
		}
		return n;
	}

	flight() {
		let steering = createVector();
		let d = dist(this.position.x, this.position.y, p.position.x, p.position.y);
		if (d <= this.perception) {
			let diff = p5.Vector.sub(this.position, p.position);
			diff.div(d);
			steering.add(diff);

			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		return steering;
	}


	align(boids) {
		let steering = createVector();
		for (let other of boids) {
			steering.add(other.velocity);
		}
		if (boids.length > 0) {
			steering.div(boids.length);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	cohesion(boids) {
		let steering = createVector();
		for (let other of boids) {
			steering.add(other.position);
		}
		if (boids.length > 0) {
			steering.div(boids.length);
			steering.sub(this.position);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	separation(boids) {
		let steering = createVector();
		var count = 0;
		for (let other of boids) {
			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);

			if ((d > 0) && (d < this.desiredSeparation)) {
				let diff = p5.Vector.sub(this.position, other.position);
				diff.div(d);
				steering.add(diff);
				count++;
			}
		}
		if (count > 0) {
			steering.div(count);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
	}

	show() {
		push();
		strokeWeight(2);
		stroke(25);
		fill(25);
		translate(this.position.x, this.position.y);
		rotate(this.velocity.heading());
		//triangle(0, -3, 0, 3, 5, 0);
		//text("FISH", 0, 0);
		image(this.img,0,0,25,25);
		pop();
	}

}
