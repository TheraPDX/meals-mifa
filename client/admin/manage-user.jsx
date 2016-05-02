ManageUser = React.createClass({
  
  mixins: [ ReactMeteorData ],
  getMeteorData() {

  let subscription = Meteor.subscribe( 'routesMaster' );
  let nextSubscription = Meteor.subscribe('directory');
    return {
      isLoading: (!subscription.ready() && !nextSubscription.ready()),
      routesForUser: RouteMaster.find({}, {sort:{route: 1}}).fetch(),
      userToManage: Meteor.users.findOne({
        _id: this.props.userId
        })
    };
  },
    toggleAdminRights: function(e){
      if(e.target.checked){
      //if not, remove the route
        Meteor.call('addToAdminGroup', this.props.userId, function(error, response){
            if(error){
              Bert.alert('There was an error processing the update.', 'warning')
        }
      })
      }else{
        Meteor.call('removeFromAdminGroup', this.props.userId, function(error, response){
            if(error){
              Bert.alert('There was an error processing the update.', 'warning')
            }
        })
      }
    },

    render() {
    if ( this.data.isLoading ) {
      return <Loading />;
    }else{
      //check to see if they actually have routes
      if(Roles.userIsInRole(Meteor.user._id, 'admin')){
        Bert.alert('You must be an admin to manage users.', 'danger');
        return(
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Manage User</h4>
            </div>
            <div className="form-group xs-col-12">
              <p>You are not authorized to manage any users.</p>
            </div>
          </div>
          );
      }else{
        return (
          <span>
            <div className="row">
              <div className="form-group h4">
                {'Managing Access for: '}
              </div>
              <div className="form-group h4">
              {'Name: ' + this.data.userToManage.profile.firstName + ' ' + this.data.userToManage.profile.lastName + ' ' + this.data.userToManage.profile.phoneNumber}
              </div>
              <div className="form-group h4">
                <a href={'mailto:' + this.data.userToManage.emails[0].address}>{this.data.userToManage.emails[0].address}</a>
              </div>
            </div>
            <div className="row">
              <div className="form-group h4">
                Special Roles
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" 
                  value={this.data.userToManage._id} 
                  checked={Roles.userIsInRole(this.data.userToManage._id, 'admin')}
                  onChange={this.toggleAdminRights}/> Admin
                </label>
              </div>
            </div>
            <div className="row">
              <div className="form-group h4">
                Authorized Routes
              </div>
              <div className='form-group'>
                <br />
                  <ManageRouteListForUser routesForUser={this.data.routesForUser} userId={this.props.userId}/>
              </div>
            </div>  
          </span>
        );
      }
    }
  }
});


ManageRouteListForUser = React.createClass({
  render() {
    return (
      <div className='form-group'>
            {this.props.routesForUser.map( ( route, index ) => {
              return <ManageRouteItemForUser key={index} routesForUser={route} userId={this.props.userId}/>;
            })}
      </div>
    );
  }
});




ManageRouteItemForUser = React.createClass({
    toggleRoute(event){
      event.preventDefault();
      //if the box is now checked, add the route
      let routeId = event.target.value;
      if(event.target.checked){
      //if not, remove the route
        Meteor.call('addUserToRoute', this.props.userId, routeId, function(error, response){
            if(error){
              Bert.alert('There was an error processing the update.', 'warning')
        }
      })
      }else{
        Meteor.call('removeUserFromRoute', this.props.userId, routeId, function(error, response){
            if(error){
              Bert.alert('There was an error processing the update.', 'warning')
            }
        })
      }
    },  
  render() {
    return (
    <div className="col-xs-4 col-sm-3 col-md-3 col-lg-2 paddedDiv">
      <label>
        <input type="checkbox" 
        value={this.props.routesForUser.route} 
        checked={Roles.userIsInRole(this.props.userId, this.props.routesForUser.route.toString())}
        onChange={this.toggleRoute}/>
        {' Route: ' + this.props.routesForUser.route}
      </label>
    </div>
    );
  }
});