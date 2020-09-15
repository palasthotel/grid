/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

import GridBackbone from 'backbone'

var Author = GridBackbone.View.extend({
    tagName: "li",
    className: "grid-author",
    events: {
        "click .author-lock-sender": "onClickSendLock",
        "click .author-lock-requester": "onClickRequestLock"
    },
    initialize: function(){
        this.listenTo(this.model, "change:request_lock", this.onRequestLock);
    },
    render: function(){
        var json = this.model.toJSON();
        json.have_lock = GRID.authors.haveLock();
        this.$el.empty();
        this.$el.append(ich.tpl_author(json));
	    this.onRequestLock();
        return this;
    },
    onClickSendLock: function(){
        GRID.async.locking_handover(this.model.get("id"));
    },
    onClickRequestLock: function(){
        GRID.async.locking_request_lock();
    },
	onRequestLock: function(){
		if(this.model.get("request_lock")){
			this.$el.addClass('async-request-lock');
		} else {
			this.$el.removeClass('async-request-lock');
		}
    }

});
