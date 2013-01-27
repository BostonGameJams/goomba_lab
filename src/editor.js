/*
 * All the data related to the outer editor frame
 */
Editor = {
	editorMode : true,
	placeableIndex : 0,
	incrementIndex : function() {
		if (this.placeables.length - 4 <= this.placeableIndex) {
			return false;
		} else {
			this.placeableIndex++;
			return true;
		}
	},
	decrementIndex : function() {
		if (this.placeableIndex == 0) {
			return false;
		} else {
			this.placeableIndex--;
			return true;
		}
	},
	placeables : [
		/*{
			id: 'Fire',
			img: 'assets/Fire.png'
		},
		{
			id: 'Water',
			img: 'assets/Water.png'
		},
		{
			id: 'Bug',
			img: 'assets/Bug.png'
		},*/
		{
			id: 'Wall',
			img: 'assets/Wall.png'
		}
	],
	selectedId : null,
	simulationStarted : false,
	pauseEnabled : true,
	
	resetButtonPushed : function() {
		console.log('Reset!');
		Editor.simulationStarted = false;
		Editor.pauseEnabled = true;
		Editor.render();
	},
	
	pauseButtonPushed : function() {
		console.log('Pause!');
		Editor.pauseEnabled = true;
		Editor.render();
	},
	
	goButtonPushed : function() {
		console.log('Go!');
		Editor.simulationStarted = true;
		Editor.pauseEnabled = false;
		Editor.selectedId = null;
		Editor.render();
	},
	
	render : function() {
		$('#editorPanel').html('');
		
		var out = '';
		if (this.placeables.length > 4) {
			out += '<img id="upArrow" src="assets/upArrow.png"/>';
		} else {
			out += '<img id="upArrow" src="assets/upArrow.png" class="hiddenArrow"/>';
		}
		if (Editor.simulationStarted) {
			out += '<ul id="tileListLocked">';
		} else {
			out += '<ul id="tileList">';
		}
			var i = this.placeableIndex;
			for( ; i < this.placeables.length && i < this.placeableIndex + 4; i++) {
				if (this.placeables[i].id == this.selectedId && this.simulationStarted == false) {
					out += '<li class="tile selected">';
				} else {
					out += '<li class="tile">';
				}
					out += '<img id="' + this.placeables[i].id + '" ';
					out += 'src="' + this.placeables[i].img + '" class="icon"/>';
				    out += '<span>' + this.placeables[i].id + '</span>';
				out += '</li>';
			}
			while (i < this.placeableIndex + 4) {
				//Generate empty rows
				out += '<li></li>';
				i++;
			}
		out += '</ul>';
		if (this.placeables.length > 4) {
			out += '<img id="downArrow" src="assets/downArrow.png"/>';
		} else {
			out += '<img id="downArrow" src="assets/downArrow.png" class="hiddenArrow"/>';
		}
		out += '<img id="resetButton" src="assets/resetButton.png" />';
		if (this.pauseEnabled) {
			out += '<img id="goButton" src="assets/goButton.png"/>'
		} else {
			out += '<img id="pauseButton" src="assets/pauseButton.png"/>'
		}
		
		$('#editorPanel').append(out);
		
		//Register the listeners for the buttons
		$('#editorPanel #tileList li').click(function(event) {
			var li = $(this);
			var child = li.children()[0];
			if (child) {
				$('#tileList .selected').removeClass('selected');
				li.addClass('selected');
				var id = child.id;
				Editor.selectedId = id;
				console.log('id = ' + id);
			}
		});

		$('#goButton').click(function(event) {
			Crafty.trigger('startSimulation');
		});
		
		$('#pauseButton').click(function(event) {
			Crafty.trigger('pauseSimulation');
		});
		
		$('#resetButton').click(function(event) {
			Crafty.trigger('reloadLevel');
		});
		
		$('#upArrow').click(function(event) {
			console.log('up');
			if (Editor.decrementIndex()) {
				Editor.render();
			}
		});
		
		$('#downArrow').click(function(event) {
			console.log('down');
			if (Editor.incrementIndex()) {
				Editor.render();
			}
		});
	}
	
};

$(document).ready(function() {
	Crafty.bind('startSimulation',Editor.goButtonPushed);
	Crafty.bind('pauseSimulation',Editor.pauseButtonPushed);
	Crafty.bind('reloadLevel',Editor.resetButtonPushed);
	$('#cr-stage').click(function(event) {
		//Relative ( to its parent) mouse position 
		var posX = $(this).position().left;
		var posY = $(this).position().top;
		var x = event.pageX - posX;
		var y = event.pageY - posY;
		
		if (Editor.selectedId != null && !Editor.simulationStarted) {
			//place tile
			Crafty.trigger('placeTile', {
				x:x,
				y:y,
				id:Editor.selectedId,
				editorMode: Editor.editorMode
			});
		} else {
			Crafty.trigger('gameClick', {
				x:x,
				y:y
			});
		}
	});
	
	Crafty.bind('placeTile', function(params) {
		console.log('placeTile: ' + params.id);
	})
	
	Crafty.bind('gameClick', function(params) {
		console.log('gameClick: x:' + params.x + ' y:' + params.y);
	});
	
	Editor.render();
});