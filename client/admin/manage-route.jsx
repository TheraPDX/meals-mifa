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
              <h4 className="page-header">{'Manage Users for Route: ' + this.props.id}</h4>
            </div>
            <div className='form-group'>
              <br />
                <ManageUserListForRoute usersForRoute={this.data.usersForRoute} routeId={this.props.id}/>
            </div>
          </div>  
          </span>
        );
      }
    }
  }
});


ManageUserListForRoute = React.createClass({
  render() {
    return (
      <div className='form-group'>
            {this.props.usersForRoute.map( ( _id, index ) => {
              return <ManageUserItemForRoute key={index} usersForRoute={_id} routeId={this.props.routeId}/>;
            })}
      </div>
    );
  }
});




ManageUserItemForRoute = React.createClass({
    updateUser(event){
      event.preventDefault();
      //if the box is now checked, add the route
      let userID = event.target.value;
      if(event.target.checked){
      //if not, remove the route
        Meteor.call('addUserToRoute', userID, this.props.routeId, function(error, response){
            if(error){
              Bert.alert('There was an error processing the update.', 'warning')
        }
      })
      }else{
        Meteor.call('removeUserFromRoute', userID, this.props.routeId, function(error, response){
            if(error){
              Bert.alert('There was an error processing the update.', 'warning')
            }
        })
      }
    },  
  render() {
    return (
    <div className="col-xs-12 paddedDiv">
      <label>
        <input type="checkbox" 
        value={this.props.usersForRoute._id} 
        checked={Roles.userIsInRole(this.props.usersForRoute._id, this.props.routeId)}
        onChange={this.updateUser}/>
        {this.props.usersForRoute.profile.firstName + ' ' + this.props.usersForRoute.profile.lastName + '(' + this.props.usersForRoute.emails[0].address + ')'}
      </label>
    </div>
    );
  }
});