# Grid

The PHP/JS library behind the Grid page builder: storage, rendering, revisions, reusable
containers and boxes, and the editor. It does nothing on its own - a CMS integration wires
it to its database, hooks and templates:

- [grid-wordpress](https://github.com/palasthotel/grid-wordpress) - the [Grid plugin on wordpress.org](https://wordpress.org/plugins/grid/)
- [grid-drupal](https://github.com/palasthotel/grid-drupal)

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

`npm run build` writes `js/dist/grid-editor.js` and `js/dist/reuseContainerList.js`.
The stylesheets in `css/` need no build.

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
  grid-wordpress shows how.
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

## Development

```sh
composer install          # autoloader and PHPUnit
composer test             # PHPUnit
npm ci && npm run build   # editor bundle; npm run watch while working on src/
```

Node version: `.nvmrc`. `js/dist/` and `vendor/` are build output and not committed.
The pull request check lints PHP from 7.4 to 8.4, runs PHPUnit and builds the bundle.

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit messages and releases.

## License

See [license.txt](license.txt).
