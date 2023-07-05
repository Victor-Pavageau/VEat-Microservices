const express = require('express');
const winston = require('winston');
const cors = require('cors');
const prometheusMetrics = require('./middleware/promMiddleware');
const app = express();
app.use(cors());
const routes = require('./routes/logRoutes');

// Configure Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.use(express.json());

app.get('/',(req, res) => {
  const response = {
    message: 'Votre requête a bien été reçue !',
  };
  res.json(response);
});

app.use(prometheusMetrics);
app.use(routes);

module.exports = app;