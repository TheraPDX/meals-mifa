<<<<<<< refs/remotes/origin/master
import React from 'react';
import {mount} from 'react-mounter';

//errors
FlowRouter.notFound = {
  action: function () {
    mount(MainLayout, { 
      content: (<Error404 />) 
    });
  }
}

FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        FlowRouter.go( '/' );
        Bert.alert( 'Email verified! Thanks!', 'success' );
      }
    });
  }
});
=======
//errors
FlowRouter.notFound = {
  action: function () {
    ReactLayout.render(MainLayout, { content: <Error404 /> });
  }
}

>>>>>>> Inital Load
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//unautheniticated links
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
allowAny = FlowRouter.group({});
allowAny.route('/', {  
  action() {
  	//check to see if authenitcated. If so, send them on to routes
    if(!Meteor.userId()){
<<<<<<< refs/remotes/origin/master
      mount(MainLayout, { content: <Login /> });
=======
      ReactLayout.render(MainLayout, { content: <Login /> });
>>>>>>> Inital Load
    }else{
      FlowRouter.go('/routes');
    }
  }
});

allowAny.route('/validation-landing', {
    action: function(params, queryParams) {
<<<<<<< refs/remotes/origin/master
        mount(MainLayout, { content: <ValidationLanding /> });
=======
        ReactLayout.render(MainLayout, { content: <ValidationLanding /> });
>>>>>>> Inital Load
    }
});

allowAny.route('/login', {  
  action() {
<<<<<<< refs/remotes/origin/master
    mount(MainLayout, { content: <Login /> });
=======
    ReactLayout.render(MainLayout, { content: <Login /> });
>>>>>>> Inital Load
  }
});

allowAny.route('/about', {
    action: function(params, queryParams) {
<<<<<<< refs/remotes/origin/master
        mount(MainLayout, { content: <About /> });
=======
        ReactLayout.render(MainLayout, { content: <About /> });
>>>>>>> Inital Load
    }
});

allowAny.route('/logout', {  
  action() {
<<<<<<< refs/remotes/origin/master
    mount(MainLayout, { content: <Login /> });
=======
    ReactLayout.render(MainLayout, { content: <Login /> });
>>>>>>> Inital Load
    Meteor.logout();
  }
});

allowAny.route('/signup', {
    action() {
<<<<<<< refs/remotes/origin/master
        mount(MainLayout, { content: <Signup /> });
=======
        ReactLayout.render(MainLayout, { content: <Signup /> });
>>>>>>> Inital Load
    }
});
allowAny.route('/recover-password', {
    action() {
<<<<<<< refs/remotes/origin/master
        mount(MainLayout, { content: <RecoverPassword /> });
=======
        ReactLayout.render(MainLayout, { content: <RecoverPassword /> });
>>>>>>> Inital Load
    }
});



allowAuthenticated = FlowRouter.group({
    triggersEnter: [function(context, redirect) {
    if ( !Meteor.userId() ) redirect('/login');
  }]
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Authenticated routes
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
allowAuthenticated.route('/routes', {
    action() {
<<<<<<< refs/remotes/origin/master
        mount(MainLayout, { content: <MealRoutes /> });
=======
        ReactLayout.render(MainLayout, { content: <MealRoutes /> });
>>>>>>> Inital Load
    }
});

allowAuthenticated.route('/customize-route/:routeId', {
    action: function(params, queryParams) {
<<<<<<< refs/remotes/origin/master
        mount(MainLayout, { content: <CustomizeRoute id={params.routeId}/> });
    }
});
allowAuthenticated.route('/import-clients', {
    action: function(params, queryParams) {
        mount(MainLayout, { content: <ImportClients /> });
    }
});


allowAuthenticated.route('/clients/:routeId', {
    action: function(params, queryParams) {
        mount(MainLayout, { content: <MealClients id={params.routeId}/> });
=======
        ReactLayout.render(MainLayout, { content: <CustomizeRoute id={params.routeId}/> });
    }
});

allowAuthenticated.route('/clients/:routeId', {
    action: function(params, queryParams) {
        ReactLayout.render(MainLayout, { content: <MealClients id={params.routeId}/> });
>>>>>>> Inital Load
    }
});


//admin functions
allowAuthenticated.route('/manage-profile', {
    action: function(params, queryParams) {
<<<<<<< refs/remotes/origin/master
        mount(MainLayout, { content: <ManageProfile /> });
=======
        ReactLayout.render(MainLayout, { content: <ManageProfile /> });
>>>>>>> Inital Load
    }
});


// per FlowRouter design specs, we'llm manage access to this in the components themselves to insure roles are loaded.
allowAuthenticated.route('/manage-routes', {
    action: function(params, queryParams) {
<<<<<<< refs/remotes/origin/master
        mount(MainLayout, { content: <ManageRoutes /> });
=======
        ReactLayout.render(MainLayout, { content: <ManageRoutes /> });
>>>>>>> Inital Load
    }
});

allowAuthenticated.route('/manage-route/:routeId', {
    action: function(params, queryParams) {
<<<<<<< refs/remotes/origin/master
        mount(MainLayout, { content: <ManageRoute id={params.routeId}/> });
    }
});

allowAuthenticated.route('/map-view', {
    action: function(params, queryParams) {
        mount(MainLayout, { content: <MapView /> });
    }
});
allowAuthenticated.route('/manage-users', {
    action: function(params, queryParams) {
        mount(MainLayout, { content: <ManageUsers /> });
    }
});
allowAuthenticated.route('/manage-user/:userId', {
    action: function(params, queryParams) {
        mount(MainLayout, { content: <ManageUser userId={params.userId}/> });
    }
});
=======
        ReactLayout.render(MainLayout, { content: <ManageRoute id={params.routeId}/> });
    }
});
>>>>>>> Inital Load
