require('dotenv').config();
const _ = require('underscore'); // TODO - unused, just for testing
const fs = require('fs');
const path = require('path');
const io = require('socket.io');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

// // // //

// writeFile
// Writes the `schwaa6-tweets.json` file after the Twitter stream has closed
function writeFile (tweets) {
  return new Promise((resolve, reject) => {

    const filename = './cli-output.json';

    fs.writeFile(__dirname + filename, JSON.stringify(tweets, null, 2), (err) => {
      if (err) throw err;
      return resolve();
    });

  });

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

// Opens new socket for tweets
app.post('/api/vue', (req, res) => {
  return res.json({ received: true });
});

// // // //

// Starts Express app
app.listen(process.env.PORT, () => {
  console.log(`Express is running on port ${process.env.PORT}`)
})
