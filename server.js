// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

var client = require('emitter-io').connect({
  secure: true
});

client.on('connect', function (connack) {
  //console.log(connack);
  console.log("Connected to dream broker")
  client.subscribe({
    key: process.env.BROKER_KEY,
    channel: "cyber-text/",
    last: 5
  });
  client.on('message', function (msg) {
    console.log(msg.asString());
    dreams.push(msg.asString());
  });
});



client.on('error', function (msg) {
  console.log(msg.asString());
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

// Simple in-memory store
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
]

app.get("/dreams", (request, response) => {
  response.send(dreams)
})

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", (request, response) => {
  dreams.push(request.query.dream)

  console.log("Sending dream to the dream broker...\nHe hears your wishes, and files them away.")
  //Send the dream to the broker
  client.publish({
    key: process.env.BROKER_KEY,
    channel: "cyber-text/",
    message: request.query.dream
  });

  response.sendStatus(200)
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
});