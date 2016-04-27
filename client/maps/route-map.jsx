RouteMap = React.createClass({
  mixins: [ReactMeteorData],
  componentDidMount() {
    GoogleMaps.load();
  },
  getMeteorData() {
    return {
      loaded: GoogleMaps.loaded(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions()
    };
  },
  _mapOptions() {
    return {
      center: new google.maps.LatLng(35.1495, -90.0490),
      zoom: 11
    };
  },
  render() {
    if (this.data.loaded)
      return <GoogleMap name="mymap" options={this.data.mapOptions} />;

    return <div>Loading map...</div>;
  }
});

GoogleMap = React.createClass({
  
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
  },  
  mixins: [ ReactMeteorData ],
  getMeteorData() {
    let subscription = Meteor.subscribe( 'clients', 35 );
    return {
        isLoading: !subscription.ready(),
    };
  },
  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });
    
    GoogleMaps.ready(this.props.name, function(map) {
      var bounds = new google.maps.LatLngBounds();
      var markers = {};
      Clients.find().forEach(
        function(document){
          var myLatlng = new google.maps.LatLng(document.geoLat, document.geoLng);
          var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
          switch(document.deliveryStatus){
              
          case 'complete':
            var pinColor = "004C00";
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
              break;
            
          case 'nothome':
            var pinColor = "e70935";
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
              break;
            break;

          default:
            var pinColor = "FFFFFF";
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
          }
          var marker = new google.maps.Marker({
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: myLatlng,
            map: map.instance,
            id: document._id,
            title: 'Route ' + document.route + ': Stop ' + document.seq,
            icon: pinImage
          });
          markers[document._id] = marker;
          bounds.extend(marker.position);  
          map.instance.fitBounds(bounds); 
        }
      )
      Clients.find().observe({  
        changed: function(document, oldDocument) {
          console.log('changed');
        //remove marker
        markers[oldDocument._id].setMap(null);


        //re add w/ appropriate color
        var myLatlng = new google.maps.LatLng(document.geoLat, document.geoLng);
        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
          switch(document.deliveryStatus){
              
          case 'complete':
            var pinColor = "004C00";
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
              break;
              
          case 'nothome':
            var pinColor = "e70935";
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
              break;

          default:
            var pinColor = "FFFFFF";
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            }
          var marker = new google.maps.Marker({
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: myLatlng,
            map: map.instance,
            id: document._id,
            title: 'Route ' + document.route + ': Stop ' + document.seq,
            icon: pinImage
          });
          markers[document._id] = marker;
        }
      });
    });
  },
  
  componentWillUnmount() {
    if (GoogleMaps.maps[this.props.name]) {
      google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
      delete GoogleMaps.maps[this.props.name];
    } 
  },
  render() {
    return <div className="map-container"></div>;
  }
});