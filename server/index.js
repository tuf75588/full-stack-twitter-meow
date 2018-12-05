const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const monk = require('monk');
const db = monk(process.env.MONGO_URI, '/Meower-Application');
const mews = db.get('mews');
const rateLimit = require('express-rate-limit');
const Filter = require('bad-words');

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.get('/', (req, res) => {
  res.json({
    message: 'Meowerrr! 🐱'
  });
});

const filter = new Filter();

function isValidMew(mew) {
  return mew.name && mew.name.toString().trim() !== '' && mew.content && mew.content.toString().trim() !== '';
}
app.get('/mews', (req, res) => {
  mews.find().then((mews) => {
    res.json(mews);
  });
});
app.use(
  rateLimit({
    windowMs: 5 * 1000, // 15 minutes
    max: 1 // limit each IP to 100 requests per windowMs
  })
);
app.post('/mews', (req, res) => {
  if (isValidMew(req.body)) {
    //insert into db
    const mew = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
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
