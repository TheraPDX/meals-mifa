var Tget = Meteor.wrapAsync(HTTP.get)
forbidClientAccountCreation: true; 
//manage account creation

Meteor.methods({
	addToAdminGroup: function(){
		if (! Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
    	};
		if (Meteor.user()){
			Roles.addUsersToRoles(Meteor.userId(), ['admin'])
		}
	}
});

Accounts.onCreateUser(function(options, user) {
   // Use provided profile in options, or create an empty object
   user.profile = options.profile || {};
   // Assigns first and last names to the newly created user object
   user.profile.firstName = options.firstName;
   user.profile.lastName = options.lastName;
   user.profile.phoneNumber = options.phoneNumber;
   // Returns the user object
   return user;
});

Meteor.methods({
	updateProfile: function(userID, firstName, lastName, phoneNumber){
		if (! Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
    	};
		var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      	phoneNumber = phoneNumber.replace(phoneRegex, "($1) $2-$3");
      	Meteor.users.update(userID, {
      		$set: {"profile.lastName": lastName,
      			"profile.firstName": firstName,
      			"profile.phoneNumber": phoneNumber
      		}
      	})
	}
});

Meteor.methods({
	updateDeliveryStatus: function(clientID, outcome, emailAddress){
		check(clientID, String);
		check(outcome, String);
	    if (! Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
    	};
		// do this because mongo can't handle a simple update with a key like every other database ever... boo...
		var ObjectID = require('mongodb').ObjectID;
		var stupidMongoId = ObjectID.createFromHexString(clientID);
		Clients.update({ _id: stupidMongoId}, {
				$set: {deliveryStatus: outcome,
						updatedBy: emailAddress}
		})
	}
});
Meteor.methods({
    createAccount: function(emailAddress, firstName, lastName, phoneNumber, password){
		//format phone number
      	if (! Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
    	};

      	var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      	phoneNumber = phoneNumber.replace(phoneRegex, "($1) $2-$3");
      	Accounts.createUser({
	  		email: emailAddress,
	        firstName: firstName,
	        lastName: lastName,
	        phoneNumber: phoneNumber,
	        password: password});
    }      
});

Meteor.methods({
    optimizeRoute: function (routeNumber, startLocation, endLocation) {
	        	//build google API request
		
        if (! Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
    	};
        check(parseInt(routeNumber), Number);
        check(startLocation, String);
        check(endLocation, String);

        var jsonUrl= '';
    	jsonUrl += encodeURIComponent(startLocation);
    	jsonUrl += "&destination=" + encodeURIComponent(endLocation);

    	//build waypoint array for JSON request
		
		var wayPoints="&waypoints=optimize:true|";
		
		var clients = Clients.find(
			{
				route: parseInt(routeNumber)
			}, 
			{sort: 
				{seq:1}
			}
		).fetch();

		let i = 0;
		while(i<clients.length){
			wayPoints += encodeURIComponent(clients[i].address +","+ clients[i].zip) + "|";
			i++;
		}

		//combine jsonURL and wayPoints (slice off the last | to keep it clean)
		jsonUrl += wayPoints.slice(0, -1);

        //add api key from env variables
    	let envKey = process.env.GMAP_KEY;
		if (typeof(envKey) == 'undefined') {
		  throw new Meteor.Error('500', 'Google Maps API Key has not been configured on this server.');
		}
        jsonUrl += "&key=" + envKey

        //this is the url for calling the webservice
        var jsonRoot = "https://maps.googleapis.com/maps/api/directions/json?origin="
        jsonUrl = jsonRoot + jsonUrl


        console.log(jsonUrl);
		//get the optimized waypoints
		var arrWayPoints = Tget(jsonUrl).data.routes[0].waypoint_order
		
		//loop through google's optimized way point and update the sequence in the DB
		
		i = 0;

		while (i<arrWayPoints.length) {
    	//save the new sequence ids to the mongodb
			Clients.update(clients[i]._id, {
				$set: {seq: arrWayPoints[i]+1}
			
			});
				i++;
			}
    }
});

Meteor.methods({
        getRoutesForUser: function(emailAddress){
        	if (! Meteor.userId()) {
      			throw new Meteor.Error('not-authorized');
			};
            check(emailAddress, String);
        return Routes.find({email: emailAddress}).fetch();
    }
});

Meteor.methods({
    checkLogin: function(){
        if(this.userId===null){
            return false;
        }else{
            return true;
        }
    }
});

Meteor.methods({
    addUserToRoute: function(userId, route){
	    //check user
	    if (! Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
    	}else{
			//check admin rights
			if(Roles.userIsInRole(this.userId, 'admin')){
				//add to roles table
				Roles.addUsersToRoles(userId, route)
				
				//get the user object for the user
			    var user = Meteor.users.findOne(userId);
    			//check if they have this route already
    			var myRoutes = Routes.find(
    				{
    					email: user.emails[0].address
					},
					{
						authorizedRoute: parseInt(route)
					}).fetch();
    			if(myRoutes.length==0){
    				//insert the row
    				Routes.insert(
    					{
					    "email" : user.emails[0].address,
					    "authorizedroute" : route,
					    "authorizedBy": Meteor.user().emails[0].address,
					    "authorizedOn": new Date()
    				})
    			}
			}
    	}
    }
});
Meteor.methods({
    removeUserFromRoute: function(userId, route){
	    //check user
	    if (! Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
    	}else{
			//check admin rights
			if(Roles.userIsInRole(this.userId, 'admin')){
				//remove the role from roles
				Roles.removeUsersFromRoles(userId, route)
				
				//remove the user from the routes collection
				//get the user object for the user
			    var user = Meteor.users.findOne(userId);
    			//check if they have this route already
    			var myRoutes = Routes.find(
    				{
    					email: user.emails[0].address
					},
					{
						authorizedRoute: parseInt(route)
					}).fetch();
    			if(myRoutes.length>0){
    				//delete the row
    				Routes.remove(myRoutes[0]._id);
    			}
			}
    	}
    }
});