// This is inside footer.jsx
Footer = React.createClass({
mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    }
  },
  logout() {
    FlowRouter.go('/logout');
  },
  currentUserEmail() {
      return Meteor.user().emails[0].address;
  },
  getLogoutButton() {
      return <span className="settingsIcon">
    <p>You are logged in as {this.currentUserEmail()} | <a href='#' onClick={this.logout}>Click here to Logout</a></p>
    </span>
  },  
  render() {
    return (
      <div className="footer">
        <hr />
        {this.data.user? this.getLogoutButton() : null}
      </div>
    )
  }
});