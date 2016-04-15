Error404 = React.createClass({
    render() {
        return (
        <span>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-4">
              <h4 className="page-header">404: Page Not Found</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-4">
              <p>We Looked All Over and Can Not Find the Page You Are Looking For!</p>
            </div>
          </div>
          <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-4">
                <img className='image-404' src="/404error.jpg" />
            </div>
          </div>
        </span>
      );
    }
});