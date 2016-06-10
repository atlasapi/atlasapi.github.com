import {ENV} from '../config.js';

Backbone.View = Backbone.NativeView;
window.test = {};

log.info('Environment: ' + ENV);

if (ENV === 'dev') {
  log.enableAll();
} else if (ENV === 'stage') {
  log.setLevel('error');
} else if (ENV === 'prod') {
  log.disableAll();
}