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
   check(options, Array);
   check(user, Object);
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
		check(userID, String);
		check(firstName, String);
		check(lastName, String);
		check(phoneNumber, String);
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
		check(emailAddress, String);
	    if (! Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
    	};
		Clients.update({ _id: clientID}, {
				$set: {deliveryStatus: outcome,
						updatedBy: emailAddress}
		})
	}
});
Meteor.methods({
    createAccount: function(emailAddress, firstName, lastName, phoneNumber, password){
		check(emailAddress, String);
		check(firstName, String);
		check(lastName, String);
		check(phoneNumber, String);
		check(password, String);
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
		//var Tget = Meteor.wrapAsync(HTTP.get)
		//var arrWayPoints = Tget(jsonUrl).data.routes[0].waypoint_order

		//call goodle
		//
		HTTP.get(jsonUrl, {}, function(error, response){
			if(error){
				throw new Meteor.Error('500', error.reason);
			}else{
				let arrWayPoints = response.data.routes[0].waypoint_order;
				for (let x = 0; x < arrWayPoints.length; x++) {
    				//save the new sequence ids to the mongodb
					Clients.update(clients[parseInt(arrWayPoints[x])]._id, {
						$set: {seq: x+1}
					});
				}
			}
		});		
    }
});

Meteor.methods({
        getRoutesForUser: function(emailAddress){
        	check(emailAddress, String);
        	if (! Meteor.userId()) {
      			throw new Meteor.Error('not-authorized');
			};
            check(emailAddress, String);
        return Routes.find({email: emailAddress}).fetch();
    }
});

Meteor.methods({
    reloadClients: function(clientsArray){
    	check(clientsArray, Array);
        if(!Roles.userIsInRole(this.userId, 'admin')){
        	console.log('kicked out')
            return false;
        }else{
        	//first archive current collection in history

        	//then remove all clients from clients collection
			Clients.remove({})
        	//now insert all new clients
        	for (let i=0; i < clientsArray.length; i++){
        		let client=clientsArray[i];
        		//encode polyline



        		if(client.route){
	        		Clients.insert({
	        			route: parseInt(client.route),
	        			fname: client.fname,
	        			lname: client.lname,
	        			address: client.address,
	        			city: client.city,
	        			state: client.state,
	        			zip: client.zip,
	        			home: client.home,
	        			mobile: client.mobile,
	        			seq: parseInt(client.seq),
	        			meal1: client.meal1,
	        			meal2: client.meal2,
	        			beverage: client.beverage,
	        			instructions: client.instructions,
	        			delivered: false,
					    uploadedBy: Meteor.user().emails[0].address,
					    uploadedOn: new Date()

	        		})
	        	}
        	}
    	}
    }
});

    				

Meteor.methods({
    addUserToRoute: function(userId, route){
	    check(userId, String);
	    check(parseInt(route), Number);
		//check admin rights
		if(Roles.userIsInRole(this.userId, 'admin')){
			//add to roles table
			Roles.addUsersToRoles(userId, route)
			var user = Meteor.users.findOne(userId);
			Routes.insert(
				{
			    "email" : user.emails[0].address,
			    "authorizedroute" : route,
			    "authorizedBy": Meteor.user().emails[0].address,
			    "authorizedOn": new Date()
			})
		}
    }
});
Meteor.methods({
    removeUserFromRoute: function(userId, route){
	    //check user
	   	check(userId, String);
	    check(parseInt(route), Number);
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
});