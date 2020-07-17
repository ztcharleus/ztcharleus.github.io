"use strict";

import { spawnSync, spawn, exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";
import recursiveReaddir from "recursive-readdir";

const writeFile = util.promisify(fs.writeFile);
const execPr = util.promisify(exec);

// Get the file name we're working on
// I want to walk a folder for things to validate
// process out the errors for ALL HTML files using this
// and then in the tests only retrieve the errors for the file someone is currently working on

// First, we're going to get the argument off the node command
// Then we're going to get that as a folder name?
// then we'll loop the public folder and process all HTML documents we find
// we'll need a delimiter to block more than 15 found documents
function excludeNonHTML(file, stats) {
  return path.extname(file).length && path.extname(file) !== ".html";
}

// TODO: comment this in before export
function excludeAnswerKey(file, stats) {
  // return stats.isDirectory() && path.basename(file) == "answer_key";
}

function cleanTerminalOutput(string) {
  const nS1 = string.split("\n");
  const d = nS1.filter((f) => f.match(/\d+:\d+/g));
  return d.map((m) => m.trim());
}

async function processHTML(filename) {
  // fire HTML-Validate process
  const ls = await execPr(`npx html-validate "./${filename}"`)
    .catch((err) => {
      // NB: for whatever reason, .exec sees NPX as failing? This error is in Node itself.
      if(err.stdout){
        return err.stdout
      }
    });
  // get the string from the process
  const terminalOutput = ls.toString();
  const errorCollection = cleanTerminalOutput(terminalOutput);
  return {
    filename,
    errorCollection
  }
}

// // Write the file

// ).then((err) => {
//   return "Success";
// });

recursiveReaddir("./public", [excludeNonHTML, excludeAnswerKey, ".DS_Store"])
  .then((data) => {
    // for each file in data, we're going to want to run the validator and output an updated file.
    // this needs to happen asynchronously because each process is its own thing
    console.log("FILENAMES TO PROCESS", data);
    return Promise.all(data.map(m => {
      return processHTML(m);
    }))

    // todo
    // write file
    // write them to a cypress fixture
    // put all string values re labs into a config file
  })
  .then((data) => data.filter(f => f.errorCollection.length > 0))
  .then((data) => {
    console.log("Data with errors", data);
    return data.map(m => {
      m.title = m.filename.match(/lab_\d+/g);
      return m;
    })
  })
  .then((data) => {
    return Promise.all(
      data.map((m) => {
        // now we have to write out every one of these
        // to a fixture file
        // and return a collection of successes or failures
        // parse the actual filename out of the filename - it's the last folder before index.html
        return writeFile(
          `./cypress/fixtures/generated/${m.title}.json`,
          JSON.stringify(m.errorCollection)
      )}
    ))
  }).then((data) => {
    console.log(data);
  })    
    
    // return Promise.all(
    //   dataWithErrors.map((m) => {
    //     // now we have to write out every one of these
    //     // to a fixture file
    //     // and return a collection of successes or failures
    //     // parse the actual filename out of the filename - it's the last folder before index.html
    //     return writeFile(
    //       `./cypress/fixtures/tempFileName.json`, // TKTKTK fix this
    //       JSON.stringify(m.errorCollection)
    //   )}
    // ))
    // .then((data) => {
    //   console.log(data);
    // })
