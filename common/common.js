//Collection to hold authorized routes
Routes = new Mongo.Collection("routes");
//Collection to hold clients for authorized route
Clients = new Mongo.Collection("clients");
//Collection to hold all routes in system - only contains data for admins
RouteMaster = new Mongo.Collection("routesMaster");

//ClientMaster = new Mongo.Collection("clients");
//static MIFA Address Info
mifaAddress = "910 Vance Ave"
mifaZip = "38126";