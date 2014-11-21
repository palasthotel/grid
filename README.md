grid
====

A PHP/HTML/JS Framework to build landing pages.
This library does not work on it's own - it needs some help from outside.


## Requirements

* you need to provide db_query() which replaces {...} with PREFIX... and executes the statement

## Supported Browsers

 * Chrome  
 * Firefox 4.0+
 * Safari
 * IE9+

## Usage

* whatever you want to do, require grid.php and instantiate a new grid_library object.
* the grid_library object will provide you with everything you need to.

## grid_library

* getFrontendCSS($absolute) returns the default frontend css path in either absolute or relative paths (relative means relative to grid.php)
* getEditorJS($language,$absolute) returns an array of js paths to include for the editor to work correctly.
* getEditorCSS($rtl,$absolute) returns an array of css paths to include for the editor to work correctly.
* getCKEditorConfig($styles,$formats) returns the rendered js to be provided for the editor in order to configure CKEditor correctly.
* getEditorHTML(...) returns the HTML for the editor to work properly.
* getDatabaseSchema() returns the drupal-7-conform scheme of tables needed by grid.
* install() performs the needed transformations on the tables based on the schema to set everything up.
* uninstall() undos the transformations install() did.
* getStyleEditor() returns the editor class for styles.
* getReuseContainerEditor() returns the editor class for reusable containers.
* getReuseBoxEditor() returns the editor class for reusable boxes.
* update() performs needed database updates.

## License

GPL v3 - see license.txt
