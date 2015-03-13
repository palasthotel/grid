/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var Authors = GridBackbone.View.extend({
    className: "grid-box-authors",
    events: {
        "click .grid-back": "onBack",
    },
    initialize: function(){
        this.listenTo(GRID.authors, "add", this.onAddAuthor);
        this.listenTo(GRID.authors, "remove", this.render);
        this.listenTo(GRID.authors, "reset", this.render);
    },
    render: function(){
        this.$el.empty();
        this.$el.append(ich.tpl_authors());
        this.$list = this.$el.find(".authors-list");
        var self = this;
        GRID.authors.each(function(author){
            self.onAddAuthor(author);
        });
        return this;
    },
    onAddAuthor: function(author){
        var author = new Author({model: author});
        this.$list.append(author.render().$el);
    },
    onBack: function(){
        GRID.hideAuthors();
        this.remove();
    }
});
