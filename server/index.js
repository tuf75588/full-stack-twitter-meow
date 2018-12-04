const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const monk = require('monk');
const db = monk('localhost/Meower-Application');
const mews = db.get('mews');

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.get('/', (req, res) => {
  res.json({
    message: 'Meowerrr! 🐱'
  });
});

function isValidMew(mew) {
  return mew.name && mew.name.toString().trim() !== '' && mew.content && mew.content.toString().trim() !== '';
}

app.post('/mews', (req, res) => {
  if (isValidMew(req.body)) {
    //insert into db
    const mew = {
      name: req.body.name.toString(),
      content: req.body.content.toString(),
      created: new Date()
    };
    mews.insert(mew).then((createdMew) => {
      res.json(createdMew);
    });
  } else {
    res.state(422);
    res.json({
      message: 'Hey! Name and content are required!'
    });
  }
  console.log(req.body);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('server running!', port);
});
