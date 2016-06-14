// This is inside header.jsx
Header = React.createClass({  
  render() {
    return (
        <header className="header">
          <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 brand-wrap">
                <a href="/"><img className="logo" src="/mifa.png" alt="MIFA Logo" /></a>
              </div>
          </div>
          <MealsMenu />
    </header>
    )
  }
})