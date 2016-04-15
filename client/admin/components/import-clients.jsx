//This page is simply used to upload CSV of clients and insert into client's collection. 
//Only available to admin
//Users can select replace or append. Replace dumps the client list in the delivery history collection
ImportClients = React.createClass({
  render() {
    if(!Roles.userIsInRole(Meteor.user()._id, 'admin')){
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
FileForm = React.createClass({
  // since we are starting off without any data, there is no initial value
  getInitialState: function() {
    return {
      data_url:null,
      isUploading: false
    };
  },

  // prevent form from submitting; we are going to capture the file contents
  handleSubmit: function(e) {
    e.preventDefault();
  },

  // when a file is passed to the input field, retrieve the contents as a
  // base64-encoded data URI and save it to the component's state
  handleFile: function(e) {
    this.isUploading=true;

    var file = e.target.files[0];
    //lots of validation should go here....
    Papa.parse( file, {
      header: true,
      complete( results, file ) {
        // Handle the upload here.
        console.log(results.data);
        //Pass the json array into the server
        Meteor.call('reloadClients', results.data, function(error, result){
          if(error){
            Bert.alert('Error Optimizing Route:' + error.reason);
          }else{
            Bert.alert('All clients have been replaced', 'success', 'growl-top-left');
          }
        });
      }
    })

    this.isUploading=false;
  },

  // return the structure to display and bind the onChange, onSubmit handlers
  render: function() {
    // since JSX is case sensitive, be sure to use 'encType'
    if(this.isUploading){
      return(<Loading />);
    }else{
      return (
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <input type="file" className='form-control' onChange={this.handleFile} />
        </form>
      );
    }
  },
});