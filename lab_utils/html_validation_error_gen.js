"use strict";

import { exec } from "child_process";
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
  const ls = await execPr(`npx html-validate "./${filename}"`).catch((err) => {
    // NB: for whatever reason, .exec sees NPX as failing? This error is in Node itself.
    if (err.stdout) {
      return err.stdout;
    }
  });
  // get the string from the process
  const terminalOutput = ls.toString();
  const errorCollection = cleanTerminalOutput(terminalOutput);
  return {
    filename,
    errorCollection,
  };
}

recursiveReaddir("./public", [excludeNonHTML, excludeAnswerKey, ".DS_Store"])
  .then((data) => {
    // for each file in data, we're going to want to run the validator and output an updated file.
    // this needs to happen asynchronously because each process is its own thing
    // console.log("FILENAMES TO PROCESS", data);
    return Promise.all(
      data.map((m) => {
        return processHTML(m);
      })
    );
  })
  .then((data) => data.filter((f) => f.errorCollection.length > 0))
  .then((data) => {
    if(data.length > 0){
      // console.log("HTML validation errors found", data);
    }
    return data.map((m) => {
      m.title = m.filename.match(/lab_\d+/g);
      return m;
    });
  })
  .then((data) => {
    return Promise.all(
      data.map((m) => {
        return writeFile(
          `./cypress/fixtures/generated/${m.title}.json`,
          JSON.stringify(m.errorCollection)
        ).catch(error => console.log("write error", err));
      })
    );
  })
  .then((data) => {
    console.log("Preliminary HTML validation check complete");
    if(data.length > 0) {
      const str = (data.length === 1) ? 'document has' : 'documents have';
      console.log(data.length, `${str} errors`);
      console.log("Check out Cypress for your errors!");
    } else {
      console.log("No invalid HTML detected");
    }
  });
