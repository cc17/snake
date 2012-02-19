(function(win) {


    var SNAKESMOVE;

    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

    // Model
    var State = Backbone.Model.extend({
            defaults: {
                x: 20,
                y: 20,
                k: 39,
                l: 3,
                s: 500
            }
        }),

        Box = Backbone.Model.extend({
            defaults: {
                type: false
            }
        }),

        Snake = Backbone.Model.extend({
            defaults: {
                x: 0,
                y: 0
            }
        }),

        STATE = new State;

    // Collection
    var Boxs = Backbone.Collection.extend({
            model: Box
        }),

        Snakes = Backbone.Collection.extend({
            model: Snake
        }),

        BOXS = new Boxs,

        SNAKES = new Snakes;

    // View
    var StateView = Backbone.View.extend({

        tagName: "ul",

        template: _.template("<li>len: {{l}}</li><li>speed: {{s}}</li>"),

        initialize: function() {
            this.model.bind("change", this.render, this);
            this.render();
        },

        render: function() {
            this.$el.html(this.template(STATE.toJSON())); 
            return this;
        }

    }),

    BoxView = Backbone.View.extend({
        tagName: "td",

        initialize: function() {
            this.model.bind("change:type", this.render, this);
        },

        render: function() {
            var type = this.model.get("type");

            if (type !== false) {
                this.el.className = type;
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
            for (i = 0; i < STATE.get("y"); i++) {
                var tr = $("<tr></tr>");

                for (j = 0; j < STATE.get("x"); j++) {
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
            var p = this.random(STATE.get("l") - 1);

            for (i = 0; i < STATE.get("l"); i++) {
                this.setType(p.x + i, p.y, "snake");
            }

            this.move();
        },

        addFood: function() {
            var p = this.random();

            BOXS.get(p.x + "-" + p.y).set({
                type: "food"
            });
        },

        move: function() {
            var self = this;

            if (SNAKESMOVE !== undefined) {
                win.clearInterval(SNAKESMOVE)
            }

            SNAKESMOVE = win.setInterval(function() {
                self.step();
            }, STATE.get("s"));
        },

        step: function() {
            var l = SNAKES.length - 1,
                m = SNAKES.models,
                hx = m[l].get("x"),
                hy = m[l].get("y"),
                fx = m[0].get("x"),
                fy = m[0].get("y");

            switch (STATE.get("k")) {
                case 37:
                    hx === 0 ? hx = STATE.get("x") - 1: hx -= 1;
                    break;
                case 38:
                    hy === 0 ? hy = STATE.get("y") - 1: hy -= 1;
                    break;
                case 39:
                    hx === STATE.get("x") - 1 ? hx = 0: hx += 1;
                    break;
                case 40:
                    hy === STATE.get("y") - 1 ? hy = 0: hy += 1;
                    break;
            }

            switch (this.getType(hx, hy)) {
                case "snake":
                    win.clearInterval(SNAKESMOVE);
                    alert("The game is over!");
                    break;
                case "food":
                    this.setType(hx, hy, "snake");
                    this.setState();
                    this.addFood();
                    break;
                case false:
                    this.setType(hx, hy, "snake");
                    this.setType(fx, fy, false);
                    break;
            }
        },

        random: function(sx, sy, ex, ey) {
            var self = this,
            x, y;

            sx = sx || 0;
            sy = sy || 0;
            ex = ex || STATE.get("x");
            ey = ey || STATE.get("y");

            x = Math.floor(Math.random() * (ex - sx));
            y = Math.floor(Math.random() * (ey - sy));

            if (self.getType(x, y) !== false) {
                return self.random(sx, sy, ex, ey);
            }

            return {
                "x": x,
                "y": y
            };
        },

        getType: function(x, y) {
            return BOXS.get(x + "-" + y).get("type");
        },

        setType: function(x, y, val) {
            BOXS.get(x + "-" + y).set({
                type: val
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

        setState: function() {
            STATE.set({
                "l": SNAKES.length,
                "s": 500 - (SNAKES.length - 3) * 20
            });

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
            var boxsView = new BoxsView(),
                boxsEl = boxsView.make("table", {
                    "class": "wrap"
                }, boxsView.el);

            var stateView = new StateView({model: STATE}),
                stateEl = stateView.make("div", {
                    "class": "state"
                }, stateView.el);

            this.$el.append(boxsEl);
            this.$el.append(stateEl);
        },

        setKeyCode: function(e) {
            key = e.which || e.keyCode;

            if (Math.abs(STATE.get("key") - key) != 2 && key >= 37 && key <= 40) {
                STATE.set({"k": key});
            } else {
                return false;
            }
        }
    });

    new ControlView;

})(window);

