#!/usr/bin/env node
/**
 * PhraseApp dependency installer
 * https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/examples/input.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const inquirer = require('inquirer');
const questions = require('./questions');


const cleanup = () => {
  console.log('Cleaning up. (Reset changes made to package.json files)');
  try {
    cp.execSync(`git checkout -- packages/*/package.json`);
  } catch(e) {

  }
};

const handleExit = () => {
  cleanup();
  console.log('Exiting without error.');
  process.exit();
};

const handleError = e => {
  console.error('ERROR! An error was encountered while executing');
  console.error(e);
  cleanup();
  console.log('Exiting with error.');
  process.exit(1);
};

process.on('SIGINT', handleExit);
process.on('uncaughtException', handleError);

const welcomeNote = () => {
  console.log();
  console.log('-------------------------------------------------------');
  console.log('Welcome to Phrase App Installer');
  console.log('Assuming you have already have dependencies installed.');
  console.log('If not, remember to do this before testing!');
  console.log('-------------------------------------------------------');
  console.log();
}

const enquire = () => {
  inquirer.prompt(questions).then((answers) => {
    fs.readFile('./src/phraseapp.yml', 'utf8', function(err, data){ 
      let newData = data
        .replace('<<ACCESS_TOKEN>>', answers.access_token)
        .replace('<<PROJECT_ID>>', answers.project_id)
        .replace('<<LOCALE_LOCATION>>', answers.locale_location)
        .replace('<<LOCALE_LOCATION>>', answers.locale_location);
      fs.writeFile('phraseapp.yml', newData, function (err) {
        if (err) return console.log(err);
        console.log('phraseapp yml installed');
      });
      copyScripts(answers);
      addScriptInPackageJsonFile();
    });
  });
};

const copyScripts = (answers) => {
  const pullLocale = fs.readFileSync('./src/pull-locale.js', 'utf8');
  let newData = pullLocale
    .replace('<<ACCESS_TOKEN>>', answers.access_token)
    .replace('<<PROJECT_ID>>', answers.project_id);
  
  fs.mkdirSync( path.join(__dirname, "phraseapp"));
  fs.writeFileSync(path.join(__dirname, "phraseapp") + '/pull-locale.js', newData, 'utf8');
  fs.copyFileSync("hello.txt", "world.txt");
}

const addScriptInPackageJsonFile = () => {
  const packageFile = 'package.json';
  const packageJSON = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  packageJSON.scripts['locales-pull-js'] = 'node phraseapp/pull-locale.js';
  packageJSON.scripts['locales-cleanup'] = 'run-s cleanup locales-pull-js';
  fs.writeFileSync('package1.json', JSON.stringify(packageJSON, null, 2), 'utf8');
  console.log(
    'Updated local package.json'
  );
}


function main() {
  welcomeNote();
  // enquire();
}

main();
handleExit();