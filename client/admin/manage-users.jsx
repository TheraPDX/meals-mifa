ManageUsers = React.createClass({
  
  mixins: [ ReactMeteorData ],
  getMeteorData() {
  let subscription = Meteor.subscribe( 'directory' );
    return {
      isLoading: !subscription.ready(),
      usersToManage: Meteor.users.find({}).fetch()
    };
  },
  
    render() {
    if ( this.data.isLoading ) {
      return <Loading />;
    }else{
      //check to see if they actually have routes
      if(this.data.usersToManage.length==0){
        Bert.alert('You must be an admin to manage users.', 'danger');
        return(
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Authorize Routes</h4>
            </div>
            <div className="form-group xs-col-12">
              <p>You are not authorized to Manage any users. Please contact <a href="mailto:">Angela Scott</a> with your email address and route number to have your routes enabled for digital delivery.</p>
            </div>
          </div>
          );
      }else{
        return (
          <span>
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Manage Users</h4>
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Select the user you wish to manage.</h4>
                <ManageUserAdminList usersToManage={this.data.usersToManage} />
            </div>
          </div>
          </span>
        );
      }
    }
  }
});
ManageUserAdminList = React.createClass({
  render() {
    return (
      <div className='form-group'>
            {this.props.usersToManage.map( ( user, index ) => {
              return <ManageUserAdminItem key={index} usersToManage={user} />;
            })}
      </div>
    );
  }
});
ManageUserAdminItem = React.createClass({
  goManageUser(event){
    FlowRouter.go('/manage-user/' + event.target.value);
  },
  render() {
    console.log(this.props.usersToManage._id);
    return (
    <div className="col-xs-4 col-sm-3 col-md-3 col-lg-2 paddedDiv">
      <p>
              {this.props.usersToManage.profile.firstName + ' ' + this.props.usersToManage.profile.lastName}
      </p>
      <p>
              {this.props.usersToManage.emails[0].address}
      </p>
      <p>
              {this.props.usersToManage.profile.phoneNumber}
      </p>
      <button value={this.props.usersToManage._id} className='button' onClick={this.goManageUser}>
        Manage
      </button>
    </div>
    );
  }
});
