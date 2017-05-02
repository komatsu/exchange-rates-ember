import Ember from 'ember';
import moment from 'moment';
import { currencies } from '../helpers/constants';

export default Ember.Controller.extend({
  queryParams:['a', 'b'],
  isLoading: true,
  currencies: currencies,

  base: Ember.computed('a', function() {
    return this.get('a') || 'USD';
  }),

  symbols: Ember.computed('b', function() {
    return this.get('b') || 'EUR';
  }),

  labels: Ember.computed('model', function() {
    return this.get('model').mapBy('label');
  }),

  values: Ember.computed('model', function() {
    return this.get('model').map(data => this._roundPrecision(data.value));
  }),

  legendLabel: Ember.computed('base', 'symbols', function() {
    return `${this.get('base')}/${this.get('symbols')}`;
  }),

  startDateString: Ember.computed('labels', function() {
    const label = this.get('labels.firstObject');
    return moment(label).format('MMM DD YYYY');
  }),

  median: Ember.computed('values', function() {
    const sortedValues = this.get('values').copy().sort();
    const length = sortedValues.length;
    let median;

    if (length % 2) {
      median = (sortedValues[length / 2] + sortedValues[length / 2 - 1]) / 2;
    }
    else {
      median = sortedValues[Math.floor(length / 2)];
    }

    return this._roundPrecision(median);
  }),

  stdDev: Ember.computed('values', function() {
    const values = this.get('values');
    const sum = values.reduce((a, b) => a + b, 0);
    const length = values.length;
    const mean = sum / length;
    const valuesMinusMeanSq = values.map(val => Math.pow(val - mean, 2));
    const stddev = Math.sqrt(valuesMinusMeanSq.reduce((a, b) => a + b, 0) / length);
    return this._roundPrecision(stddev);
  }),

  _roundPrecision: function(num, precision=5) {
    return +(Math.round(`${num}e+${precision}`)  + `e-${precision}`);
  },

  actions: {
    changeBase: function(newBase) {
      this.set('a', newBase);
    },

    changeSymbol: function(newSymbol) {
      this.set('b', newSymbol);
    },

    swap: function() {
      const base = this.get('base');
      const symbol = this.get('symbols');

      this.setProperties({
        a: symbol,
        b: base
      });
    }
  }
});
