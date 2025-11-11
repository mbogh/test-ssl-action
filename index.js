const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const Grades = {
  "A+": { name: "A+", value: 0 },
  "A":  { name: "A",  value: 1 },
  "A-": { name: "A-", value: 2 },
  "B":  { name: "B",  value: 3 },
  "C":  { name: "C",  value: 4 },
  "D":  { name: "D",  value: 5 },
  "E":  { name: "E",  value: 6 },
  "F":  { name: "F",  value: 7 },
};

async function run() {
  try {
    let workspace = process.env.GITHUB_WORKSPACE;
    let image = core.getInput('image');
    let host = core.getInput('host');
    let output = core.getInput('output');
    let options = core.getInput('options');
    let thresshold = Grades[core.getInput('grade')];

    await exec.exec(`mkdir -p ${workspace}/${output}`);
    await exec.exec(`docker pull ${image} -q`);
    let command = (`docker run --user 0:0 -v ${workspace}/${output}:/data --network="host" ` + `-t ${image} ${options} ${host}`);
    try {
      let execOptions = {
        ignoreReturnCode: true
      };
      await exec.exec(command, [], execOptions);

      let path = workspace + '/' + output;
      let reportFile = fs.readdirSync(path).filter(fn => fn.startsWith(host) && fn.endsWith('.json'))[0];
      let report = JSON.parse(fs.readFileSync(path + '/' + reportFile));
      let grades = report.filter(finding => finding['id'] == 'overall_grade').map(finding => Grades[finding['finding']]);

      let lowestGrade = grades.reduce((previous, current) => previous.value >= current.value);

      if (lowestGrade.value > thresshold.value) {
        core.setFailed('Minimum accepted grade is ' + thresshold.name + ' and lowest grade found in scan is ' + lowestGrade.name);
      }
    } catch (error) {
        core.setFailed(error.message);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
