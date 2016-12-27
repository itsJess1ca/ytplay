[![Build Status](https://travis-ci.org/j3ddesign/ytplay.svg?branch=master)](https://travis-ci.org/j3ddesign/ytplay)

## **PlayLyster** ##
Manage and play youtube playlists in an easy to use UI

----------


This is a WIP app for playing youtube playlists/videos - This will also eventually expose a websocket connection with current song information eventually, making it perfect for live video etc.


## Basic scripts

Use `yarn start` for dev server. Default dev port is `3000`.

Use `yarn run start:hmr` to run dev server in HMR mode.

Use `yarn run build` for production build.

Use `yarn run server:prod` for production server and production watch. Default production port is `8088`.

Default ports and option to use proxy backend for dev server can be changed in `constants.js` file.

To create AOT version, run `yarn run compile`. This will compile and build script.
Then you can use `yarn run prodserver` to see to serve files.
Do not use build:aot directly unless you have already compiled.
Use `yarn run compile` instead, it compiles and builds:aot

The scripts are set to compile css next to scss because ngc compiler does not support Sass.
To compile scss, use `yarn run sass`, but many of the scripts will either build or watch scss files.
