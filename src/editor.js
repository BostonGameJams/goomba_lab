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
		{
			id: 'Fire',
			img: 'assets/t_env_fireA.png',
			numberRemaining : 0,
			numberInitial : 0
		},
		{
			id: 'Water',
			img: 'assets/t_env_waterA.png',
			numberRemaining : 0,
			numberInitial : 0
		},
		{
			id: 'Bug',
			img: 'assets/t_env_bugA.png',
			numberRemaining : 0,
			numberInitial : 0
		},
		{
			id: 'Wall',
			img: 'assets/env_wallA.png',
			numberRemaining : 0,
			numberInitial : 0
		}
	],
	selectedId : null,
	simulationStarted : false,
	pauseEnabled : true,
	
	resetSimulationPushed : function() {
		console.log('Reset simulation!');
		Editor.simulationStarted = false;
		Editor.pauseEnabled = true;
		Editor.render();
	},
	
	reloadLevelPushed : function() {
		console.log('Reload level!');
		Editor.simulationStarted = false;
		Editor.pauseEnabled = true;
		//Get the initial and final data
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
		if (Editor.simulationStarted) {
			out += '<ul id="tileListLocked">';
		} else {
			out += '<ul id="tileList">';
		}
			var i = this.placeableIndex;
			var count = 0;
			for( ; i < this.placeables.length && i < this.placeableIndex + 4; i++) {
				if (this.placeables[i].numberInitial > 0) {
					if (this.placeables[i].id == this.selectedId && this.simulationStarted == false) {
						out += '<li class="tile selected">';
					} else {
						out += '<li class="tile">';
					}
						count++;
						
						out += '<img id="' + this.placeables[i].id + '" ';
						out += 'src="' + this.placeables[i].img + '" class="icon"/>';
						
						out += '<span>';
							out += this.placeables[i].numberRemaining;
						out += '</span>';
						out += '<span>  /  </span>';
						out += '<span>';
							out += this.placeables[i].numberInitial;
						out += '</span>';
					
					out += '</li>';
				}
			}
			while (count < 4) {
				//Generate empty rows
				out += '<li class="emptyTile"></li>';
				count++;
			}
		out += '</ul>';
		if(this.simulationStarted) {
			out += '<div id="resetSimulationButton"/>';
		} else {
			out += '<div id="reloadLevelButton"/>';
		}
		if (this.pauseEnabled) {
			out += '<div id="goButton"/>'
		} else {
			out += '<div id="pauseButton"/>'
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
		
		$('#resetSimulationButton').click(function(event) {
			Crafty.trigger('resetSimulation');
		});
		
		$('#reloadLevelButton').click(function(event) {
			Crafty.trigger('reloadLevel')
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
		
		Crafty.trigger('editorRenderDone');
	}
	
};

$(document).ready(function() {
	Crafty.bind('startSimulation',Editor.goButtonPushed);
	Crafty.bind('pauseSimulation',Editor.pauseButtonPushed);
	Crafty.bind('reloadLevel',Editor.reloadLevelPushed);
	Crafty.bind('resetSimulation',Editor.resetSimulationPushed);
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
		console.log('[Editor] placeTile: ' + params.id);
	})
	
	Crafty.bind('gameClick', function(params) {
		console.log('[Editor] gameClick: x:' + params.x + ' y:' + params.y);
	});
	
	//Get the data on the placeables, then render the sidebar
	var updateLevels = function(params) {
		var inventory = Game.getRemainingInventory();
		for (var i = 0; i < Editor.placeables.length; i++) {
			if (inventory[Editor.placeables[i].id]) {
				var initial = inventory[Editor.placeables[i].id];
				Editor.placeables[i].numberInitial = initial;
				Editor.placeables[i].numberRemaining = initial;
			}
		}
		Editor.render();
	};
	
	Crafty.bind('LevelLoaded', updateLevels);
	
	Crafty.bind('InventoryUpdated', function(inventory) {
		var inventory = Game.getRemainingInventory();
		for (var i = 0; i < Editor.placeables.length; i++) {
			if (inventory[Editor.placeables[i].id]) {
				var remaining = inventory[Editor.placeables[i].id];
				Editor.placeables[i].numberRemaining = remaining;
			}
		}
	});
	
	Editor.render();

  var enableDragNDrop = function(){
    var tiles = $('.tile img');
    var dragId = null;
    //Make the tiles draggable
    tiles.attr('draggable',true);

    //On drag start we should set the dragID
    tiles.bind('dragstart', function (e) {
      var $current = $(e.currentTarget);
      dragId = $current.attr('id');
    });

    var stage = $('#cr-stage');
    //Add the drop event
    stage.bind('drop', function (e) {
      //If we can drop
      if($('#tileList').length){
        //Find drop location
        var stageX = stage.position().left;
        var stageY = stage.position().top;
        var x = e.originalEvent.clientX - stageX;
        var y = e.originalEvent.clientY - stageY;
        //If there is a drag ID then we can drop
        if(dragId){
          console.log('trigger:placeTile', dragId);
          Editor.selectedId = dragId;
          Crafty.trigger('placeTile', {
            x:x,
            y:y,
            id:dragId,
            editorMode: Editor.editorMode
          });
        }
      }
    });
    //This is required to allow the drop event ot fire
    stage.bind('dragover', function (e) {
      if (e.preventDefault) e.preventDefault();
    });
  }
  enableDragNDrop();
//  Crafty.bind('resetSimulation',function(){
//    Crafty.bind('')
//  });


	// Map editor
	$('.live_map_editor button').click(function() {
		console.log('hi');
		console.log($('.live_map_editor textarea').val());
		var data = $('.live_map_editor textarea').val().split('\n');
		console.log('data', data);
		Game.loadLevel({ id: 'new', data: data });
	});
});