const express = require('express');
const cors = require('cors');
const prometheusMetrics = require('./middleware/promMiddleware');
const app = express();
app.use(cors());
const routes = require('./routes/orderRoutes');

app.use(express.json());

app.get('/',(req, res) => {
  const response = {
    message: 'Votre requête a bien été reçue !',
  };
  res.json(response);
});

app.use(routes);
app.use(prometheusMetrics);

module.exports = app;