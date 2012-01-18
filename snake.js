// Model
var Snake = Backbone.Model.extend({
    
});


// Collection
var Snakes = Backbone.Collection.extend({

    model: Snake,
    
    initialize: function() {
        this.initGrid();
    },
    
    initGrid: function() {
        
    }

});

var snakes = new Snakes;

// View
var SnakeView = Backbone.View.extend({
    
    model: snakes,
    
    initialize: function() {
        $(this.model).bind("add", this.initGrid);
    },
    
    initGrid: function() {
        
    }
    
})

new SnakeView;