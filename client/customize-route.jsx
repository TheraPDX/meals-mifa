CustomizeRoute = React.createClass({
	mixins: [ ReactMeteorData ],
	showLocation : function(position) {
      // Show a map centered at (position.coords.latitude, position.coords.longitude).
  		Session.set('coordinates', position.coords.latitude + ',' + position.coords.longitude);
	},
	componentDidMount(){
		if(navigator.geolocation){
			// timeout at 60000 milliseconds (60 seconds)
			navigator.geolocation.getCurrentPosition(this.showLocation);
		}
	},
  	
  	getMeteorData() {
		let subscription = Meteor.subscribe( 'clients', parseInt(this.props.id) );
		return {
		isLoading: !subscription.ready(),
		clients: Clients.find({}, {sort:{seq: 1}, reactive:true}).fetch(),
		coordinates: ''
		};
	},

	handleSubmit(event){
	    event.preventDefault();
           
		//set origin address
		var start;
		var startOption = $('[name="rdStart"]:checked').val();
		
		switch(startOption){
			case 'mifa':
				start = mifaAddress + ',' + mifaZip;
				break;
			case "currentLocation":
				if(navigator.geolocation){
   					// timeout at 60000 milliseconds (60 seconds)
					start = Session.get('coordinates');
				}else{
					Bert.alert("Sorry, browser does not support geolocation!", 'warning');
					return;
				}
				break;
			case "address":
				var startStreetAddress = $('[id="startAddress"]').val();
	    		var startZipCode = $('[id="startZip"]').val();
	    		start = startStreetAddress + ',' + startZipCode;
				break;
				
		}


		//set destination address
		var destination;
		var destinationOption = $('[name="rdDestination"]:checked').val();
		
		switch(destinationOption){
			case "mifa":
				destination = mifaAddress + ',' + mifaZip;
				break;

			case "currentLocation":
				if(navigator.geolocation){
   					// timeout at 60000 milliseconds (60 seconds)
					destination = Session.get('coordinates');
				}else{
					Bert.alert("Sorry, browser does not support geolocation!", 'warning');
					return;
				}
				break;
			case "address":
				var destStreetAddress = $('[id="destinationAddress"]').val();
	    		var destZipCode = $('[id="destinationZip"]').val();
	    		destination = destStreetAddress + ',' + destZipCode;	
				break;
		}

		//call the server side API
		Meteor.call("optimizeRoute", parseInt(this.props.id), start, destination, function(error, result){
			if(error){
				Bert.alert('Error Optimizing Route:' + error.reason, 'danger');
			}else{
				Bert.alert('Your route has been optimized.', 'success', 'growl-top-left');
			}
		});
		FlowRouter.go('/clients/' + this.props.id);
	},
  render() {
    if (this.data.isLoading ) {
      return <Loading />;
    }else{
      return (
        <form id="customizeForm" name="customizeForm" onSubmit={this.handleSubmit}>
	        <div className="row">
	          <div className="form-group">
	            <h4 className="page-header">Customize My Route</h4>
	          </div>
	          <div className="form-group">
	            <p>You an modify your route by changing your start address (default start and end is your Mifa) or your finishing address. Your route will be recalculated to finish your route closest to your last stop.</p>
	          </div>
	        </div>
			<div className="row">
	            <div className="col-xs-12">
	            	Manage your starting point 
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	            	<input type="radio" id="rdStart1" name="rdStart" value="mifa" defaultChecked={true} onchange={this.handleChange} />
	            	<label htmlFor = "rdStart1">Start at Mifa</label><br/>
	        		<input type="radio" id="rdStart2" name="rdStart" value="currentLocation" onchange={this.handleChange}/>
	        		<label htmlFor = "rdStart2">Use my current location</label><br/>
	            	<input type="radio" id="rdStart3" name="rdStart" value="address" onchange={this.handleChange}/>
	            	<label htmlFor = "rdStart3">Start at the address below</label>

	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	                <input type="text" id="startAddress" placeholder="Start Address" onclick="document.getElementById('rdStart3').checked=true" />
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	                <input type="text" id="startZip" placeholder="Start Zip" onclick="document.getElementById('rdStart3').value=address" />
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	                <hr/>
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	            	Manage your end point  
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	            	<input type="radio" id="rdDestiation1" value="mifa" name="rdDestination" defaultChecked={true}/>
	            	<label htmlFor = "rdDestiation1">Finish at Mifa</label><br/>
	        		<input type="radio" id="rdDestiation2" value="currentLocation" name="rdDestination"/>
	        		<label htmlFor = "rdDestiation2">Use current location</label><br/>
	            	<input type="radio" id="rdDestiation3" value="address" name="rdDestination"/>
	            	<label htmlFor = "rdDestiation3">Finish at the address below</label>
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	                <input type="text" id="destinationAddress" placeholder="Destination Address" onclick="document.getElementById('rdDestiation3').checked=true" />
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	                <input type="text" id="destinationZip" placeholder="Destination Zip" onclick="document.getElementById('rdDestiation3').checked=true" />
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	                <hr/>
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	            	<button className="btn cancel btn-success pull-left">
		                Cancel
		            </button>
	                <input type="submit" id="optimize-button" className="btn btn-success pull-right" value="Recalculate my Route" />
	            </div>
	        </div>
	        <div className="row">
	            <div className="col-xs-12">
	                <hr/>
	            </div>
	        </div>
        </form>        
      );
    }
  }
});









        