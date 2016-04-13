ManageUserItem = React.createClass({
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