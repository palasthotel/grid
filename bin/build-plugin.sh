#!/bin/sh

PLUGIN_SLUG="grid"
PROJECT_PATH=$(pwd)
BUILD_PATH="${PROJECT_PATH}/build"
DEST_PATH="$BUILD_PATH/$PLUGIN_SLUG"

echo "Generating build directory..."
rm -rf "$BUILD_PATH"
mkdir -p "$DEST_PATH"

echo "Syncing files..."
rsync -rL  "$PROJECT_PATH/public/" "$DEST_PATH/"

echo "Cleanup files..."
rm "$DEST_PATH/composer.json"
rm "$DEST_PATH/lib/grid/.gitignore"
rm "$DEST_PATH/lib/grid/Butlerfile"
rm "$DEST_PATH/lib/grid/composer.json"
rm "$DEST_PATH/lib/grid/package.json"
rm "$DEST_PATH/lib/grid/package-lock.json"
if [ -d "$DEST_PATH/lib/grid/node_modules" ]; then
  rm -rf "$DEST_PATH/lib/grid/node_modules"
fi
rm "$DEST_PATH"/lib/grid/webpack*
rm -r "$DEST_PATH/lib/grid/src"
rm -r "$DEST_PATH/lib/grid/scss"

echo "Generating zip file..."
cd "$BUILD_PATH" || exit
zip -q -r "${PLUGIN_SLUG}.zip" "$PLUGIN_SLUG/"

cd "$PROJECT_PATH" || exit
mv "$BUILD_PATH/${PLUGIN_SLUG}.zip" "$PROJECT_PATH"
echo "${PLUGIN_SLUG}.zip file generated!"

echo "Cleanup build path..."
rm -rf "$BUILD_PATH"

echo "Build done!"