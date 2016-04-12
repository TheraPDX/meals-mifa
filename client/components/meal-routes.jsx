MealRoutes = React.createClass({
  
  mixins: [ ReactMeteorData ],
  getMeteorData() {

  let subscription = Meteor.subscribe( 'routes' );
    return {
      isLoading: !subscription.ready(),
      routes: Routes.find().fetch()
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
