ManageUserList = React.createClass({
  render() {
    return (
      <div className='form-group'>
            {this.data.usersToManage.map( ( _id, index ) => {
              return <ManageUserItem key={index} usersToManage={_id} />;
            })}
      </div>
    );
  }
});