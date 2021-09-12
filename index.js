const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

// Test comment

// most @actions toolkit packages have async methods
async function run() {
    core.info("Get inputs");
    const token = core.getInput('token');
    const tag = core.getInput('tag');
    const assetPath = core.getInput('asset-path');
    const assetName = core.getInput('asset-name');

    // Thins
    if (tag.includes('refs')) {
        core.warning('No tag, no release');
        return;
    }

    core.info('tag: ' + tag);
    core.info('asset path: ' + assetPath);

    const octokit = github.getOctokit(token);
    const context = github.context;

    core.info("Create release");
    let createReleaseResponse;
    try {
        createReleaseResponse = await octokit.rest.repos.createRelease({
            ...context.repo,
            tag_name: tag
        });
    } catch (error) {
        core.warning('create release');
        core.setFailed(error.message);
    }

    core.info("Upload object to release");

    const release_id = createReleaseResponse.data.id;
    const upload_url = createReleaseResponse.data.upload_url;

    try {
        const _ = await octokit.rest.repos.uploadReleaseAsset({
            ...context.repo,
            release_id: release_id,
            data: fs.readFileSync(assetPath),
            origin: upload_url,
            name: assetName
        });
    } catch (error) {
        core.warning("upload asset");
        core.setFailed(error.message);
    }
}

run();
