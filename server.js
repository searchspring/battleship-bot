const express = require('express')
const { handler } = require('./app');

const app = express()
app.use(express.json())
app.use(express.urlencoded())

app.get('/', (req, res) => {
  res.json('Hello, I am a battleship bot');
})

app.post('/battleship', (req, res, next) => {
  console.log('req:', req.body)
  res.set('Content-Type', 'application/json');
  return res.json(handler(req.body));
});

app.listen(3000, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${3000}`)
  }
});

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
});
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
});