#!/bin/bash   
# set -x

branch=$1
message=$2

if [ -z "$branch" ]
  then
    echo "No branch argument supplied"
    echo "Usage: apply [branch] [message]"
    exit
fi

if [ -z "$message" ]
  then
    echo "No message argument supplied"
    echo "Usage: apply [branch] [message]"
    exit
fi

repoDir="clone-repo-dir"
patchDir="PATCH"

function processRepo {
    repoUrl=$1 

    echo ">>>>>>>>> Processing repo: " $repoUrl

    echo "Cleanup..."
    rm -rf $repoDir

    echo "Cloning repo..."
    git clone $repoUrl $repoDir

    echo "Patching..."
    cp -r PATCH/* repo

    cd $repoDir
    echo "Creating patch branch... " $branch
    git checkout -b $branch
    git add .
    git commit -m "$message"

    echo "Pushing to remote... "
    git push
    cd ..

    echo ">>>>>>>>> Processing repo: " $repoUrl " DONE!"
    echo
    echo
}

for repoUrl in $(<templates-repos.txt)
do
    processRepo $repoUrl
done
