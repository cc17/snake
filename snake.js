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
			var state = this.model.get("state");

			if (state !== false) {
				this.el.className = state;
			} else {
				this.el.className = "";
			}

			return this;
		}

	}),

	BoxsView = Backbone.View.extend({

		tagName: "tbody",

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

			this.addSnake();
			this.addFood();

			return this;

		},

		addSnake: function() {
			var p = this.random(SNAKES.l - 1);

			for (i = 0; i < SNAKES.l; i++) {
				this.setState(p.x + i, p.y, "snake");
			}

			this.move();
		},

		addFood: function() {
			var p = this.random();

			BOXS.get(p.x + "-" + p.y).set({
				state: "food"
			});
		},

		move: function() {
			var self = this;

			if (SNAKESMOVE !== undefined) {
                win.clearInterval(SNAKESMOVE)
            }

			SNAKESMOVE = win.setInterval(function() {
				self.step();
			},
			SNAKES.s);
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
				hx === 0 ? hx = BOXS.x - 1: hx -= 1;
				break;
			case 38:
				hy === 0 ? hy = BOXS.y - 1: hy -= 1;
				break;
			case 39:
				hx === BOXS.x - 1 ? hx = 0: hx += 1;
				break;
			case 40:
				hy === BOXS.y - 1 ? hy = 0: hy += 1;
				break;
			}

			switch (this.getState(hx, hy)) {
			case "snake":
				win.clearInterval(SNAKESMOVE);
				alert("The game is over!");
				break;
			case "food":
				this.setState(hx, hy, "snake");
                this.setSpeed();
				this.addFood();
				break;
			case false:
				this.setState(hx, hy, "snake");
				this.setState(fx, fy, false);
				break;

			}

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

			if (self.getState(x, y) !== false) {
				return self.random(sx, sy, ex, ey);
			}

			return {
				"x": x,
				"y": y
			};
		},

		getState: function(x, y) {
			return BOXS.get(x + "-" + y).get("state");
		},

		setState: function(x, y, val) {
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
		},

        setSpeed: function() {
            SNAKES.s = 500 - SNAKES.length * 20 ;
            this.move();
        }

	}),

	ControlView = Backbone.View.extend({

		el: $("body"),

		events: {
			"keydown": "setKeyCode"
		},

		initialize: function() {
			this.render();
		},

		render: function() {
			var boxsView = new BoxsView();
			boxsEl = boxsView.make("table", {
				class: "wrap"
			},
			boxsView.el);
			this.el.append(boxsEl);
		},

		setKeyCode: function(e) {

			key = e.which || e.keyCode;

			if (Math.abs(BOXS.k - key) != 2 && key >= 37 && key <= 40) {
				BOXS.k = key;
			} else {
				return false;
			}
		}

	});

	new ControlView;

})(window)

