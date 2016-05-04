//Account settings
forbidClientAccountCreation: true; 
Accounts.emailTemplates.siteName = "MIFA Meals Companion";
Accounts.emailTemplates.from     = "Admin <mwdavisii@mikesplaysite.com>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "[Mifa Meals Companion] Verify Your Email Address";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "mwdavisii@mikesplaysite.com",
        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: mwdavisii@gmail.com.`;

    return emailBody;
  }
};
//manage account creation
GeoCache = new Mongo.Collection("geocache");

Meteor.methods({
	addToAdminGroup: function(userId){
        if(!Roles.userIsInRole(this.userId, 'admin')){
        	console.log('kicked out')
            throw new Meteor.Error('401', 'Unauthorized');
    	}else{
			Roles.addUsersToRoles(userId, ['admin'])
		}
	}
});

Meteor.methods({
	removeFromAdminGroup: function(userId){
        if(!Roles.userIsInRole(this.userId, 'admin')){
        	console.log('kicked out')
            throw new Meteor.Error('401', 'Unauthorized');
    	}else{
			Roles.removeUsersFromRoles(userId, ['admin'])
		}
	}
});

Accounts.onCreateUser(function(options, user) {
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
		check(password, Object);
      	var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      	phoneNumber = phoneNumber.replace(phoneRegex, "($1) $2-$3");
      	Accounts.createUser({
	  		email: emailAddress,
	        firstName: firstName,
	        lastName: lastName,
	        phoneNumber: phoneNumber,
	        password: password});
    		}      
    	//Accounts.sendVerificationEmail( user._id );
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
				try{
					let arrWayPoints = response.data.routes[0].waypoint_order;
					for (let x = 0; x < arrWayPoints.length; x++) {
	    				//save the new sequence ids to the mongodb
						Clients.update(clients[parseInt(arrWayPoints[x])]._id, {
							$set: {seq: x+1}
						});
					}
				}
				catch(error){
					throw new Meteor.Error('500', error.reason);
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
    	//Collection to hold authorized routes
        if(!Roles.userIsInRole(this.userId, 'admin')){
        	console.log('kicked out')
            throw new Meteor.Error('401', 'Unauthorized');
        }else{
        	//first archive current collection in history

        	//then remove all clients from clients collection
			Clients.remove({})
        	//now insert all new clients
        	for (let i=0; i < clientsArray.length; i++){
        		let client=clientsArray[i];
        		

        		//GEO CODING
        		//check cache table to see if address has previously been geocoded (helps with the 2500 / day API limit)
    			let cacheArray = GeoCache.find({address: client.address}).fetch();
    			if (cacheArray.length==0){
    				//not found 0 go geocode it
    				//client.route checks for empty rows in the CSV import
    				if(client.route){
    					client = geoCodeAddress(client);
    					saveClient(client);
    				}
    			}else{
    				console.log(cacheArray);
    				client.geoLat=cacheArray[0].geoLat;
    				client.geoLng=cacheArray[0].geoLng;
    				client.geoCodePrecision=cacheArray[0].geoCodePrecision;
    				saveClient(client);
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

//SERVER ONLY FUNCTIONS//
geoCodeAddress = function(client){
	//construct url
	let jsonUrl= "";
	jsonUrl += encodeURIComponent(client.address) + ',' + client.zip;
	
	//get the API key
	let envKey = process.env.GMAP_KEY;
	if (typeof(envKey) == 'undefined') {
	  throw new Meteor.Error('500', 'Google Maps API Key has not been configured on this server.');
	}
    jsonUrl += "&key=" + envKey

    //this is the url for calling the webservice
    let jsonRoot= 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    jsonUrl = jsonRoot + jsonUrl
    console.log(jsonUrl);

    var response = HTTP.get(jsonUrl);
    console.log(response.data);
	try{
		//if status is ok, grab these values
		if(response.data.status=='OK'){
			client.geoLat =response.data.results[0].geometry.location.lat
			client.geoLng = response.data.results[0].geometry.location.lng;
			//if we got the partial match flag, let's record it so NPO can do cleanup.
			if(response.data.results[0].partial_match){
				client.geoCodePrecision='Partial Match';
			}else{
				client.geoCodePrecision='Match';
			}

			//geocache the results so we don't have to look this address up every time

			GeoCache.insert({
				address: client.address,
				geoLat: client.geoLat,
				geoLng: client.geoLng,
				geoCodePrecision: client.geoCodePrecision,
			    uploadedBy: Meteor.user().emails[0].address,
			    uploadedOn: new Date()
			})
			return client;
		}else{
			//if we don't get anything back from the geocoder, return the client so the insert can continue
			//this is likely because we're reached the API limit. 
			return client;
		}
	}
	catch(error){
		console.log(error);
		throw new Meteor.Error('500', error.message);
	}
}

saveClient = function(client){
	//make sure this call can only come from server by checking connection
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
			geoLat: client.geoLat,
			geoLng: client.geoLng,
			geoCodePrecision: client.geoCodePrecision,
		    uploadedBy: Meteor.user().emails[0].address,
		    uploadedOn: new Date()
		});
	}
}
