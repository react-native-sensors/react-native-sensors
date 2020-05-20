#!/bin/bash

set -ex

if [ "$ENV" == "CI" ]; then
    echo "This script will screw with your git config"
    echo "if you really want to run it pass this env var: ENV=CI"
    exit 1
fi

if [ -z "$GIT_USER" ]; then
    echo "No GIT_USER provided"
    exit 1
fi

if [ -z "$GIT_TOKEN" ]; then
    echo "No GIT_TOKEN provided"
    exit 1
fi


git config --global user.email "$GIT_USER@users.noreply.github.com"
git config --global user.name "$GIT_USER"
echo "machine github.com login $GIT_USER password $GIT_TOKEN" >~/.netrc

cd website
npm install
GIT_USER=$GIT_USER CURRENT_BRANCH=master npm run publish-gh-pages
