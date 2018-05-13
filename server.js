require('dotenv').config();
const _ = require('underscore'); // TODO - unused, just for testing
const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const archiver = require('archiver');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

// // // //

// writeFile
// Writes the `cli-output.json` file
async function writeFile (tweets) {
  return new Promise((resolve, reject) => {

    const filename = '/cli-output.json';

    fs.writeFile(__dirname + filename, JSON.stringify(tweets, null, 2), (err) => {
      if (err) throw err;
      return resolve();
    });

  });

}

// // // //

async function copyVueTemplate () {
  return new Promise((resolve, reject) => {
    fs.copy('templates/vue-webpack', 'build/vue-webpack', (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

// // // //

function zipBuild (res) {

  // Logs build success
  // bplog(`Build ${buildId} application generated & sanitized`)

  // create a file to stream archive data to.
  let output = fs.createWriteStream(__dirname + `/output.zip`);
  let archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level (?)
  });

  // Sends generated zip to client
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-disposition': `attachment; filename=output.zip`
  });

  // Send the file to the page output.
  archive.pipe(res);

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', function() {
    // bplog(archive.pointer() + ' total bytes');
    // bplog('archiver has been finalized and the output file descriptor has closed.');
    // scheduleRemoval(buildId, appIdentifier)
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function() {
    // bplog('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);

  // append files from a sub-directory, putting its contents at the root of archive
  // archive.directory(`generated_apps/${buildId}/`, false);
  // TODO - removed hardcoded app_name
  archive.directory(__dirname + '/build/vue-webpack', false);

  // finalize the archive (ie we are done appending files but streams have to finish yet)
  // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
  archive.finalize();

}

// // // //

// Express.js App Configuration
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static client assets
app.use(express.static('client'));

// Serve client HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
})

// // // //

async function handleRequest(req, res) {
  await writeFile()
  await copyVueTemplate()
  return zipBuild(res)
}

// Runs Vue CLI
app.get('/api/vue', (req, res) => {
  // return copyVueTemplate()
  // .then(() => {
  //   return zipBuild(res)
  // })
  // .catch(() => {
  //   console.log('ERR')
  // })
  return handleRequest(req, res)
});

// // // //

// Starts Express app
app.listen(process.env.PORT, () => {
  console.log(`Express is running on port ${process.env.PORT}`)
})
