const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.get('/', (req, res) => {
  res.json({
    message: 'Meowerrr! 🐱'
  });
});

app.post('/mews', (req, res) => {
  console.log(req.body);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('server running!', port);
});
