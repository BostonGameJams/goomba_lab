$(document).ready(function() {

	//Register the listeners for the buttons
	$('#editorPanel #tileList li').click(function(event) {
		var id = $(this).children()[0].id;
		console.log('id = ' + id);
	});
});