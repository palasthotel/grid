=== Grid ===
Contributors: edwardbock,mkernel
Donate link: http://palasthotel.de/
Tags: landingpage, editor, admin, page, containerist
Requires at least: 4.0
Tested up to: 4.2.1
Stable tag: 1.3.5
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl

Grid is a containerist landingpage editor.

== Description ==

What is Grid?

* Grid allows Editors to easily create and maintain Landingpages
* Grid is build of a grid containing Containers and Boxes
* Grid is a CMS-neutral Library and this is the Wordpress plugin that implements it

## Types of Boxes

### Static Boxes

* Free-HTML-Box
* Medialibrary-Box
* Video-Box

### List-Boxes

* Ordered and filtered Lists of Contents
* Number of Items as well as criteria for sorting and filtering are configurable

### Content-Boxes

* Single Posts of any kind as Teasers

### Reuseable Boxes

* All Boxes may be reused across several Landingpages

Easy extendable with new boxes. Have a look at doc.the-grid.ws (english is coming soon).

== Installation ==

1. Upload `grid-wordpress.zip` to the `/wp-content/plugins/` directory
1. Extract the Plugin to a `grid` Folder
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Build landing pages at `Landing Pages`, `Switch into the Grid` and on next screen `save changes`
1. Look for more plugins on wordpress.org that can provide grid boxes

== Frequently Asked Questions ==

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



== Arbitrary section ==

There’s a documentation at doc.the-grid.ws (english is coming soon)


