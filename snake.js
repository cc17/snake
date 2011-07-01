function snake() {
	this.init();
};

//init
snake.prototype.init = function() {
	this.initGrid(20, 20);
}

//initGrid
snake.prototype.initGrid = function(row, column) {
	var snake = document.getElementById("snake");
	html = "";

	for (var i = 1; i < row; i++) {
		html += "<tr>";
		for (var j = 1; j < column; j++) {
			html += "<td></td>";
		}
		html += "</td>";
	}

	snake.innerHTML = html;

};

new snake();
