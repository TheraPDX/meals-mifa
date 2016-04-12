ManageRouteList = React.createClass({
  render() {
    return (
      <div className='form-group'>
            {this.props.routesToManage.map( ( route, index ) => {
              return <ManageRouteItem key={index} routesToManage={route} />;
            })}
      </div>
    );
  }
});