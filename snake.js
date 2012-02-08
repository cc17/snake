// Model
var Box = Backbone.Model.extend({

    defaults: {
        snake: false,
        food: false
    }

});

// Collection
var Boxs = Backbone.Collection.extend({

    model: Box,
    x: 20,
    y: 20,
    l: 5

});

var BOXS = new Boxs;

// View
var BoxView = Backbone.View.extend({

    tagName: "td",

    initialize: function() {
        this.model.bind("change:snake", this.render, this);
    },

    render: function() {
        $(this.el).addClass("snake");
        return this;
    }

});

var BoxsView = Backbone.View.extend({

    el: "#wrap",

    initialize: function() {
        this.render();
        this.initSnake();
    },

    render: function() {

        for (i = BOXS.y; i--;) {
            var tr = $("<tr></tr>");

            for (j = BOXS.x; j--;) {
                var id = j + "-" + i;

                BOXS.add({
                    "id": id 
                });

                var view = new BoxView({
                    "model": BOXS.get(id)
                });

                tr.append(view.el);
            }

            $(this.el).append(tr);
        }

    },

    initSnake: function() {
        
        var self = this,
            p = self.random(BOXS.l - 1);
        
        for (i = 0; i < BOXS.l; i++) {
            self.setSnake(p.x - i, p.y, true);
        }

    },

    random: function(sx, sy, ex, ey) {
        var self = this,
        x,
        y;

        sx = sx || 0;
        sy = sy || 0;
        ex = ex || BOXS.x;
        ey = ey || BOXS.y;

        x = Math.floor(Math.random() * (ex - sx)) + sx;
        y = Math.floor(Math.random() * (ey - sy)) + sy;

        if (self.getSnake(x, y)) {
            return self.random(sx, sy, ex, ey);
        }

        return {"x": x, "y": y};
    },

    getSnake: function(x, y) {
        return BOXS.get(x + "-" + y).get("snake");         
    },

    setSnake: function(x, y, val) {
        BOXS.get(x + "-" + y).set({"snake": val});
    }

});

new BoxsView;

