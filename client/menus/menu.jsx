Menu = require('react-burger-menu').slide;

MealsMenu = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    }
  },
    render: function() {
        //check admin
        if(!Meteor.user()){
            return (
              <Menu width={ 200 } right>
                <a id="routes" className="h3" href="/routes">My Routes</a>
                <a id="profile" className="h3" href="/manage-profile">My Profile</a>
                <a id="logout" className="h3" href="/logout">Logout</a>
                <a id="contact" className="h3" href="/about">About</a>
              </Menu>
            );
        }else{

            if(Roles.userIsInRole(this.data.user._id, 'admin')){
                return (
                    <Menu width={ 200 } right>
                        <a id="routes" className="h3" href="/routes">My Routes</a>
                        <a id="profile" className="h3" href="/manage-profile">My Profile</a>
                        <a id="routes" className="h3" href="/manage-routes">Manage Routes</a>
                        <a id="routes" className="h3" href="/manage-users">Manage Users</a>
                        <a id="contact" className="h3" href="/import-clients">Import Clients</a>
                        <a id="map" className="h3" href="/map-view">Full Screen Map</a>
                        <a id="logout" className="h3" href="/logout">Logout</a>
                        <a id="contact" className="h3" href="/about">About</a>
                    </Menu>
                );
            }else{
                return(
                  <Menu width={ 200 } right>
                    <a id="routes" className="h3" href="/routes">My Routes</a>
                    <a id="profile" className="h3" href="/manage-profile">My Profile</a>
                    <a id="logout" className="h3" href="/logout">Logout</a>
                    <a id="contact" className="h3" href="/about">About</a>
                  </Menu>
                );
            }
        }
    }
});