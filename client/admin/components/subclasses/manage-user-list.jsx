ManageUserList = React.createClass({
  render() {
    return (
      <div className='form-group'>
            {this.props.usersForRoute.map( ( _id, index ) => {
              return <ManageUserItem key={index} usersForRoute={_id} routeId={this.props.routeId}/>;
            })}
      </div>
    );
  }
});