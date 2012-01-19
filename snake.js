// Model
var Box = Backbone.Model.extend({

	defaults: {
		state: false
	}

});

// Collection
var Boxs = Backbone.Collection.extend({

	model: Box,
	x: 20,
	y: 20

});

var boxs = new Boxs;

// View
var BoxView = Backbone.View.extend({

	tagName: "td",

	initialize: function() {
		this.model.bind("change:state", this.render, this);
	},

	render: function() {
		$(this.el).addClass("snake");
		return this;
	}

});

var BoxsView = Backbone.View.extend({

	el: "#wrap",

	initialize: function() {
		this.initGrid();
	},

	initGrid: function() {

		for (i = boxs.x; i--;) {
			var tr = document.createElement("tr");

			for (j = boxs.y; j--;) {
				var modelID = i + "-" + j;

				// add box model
				boxs.add({
					id: modelID
				});

				// add box view
				var view = new BoxView({
					model: boxs.get(modelID)
				});

				tr.appendChild(view.el);
			}

			$(this.el).append(tr);
		}

	}
});

new BoxsView;

