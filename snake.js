// Model
var Box = Backbone.Model.extend({

    state: false
    
});


// Collection
var Boxs = Backbone.Collection.extend({
    
    model: Box,
    
    x: 10,
    
    y: 10
    
});

var boxs = new Boxs;

// View
var BoxView = Backbone.View.extend({
    
    tagName: "td", 

    initialize: function() {
        $(this.model).bind("change", this.render);
    },

    render: function() {
        return this;
    }

});

var BoxsView = Backbone.View.extend({

    el: "#wrap",
    
    template: "{{#boxArray}}{{el}}{{/boxArray}}",
    
    boxArray:[],
    
    initialize: function() {
        boxs.bind("add", this.addBox, this);
        this.initGrid();
    },
    
    initGrid: function() {

        for (i = boxs.x; i--;) {
            for (j = boxs.y; j--;) {
                boxs.add({id: i + "-" + j});
            }
        }

        $(this.el).append(Mustache.render(this.template, {"boxArray": this.boxArray}));
        
    },
    
    addBox: function(box) {
        this.boxArray.push(new BoxView({model: box}));
    }
    
});

new BoxsView;