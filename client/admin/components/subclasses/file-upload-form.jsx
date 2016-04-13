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