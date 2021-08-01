let flock = []
let p;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(51);
	for (var i = 0; i < 100; i++) {
		flock.push(new Boid());
	}
	p = new Predator();
}

function draw() {
	background(51);
	for (let boid of flock) {
		boid.rollEdges();
		boid.flock(flock);
		boid.update();
		boid.show();
	}

	p.show();
}

class Predator {
	constructor() {
		this.position = createVector(random(width), random(height));
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
		p.move(flock);
		p.update();
	}


	chase(boids) {
		let steering = createVector();
		let count = 0;
		for (let other of boids) {
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

	move(boids) {
		this.acceleration.set(0, 0);
		let cohesion = this.chase(boids).mult(1.0);
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
	constructor() {
		this.position = createVector(random(width), random(height));
		this.velocity = createVector(random(-1, 1), random(-1, 1));
		this.velocity.setMag(random(2, 4));
		this.acceleration = createVector();
		this.maxForce = 0.05;
		this.maxSpeed = 3;
		this.perception = 50;
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
		for (let other of boids) {
			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
			if (other != this && d < this.perception) {
				n.push(other);
			}
		}
		return n;
	}

	flight() {
		let steering = createVector();
		let d = dist(this.position.x, this.position.y, p.position.x, p.position.y);
		if (d <= this.perception+50) {
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
		stroke(255);
		translate(this.position.x, this.position.y);
		rotate(this.velocity.heading());
		triangle(0, -3, 0, 3, 5, 0);
		pop();
	}

}
