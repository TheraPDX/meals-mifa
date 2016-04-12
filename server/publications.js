Meteor.publish( 'clients', function(thisRoute){
  check( thisRoute, Number);
    if (!this.userId) {
        this.ready();
        return;
    }

    //get email address
    var user = Meteor.users.findOne(this.userId);
    //check if they can see routes:
    var myRoutes = Routes.find(
    	{
    		email: user.emails[0].address
		},
		{
			authorizedRoute: parseInt(thisRoute)
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
          //throw 401 exception
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
      });

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