# Changelog

## [3.1.0](https://github.com/palasthotel/grid/compare/v3.0.0...v3.1.0) (2026-10-06)


### Features

* install into Drupal's libraries directory ([4bc8f75](https://github.com/palasthotel/grid/commit/4bc8f75ff692908d2bee5306d47dad414241d2a8))
* install into Drupal's libraries directory ([4d66615](https://github.com/palasthotel/grid/commit/4d66615e0d46046a7834e445aedf79badae4f4a7))


### Bug Fixes

* run the editor with jQuery 4 ([916eb78](https://github.com/palasthotel/grid/commit/916eb78e5a99753e512fb7ffecdef84a04685c1e))

## [3.0.0](https://github.com/palasthotel/grid/compare/v2.5.7...v3.0.0) (2026-10-05)


### ⚠ BREAKING CHANGES

* grid needs PHP 8.2 or later; the pull request check lints 8.2 to 8.4.
* Editor::__construct() takes the integration's iHook as a third argument (Storage, asset base URL, iHook), so the style editor can fire hooks. Integrations that construct the Editor have to pass it; grid-wordpress does, grid-drupal does not yet.
* js/dist and vendor/ are no longer part of the repository or the release tags. Consumers install the library with Composer (palasthotel/grid from GitHub) and build it themselves: composer install, then npm ci && npm run build in the library directory.
* grid_html_box is no longer part of the library. CMS integrations ship their own html box; grid-wordpress and grid-drupal already do.
* grid_video_box and its edit-mode template are no longer part of the library. CMS integrations ship their own video box; grid-wordpress and grid-drupal already do.

### build

* build the editor bundle in the pipeline instead of committing it ([d5a02cc](https://github.com/palasthotel/grid/commit/d5a02cca712c1e4240626c26cb3b6c25f0ec19f6))
* require PHP 8.2 ([326cfdc](https://github.com/palasthotel/grid/commit/326cfdcc64d231230108eb6b80d7e6be2f05ca1a))


### Features

* reject changes based on an outdated copy of a grid ([84f3b7a](https://github.com/palasthotel/grid/commit/84f3b7a512f4c5911b1a09b866ac856e14976514))
* send a User-Agent with SoundCloud requests and let projects cha… ([7c6bb15](https://github.com/palasthotel/grid/commit/7c6bb155ca60b168755a3926a743d426d3785381))
* send a User-Agent with SoundCloud requests and let projects change it ([3731449](https://github.com/palasthotel/grid/commit/373144943fbdbbcf4bbd9821470e8f355e96b934))


### Bug Fixes

* call get_class() with an argument ([94579fb](https://github.com/palasthotel/grid/commit/94579fbccdae901c9f802b1e978b2b0f32c6925f))
* cast ids and escape values in all storage queries ([fcf1798](https://github.com/palasthotel/grid/commit/fcf1798a109b4799d17e9eef0b5c3eda70919db9))
* deprecated warnings ([da1d855](https://github.com/palasthotel/grid/commit/da1d855f4ce5df32ca16b318a38e99b34958f3cf))
* deprecation warnings ([24cb5cc](https://github.com/palasthotel/grid/commit/24cb5cc813bf2cd348b2158ea9fb8a0d4376c7d8))
* **deps:** update the bundled CKEditor to 4.22.1 ([a663caa](https://github.com/palasthotel/grid/commit/a663caae68c2f41766610ca44a7eba7e41ac3b52))
* **deps:** update the editor bundle's packages and drop unused ones ([109a292](https://github.com/palasthotel/grid/commit/109a292b97597c65c89bad2743012651a6b18469))
* do not fail when removing a box that is already gone ([a2efc2d](https://github.com/palasthotel/grid/commit/a2efc2dee1914756f54412d9c22f23ec49a8b7b8))
* keep a box type's defaults when stored or posted content lacks a field ([daaf415](https://github.com/palasthotel/grid/commit/daaf4152b5688c17d6fd43f27f6773146b41c033))
* keep the editor's toolbar buttons in the window and steady on hover ([b0f892b](https://github.com/palasthotel/grid/commit/b0f892b51f5ad2aaf6ddf7f0480eb6b75c9ecbf9))
* keep the editor's toolbar buttons in the window and steady on hover ([417713d](https://github.com/palasthotel/grid/commit/417713ddabf33409636a39427e9d02e0370d276f))
* link a container, slot or box only once per grid revision ([eb91b8a](https://github.com/palasthotel/grid/commit/eb91b8acafb92d89b8ccc3c66dabacba0897cbc0))
* load every external CKEditor plugin, not only the last ([791b3af](https://github.com/palasthotel/grid/commit/791b3af87c64d8f2fdf757963404293d83802468))
* stop the bundled SimplePie from breaking WordPress feeds ([55fe965](https://github.com/palasthotel/grid/commit/55fe96592c0ce96e4487b04bcd1aa04f402660e7))
* stop the bundled SimplePie from breaking WordPress feeds ([0aab356](https://github.com/palasthotel/grid/commit/0aab35659dce14f8d43c0b0b5336fe3e9453ca6a))


### Code Refactoring

* pass an iHook to the Editor ([e97fe34](https://github.com/palasthotel/grid/commit/e97fe3466d358a9375363ff0f153c52267059ce5))
* remove the html box from the library ([7b62ef0](https://github.com/palasthotel/grid/commit/7b62ef010fe04f6c3c177094027bac63613ee1c0))
* remove the video box from the library ([efe85d9](https://github.com/palasthotel/grid/commit/efe85d9d278f81eca8a582d801b2cd5977b339ed))

## Changelog
