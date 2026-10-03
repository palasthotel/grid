/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/

window.Authors = GridBackbone.View.extend({
    className: "grid-authors",
    initialize: function(){
        this.listenTo(GRID.authors, "add", this.onAddAuthor);
        this.listenTo(GRID.authors, "remove", this.render);
        this.listenTo(GRID.authors, "reset", this.render);
        this.listenTo(GRID.authors, "change", this.render);
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
    onResize: function(height){
        this.$list.css("height", height+"px");

    },
    onAddAuthor: function(author){
        var author = new Author({model: author});
        this.$list.append(author.render().$el);
    }
});
