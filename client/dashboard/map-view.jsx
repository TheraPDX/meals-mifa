MapView = React.createClass({
  
  mixins: [ ReactMeteorData ],
  getMeteorData() {
  GoogleMaps.load;
  let subscription = Meteor.subscribe( 'clientMaster' );
    return {
      isLoading: !subscription.ready(),
      clients: Clients.find({}).fetch()
    };
  },
  
    render() {
    

    if ( this.data.isLoading ) {
      return <Loading />;
    }else{
      //check to see if they actually have routes
      if(this.data.clients.length==0){
        Bert.alert('You must be an admin to view this map.', 'danger');
        return(
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Authorize Routes</h4>
            </div>
            <div className="form-group xs-col-12">
              <p>You are not authorized to view this map.</p>
            </div>
          </div>
          );
      }else{
        return (
          <span>
          <div className="row">
            <div className="form-group">
              <h4 className="page-header">Manage Users for Route</h4>
            </div>
            <div className='form-group'>
              <br />
                <MealsMap />
            </div>
          </div>  
          </span>
        );
      }
    }
  }
});
