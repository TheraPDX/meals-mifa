ManageRoutes = React.createClass({
  
  mixins: [ ReactMeteorData ],
  getMeteorData() {

  let subscription = Meteor.subscribe( 'routesMaster' );
    return {
      isLoading: !subscription.ready(),
      routesToManage: RouteMaster.find({}, {sort:{route: 1}}).fetch()
    };
  },
  
    render() {
    if ( this.data.isLoading ) {
      return <Loading />;
    }else{
      //check to see if they actually have routes
      if(this.data.routesToManage.length==0){
        Bert.alert('You must be an admin to manage routes.', 'danger');
        return(
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Authorize Routes</h4>
            </div>
            <div className="form-group xs-col-12">
              <p>You are not authorized to Manage any routes. Please contact <a href="mailto:">Angela Scott</a> with your email address and route number to have your routes enabled for digital delivery.</p>
            </div>
          </div>
          );
      }else{
        return (
          <span>
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Manage Routes</h4>
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Select the route you wish to manage.</h4>
                <ManageRouteList routesToManage={this.data.routesToManage} />
            </div>
          </div>
          </span>
        );
      }
    }
  }
});
