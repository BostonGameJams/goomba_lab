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
			img: 'assets/t_env_fireB.png',
			numberRemaining : 0,
			numberInitial : 0
		},
		{
			id: 'Water',
			img: 'assets/t_env_waterB.png',
			numberRemaining : 0,
			numberInitial : 0
		},
		{
			id: 'Bug',
			img: 'assets/t_env_bugB.png',
			numberRemaining : 0,
			numberInitial : 0
		},
		{
			id: 'Wall',
			img: 'assets/env_wallB.png',
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

var enableDragNDrop = function(){
  var tiles = $('.tile img');
  var editorPanel = $('#editorPanel');
  var dragId = null;

  //On drag start we should set the dragID
  editorPanel.bind('dragstart','.tile img', function (e) {
    var $current = $(e.target);
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
      var y = e.originalEvent.clientY - stageY + $(window).scrollTop();

      //If there is a drag ID, and we're not out, then we can drop
      if(dragId){
		for (var i = 0; i < Editor.placeables.length; i++) {
			if (dragId == Editor.placeables[i].id) {
				if (Editor.placeables[i].numberRemaining > 0) {
					Editor.selectedId = dragId;
			        Crafty.trigger('placeTile', {
			          x:x,
			          y:y,
			          id:dragId,
			          editorMode: Editor.editorMode
			        });
					break;
				}
			}
		}
      }
    }
  });
  //This is required to allow the drop event ot fire
  stage.bind('dragover', function (e) {
    if (e.preventDefault) e.preventDefault();
  });
}

$(document).ready(function() {
	Crafty.bind('startSimulation',Editor.goButtonPushed);
	Crafty.bind('pauseSimulation',Editor.pauseButtonPushed);
	Crafty.bind('reloadLevel',Editor.reloadLevelPushed);
	Crafty.bind('resetSimulation',Editor.resetSimulationPushed);

	Crafty.bind('placeTile', function(params) {
		console.log('[Editor] placeTile: ' + params.id);
	});
	
	//Get the data on the placeables, then render the sidebar
	var updateLevels = function(params) {
		var inventory = Game.getRemainingInventory();
		for (var i = 0; i < Editor.placeables.length; i++) {
			var initial = inventory[Editor.placeables[i].id];
			Editor.placeables[i].numberInitial = initial;
			Editor.placeables[i].numberRemaining = initial;
		}
		
		Editor.simulationStarted=false;
		Editor.pauseEnabled=true;
		Editor.render();
	};
	
	Crafty.bind('LevelLoaded', updateLevels);
	
	Crafty.bind('InventoryUpdated', function(inventory) {
		var inventory = Game.getRemainingInventory();
		for (var i = 0; i < Editor.placeables.length; i++) {
			var remaining = inventory[Editor.placeables[i].id];
			Editor.placeables[i].numberRemaining = remaining;
		}
		Editor.render();
	});
	
	Editor.render();

  enableDragNDrop();
  
	// Map editor
	$('.live_map_editor button').click(function() {
		console.log('hi');
		console.log($('.live_map_editor textarea').val());
		var data = $('.live_map_editor textarea').val().split('\n');
		console.log('data', data);
		Game.loadLevel({ id: 'new', data: data, inventory: { Fire: 10, Water: 10, Wall: 10, Bug: 10 }});
	});
});