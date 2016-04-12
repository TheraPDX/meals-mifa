ManageUserItem = React.createClass({
	render() {

		return (
		<div className="col-xs-4 col-sm-3 col-md-2 col-lg-1 paddedDiv">
			<button value={this.props.usersToManage.emails[0].address} className='btn btn-success form-control' onClick={this.goManageRoute}>
				{this.props.usersToManage.emails[0].address}
			</button>
		</div>
		);
	}
});