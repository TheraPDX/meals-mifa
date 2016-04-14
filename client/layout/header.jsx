// This is inside header.jsx
Header = React.createClass({  
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    }
  },
  showRight: function() {
    this.refs.right.show();
  },
  getSettingsIcon(){
      return (<a href="#" onClick={this.showRight}><img className="settingsIcon pull-right" src="/settings.png" alt="Settings" /></a>)
  },

  render() {
  	return (
    		<header className="header">
      		<div className="row">
          		<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 brand-wrap">
          			<a href="/"><img className="logo" src="/mifa.png" alt="MIFA Logo" /></a>
                {this.data.user? this.getSettingsIcon() : null}
          		</div>
      		</div>
          <Menu ref="right" alignment="right">
            <MenuItem hash="/routes">View Routes & Clients</MenuItem>
            <MenuItem hash="/manage-profile">Update my Information</MenuItem>
            <MenuItem hash="/logout">Logout</MenuItem>
            <MenuItem hash="/about">About</MenuItem>
            <MenuItem hash="/manage-routes">Manage Routes</MenuItem>
            <MenuItem hash="/import-clients">Import Clients</MenuItem>
            <MenuItem hash="/map-view">View Map</MenuItem>
          </Menu>
		</header>
  	)
	}
})