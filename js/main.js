// main

require.config({
	basePath: 'js/',
	paths: {
		jquery: 'vendor/jquery-1.11.2.min',
		underscore: 'vendor/underscore-min'
	}
})

require([
	'boids/boids'
], function(boids){

	console.log('Hello person who looks at the console')
	console.log('If you want to talk to me over TOX, my ID is: A3508AFB1BEBE5D565EFE3CB58DE3A093FB97FF71DB1A453FEE28B7AB825A82F05DC0984A300')

	// Initialize boids algorithm
	boids.initialize();

})
