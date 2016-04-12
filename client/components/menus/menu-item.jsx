MenuItem = React.createClass({
    handleClick(){
    	FlowRouter.go(this.props.hash);
    },
    render: function() {
        return <div className="menu-item brand-wrap" onClick={this.handleClick}>{this.props.children}</div>;
    }
});