MealClients = React.createClass({
  mixins: [ ReactMeteorData ],
  getMeteorData() {
  let subscription = Meteor.subscribe( 'clients', parseInt(this.props.id) );
    return {
      isLoading: !subscription.ready(),
      clients: Clients.find({}, {sort:{seq: 1}, reactive:true}).fetch()
    };
  },
  optimizeRoute: function(){
    FlowRouter.go('/customize-route/' + this.props.id);
  },
  /*componentDidMount(){
    //Not using this method because displaying the iframe limits to 10 stops
    Meteor.call('getMapUrl', parseInt(this.props.id), function(error, response){
      if(error){
        Bert.alert('error getting MAP URL from server:' + error.reason, 'warning');
      }else{
        Session.set('iframeLocation', response);
      }
    });
  },*/

  render() {
    if (this.data.isLoading ) {
      return <Loading />;
    }else{
      //check for route with no clients
      if (this.data.clients.length==0){
            Bert.alert('There are no clients in the system for route: ' + this.props.id, 'danger');
            return(
              <div className="row">
                <div className="col-xs-12">
                  <h4 className="page-header">Scheduled Deliveries</h4>
                </div>
                <div className="col-xs-12">
                  <p>There are no clients for your route. Please contact your volunteer coordinator or select a <a href='/routes'>different route</a>.</p>
                </div>
              </div>
            )
      }else{
        return (
          <div className="row">
            <div className="col-xs-12">
              <h4 className="page-header">Scheduled Deliveries</h4>
            </div>
            <div className="col-xs-12">
              <p>You can start deliverying your route with turn by turn directions by tapping the address of each client. 
              To optimize your right to start or finish in a location different from MIFA's default, tap the 'Customize my Route' button.</p>
            </div>
            <div className="col-xs-12">
                <button className='form-control btn btn-success' onClick={this.optimizeRoute}>
                  Customize my Route
                </button> 
            </div>
            <div className='form-group'>
              <br />
                <ClientTable clients={this.data.clients} />
            </div>
          </div>
        );
      }
    }
  }
});