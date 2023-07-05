const promClient = require('prom-client');
const promMiddleware = require('express-prometheus-middleware');

const PrometheusMetrics = promMiddleware({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  useGcMetrics: true,
  prefix: "log_"
});


module.exports = PrometheusMetrics;
