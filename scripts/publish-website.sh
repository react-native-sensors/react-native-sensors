#!/bin/bash

set -ex

git config user.email "$GIT_USER@users.noreply.github.com"
git config user.name "$GIT_USER"
echo "machine github.com login $GIT_USER password $GIT_TOKEN" >~/.netrc

cd website
npm install
GIT_USER=$GIT_USER CURRENT_BRANCH=master npm run publish-gh-pages
