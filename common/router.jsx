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
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//unautheniticated links
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
allowAny = FlowRouter.group({});
allowAny.route('/', {  
  action() {
    //check to see if authenitcated. If so, send them on to routes
    if(!Meteor.userId()){
      mount(MainLayout, { content: <Login /> });
    }else{
      FlowRouter.go('/routes');
    }
  }
});

allowAny.route('/validation-landing', {
    action: function(params, queryParams) {
        mount(MainLayout, { content: <ValidationLanding /> });
    }
});

allowAny.route('/login', {  
  action() {
    mount(MainLayout, { content: <Login /> });
  }
});

allowAny.route('/about', {
    action: function(params, queryParams) {
        mount(MainLayout, { content: <About /> });
    }
});

allowAny.route('/logout', {  
  action() {
    mount(MainLayout, { content: <Login /> });
    Meteor.logout();
  }
});

allowAny.route('/signup', {
    action() {
        mount(MainLayout, { content: <Signup /> });
    }
});
allowAny.route('/recover-password', {
    action() {
        mount(MainLayout, { content: <RecoverPassword /> });
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
        mount(MainLayout, { content: <MealRoutes /> });
    }
});

allowAuthenticated.route('/customize-route/:routeId', {
    action: function(params, queryParams) {
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
    }
});


//admin functions
allowAuthenticated.route('/manage-profile', {
    action: function(params, queryParams) {
        mount(MainLayout, { content: <ManageProfile /> });
    }
});


// per FlowRouter design specs, we'llm manage access to this in the components themselves to insure roles are loaded.
allowAuthenticated.route('/manage-routes', {
    action: function(params, queryParams) {
        mount(MainLayout, { content: <ManageRoutes /> });
    }
});

allowAuthenticated.route('/manage-route/:routeId', {
    action: function(params, queryParams) {
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