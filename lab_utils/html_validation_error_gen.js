"use strict";

import { spawnSync } from "child_process";
import fs from "fs";

const ls = spawnSync("npx", ["html-validate", "../public/answer_key/lab_2/index.html"]);
// todo
// write file
// generalize index to test processing
// list available filenames
// write them to a cypress fixture
// put all string values re labs into a config file

const tempFileName = 'lab_2_html.json'

const newString = ls.stdout.toString();
const nS1 = newString.split('\n');

const process = nS1.filter(f => f.match(/\d+:\d+/g))
const prune = process.map(m => m.trim());
console.log(prune);

fs.writeFile(`../cypress/fixtures/${tempFileName}`, JSON.stringify(prune), () => {
    console.log("HTML validation array file write success");
})

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
