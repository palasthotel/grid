Grid - API
====

Interface to talk to the data.

## hooks

Grid is hookable at several points.

### Rendering

 - **will_render_grid** fires before grid is rendered. Is first rendering hook.
 - **did_render_grid** fires after grid was fully rendered. Is last rendering hook.
 - **will_render_container** fires before a container is rendered but after will_render_grid
 - **did_render_container** fires after a container was fully rendered but before did_render_grid
 - **will_render_slot** fires before a slot is rendered but after will_render_container
 - **did_render_slot** fires after slot was fully rendered but before did_render_container
 - **will_render_box** fires before a box is rendered but after will_render_slot
 - **did_render_box** fires after box was fully rendered but before did_render_slot
 
 ### Data manipulation
 
 - **createGrid** fires when new grid was created
 - **publishGrid** fires when grid revision changes state from draft to publish
 - **cloneGrid** fires when grid was cloned to new grid
 - **destroyGrid* fires before grid will be deleted
 - **save_container** fires before container stats are persisted
 - **delete_container** 
 - **save_slot** fires before slot stats are persisted and if box is added to or removed from slot.
 - **save_box** fires before new data is persisted
 - **delete_box** fires before box is deleted
  

## License

GPL v3 - see license.txt

## Documentation

Currently there is only [a German documentation available](http://doc.the-grid.ws/). It includes both documentations for users and developers.
