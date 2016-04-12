ManageRoute = React.createClass({
  
  mixins: [ ReactMeteorData ],
  getMeteorData() {

  let subscription = Meteor.subscribe( 'usersForRoute' );
    return {
      isLoading: !subscription.ready(),
      usersForRoute: Meteor.users.find({}).fetch()
    };
  },
  
    render() {
    if ( this.data.isLoading ) {
      return <Loading />;
    }else{
      //check to see if they actually have routes
      if(this.data.usersForRoute.length==0){
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
              <h4 className="page-header">Manage Users for Route</h4>
            </div>
            <div className='form-group'>
              <br />
                <ManageUserList clients={this.data.usersToManage} />
            </div>
          </div>  
          </span>
        );
      }
    }
  }
});
