"use strict";
// import util from "util";
// import fs from "fs";

import recursiveReaddir from "recursive-readdir";
import chalk from "chalk";

import {
  processHTML,
  excludeNonHTML,
  excludeAnswerKey,
  severeErrorCheck
} from "./functions.js";

// const writeFile = util.promisify(fs.writeFile);

// Get the file name we're working on
// I want to walk a folder for things to validate
// process out the errors for ALL HTML files using this
// and then in the tests only retrieve the errors for the file someone is currently working on

// First, we're going to get the argument off the node command
// Then we're going to get that as a folder name?
// then we'll loop the public folder and process all HTML documents we find
// we'll need a delimiter to block more than 15 found documents

const stringOutput = {};

recursiveReaddir("./public", [excludeNonHTML, excludeAnswerKey, ".DS_Store"])
  .then((data) => {
    // for each file in data, we're going to want to run the validator and output an updated file.
    // this needs to happen asynchronously because each process is its own thing
    return Promise.all(data.map((m) => processHTML(m)));
  })
  .then((data) => data.filter((f) => f.errors.length > 0))
  .then((data) =>
    data.map((m) => {
      m.title = m.filename.match(/lab_\d+/g)[0]; // TODO: Replace this with a config file
      return m;
    })
  )
  .then((data) => data.map((m) => severeErrorCheck(m)))
  .then((data) => {
    // DO YOUR OUTPUTS
    console.log(
      chalk.bgCyan.bold("Preliminary HTML validation check complete")
    );
    // if any document has severe errors, list it and put it in a table
    // and block cypress launch
    let blockCypress;

    if (data.length > 0) {
      const str = data.length === 1 ? "document has" : "documents have";
      console.log(chalk.yellow.bold(data.length, `${str} validation errors`));
      data.forEach((d) => {
        console.log(
          chalk.yellow(` --- ${d.title}  ${d.errors.length}`)
        );
      });

      data.forEach((d) => {
        if (d.severe.length > 0) {
          console.log('\n')
          console.log(chalk.red.bold(`${d.title} has breaking errors`))
          console.table(d.severe);
          console.error(
            `Please repair your HTML in ${d.title} before proceeding with the lab.\n`
          );
          blockCypress === true;
        }
      });
    } else {
      // Else green to go and good luck with lab problems.
      console.log(
        chalk.green.bold("No invalid HTML detected! Good luck with your lab.")
      );
    }

    // we may not need to write these files if we're doing Head checks before
    // we allow Cypress to open at all.
    // return Promise.all(
    //   data.map((m) => {
    //     return writeFile(
    //       `./cypress/fixtures/generated/${m.title}.json`,
    //       JSON.stringify(m.errors)
    //     ).catch((error) => console.log("write error", err));
    //   })
    // );
  })
  .catch((err) => console.log(err));
