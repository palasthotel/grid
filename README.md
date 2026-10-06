# Grid

The PHP/JS library behind the Grid page builder: storage, rendering, revisions, reusable
containers and boxes, and the editor. It does nothing on its own - a CMS integration wires
it to its database, hooks and templates:

- [wp-grid](https://github.com/palasthotel/wp-grid) - the [Grid plugin on wordpress.org](https://wordpress.org/plugins/grid/)
- [drupal-grid](https://github.com/palasthotel/drupal-grid)

## Installation

Grid is a base library, not a finished package: the release tags contain the sources, and
the integration builds the editor bundle itself. Install it with Composer from GitHub:

```json
{
	"repositories": [
		{ "type": "vcs", "url": "https://github.com/palasthotel/grid" }
	],
	"require": {
		"palasthotel/grid": "^3.0"
	}
}
```

Then, in the integration's build step:

```sh
composer install --no-dev
(cd vendor/palasthotel/grid && npm ci && npm run build)
```

The package type is `drupal-library`. A Drupal project with the usual installer path
(`"web/libraries/{$name}": ["type:drupal-library"]`) installs the library to
`libraries/grid`, where the editor's scripts and stylesheets are reachable from the web;
build the bundle there. Projects without `composer/installers`, such as a WordPress
plugin, get it in `vendor/palasthotel/grid` as before.

`npm run build` writes `js/dist/grid-editor.js` and `js/dist/reuseContainerList.js`.
The stylesheets in `css/` need no build.

## Upgrading to 3.0

3.0 changes how integrations get the library and what it requires. For wp-grid
and drupal-grid the new versions do this for you; custom integrations and projects that
copied grid into their repository have to adapt.

**Before you update a live site, back up its database.** Schema update 9 deletes
duplicate links between grids, containers, slots and boxes (see below).

1. **PHP 8.2 or later.**
2. **Composer instead of a Git submodule or a copy.** Install `palasthotel/grid` from
   GitHub (see [Installation](#installation)) and load Composer's autoloader. The release
   tags no longer contain `vendor/` or `js/dist/`.
3. **Build the editor bundle yourself:** `npm ci && npm run build` in the library
   directory, as part of your build or deploy. The stylesheets in `css/` need no build.
4. **`Editor` takes your `iHook` as third argument:**
   `new Editor( $core->storage, $assetBaseUrl, $hook )`.
5. **The HTML and video boxes are not part of the library any more.** Integrations bring
   their own `grid_html_box` and `grid_video_box`; wp-grid and drupal-grid do.
6. **Run the schema updates** by calling `Core::update()` once after updating, e.g. from
   your plugin's or module's update routine:
   - update 8 adds a change counter to `grid_grid`;
   - update 9 deletes duplicate rows in `grid_grid2container`, `grid_container2slot` and
     `grid_slot2box` - only rows that link the same element a second time within one
     grid revision, the oldest link is kept - and adds unique keys. An element that was
     shown twice because of such a duplicate is shown once afterwards.
7. **SimplePie comes from Composer** (`simplepie/simplepie` 1.8). If your project ships its
   own SimplePie copy, remove it, or load it only when no `SimplePie` class exists.
8. **The editor endpoint only accepts JSON requests** and only calls public `Endpoint`
   methods. It still does not authenticate - check the user's permission, a CSRF token
   and that the user may edit the grid's post before you call `API::handleAjaxCall()`.
9. **Editors are protected against overwriting each other.** A change based on an outdated
   copy of a grid is rejected with HTTP 409 and the editor reloads. Clients that send no
   version keep working unchecked.

## Usage

An integration provides three adapters and hands them to the library:

| Interface | Provides |
|---|---|
| `Palasthotel\Grid\iQuery` | the table prefix, executing SQL and escaping strings |
| `Palasthotel\Grid\iHook` | firing and filtering hooks (`fire`, `alter`) |
| `Palasthotel\Grid\iTemplate` | where box, container and slot templates are looked up |

```php
$core   = new \Palasthotel\Grid\Core( $query, $hook, $author );
$api    = new \Palasthotel\Grid\API( $core, new \Palasthotel\Grid\Endpoint(), $template );
$editor = new \Palasthotel\Grid\Editor( $core->storage, $assetBaseUrl, $hook );
```

- `Core::getDatabaseSchema()`, `install()`, `uninstall()` and `update()` manage the tables.
- `API::loadGrid( $id )` loads a grid for rendering; `API::handleAjaxCall()` serves the
  editor's requests. The integration is responsible for authentication, a CSRF token and
  checking that the user may edit the grid's post before it calls `handleAjaxCall()` -
  wp-grid shows how.
- `Editor` returns the editor's HTML, scripts and stylesheets.

Box types are classes named `grid_<type>_box` that extend `grid_box`. CMS-specific boxes
(HTML, video, posts, media, ...) live in the integrations, not here.

## Hooks

### Rendering

- `will_render_grid` / `did_render_grid` - first and last rendering hook
- `will_render_container` / `did_render_container`
- `will_render_slot` / `did_render_slot`
- `will_render_box` / `did_render_box`

### Data

- `createGrid`, `publishGrid`, `cloneGrid`, `destroyGrid`
- `save_container`, `delete_container`
- `save_slot` - also when a box is added to or removed from the slot
- `save_box`, `delete_box`
- `will_perform_file_upload` / `did_perform_file_upload`

### Filters

- `soundcloud_user_agent` - the User-Agent of the SoundCloud box's oEmbed requests,
  `Mozilla/5.0 (compatible; grid/3; +https://github.com/palasthotel/grid)` by default. CDNs
  tend to block requests from servers without a User-Agent; change it here if they block
  this one too. In WordPress it is the filter `grid_soundcloud_user_agent`, in Drupal
  `hook_grid_soundcloud_user_agent_alter()`.

## Development

```sh
composer install          # autoloader and PHPUnit
composer test             # PHPUnit
npm ci && npm run build   # editor bundle; npm run watch while working on src/
```

Node version: `.nvmrc`. `js/dist/` and `vendor/` are build output and not committed.
Grid needs PHP 8.2 or later. The pull request check lints PHP 8.2 to 8.4, runs PHPUnit and builds the bundle.

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit messages and releases.

## License

GPL-3.0-or-later, see [license.txt](license.txt).
