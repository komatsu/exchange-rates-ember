import Ember from 'ember';

export default Ember.Component.extend({
  labels: [],
  values: [],
  legendLabel: '',

  graphInputData: Ember.computed('labels', 'values', 'legendLabel', function() {
    return {
      labels: this.get('labels'),
      datasets: [{
        label: this.get('legendLabel'),
        data: this.get('values'),
        backgroundColor: '#66B2FF'
      }],
    };
  })

});
