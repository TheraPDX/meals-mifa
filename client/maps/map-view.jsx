MapView = React.createClass({
  render() {
    return (
      <span>
        <div className="row">
          <div className="form-group">
            <h4 className="page-header">Realtime Delivery Map</h4>
          </div>
          <div className='form-group'>
            <br />
            <MasterMap />
          </div>
        </div>  
      </span>
    );
  }  
});

