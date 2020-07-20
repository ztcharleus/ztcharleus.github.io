import path from "path";
import util from "util";
import fs from "fs";
import { exec } from "child_process";

const execPr = util.promisify(exec);

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


function errorToObject(err) {
    return err
    .split("  ")
    .map((m) => m.trim())
    .filter((f) => f.length > 0 && f !== "error")
    .reduce((acc, curr, idx) => {
      const idxChr = {
        0: "Line number",
        1: "Error",
        2: "Error Type",
      };
      acc[idxChr[idx]] = curr;
      return acc;
    }, {})
  }

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
  const arr = d.map((m) => m.trim());
  return arr.map(m => errorToObject(m));
}

export {
  processHTML,
  excludeNonHTML,
  excludeAnswerKey,
  cleanTerminalOutput
};
