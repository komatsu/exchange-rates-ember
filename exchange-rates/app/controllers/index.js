import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  queryParams:['base', 'symbols'],
  isLoading: true,

  labels: Ember.computed('model', function() {
    return this.get('model').mapBy('label');
  }),

  values: Ember.computed('model', function() {
    return this.get('model').mapBy('value');
  }),

  legendLabel: Ember.computed('base', 'symbols', function() {
    return `${this.get('base')}/${this.get('symbols')}`;
  }),

  startDateString: Ember.computed('labels', function() {
    const label = this.get('labels.firstObject');
    return moment(label).format('MMM DD YYYY');
  })
});
