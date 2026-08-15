# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/Akylas/gps-mocker-rs/compare/v2.1.0...v3.0.0) (2026-08-15)


### Features

* **adb:** one Prepare device action that fixes what is actually missing ([f310ce7](https://github.com/Akylas/gps-mocker-rs/commit/f310ce7ab02a85a840cf2b625aa7c465c40db52c))
* **adb:** send bearing and speed with the mocked fix ([81b9e6b](https://github.com/Akylas/gps-mocker-rs/commit/81b9e6be60e0a24f98697a37e15ebc42156c92bf))
* allow custom map style ([1d5dc9f](https://github.com/Akylas/gps-mocker-rs/commit/1d5dc9fc05b447496692d7cf69fc6b7604781859))
* **android:** drive our own app over adb instead of the appium helper ([ef673ea](https://github.com/Akylas/gps-mocker-rs/commit/ef673ea6e9b03540ef8827c188c8d86dfcfa53ff))
* **android:** mock location natively, with no adb bridge ([f806164](https://github.com/Akylas/gps-mocker-rs/commit/f80616488d27b56289ebe7aee61cb7f62cdd300e))
* **android:** stop showing a notification for mocking nobody is watching ([b2013f2](https://github.com/Akylas/gps-mocker-rs/commit/b2013f271927dd91ce540550667d42390cedc41f))
* **ci:** let a manual release choose how far to bump the version ([9c88a39](https://github.com/Akylas/gps-mocker-rs/commit/9c88a39405f292f99ed5ea4cae725273b05dcc04))
* GPX playback, Valhalla routing and live navigation ([50f6566](https://github.com/Akylas/gps-mocker-rs/commit/50f656634b0cc0fd33b5e990fe3882c84c69bbc7))
* **import:** read routes from GeoJSON, instructions included ([a006f0f](https://github.com/Akylas/gps-mocker-rs/commit/a006f0f6129cf6ce67adf63931db0029763d6f14))
* migrate to Tauri v2 ([d7fabee](https://github.com/Akylas/gps-mocker-rs/commit/d7fabee6441f09e22a29214b4155b81669d4cf4b))
* new settings for speed and keyboard frequency ([bb024b9](https://github.com/Akylas/gps-mocker-rs/commit/bb024b93d30e13c5dec3adc5dac3459ac16e1d74))
* **release:** publish the Android build and fetch it once ([a45c4fc](https://github.com/Akylas/gps-mocker-rs/commit/a45c4fcd8d2a21e6269508c8f3eb40b3d0c96e9a))
* show progress and errors for the Setup and Install APK menu actions ([a213ab1](https://github.com/Akylas/gps-mocker-rs/commit/a213ab1528b327c963a1abb5e34d853f48547a91))
* **ui:** one responsive shell, a light theme, and reliable adb targeting ([144623a](https://github.com/Akylas/gps-mocker-rs/commit/144623ae434097127ed2dbf14363c58e43af1e24))


### Bug Fixes

* **adb:** stop reviving the helper mid-route ([9bd2e0b](https://github.com/Akylas/gps-mocker-rs/commit/9bd2e0bb0efaa718e6fbed8dca2b9923059e697c))
* apply map style and terrain settings, restore the route on cancel ([2433e05](https://github.com/Akylas/gps-mocker-rs/commit/2433e05db6f67d4a02c56fc4500fdb95abde2d48))
* **ci:** give a manually run release a version to look up ([35ea410](https://github.com/Akylas/gps-mocker-rs/commit/35ea410a74eb7e72ae80e97c41efab476e8c27dc))
* **ci:** install the project before cutting a release with standard-version ([dd694ec](https://github.com/Akylas/gps-mocker-rs/commit/dd694ec12670cc7d38777d16172dcc6757a26137))
* dock the bottom panels, move stats clear of the map controls ([3fb00aa](https://github.com/Akylas/gps-mocker-rs/commit/3fb00aafbbfd713749a0feca6d862dd9adb0f4d4))
* **icons:** use the app's own icon on Android, and in the Dock while developing ([c259503](https://github.com/Akylas/gps-mocker-rs/commit/c259503e0004fc2ea39d0a2ba00ffb45bf4f4c3c))
* let the map style and terrain URL fields be edited ([5475f3d](https://github.com/Akylas/gps-mocker-rs/commit/5475f3d972aaca88b0ad33bd18daf05b3bfa6071))
* **macos:** vendor rusty_libimobiledevice fork pinned to libimobiledevice 1.3.0 ([6dee9b7](https://github.com/Akylas/gps-mocker-rs/commit/6dee9b7114a2cb8b231eeebb4c78e307a65fd977))
* **map:** keep the position marker on the ground with 3D terrain ([4259d38](https://github.com/Akylas/gps-mocker-rs/commit/4259d381d6c3713f655003a9de447e17551a543c))
* only build libimobiledevice on macos for now ([0b3758f](https://github.com/Akylas/gps-mocker-rs/commit/0b3758f55a62aa67bbc758e273938ca74bf5c581))
* unblock settings clicks and restore macOS editing shortcuts ([95033de](https://github.com/Akylas/gps-mocker-rs/commit/95033debeccc5b4ff6f51af88754d526843e6232))
* use `handle.path_resolver` ([fd5cd3d](https://github.com/Akylas/gps-mocker-rs/commit/fd5cd3d23c6137acdb4eb33fcd5d5e48de660784))

## [2.1.0](https://github.com/farfromrefug/gps-mocker-rs/compare/v1.2.0...v2.1.0) (2022-10-06)


### Features

* 2.0.0 ([61714bc](https://github.com/farfromrefug/gps-mocker-rs/commit/61714bc7ad7699ca5ca461b71a6035ea0b0df329))


### Bug Fixes

* faster build process with generated carbon.css ([1b3ae1c](https://github.com/farfromrefug/gps-mocker-rs/commit/1b3ae1c7449f9d74e3f264fe05e866cf717c9817))
* fixes ([e1d12f8](https://github.com/farfromrefug/gps-mocker-rs/commit/e1d12f874021c5e5686e3db58e3c5e1aa45d72ae))

## [1.2.0](https://github.com/farfromrefug/gps-mocker-rs/compare/v1.1.0...v1.2.0) (2022-03-17)


### Features

* localized app (en/fr) ([13da8b9](https://github.com/farfromrefug/gps-mocker-rs/commit/13da8b96e38740a5702855c2ea80408b6eb75075))

## [1.1.0](https://github.com/farfromrefug/gps-mocker-rs/compare/v1.0.0...v1.1.0) (2022-03-16)


### Features

* move to carbon ui kit ([6ad9e4d](https://github.com/farfromrefug/gps-mocker-rs/commit/6ad9e4d07eea0900e9102462c6ef6a2a90aab7d3))
* support ios simulator ([ca08281](https://github.com/farfromrefug/gps-mocker-rs/commit/ca082813d1bdcdf4e6078eeb983963d642a47ed0))


### Bug Fixes

* layout fixes ([62a0893](https://github.com/farfromrefug/gps-mocker-rs/commit/62a0893da785c4dd5f056c9857393850c82cfa18))
* new app icon (ugly but that s the best i can do :P ) ([a86846b](https://github.com/farfromrefug/gps-mocker-rs/commit/a86846b082d2a211058c0fa028e5407e494d6cbb))
* trying to fix build on ubuntu/macos ([cbab738](https://github.com/farfromrefug/gps-mocker-rs/commit/cbab738ea11f15a54687dd0822b99204ea3dc243))

## [1.1.0](https://github.com/farfromrefug/gps-mocker-rs/compare/v1.0.0...v1.1.0) (2022-03-16)


### Features

* move to carbon ui kit ([6ad9e4d](https://github.com/farfromrefug/gps-mocker-rs/commit/6ad9e4d07eea0900e9102462c6ef6a2a90aab7d3))
* support ios simulator ([ca08281](https://github.com/farfromrefug/gps-mocker-rs/commit/ca082813d1bdcdf4e6078eeb983963d642a47ed0))


### Bug Fixes

* layout fixes ([62a0893](https://github.com/farfromrefug/gps-mocker-rs/commit/62a0893da785c4dd5f056c9857393850c82cfa18))
* new app icon (ugly but that s the best i can do :P ) ([a86846b](https://github.com/farfromrefug/gps-mocker-rs/commit/a86846b082d2a211058c0fa028e5407e494d6cbb))
* trying to fix build on ubuntu/macos ([cbab738](https://github.com/farfromrefug/gps-mocker-rs/commit/cbab738ea11f15a54687dd0822b99204ea3dc243))
