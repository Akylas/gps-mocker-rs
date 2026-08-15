const tracker = {
    filename: './src-tauri/Cargo.toml',
    updater: require('./tauriVersioner')
};

module.exports = {
    bumpFiles: [tracker],
    packageFiles: [tracker],
    scripts: {
        // after the CHANGELOG entry exists and before the release is committed,
        // so the F-Droid changelog for the new versionCode rides along in the
        // same commit instead of being remembered by hand
        postchangelog: 'node tools/fdroid-changelog.mjs'
    }
};
