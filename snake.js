(function(win) {

	var SNAKESMOVE;

	// Model
	var Box = Backbone.Model.extend({
		defaults: {
			state: false
		}
	}),

	Snake = Backbone.Model.extend({

	});

	// Collection
	var Boxs = Backbone.Collection.extend({
		model: Box,
		x: 20,
		y: 20,
		k: 39
	}),

	Snakes = Backbone.Collection.extend({
		model: Snake,
		l: 5,
		s: 500
	}),

	BOXS = new Boxs;

	SNAKES = new Snakes;

	// View
	var BoxView = Backbone.View.extend({

		tagName: "td",

		initialize: function() {
			this.model.bind("change:state", this.render, this);
		},

		render: function() {

			switch (this.model.get("state")) {
			case true:
				$(this.el).addClass("snake");
				break;
			case false:
				$(this.el).removeClass("snake");
				break;
			}

			return this;
		}

	}),

	BoxsView = Backbone.View.extend({

		el: "#wrap",

		initialize: function() {
			this.render();
		},

		render: function() {

			for (i = 0; i < BOXS.y; i++) {
				var tr = $("<tr></tr>");

				for (j = 0; j < BOXS.x; j++) {
					var mID = j + "-" + i;

					BOXS.add({
						id: mID
					});

					var view = new BoxView({
						model: BOXS.get(mID)
					});

					tr.append(view.el);
				}

				$(this.el).append(tr);
			}

			this.initSnake();
			this.move();

		},

		initSnake: function() {
			var self = this,
			p = self.random(SNAKES.l - 1);

			for (i = 0; i < SNAKES.l; i++) {
				self.setSnake(p.x + i, p.y, true);
			}
		},

		move: function(s) {
			var self = this;

			(s) ? win.clearInterval(snakeMove) : s = SNAKES.s;

			snakeMove = win.setInterval(function() {
				self.step();
			},
			s);
		},

		step: function() {
			var l = SNAKES.length - 1,
			m = SNAKES.models,
			hx = m[l].get("x"),
			hy = m[l].get("y"),
			fx = m[0].get("x"),
			fy = m[0].get("y");

			switch (BOXS.k) {
			case 37:
				hx === 0 ? hx = column - 1: hx -= 1;
				break;
			case 38:
				hy === 0 ? hy = row - 1: hy -= 1;
				break;
			case 39:
				hx === BOXS.x - 1 ? hx = 0: hx += 1;
				break;
			case 40:
				hy === BOXS.y - 1 ? hy = 0: hy += 1;
				break;
			}

			this.setSnake(hx, hy, true);
			this.setSnake(fx, fy, false);
		},

		random: function(sx, sy, ex, ey) {
			var self = this,
			x, y;

			sx = sx || 0;
			sy = sy || 0;
			ex = ex || BOXS.x;
			ey = ey || BOXS.y;

			x = Math.floor(Math.random() * (ex - sx));
			y = Math.floor(Math.random() * (ey - sy));

			if (self.getSnake(x, y)) {
				return self.random(sx, sy, ex, ey);
			}

			return {
				"x": x,
				"y": y
			};
		},

		getSnake: function(x, y) {
			return BOXS.get(x + "-" + y).get("state");
		},

		setSnake: function(x, y, val) {
			BOXS.get(x + "-" + y).set({
				state: val
			});

			if (val) {
				SNAKES.add({
					"x": x,
					"y": y
				});
			} else {
				SNAKES.remove((SNAKES.models)[0]);
			}
		}

	});

	new BoxsView;

})(window)

