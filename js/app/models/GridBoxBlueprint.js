var GridBoxBlueprint = GridBackbone.Model.extend({
    initialize: function(spec){
    	if(!spec || !spec.type || spec.type == "") throw "InvalidConstructArgs GridBoxBlueprint: needs type";
    	if(!spec.content || typeof spec.content != "object" ) throw "InvalidConstructArgs GridBoxBlueprint: needs content";
    }
});