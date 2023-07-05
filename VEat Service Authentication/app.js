const express = require('express');
const cors = require('cors');
const prometheusMetrics = require('./middleware/promMiddleware');
const app = express();
app.use(cors());
const authRoutes = require('./routes/authRoutes');
app.use(express.json());

app.get('/',(req, res) => {
    const response = {
      message: 'Votre requête a bien été reçue !',
    };
    res.json(response);
  });
  
app.use(prometheusMetrics);
app.use(authRoutes);

module.exports = app;