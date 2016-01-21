// boids/flock

define([
], function(){

	// PRIVATE
	var boids = [];

	var width = undefined;
	var height = undefined;

	var canvas = undefined;
	var ctx = undefined;

	var boidSize = 1;

	function boidConstructor(x, y){
		this.pos = {
			x: x,
			y: y
		},
		this.vel = {
			x: 0,
			y: 0
		},
		this.nextVel = {
			x: Math.random() * 2 - 1,
			y: Math.random() * 2 - 1
		}
		this.nextPos = {
			x: 0,
			y: 0
		},
		this.addVel = function(vector, multiplier){
			this.nextVel.x += vector.x * multiplier;
			this.nextVel.y += vector.y * multiplier;
		},
		this.updateVel = function(){
			this.vel.x = this.nextVel.x;
			this.vel.y = this.nextVel.y;
		}
		this.updatePos = function(){
			this.pos.x += this.vel.x;
			this.pos.y += this.vel.y;
		}
	}

	// Boids will try to move to the center of the flock
	function ruleBoidsMoveToFlockCenter(b, index){
		var c = {
			x: 0,
			y: 0
		};

		for (var i = boids.length - 1; i >= 0; i--) {
			if (i === index) continue;
		
			var n = boids[i];

			c.x += n.pos.x;
			c.y += n.pos.y;
		};

		c.x /= (boids.length-1);
		c.y /= (boids.length-1);

		c.x -= b.pos.x;
		c.y -= b.pos.y;

		c.x /= 15000;
		c.y /= 15000;

		c.x *= myMutliplier;
		c.y *= myMutliplier;

		return c;
	}

	var myMutliplier = 1;
	var myTimer = setInterval(function(){

		myMutliplier = -3;
		setTimeout(function(){
			myMutliplier = 1;
		}, 400*5);
	}, 4000*5)

	// Boids will try to match the velocity of the boids around them
	function ruleMatchVelOfNeighboors(b, index){
		var c = {
			x: 0,
			y: 0
		}
		cLength = 0;

		for (var i = boids.length - 1; i >= 0; i--) {
			if (i === index) continue;
			
			var n = boids[i];
			var distance = Math.sqrt(
				Math.pow(n.pos.x - b.pos.x, 2) +
				Math.pow(n.pos.y - b.pos.y, 2)
			);

			if (distance < 60) {
				cLength++;
				c.x += n.vel.x;
				c.y += n.vel.y;
			};
		};

		if (cLength > 0) {
			c.x /= cLength;
			c.y /= cLength;
		};

		c.x /= 32;
		c.y /= 32;
		
		return c;
	}

	// Boids will avoid colliding with other boids
	function ruleBoidsAvoidColliding(b, index){
		var c = {
			x: 0,
			y: 0
		}

		for (var i = boids.length - 1; i >= 0; i--) {
			if (i === index) continue;

			var n = boids[i];

			// Pythagoras
			var distance = Math.sqrt(Math.pow(b.pos.x-n.pos.x,2) + Math.pow(b.pos.y-n.pos.y,2));
			
			if (distance > 10) continue;

			// Find angle from vector. Fun note, if we reverse objectA and B we have anti-gravity
			var angle = Math.atan2(
				n.pos.y - b.pos.y,
				n.pos.x - b.pos.x
			);

			// All credit for this formula goes to an Isaac Newton
			c.x -= (
				Math.cos(angle) *
				Math.max(Math.sqrt(distance), 1)
			) * 0.2;
			c.y -= (
				Math.sin(angle) *
				Math.max(Math.sqrt(distance), 1)
			) * 0.2;
		};

		return c;
	}

	function ruleBoidBoundry(b, i, isBounded){
		if (isBounded) { // Don't let boid get outside the canvas edges
			if (b.pos.x > width) {
				b.nextVel.x -= 1;
			}
			else if(b.pos.x < 0){
				b.nextVel.x += 1;
			};

			if (b.pos.y > height) {
				b.nextVel.y -= 1;
			}
			else if(b.pos.y < 0){
				b.nextVel.y += 1;
			};
		}
		else{ // Canvas is a finite plain and boid can pass from one edge to the other
			b.pos.x %= width;
			b.pos.y %= height;
		};

	}

	function ruleLimitBoidVelocity(b, i){
		var velocity = Math.sqrt(Math.pow(b.nextVel.x, 2) + Math.pow(b.nextVel.y, 2));
		var limit = 2;

		if (velocity > limit) {
			var dir = Math.atan2(b.nextVel.y, b.nextVel.x);

			boids[i].nextVel.x = Math.cos(dir) * limit;
			boids[i].nextVel.y = Math.sin(dir) * limit;
		};
	}

	/*function ruleCursorRepulse(b, i){
		if (cursor) {};
	}

	window.addEventListener('mousemove', function(){

	})*/

	function moveBoids(){
		for (var i = boids.length - 1; i >= 0; i--) {
			var v;
			var b = boids[i];
			
			v = ruleBoidsMoveToFlockCenter(b, i);
			b.addVel(v, boidSize);

			v = ruleMatchVelOfNeighboors(b, i);
			b.addVel(v, boidSize);

			v = ruleBoidsAvoidColliding(b, i)
			b.addVel(v, boidSize);

			// Limit boid velocity
			ruleLimitBoidVelocity(b, i);

			// Add boundry to canvas that boids don't pass, if third parameter is false then there is no boundry
			ruleBoidBoundry(b, i, false);
		};

		for (var i = boids.length - 1; i >= 0; i--) {
			var b = boids[i];
			
			b.updateVel();
			b.updatePos();
		};
	}

	function renderBoids(){
		ctx.beginPath();
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = boids.length - 1; i >= 0; i--) {
			var b = boids[i];

			ctx.beginPath();
			ctx.moveTo(b.pos.x, b.pos.y);
			ctx.lineTo(b.pos.x - b.vel.x*6, b.pos.y - b.vel.y*6);
			ctx.strokeStyle = "#888";
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(b.pos.x, b.pos.y, 1, 0, 2 * Math.PI, false);
			ctx.fillStyle = "#000";
			ctx.fill();
		};
	}

	// PUBLIC
	var api = {};

	api.getBoids = function(){
		return boids;
	}

	api.initialize = function(pcanvas){
		canvas = pcanvas;
		ctx = canvas.getContext('2d');
		width = canvas.width;
		height = canvas.height;

		for (var i = 200 - 1; i >= 0; i--) {
			var b = new boidConstructor(
				Math.random() * width,
				Math.random() * height
			);

			boids.push(b);
		};

		setInterval(function(){
			moveBoids();
			renderBoids();
		}, 25);
	}

	return api;
})
