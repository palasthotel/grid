/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var Author = GridBackbone.View.extend({
    tagName: "li",
    className: "grid-author",
    events: {
        "click .lock-sender": "onSendLock",
    },
    initialize: function(){
    },
    render: function(){
        var json = this.model.toJSON();
        json.have_lock = GRID.authors.haveLock();
        this.$el.empty();
        this.$el.append(ich.tpl_author(json));
        return this;
    },
    onSendLock: function(){
        console.log("send lock to"+this.model.get("id"));
        GRID.async.locking_handover(this.model.get("id"));
    },
});
