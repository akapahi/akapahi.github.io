let flock = []
let p;
var qtree;
const capacity = 6;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	canvas.style('z-index','-1')
	background(240);
	for (var i = 0; i < 100; i++) {
		flock.push(new Boid());
	}
	p = new Predator();
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight)	
}

function draw() {
	background(240);
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
	flock.push(new Boid(mouseX, mouseY));
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
		triangle(0, -6, 0, 6, 8, 0);
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
		this.velocity = createVector(random(-1, 1), random(-1, 1));
		this.velocity.setMag(random(2, 4));
		this.acceleration = createVector();
		this.maxForce = 0.05;
		this.maxSpeed = 3;
		this.perception = 100;
	}

	flock(boids) {
		this.acceleration.set(0, 0);
		let n = this.findNeighbors(boids);
		let alignment = this.align(n).mult(1.0);
		let cohesion = this.cohesion(n).mult(1.0);
		let separation = this.separation(n).mult(1.5);
		let flightResponse = this.flight().mult(5);
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
		var desiredseparation = 25.0;
		var count = 0;
		for (let other of boids) {
			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);

			if ((d > 0) && (d < desiredseparation)) {
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
		triangle(0, -3, 0, 3, 5, 0);
		pop();
	}

}
