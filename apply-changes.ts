#!/usr/bin/env node
import * as Git from "nodegit";
import * as fs from 'fs-extra';
import * as path from "path";
import * as rCopy from 'recursive-copy';

let repos = [
    "https://github.com/NativeScript/template-hello-world",
    "https://github.com/NativeScript/template-hello-world-ts",
    "https://github.com/NativeScript/template-hello-world-ng",
]

const patchDir = path.join(__dirname, "PATCH");
const repoDir = path.join(__dirname, "repo");
const syncFolder = "App_Resources";

console.log("STARTED")

async function process(repoUrl: string) {

    console.log("Deleting repo dir ...")
    fs.removeSync(repoDir)
    console.log("Deleting repo dir ... DONE")


    console.log("Cloning repo... " + repoUrl);
    const repo = await Git.Clone.clone(repoUrl, repoDir);
    console.log("Cloning repo... DONE!");


    console.log("Creating branch...");
    const headCommit = await repo.getHeadCommit();
    const branchRef = await repo.createBranch("patch", headCommit, false);
    await repo.checkoutRef(branchRef);
    console.log("Creating branch... DONE!" + branchRef);


    console.log("Patching files...");
    await rCopy(path.join(patchDir, syncFolder), path.join(repoDir, syncFolder), { overwrite: true })
    console.log("Patching files... DONE!");


    console.log("Committing files ...")
    const index = await repo.refreshIndex();
    const res = await index.addAll();
    await index.write();
    const oid = await index.writeTree();
    const committer = repo.defaultSignature()
    const commitOid = await repo.createCommit("HEAD", committer, committer, "message", oid, [headCommit]);
    console.log("Committing files .. DONE")
}

process(repos[0])