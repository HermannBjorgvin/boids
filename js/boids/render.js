// render

define([
	'boids/threejs/three.min',
	'boids/threejs/bird'
], function(THREE){

	var loop = undefined;
	var canvas = undefined;
	var ctx = undefined;



	var api = {};

/*	api.start = function(boids, canvasId){
		canvas = document.getElementById(canvasId);
		ctx = canvas.getContext('2d');

		loop = setInterval(function(){
			renderBoids(boids);
		}, 1000/60);
	}

	api.setBoids = function(pboids){
		boids = pboids;
	}*/

	return api;
})
