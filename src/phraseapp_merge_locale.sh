#!/bin/bash
FROM_BRANCH="dev"
TO_BRANCH=$1

echo "Installing phrase-cli"

sudo wget -O phrase https://github.com/phrase/phrase-cli/releases/download/2.0.13/phrase_linux_amd64
sudo chmod +x phrase
sudo cp phrase /usr/local/bin/

echo "Merging $FROM_BRANCH to $TO_BRANCH"


phrase pull --branch $FROM_BRANCH
if [[ $TO_BRANCH == master ]]
then
    phrase push
else
    phrase push --branch $TO_BRANCH
fi
