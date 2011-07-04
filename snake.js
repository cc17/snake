function snake(row, column, len) {
	this.row = row;
	this.column = column;
	this.len = len;
	this.score = 0;
	keyCode = 39;
	this.init();
};

snake.prototype = {

	//init
	init: function(row, column) {
		var self = this;

		self.initGrid(self.row, self.column);
		self.start();
	},

	//initGrid
	initGrid: function(row, column) {
		var self = this,
		wrap = document.getElementById("wrap"),
		grid = self.multiArray(row, column),
		tr,
		td;

		self.score = 0;
		self.scoreObj = document.getElementById("score");
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
		self.setMsg(self.scoreObj, self.score);
	},

	//setMsg
	setMsg: function(obj, val) {
		obj.innerHTML = val;
	},

	//start
	start: function() {
		var self = this;

		self.initSnake(self.column, self.len);
		self.addObj("food");
		document.onkeydown = self.attachEvents;
		self.move();

	},

	//initSnake
	initSnake: function(column, len) {
		var self = this,
		p = self.random(len - 1),
		x = p[0],
		y = p[1];

		self.body = new Array();

		for (i = 0; i < len; i++) {
			self.body.push([x, y]);
			self.state[x][y] = true;
			self.grid[x][y].className = "snake";

			x = x - 1;
		}
	},

	//addObj
	addObj: function(name) {
		var self = this,
		p = self.random(),
		x = p[0],
		y = p[1];

		self.state[x][y] = name;
		self.grid[x][y].className = name;
	},

	//attachEvents
	attachEvents: function(e) {
		var self = this,
		e = e || event,
		key = e.which || e.keyCode;

		if (Math.abs(keyCode - key) != 2 && key >= 37 && key <= 40) {
			keyCode = key;
		} else {
			return false;
		}
	},

	//move
	move: function(speed) {
		var self = this;

		(speed) ? window.clearInterval(snakeMove) : speed = 500;

		snakeMove = window.setInterval(function() {
			self.step();
		},
		speed);
	},

	//step
	step: function() {
		var self = this,
		body = self.body,
		head = body[0],
		foot = body[self.len - 1],
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
			hx === column - 1 ? hx = 0: hx += 1;
			break;
		case 40:
			hy === row - 1 ? hy = 0: hy += 1;
			break;
		}

		//game over
		if (state[hx][hy] === true) {
			window.clearInterval(snakeMove);
			alert("The game is over!");
		}

		//get food
		if (state[hx][hy] === "food") {
			self.len += 1;
			self.score += 10;
			self.setMsg(self.scoreObj, self.score);
			self.addObj("food");

			//changeSpeed
			if (self.len % 5 === 0) {
				self.move(500 - self.len / 5 * 100);
			}
		} else {
			state[fx][fy] = false;
			grid[fx][fy].className = "";
			body.pop();
		}

		body.unshift([hx, hy]);
		state[hx][hy] = true;
		grid[hx][hy].className = "snake";
	},

	//random
	random: function(sx, sy, ex, ey) {
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

		if (self.state[x][y]) {
			return self.random(sx, sy, ex, ey);
		}

		temp[0] = x;
		temp[1] = y;
		return temp;
	},

	//multiArray
	multiArray: function(m, n) {
		var arr = new Array(n);
		for (var i = 0; i < m; i++) {
			arr[i] = new Array(n);
		}
		return arr;
	}
}

new snake(20, 20, 3);
