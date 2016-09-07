=== Grid ===
Contributors: edwardbock,mkernel
Donate link: http://palasthotel.de/
Tags: landingpage, editor, admin, page, containerist, grid
Requires at least: 4.0
Tested up to: 4.6
Stable tag: 1.6.6
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl

Grid is a containerist landingpage editor.

== Description ==

What is Grid?

* Grid allows Editors to easily create and maintain Landingpages
* Grid is build of a grid containing Containers and Boxes
* Grid is a CMS-neutral Library and this is the Wordpress plugin that implements it

Types of Boxes

- Static Boxes -

* Free-HTML-Box
* Medialibrary-Box
* Video-Box

- List-Boxes -

* Ordered and filtered Lists of Contents
* Number of Items as well as criteria for sorting and filtering are configurable

- Content-Boxes -

* Single Posts of any kind as Teasers

- Reuseable Boxes -

* All Boxes may be reused across several Landingpages

Easy extendable with new boxes. Have a look at doc.the-grid.ws (english is coming soon).

== Installation ==

1. Upload `grid-wordpress.zip` to the `/wp-content/plugins/` directory
1. Extract the Plugin to a `grid` Folder
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Build landing pages at `Landing Pages`, `Switch into the Grid` and on next screen `save changes`
1. Look for more plugins on wordpress.org that can provide grid boxes

== Frequently Asked Questions ==

= How do the async features like author control work? Does Grid talk to an external service? =

Generally speaking, yes! But you can easily turn it off in grid settings. And there will be no talking to any external server anymore. Alternatively you can host your own grid async service on your own server. Note that our service will not use or save any personal data at any time. It only uses data to keep the function going.

= Table already exists error when I want to activate Grid. Why? = 

This happens if grid was installed previously and could not be uninstalled correctly. You have to delete in the wp_options the option_name „grid“. Then try again to active Grid plugin.

= How do I use Grid landingpages? =

Goto Settings->Grid and choose which post types should be able to use Grid. Than goto one of the activated post types and click on `Switch into the Grid` and on next screen `save changes`. Now you can drag and drop your landingpage.

= How do I get new box types? =

Have a look at wordpress.org for plugins that provide new grid boxes or you can create your own plugin and use the `grid_load_classes` action to add new box classes. You can find a documentation at doc.the-grid.ws

== Screenshots ==

1. Grid editor with Container list

2. Grid editor with Box list

== Changelog ==

= 1.6.6. =
 * Avoid Doublets plugin implementation

= 1.6.5 =
 * Revisions not working fix

= 1.6.4 =
 * media box fix

= 1.6.3 =
 * PHP function default value calculation fix

= 1.6.2 =
 * Selectable Grid position to Post content
 * Disable Grid in single Post
 * Localization

= 1.6.1 =
 * RSS box in core
 * Plaintext box in core
 * Async timeout setting

= 1.6 =
 * Async features are working
 * Problems with double question marks in box fields fixed

= 1.5.11 =
 * Async locking problems fix
 * grid_the_content filter for grid position on the_content filter

= 1.5.9 =
 * Posts box fix
 * Media type select for media-box in grid settings

= 1.5.8 =
 * Include paths problems fix

= 1.5.7 =
 * Security fix

= 1.5.6 =
 * Variable collision in template files while rendering bugfix

= 1.5.5 =
 * Icon font in list widget fix

= 1.5.4 =
 * Post Box render Bugfix

= 1.5.3 =
 * Posts WP_Query moved to template
 * Async features disabled by default

= 1.5.2 =
 * CKEditor plugins support
 * CSS fix

= 1.5.2 =
 * CKEditor plugins support
 * CSS fix

= 1.5 =
 * Multiple authors handling
 * Visual optimizations

= 1.4.8 =
 * Installation bug fix

= 1.4.7 =
 * Default list of contents box can use all taxonomies
 * Bugfix wp_mediaselect in lists

= 1.4.6 =
 * Fixed reuse area problems

= 1.4.5 =
 * Render to content fix

= 1.4.4 =
 * Imagepreview in grid box editor
 * Posts box shows empty categories
 * Settings for post search on grid
 * refactoring to object orientation

= 1.4.3 =
 * Added lost template files 
 * default editmode template for content objects 

= 1.4.2 =
 * Empty reuse container title bug
 * Default templates update
 * Grid box inheritance
 * Latest contents on empty contents search
 * Grid jumping on dragging new box fix

= 1.4.1 =
 * js and css enqueue fixes

= 1.4 =
 * custom editor JS and CSS files in reuse mode fix

= 1.3.8 =
 * Polylang support

= 1.3.7 =
 * container and box loading fix

= 1.3.5 =
 * more revisions loader on scroll
 * loading opration overlay

= 1.3.5 =
 * missing wordpress media in reuse box editor

= 1.3.4 =
 * initial loading indicator
 * mysqli warning on connection

= 1.3.3 =
 * Post Types Landing Page and Sidebar can be disabled in Grid settings
 * Autocomplete false locking fix
 * New editor CSS filter
 * unpublished posts fix in post grid box

= 1.3.2 =
 * Shortcodes are working with Static HTML Box
 * Soundcloud box has new parameter for height
 * Error on saving boxes fixed

= 1.3.1 =
* .gitignore problem with lib folder fixed

= 1.3 = 
* SQL injection security fix
* UI language fix
* install fix
* facebook and twitter box separated to "grid social boxes" [Grid Social Boxes](http://wordpress.org/plugins/grid-social-boxes/ "Facebook and Twitter for Grid") plugin
* multisite support
* autocomplete fieldtype performance optimization
* plugin hook for templates added
* plugin hook for editorwidgets
* template rendering optimized
* "Switch to Grid" Button moved to editor sidebar
* implemented uninstall hook

= 1.2 =
* added version info to the facebook and twitter subplugins

= 1.1 =
* Installation issues
* Post type registration fixes on activate

= 1.0 =
* First release

== Upgrade Notice ==

= 1.3.4 = 
Grid works with custom ports on php strict level now

= 1.3.1 =
Some boxes could not be saved. Now they can.

= 1.3.1 =
If you are using git in your project the lib folder was ignore previously.

= 1.3.2 =
Fixes an sql error which occurs when editing reusable boxes or containers.

== Arbitrary section ==

There’s a documentation at doc.the-grid.ws (english is coming soon)


