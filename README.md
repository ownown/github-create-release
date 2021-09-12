# Create release with one asset

## Update and modify

Clone the repo and install the dependencies

```bash
npm install
```

Make your changes and run

```bash
npm run prepare
```

Commit, push, and update the tags

## Inputs

Input       | Required  | Description
------------|-----------|-------------
asset-path  | yes       | The location of the asset to be included in the release, relative to the github workspace
token       | yes       | The GitHub token
tag         | yes       | The name of the commit tag 
asset-name  | no        | The name the asset should be given on release. Defaults to `binary.bin`

## Example workflow

- _Example repo contains workflow and out.bin_

```text
.
├── .github
│   └── workflows
│       └── example-workflow.yml
└── out.bin

```

```yaml
name: Example Workflow

on: [push]
jobs:
  Run-Job:
    runs-on: ubuntu-20.04
    steps:
    - name: Checkout repo
      uses: actions/checkout@v2
    - name: Get repo tag
      run: echo "tag=${GITHUB_REF#refs/tags/}" >> $GITHUB_ENV
    - name: Create release
      uses: ownown/test-action@v1
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        tag: ${{ env.tag }}
        asset-path: out.bin
        asset-name: test_binary.bin
```
