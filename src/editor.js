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
			id: 'Wall',
			img: 'assets/Wall.png'
		},
		{
			id: 'Food',
			img: 'assets/Food.png'
		},
		{
			id: 'Fire',
			img: 'assets/Fire.png'
		},
		{
			id: 'Red Goomba',
			img: 'assets/RedGoomba.png'
		},
		{
			id: 'Blue Goomba',
			img: 'assets/BlueGoomba.png'
		}
	],
	selectedId : '',
	goEnabled : false,
	
	render : function() {
		$('#editorPanel').html('');
		
		var out = '';
		if (this.placeables.length > 4) {
			out += '<img id="upArrow" src="assets/upArrow.png"/>';
		} else {
			out += '<img id="upArrow" src="assets/upArrow.png" class="hiddenArrow"/>';
		}
		out += '<ul id="tileList">';
			var i = this.placeableIndex;
			for( ; i < this.placeables.length && i < this.placeableIndex + 4; i++) {
				if (this.placeables[i].id == this.selectedId) {
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
		if (this.goEnabled) {
			out += '<img id="stopButton" src="assets/stopButton.png"/>'
		} else {
			out += '<img id="goButton" src="assets/goButton.png"/>'
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
			console.log('Go!');
			Editor.goEnabled= true;
			Editor.render();
		});
		
		$('#stopButton').click(function(event) {
			console.log('Stop!');
			Editor.goEnabled= false;
			Editor.render();
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
	Editor.render();
});