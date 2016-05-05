MasterMap = React.createClass({
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
      center: new google.maps.LatLng(35.1495, -90.0490),
      zoom: 11
    };
  },
  render() {
    if (this.data.loaded)
      return <GoogleMasterMap name="mastermap" options={this.data.mapOptions} />;

    return <div>Loading map...</div>;
  }
});

GoogleMasterMap = React.createClass({
  
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
  },  
  mixins: [ ReactMeteorData ],
  getMeteorData() {
    let subscription = Meteor.subscribe( 'clients', 0);
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
      var animationOption;
      Clients.find().forEach(
        function(document){
          var myLatlng = new google.maps.LatLng(document.geoLat, document.geoLng);
          //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
          switch(document.deliveryStatus){
              
          case 'complete':
            var pinColor = "4ef84e";
            var pinImage = new google.maps.MarkerImage("/green_peg.png",
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            animationOption = google.maps.Animation.DROP;
            break;
              
          case 'nothome':
            var pinColor = "e70935";
            var pinImage = new google.maps.MarkerImage("/red_peg.png",
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            animationOption = google.maps.Animation.DROP;
            break;

          default:
            var pinColor = "FFFFFF";
            var pinImage = new google.maps.MarkerImage("white_peg.png",
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            animationOption = google.maps.Animation.DROP;

          }
          var marker = new google.maps.Marker({
            draggable: false,
            animation: animationOption,
            position: myLatlng,
            map: map.instance,
            id: document._id,
            title: 'Route ' + document.route + ': Stop ' + document.seq,
            icon: pinImage
          });
            //var info_window = get_info_window();
            var info_window = new google.maps.InfoWindow();
            marker.set('address', document.address);
            marker.set('name', document.fname + ' ' + document.lname);
            marker.addListener('click', function() {
              info_window.setContent(this.get('name') + '<br />' + this.get('address'));
              info_window.open(map.instance, this);
              setTimeout(function () { info_window.close(); }, 5000);
            });
          markers[document._id] = marker;
          bounds.extend(marker.position);  
          map.instance.fitBounds(bounds); 
        }
      )
      Clients.find().observe({  
        changed: function(document, oldDocument) {
        //remove marker
        markers[oldDocument._id].setMap(null);


        //re add w/ appropriate color
        var myLatlng = new google.maps.LatLng(document.geoLat, document.geoLng);
        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        var animationOption;
          switch(document.deliveryStatus){
              
          case 'complete':
            var pinImage = new google.maps.MarkerImage("/green_peg.png",
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            animationOption = google.maps.Animation.DROP;
            break;
              
          case 'nothome':
            var pinImage = new google.maps.MarkerImage("/red_peg.png",
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            animationOption = google.maps.Animation.DROP;
            break;

          default:
            var pinImage = new google.maps.MarkerImage("white_peg.png",
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            animationOption = google.maps.Animation.DROP;
            }
            
          var marker = new google.maps.Marker({
            draggable: false,
            animation: animationOption,
            position: myLatlng,
            map: map.instance,
            id: document._id,
            title: 'Route ' + document.route + ': Stop ' + document.seq,
            icon: pinImage
          });
            //var info_window = get_info_window();
            var info_window = new google.maps.InfoWindow();
            marker.set('address', document.address);
            marker.set('name', document.fname + ' ' + document.lname);
            marker.addListener('click', function() {
              info_window.setContent(this.get('name') + '<br />' + this.get('address'));
              info_window.open(map.instance, this);
              setTimeout(function () { info_window.close(); }, 5000);
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
    return <div className="master-map-container"></div>;
  }
});