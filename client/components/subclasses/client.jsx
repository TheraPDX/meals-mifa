Client = React.createClass({
    updateDeliveryStatus(event){
    	event.preventDefault();
    //if determine value of button pushed (client id) and name of button pushed (for outcome)
    let clientID = event.target.value;
    let outcome = event.target.name;
    Meteor.call('updateDeliveryStatus', clientID, outcome, Meteor.user().emails[0].address, function(error, response){
      if(error){
        Bert.alert('There was an error processing the update.', 'warning')
      }
    })
  },

  render() {
    return (
	    <div disabled>
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
	            <a href="tel:{{home}}">
	            	{this.props.client.home}
	            </a>
	        </div>
	        <div className='col-xs-6 col-sm-3 col-md-2'>
	            {this.props.client.meal2}
	        </div>
	        <div className='col-xs-6 col-sm-3 col-md-2'>
	            m#: 
	            <a href="tel:{{mobile}}">
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
});