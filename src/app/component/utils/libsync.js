const { exec } = require('child_process');
const path = require('path');

const generateLipSyncData = (audioFilePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const command = `rhubarb -f json -o ${outputFilePath} ${audioFilePath}`;
    exec(command, { cwd: path.resolve(__dirname, '../') }, (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`);
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
      }
      resolve(`stdout: ${stdout}`);
    });
  });
};

module.exports = { generateLipSyncData };
