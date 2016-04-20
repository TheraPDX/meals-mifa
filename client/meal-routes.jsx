MealRoutes = React.createClass({
  
  mixins: [ ReactMeteorData ],
  getMeteorData() {

  let subscription = Meteor.subscribe( 'routes' );
    return {
      isLoading: !subscription.ready(),
      routes: Routes.find(
        {},
        {sort:{authorizedroute: 1}, reactive:true}
      ).fetch()
    };
  },
  render() {
    if ( this.data.isLoading ) {
      return <Loading />;
    }else{
      //check to see if they actually have routes
      if(this.data.routes.length==0){
        Bert.alert('No Authorized Routes', 'danger');
        return(
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Select the route you wish to view.</h4>
            </div>
            <div className="form-group xs-col-12">
              <p>You are not authorized to view any routes. Please contact <a href="mailto:">Angela Scott</a> with your email address and route number to have your routes enabled for digital delivery.</p>
            </div>
          </div>
          );
      }else{
        return (
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Select the route you wish to view.</h4>
                <RouteTable routes={this.data.routes} />
            </div>
          </div>
        );
      }
    }
  }
});
RouteTable = React.createClass({
  render() {
    return (
      <div className='form-group'>
            {this.props.routes.map( ( route, index ) => {
              return <Route key={index} route={route} />;
            })}
      </div>
    );
  }
});
Route = React.createClass({
  gotoRoute(event){
    FlowRouter.go('/clients/' + event.target.value);
  },
  manageRoute(event){
    FlowRouter.go('/manage-route/' + event.target.value);
  },
  render() {

    return (
    <div className="form-group">
    <button value={this.props.route.authorizedroute} className='button' onClick={this.gotoRoute}>
      {'Route: ' + this.props.route.authorizedroute}
    </button>
    </div>
    );
  }
});