"use strict";
import { spawn } from "child_process";

import recursiveReaddir from "recursive-readdir";
import chalk from "chalk";

import {
  processHTML,
  excludeNonHTML,
  excludeAnswerKey,
  severeErrorCheck
} from "./functions.js";

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
    console.log(
      chalk.bgCyan.bold("Preliminary HTML validation check complete")
    );
    // if any document has severe errors, list it and put it in a table
    // and block cypress launch
    let blockCypress; // TODO: add a cypress launch

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
          blockCypress = true;
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

    if(!blockCypress){
      spawn("node_modules/.bin/cypress", ["open"]);
      // spawn("npx", ["nodemon","server.js"]);
    }
  })
  .catch((err) => console.log(err));
