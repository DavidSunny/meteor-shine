Account = React.createClass({
  mixins: [MeteorDataMixin],
  trackMeteorData(props, state) {
    // This function knows how to listen to Meteor's reactive data sources,
    // such as collection queries
    return {
      // Returns an array with all items in the collection
      account: Meteor.user()
    }
  },
  render() {
    return (
      <b>{this.data.account.username}</b>
    );
  }
});

Template.registerHelper('Account', function() {
  return Account;
})