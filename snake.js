function snake(row, column, len) {
	this.row = row;
	this.column = column;
	this.len = len;
	this.init(this.row, this.column, this.len);
};

//init
snake.prototype.init = function(row, column, len) {
	var self = this;

	self.initGrid(row, column);
	self.initSnake(column, len);
	self.start();
};

//start
snake.prototype.start = function() {
	var self = this;
	keyCode = 39;

	window.onkeydown = self.attachEvents;
	setInterval(function() {
		self.step(self);
	},
	500);
};

//attachEvents
snake.prototype.attachEvents = function(e) {
	var self = this,
	e = e || event,
	key = e.which || e.keyCode;

	if (Math.abs(keyCode - key) != 2 && key >= 37 && key <= 40) {
		keyCode = key;
	} else {
		return false;
	}
};

//initGrid
snake.prototype.initGrid = function(row, column) {
	var self = this,
	wrap = document.getElementById("wrap"),
	grid = self.multiArray(row, column),
	tr,
	td;

	self.state = self.multiArray(row, column);

	for (var i = 0; i < row; i++) {
		tr = document.createElement("tr");
		for (var j = 0; j < column; j++) {
			td = document.createElement("td");
			grid[j][i] = tr.appendChild(td);
		}
		wrap.appendChild(tr);
	}

	self.grid = grid;
};

//initSnake
snake.prototype.initSnake = function(column, len) {
	var self = this,
	p = self.random(len - 1),
	x = p[0],
	y = p[1];

	self.body = new Array();

	for (i = 0; i < len; i++) {
		self.body.push([x, y]);
		self.state[x][y] = true;
		self.grid[x][y].className = "cover";

		x = x - 1;
	}
};

//step
snake.prototype.step = function(self) {
	var self = this,
	body = self.body,
	head = body[0],
	foot = body.pop(),
	state = self.state,
	grid = self.grid,
	hx = head[0],
	hy = head[1],
	fx = foot[0],
	fy = foot[1],
	row = self.row,
	column = self.column;

	switch (keyCode) {
	case 37:
		hx === 0 ? hx = column - 1: hx -= 1;
		break;
	case 38:
		hy === 0 ? hy = row - 1: hy -= 1;
		break;
	case 39:
		hx === column-1 ? hx = 0: hx += 1;
		break;
	case 40:
		hy === row-1 ? hy = 0: hy += 1;
		break;
	}

	state[fx][fy] = false;
	grid[fx][fy].className = "";
	body.unshift([hx, hy]);
	state[hx][hy] = true;
	grid[hx][hy].className = "cover";
};

//random
snake.prototype.random = function(sx, sy, ex, ey) {
	var self = this,
	temp = [],
	x,
	y;

	sx = sx || 0;
	sy = sy || 0;
	ex = ex || self.column;
	ey = ey || self.row;

	x = Math.floor(Math.random() * (ex - sx)) + sx;
	y = Math.floor(Math.random() * (ey - sy)) + sy;

	temp[0] = x;
	temp[1] = y;
	return temp;
};

//multiArray
snake.prototype.multiArray = function(m, n) {
	var arr = new Array(n);
	for (var i = 0; i < m; i++) {
		arr[i] = new Array(n);
	}
	return arr;
}

new snake(20, 20, 3);
