const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const monk = require('monk');
const db = monk(process.env.MONGO_URI || 'localhost/Meower-Application');
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
app.enable('trust-proxy');

function isValidMew(mew) {
  return mew.name && mew.name.toString().trim() !== '' && mew.content && mew.content.toString().trim() !== '';
}
app.get('/mews', (req, res) => {
  //prep new URL parameters

  mews.find().then((mews) => {
    res.json(mews);
  });
});
//create second endpoint for pagination and infinite scroll features.
app.get('/v2/mews', (req, res) => {
  let { skip, limit, sort = 'DESC' } = req.query;
  limit = parseInt(limit) || 10;
  skip = parseInt(skip) || 0;
  limit = limit > 50 ? 50 : limit;
  //!ensuring any floating point numbers passed in simply get reduced down to something that can be interpreted.
  ​Math.min(50, Math.max(1, limit))
  //!kind of like running a "filter" on our database, first we find the total number of mews that match our query params, and then return the count of each row in the database.
  //!first element in the array will be the mews, and the second element will be the total count of mews in the database as a whole.
  Promise.all([mews.count(), mews.find({}, { limit, skip, sort: { created: sort === 'DESC' ? -1 : 1 } })]).then(
    ([totalMews, mews]) => {
      res.json({ meta: { totalMews, skip, limit, has_more: totalMews - (skip + limit) > 0 }, mews });
    }
  );
});

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
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('server running!', port);
});
