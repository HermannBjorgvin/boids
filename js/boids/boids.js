// boids/boids

define([
	'boids/flock',
	'boids/render'
], function(flock, render){

	// PRIVATE
	var boids = [];
	var canvas = document.getElementById('boids');

	// PUBLIC
	var api = {};

	api.initialize = function(){
		canvas.height = canvas.offsetHeight;
		canvas.width = canvas.offsetWidth;

		flock.initialize(canvas);
	}

	return api;
});
