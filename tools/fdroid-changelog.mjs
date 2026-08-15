#!/usr/bin/env node
/**
 * Writes the F-Droid / IzzyOnDroid changelog entry for the version currently in
 * src-tauri/Cargo.toml, from the matching CHANGELOG.md section.
 *
 *   node tools/fdroid-changelog.mjs
 *
 * `standard-version` runs it as a postbump hook (see .versionrc.js), so cutting
 * a release writes the entry into the release commit and nobody has to remember
 * it. Running it by hand is harmless: it is a pure function of two files.
 *
 * The file has to be named after the *versionCode*, not the version name, and
 * that number is chosen by the Tauri CLI rather than by anything in this repo —
 * see versionCode() below.
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CARGO = path.join(ROOT, 'src-tauri', 'Cargo.toml');
const CHANGELOG = path.join(ROOT, 'CHANGELOG.md');
const LOCALES = ['en-US', 'fr-FR'];

/** F-Droid truncates at 500 characters, so a long release gets a pointer. */
const LIMIT = 500;

/**
 * What `tauri android build` writes into tauri.properties, and therefore what
 * ends up in the manifest. Mirrored here rather than read back, because the
 * entry has to be written when the version is bumped — long before anything is
 * built.
 */
function versionCode(version) {
    const [major, minor, patch] = version.split('.').map(Number);
    if ([major, minor, patch].some((part) => !Number.isInteger(part) || part < 0)) {
        throw new Error(`${version} is not a three-part version`);
    }
    if (major > 2100 || minor > 999 || patch > 999) {
        throw new Error(`${version} does not fit Android's versionCode range`);
    }
    return major * 1000000 + minor * 1000 + patch;
}

/** The version this repo is at: .versionrc.js keeps it in Cargo.toml. */
async function currentVersion() {
    const cargo = await readFile(CARGO, 'utf8');
    const match = cargo.match(/^\s*version\s*=\s*"([^"]+)"/m);
    if (!match) {
        throw new Error(`no version in ${path.relative(ROOT, CARGO)}`);
    }
    return match[1];
}

/**
 * The body of one `## [x.y.z]` section, as plain text: the store listings are
 * not rendered, so the markdown noise in a generated changelog is only in the
 * way.
 */
async function entryFor(version) {
    const changelog = await readFile(CHANGELOG, 'utf8');
    const heading = new RegExp(String.raw`^##+ \[?${version.replace(/\./g, '\\.')}\]?.*$`, 'm');
    const start = changelog.match(heading);
    if (!start) {
        throw new Error(`CHANGELOG.md has no section for ${version}`);
    }
    const after = changelog.slice(start.index + start[0].length);
    // exactly two hashes: `### Features` and `### Bug Fixes` are part of the
    // entry, and only the next version heading ends it
    const next = after.search(/^## /m);
    const body = next === -1 ? after : after.slice(0, next);

    const lines = body
        .split('\n')
        // strip the commit links standard-version appends to every bullet
        .map((line) => line.replace(/\s*\(\[[^\]]+\]\([^)]+\)\)\s*$/, '').trimEnd())
        .map((line) => line.replace(/^###+\s*/, '').replace(/^\*\s+/, '- '))
        .filter((line, index, all) => line.trim() !== '' || all[index - 1]?.trim() !== '');

    return lines.join('\n').trim();
}

function clamp(text, version) {
    if (text.length <= LIMIT) {
        return text;
    }
    const tail = `\n…\nFull changelog: https://github.com/Akylas/gps-mocker-rs/releases/tag/v${version}`;
    return `${text.slice(0, LIMIT - tail.length).trimEnd()}${tail}`;
}

async function main() {
    const version = await currentVersion();
    const code = versionCode(version);
    const entry = clamp(await entryFor(version), version);

    for (const locale of LOCALES) {
        const file = path.join(ROOT, 'fastlane', 'metadata', 'android', locale, 'changelogs', `${code}.txt`);
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, `${entry}\n`);
        console.log(`${path.relative(ROOT, file)} (v${version})`);
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
