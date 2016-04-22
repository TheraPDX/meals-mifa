MealsMap = React.createClass({
  mixins: [ReactMeteorData],
  componentDidMount() {
    GoogleMaps.load({ v: '3', key: 'AIzaSyDEvQVPOEpw8nI1r2sYlaU5dmt7FngPafI', libraries: 'geometry,places' });
  },
  getMeteorData() {
    return {
      loaded: GoogleMaps.loaded(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions()
    };
  },
  _mapOptions() {
    return {
      center: new google.maps.LatLng(35.1495,-90.0490),
      zoom: 11
    };
  },
  render() {
    if (this.data.loaded){
      return <GoogleMap name="mymap" options={this.data.mapOptions} />;
    }else{
      return <div>Loading map...</div>;
    }
  }
});