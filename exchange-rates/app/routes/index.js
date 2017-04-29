import Ember from 'ember';
import moment from 'moment';

const API_URL_BASE = 'https://api.fixer.io/';
const NUM_DATES_BACK = 20;

export default Ember.Route.extend({
  queryParams: {
    base: { // numerator
      refreshModel: true
    },
    symbols: { // denominator
      refreshModel: true
    }
  },

  model(params) {
    const base = params.base || 'USD';
    const symbols = params.symbols || 'EUR';
    const dateFormat = 'YYYY-MM-DD';
    const dateStrings = [];

    // Get list of date strings from NUM_DATES_BACK until today
    for (let i = NUM_DATES_BACK - 1; i >= 0; i--) {
      dateStrings.push(moment().subtract(i, 'days').format(dateFormat));
    }

    // Request exchange rate data for each date
    return Ember.RSVP.all(dateStrings.map(dateString => {
      return Ember.$.get(`${API_URL_BASE}/${dateString}?base=${base}&symbols=${symbols}`).then((response) => {
        return {
          label: dateString,
          value: response.rates[symbols]
        }
      });
    }));
  },

  actions: {
    loading(transition) {
      const controller = this.controllerFor('index');

      controller.set('isLoading', true);

      transition.promise.finally(() => {
          controller.set('isLoading', false);
      });
    }
  }
});
