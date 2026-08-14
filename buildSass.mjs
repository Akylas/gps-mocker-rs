import * as sass from 'sass';
import fs from 'fs';

// node-sass no longer builds on current node; dart-sass renders the same
// entrypoint and is already a dependency.
const result = sass.compile('./src/carbon.scss', {
    loadPaths: ['./node_modules'],
    silenceDeprecations: ['import', 'global-builtin', 'slash-div', 'mixed-decls', 'color-functions', 'legacy-js-api'],
    quietDeps: true
});
fs.writeFileSync('./src/carbon.css', result.css);
console.log(`wrote src/carbon.css (${(result.css.length / 1024).toFixed(1)} KiB)`);
