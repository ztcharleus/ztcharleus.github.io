"use strict";

import { spawnSync } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";
import process from "process";
import recursiveReaddir from "recursive-readdir";

// const readdir = util.promisify(recursiveReaddir);

console.log(process.argv);
// Get the file name we're working on
// I want to walk a folder for things to validate
// process out the errors for ALL HTML files using this
// and then in the tests only retrieve the errors for the file someone is currently working on

// First, we're going to get the argument off the node command
// Then we're going to get that as a folder name?
// then we'll loop the public folder and process all HTML documents we find
// we'll need a delimiter to block more than 15 found documents
function ignoreThisStuff(file, stats) {
    return (path.extname(file).length && path.extname(file) !== ".html");
}

recursiveReaddir("./public", [ignoreThisStuff, ".DS_Store"])
  .then((data) => {
    console.log("readDir data", data);
  })
  .then(() => {
    const tempFileName = "lab_2_html.json";
    const ls = spawnSync("npx", [
      "html-validate",
      "../public/answer_key/lab_2/index.html",
    ]);

    // todo
    // write file
    // generalize index to test processing
    // list available filenames
    // write them to a cypress fixture
    // put all string values re labs into a config file

    const newString = ls.stdout.toString();
    // console.log(newString);

    const nS1 = newString.split("\n");

    const d = nS1.filter((f) => f.match(/\d+:\d+/g));
    const prune = d.map((m) => m.trim());
    console.log(prune);

    fs.writeFile(
      `../cypress/fixtures/${tempFileName}`,
      JSON.stringify(prune),
      () => {
        console.log("HTML validation array file write success");
      }
    );

    // const processedResults = nS1.map(m => m.substring(m.indexOf('error')));
    // console.log(processedResults);
    // const splitResults = result.stdout.match(/\[\d+merror.+/g);
    // const cleanResults = splitResults.map((r) => r.replace(/\[\d+m/g, ""));
    // const errors = results.match(/error/g);

    // Logging to check values for debug
    // cy.log(cleanResults.length);
    // cleanResults.forEach(e => {
    //   cy.log(e);
    // })

    // const blob = cleanResults.reduce((c, i) => {
    //   if (i.includes("error")) {
    //     c.push(i);
    //   }
    //   return c;
    // }, []);
  });
