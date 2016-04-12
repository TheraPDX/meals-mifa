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

