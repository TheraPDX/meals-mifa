Menu = React.createClass({
    getInitialState: function() {
        return {
            visible: false  
        };
    },

    show: function() {
        this.setState({ visible: true });
        document.addEventListener("click", this.hide.bind(this));
    },

    hide: function() {
        document.removeEventListener("click", this.hide.bind(this));
        this.setState({ visible: false });
    },

    render: function() {
        return <div className="menu brand-wrap" >
            <div className={(this.state.visible ? "visible " : "") + this.props.alignment}>{this.props.children}</div>
        </div>;
    }
});
MenuItem = React.createClass({
    handleClick(){
        FlowRouter.go(this.props.hash);
    },
    render: function() {
        return <div className="menu-item brand-wrap" onClick={this.handleClick}>{this.props.children}</div>;
    }
});