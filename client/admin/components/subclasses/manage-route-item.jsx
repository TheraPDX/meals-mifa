ManageRouteItem = React.createClass({
	goManageRoute(event){
		FlowRouter.go('/manage-route/' + event.target.value);
	},
	render() {

		return (
		<div className="col-xs-4 col-sm-3 col-md-2 col-lg-1 paddedDiv">
			<button value={this.props.routesToManage.route} className='btn btn-success form-control' onClick={this.goManageRoute}>
				{this.props.routesToManage.route}
			</button>
		</div>
		);
	}
});