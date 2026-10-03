# Contributing

## Branching

`main` is the default branch. Work on a feature branch and open a pull request against
`main`; the pull request check (PHP lint, PHPUnit, editor build) has to pass.

## Commit messages

Releases and the changelog are generated from the commit history by
[release-please](https://github.com/googleapis/release-please), so commit messages follow
[Conventional Commits](https://www.conventionalcommits.org/):

| Type | Effect on the version | Appears in changelog |
|---|---|---|
| `fix:` | patch (3.0.0 → 3.0.1) | yes, "Bug Fixes" |
| `feat:` | minor (3.0.0 → 3.1.0) | yes, "Features" |
| `!` after the type, or a `BREAKING CHANGE:` footer | major (3.0.0 → 4.0.0) | yes, highlighted |
| `docs:`, `refactor:`, `chore:`, `test:`, `ci:`, `build:` | none | no |

When squash-merging, make sure the squash commit message itself is a conventional commit -
that is the message release-please reads.

### Who the changelog is for

The consumers of this library are the CMS integrations. `fix:` and `feat:` are for changes
they notice: behaviour, the PHP API, hooks, templates, the editor. Workflows, tests and
repository documentation release nothing.

Anything an integration has to adapt to is a major: removed or renamed classes, boxes,
hooks, templates or asset paths. Mark it with `!` and say in the `BREAKING CHANGE:` footer
what integrations have to do.

## Releases

Merging the release pull request that release-please keeps open tags the version and
creates the GitHub release. There is no deploy: integrations pick up the new tag through
Composer (Dependabot opens the pull request there).

## Dependencies

Dependabot groups npm and Composer updates weekly. Development tools are `chore(deps)`,
everything that ends up in the editor bundle is `fix(deps)` - integrations ship it.
