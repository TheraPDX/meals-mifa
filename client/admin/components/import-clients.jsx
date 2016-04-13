//This page is simply used to upload CSV of clients and insert into client's collection. 
//Only available to admin
//Users can select replace or append. Replace dumps the client list in the delivery history collection
ImportClients = React.createClass({
  render() {
    if(!Roles.userIsInRole(Meteor.user._id, 'admin')){
      Bert.alert('You must be an admin to import clients.', 'danger');
      return(
        <div className="row">
          <div className="form-group">
            <h4 className="page-header">Upload Client Routes</h4>
          </div>
          <div className="form-group xs-col-12">
            <p>You are not authorized to import clients.</p>
          </div>
        </div>
      );
    }else{  
      return(
        <div className="row">
          <div className="form-group">
            <h4 className="page-header">Upload Client Routes</h4>
          </div>
          <div className="form-group xs-col-12">
            <p>This page is used to upload the client delivery list from your deliery system. The format musts be in CSV and the columns are expected to be in this order and contain headers:</p>
            <ul>
              <li>RouteId</li>
              <li>Client Id</li>
              <li>First Name</li>
              <li>Last Name</li>
              <li>Address</li>
              <li>City</li>
              <li>State</li>
              <li>Zip</li>
              <li>Home Phone</li>
              <li>Mobile Phone</li>
              <li>Driver Instructions</li>
              <li>Delivery Sequence</li>
              <li>Meal 1 Type</li>
              <li>Meal 2 Type</li>
              <li>Beverage</li>
            </ul>  
          </div>
          <div className="form-group xs-col-12">
            <p><b>Warning!</b> Importing routes will delete all current clients in the system and replace them. This should not be done during active delivery times.</p>
          </div>
          <div>
            <FileForm />
          </div>
          <div className="form-group xs-col-12">
            <p><b>Warning!</b> Importing routes will delete all current clients in the system and replace them. This should not be done during active delivery times.</p>
          </div>
        </div>
      );
    }
  }
});
