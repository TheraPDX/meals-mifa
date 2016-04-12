Route = React.createClass({
	gotoRoute(event){
		FlowRouter.go('/clients/' + event.target.value);
	},
	manageRoute(event){
		FlowRouter.go('/manage-route/' + event.target.value);
	},
	render() {

		return (
		<div className="form-group">
		<button value={this.props.route.authorizedroute} className='btn btn-success form-control' onClick={this.gotoRoute}>
			Route: {this.props.route.authorizedroute}
		</button>
		</div>
		);
	}
});