MealClients = React.createClass({
  mixins: [ ReactMeteorData ],
  getMeteorData() {
  let subscription = Meteor.subscribe( 'clients', parseInt(this.props.id) );
    return {
      isLoading: !subscription.ready(),
      clients: Clients.find({}, {sort:{seq: 1}, reactive:true}).fetch()
    };
  },
  optimizeRoute: function(){
    FlowRouter.go('/customize-route/' + this.props.id);
  },
  /*componentDidMount(){
    //Not using this method because displaying the iframe limits to 10 stops
    Meteor.call('getMapUrl', parseInt(this.props.id), function(error, response){
      if(error){
        Bert.alert('error getting MAP URL from server:' + error.reason, 'warning');
      }else{
        Session.set('iframeLocation', response);
      }
    });
  },*/

  render() {
    if (this.data.isLoading ) {
      return <Loading />;
    }else{
      //check for route with no clients
      if (this.data.clients.length==0){
            Bert.alert('There are no clients in the system for route: ' + this.props.id, 'danger');
            return(
              <div className="row">
                <div className="col-xs-12">
                  <h4 className="page-header">Scheduled Deliveries</h4>
                </div>
                <div className="col-xs-12">
                  <p>There are no clients for your route. Please contact your volunteer coordinator or select a <a href='/routes'>different route</a>.</p>
                </div>
              </div>
            )
      }else{
        return (
          <div className="row">
            <div className="col-xs-12">
              <h4 className="page-header">Scheduled Deliveries</h4>
            </div>
            <div className="col-xs-12">
              <p>You can start deliverying your route with turn by turn directions by tapping the address of each client. 
              To optimize your right to start or finish in a location different from MIFA's default, tap the 'Customize my Route' button.</p>
            </div>
            <div className="col-xs-12">
                <button className='form-control btn btn-success' onClick={this.optimizeRoute}>
                  Customize my Route
                </button> 
            </div>
            <div className='form-group'>
              <br />
                <ClientTable clients={this.data.clients} />
            </div>
          </div>
        );
      }
    }
  }
});

ClientTable = React.createClass({
  render() {
    return (
      <div className="col-xs-12 table-responsive>">
            {this.props.clients.map( ( client, index ) => {
              return <Client key={index} client={client} />;
            })}
      </div>
    );
  }
});

Client = React.createClass({
    updateDeliveryStatus(event){
      event.preventDefault();
    //if determine value of button pushed (client id) and name of button pushed (for outcome)
    let clientID = event.target.value;
    let outcome = event.target.name;
    

    //here if the user clicks the same status twice, we undo it
    if(this.props.client.deliveryStatus==outcome){
      outcome='';
    }

    Meteor.call('updateDeliveryStatus', clientID, outcome, Meteor.user().emails[0].address, function(error, response){
      if(error){
        Bert.alert('There was an error processing the update.', 'warning')
      }
    })
  },

  render() {
    
    switch(this.props.client.deliveryStatus){
      case 'nothome':
        return(
          <div>
            <div className='nothome col-xs-12'>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    Stop: {this.props.client.seq}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    Route: {this.props.client.route}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    {this.props.client.fname + ' ' + this.props.client.lname}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    {this.props.client.meal1}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                     <a href={'http://google.com/maps/?daddr=' + this.props.client.address + ',' + this.props.client.zip} target='_blank'>
                  {this.props.client.address}
              </a>
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    {this.props.client.beverage}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    h#: 
                    <a href={'tel:' + this.props.client.home}>
                      {this.props.client.home}
                    </a>
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    {this.props.client.meal2}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    m#: 
                    <a href={'tel:' + this.props.client.mobile}>
                      {this.props.client.mobile}
                  </a>
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    &nbsp;
                </div>
                <div className='col-xs-12 col-sm-6 col-md-3'>
                    Special Instructions: {this.props.client.instructions}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
              <button className='btn btn-warning pull-left' name='nothome' value={this.props.client._id} onClick={this.updateDeliveryStatus}>
                        Undo
                    </button>
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>    
                    <button className='btn btn-success' name='complete' value={this.props.client._id} onClick={this.updateDeliveryStatus}>
                        Complete
                    </button>
                </div>
          </div>
          <div className='col-xs-12'>
              <hr />
            </div>
        </div>
        );
        break;

      case 'complete':
        return (
          <div>
            <div className='complete col-xs-12'>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    Stop: {this.props.client.seq}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    Route: {this.props.client.route}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    {this.props.client.fname + ' ' + this.props.client.lname}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    {this.props.client.meal1}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                     <a href={'http://google.com/maps/?daddr=' + this.props.client.address + ',' + this.props.client.zip} target='_blank'>
                  {this.props.client.address}
              </a>
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    {this.props.client.beverage}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    h#: 
                    <a href={'tel:' + this.props.client.home}>
                      {this.props.client.home}
                    </a>
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    {this.props.client.meal2}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    m#: 
                    <a href={'tel:' + this.props.client.mobile}>
                      {this.props.client.mobile}
                  </a>
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
                    &nbsp;
                </div>
                <div className='col-xs-12 col-sm-6 col-md-3'>
                    Special Instructions: {this.props.client.instructions}
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>
              <button className='btn btn-warning pull-left' name='nothome' value={this.props.client._id} onClick={this.updateDeliveryStatus}>
                        Not Home
                    </button>
                </div>
                <div className='col-xs-6 col-sm-3 col-md-2'>    
                    <button className='btn btn-success' name='complete' value={this.props.client._id} onClick={this.updateDeliveryStatus}>
                        Undo
                    </button>
                </div>
          </div>
          <div className='col-xs-12'>
              <hr />
            </div>
        </div>
        );
        break;

      default:
        return(     
          <div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                  Stop: {this.props.client.seq}
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                  Route: {this.props.client.route}
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                  {this.props.client.fname + ' ' + this.props.client.lname}
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                  {this.props.client.meal1}
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                   <a href={'http://google.com/maps/?daddr=' + this.props.client.address + ',' + this.props.client.zip} target='_blank'>
                {this.props.client.address}
            </a>
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                  {this.props.client.beverage}
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                  h#: 
                  <a href={'tel:' + this.props.client.home}>
                    {this.props.client.home}
                  </a>
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                  {this.props.client.meal2}
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                  m#: 
                  <a href={'tel:' + this.props.client.mobile}>
                    {this.props.client.mobile}
                </a>
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
                  &nbsp;
              </div>
              <div className='col-xs-12 col-sm-6 col-md-3'>
                  Special Instructions: {this.props.client.instructions}
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>
            <button className='btn btn-warning pull-left' name='nothome' value={this.props.client._id} onClick={this.updateDeliveryStatus}>
                      Not Home
                  </button>
              </div>
              <div className='col-xs-6 col-sm-3 col-md-2'>    
                  <button className='btn btn-success' name='complete' value={this.props.client._id} onClick={this.updateDeliveryStatus}>
                      Complete
                  </button>
              </div>
              <div className='col-xs-12'>
                  <hr />
              </div>
        </div>
      );
      }
    }
});