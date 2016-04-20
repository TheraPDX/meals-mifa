Meteor.publish( 'clients', function(thisRoute){
  check( thisRoute, Number);
    if (!this.userId) {
        this.ready();
        return;
    }

    //get email address
    var user = Meteor.users.findOne(this.userId);
    //check if they can see this route before filling data:
    var myRoutes = Routes.find(
    	{
    		email: user.emails[0].address
		},
		{
			authorizedroute: parseInt(thisRoute)
		}
	).fetch();
    
    //make sure the above function returned a row
    if(myRoutes.length > 0){
       	return Clients.find(
        	{                                      
           		route: thisRoute
        	}, 
        	{ 
           		sort: { seq: 1} 
       		}

   	)}else{
          this.ready();
        };
});

Meteor.publish( 'routes', function(){
  if (!this.userId) {
        this.ready();
        return;
  }
  var user = Meteor.users.findOne(this.userId);
    return Routes.find(
      {
        email: user.emails[0].address
      },
      {sort:{authorizedroute: 1}, reactive:true}
    );
});

Meteor.publish("usersForRoute", function () {
  return Meteor.users.find({});
});


Meteor.publish( 'routesMaster', function(){
  if (!this.userId) {
        this.ready();
        return;
  }
  //check admin and if so, return all routes
  if (Roles.userIsInRole(this.userId, 'admin')){
    return RouteMaster.find({});
  }else{
    this.ready();
    return;
  }

});
Meteor.publish( 'clientMaster', function(){
  if (!this.userId) {
        this.ready();
        return;
  }
  //check admin and if so, return all routes
  if (Roles.userIsInRole(this.userId, 'admin')){
    return Clients.find({});
  }else{
    this.ready();
    return;
  }

});