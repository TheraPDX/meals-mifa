//errors
FlowRouter.notFound = {
  action: function () {
    ReactLayout.render(MainLayout, { content: <Error404 /> });
  }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//unautheniticated links
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
allowAny = FlowRouter.group({});
allowAny.route('/', {  
  action() {
  	//check to see if authenitcated. If so, send them on to routes
    if(!Meteor.userId()){
      ReactLayout.render(MainLayout, { content: <Login /> });
    }else{
      FlowRouter.go('/routes');
    }
  }
});

allowAny.route('/validation-landing', {
    action: function(params, queryParams) {
        ReactLayout.render(MainLayout, { content: <ValidationLanding /> });
    }
});

allowAny.route('/login', {  
  action() {
    ReactLayout.render(MainLayout, { content: <Login /> });
  }
});

allowAny.route('/about', {
    action: function(params, queryParams) {
        ReactLayout.render(MainLayout, { content: <About /> });
    }
});

allowAny.route('/logout', {  
  action() {
    ReactLayout.render(MainLayout, { content: <Login /> });
    Meteor.logout();
  }
});

allowAny.route('/signup', {
    action() {
        ReactLayout.render(MainLayout, { content: <Signup /> });
    }
});
allowAny.route('/recover-password', {
    action() {
        ReactLayout.render(MainLayout, { content: <RecoverPassword /> });
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
        ReactLayout.render(MainLayout, { content: <MealRoutes /> });
    }
});

allowAuthenticated.route('/customize-route/:routeId', {
    action: function(params, queryParams) {
        ReactLayout.render(MainLayout, { content: <CustomizeRoute id={params.routeId}/> });
    }
});
allowAuthenticated.route('/import-clients', {
    action: function(params, queryParams) {
        ReactLayout.render(MainLayout, { content: <ImportClients /> });
    }
});


allowAuthenticated.route('/clients/:routeId', {
    action: function(params, queryParams) {
        ReactLayout.render(MainLayout, { content: <MealClients id={params.routeId}/> });
    }
});


//admin functions
allowAuthenticated.route('/manage-profile', {
    action: function(params, queryParams) {
        ReactLayout.render(MainLayout, { content: <ManageProfile /> });
    }
});


// per FlowRouter design specs, we'llm manage access to this in the components themselves to insure roles are loaded.
allowAuthenticated.route('/manage-routes', {
    action: function(params, queryParams) {
        ReactLayout.render(MainLayout, { content: <ManageRoutes /> });
    }
});

allowAuthenticated.route('/manage-route/:routeId', {
    action: function(params, queryParams) {
        ReactLayout.render(MainLayout, { content: <ManageRoute id={params.routeId}/> });
    }
});
