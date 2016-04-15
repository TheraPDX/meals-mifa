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
                <a id="routes" className="menu-item" href="/routes">My Routes</a>
                <a id="profile" className="menu-item" href="/manage-profile">My Profile</a>
                <a id="contact" className="menu-item" href="/about">About</a>
                <a id="contact" className="menu-item" href="/logout">Logout</a>
              </Menu>
            );
        }else{

            if(Roles.userIsInRole(this.data.user._id, 'admin')){
                return (
                    <Menu width={ 200 } right>
                        <a id="routes" className="menu-item" href="/routes">My Routes</a>
                        <a id="profile" className="menu-item" href="/manage-profile">My Profile</a>
                        <a id="contact" className="menu-item" href="/about">About this App</a>
                        <a id="profile" className="menu-item" href="/manage-routes">Manage Routes</a>
                        <a id="contact" className="menu-item" href="/import-clients">Import Clients</a>
                        <a id="contact" className="menu-item" href="/logout">Logout</a>
                    </Menu>
                );
            }else{
                return(
                    <Menu width={ 200 } right>
                        <a id="routes" className="menu-item" href="/routes">My Routes</a>
                        <a id="profile" className="menu-item" href="/manage-profile">My Profile</a>
                        <a id="contact" className="menu-item" href="/about">About</a>
                        <a id="contact" className="menu-item" href="/logout">Logout</a>
                    </Menu>
                );
            }
        }
    }
});