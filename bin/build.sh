#!/bin/sh

# build to public folder for publication
PROJECT_PATH=$(pwd)
BUILD_PATH="${PROJECT_PATH}/public"

## update composer autoload paths
#composer dump-autoload

## update packages and build javascripts
#npm i
#npm run build

## cleanup build path
rm -rf "$BUILD_PATH"
mkdir "$BUILD_PATH"

## collect files
cp -R config "$BUILD_PATH/config"
cp -R core "$BUILD_PATH/core"
cp -R templates "$BUILD_PATH/templates"
cp -R grid* "$BUILD_PATH/."
cp -R license.txt "$BUILD_PATH/."
cp -R README.md "$BUILD_PATH/."

