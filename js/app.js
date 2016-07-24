/// map error handling
function mapFallback(){
    $("#map").append("<p class='map-error'>Fail to load google map</p>");
}
////////////// foursquare api

// client_id=4DTUCXVTVOI15OOMEP5OOZ3004QTAMD3D0IPBFSFQB5143FY
// client_secret=JLWFN5GLMK0POTQHV415XOCTM0NNLVOOEOCVIDCDXHKUDA5W

//////////////////////////////////////////////////////////
// initial data
var initialDataList = [
    {
        id: 1,
        location: {lat: 1.345428, lng:103.691612},
        address: "846 Jurong West Street 81",
        iwContentString: "IW 846 Jurong West Street 81",

    },
    {
        id: 2,
        location: {lat:1.333727, lng: 103.712721},
        address: "8 Chin Bee Crescent",
        iwContentString: "IW 8 Chin Bee Crescent",
    },
    {
        id: 3,
        location: {lat:1.2950426, lng: 103.8602614},
        address: "3 Temasek Blvd",
        iwContentString: "IW 3 Temasek Blvd",
    },
    {
        id: 4,
        location: {lat:1.3084288, lng: 103.8192987},
        address: "18 Taman Serasi",
        iwContentString: "Botanic Gardens Mansion, 18 Taman Serasi",
    },
    {
        id: 5,
        location: {lat:1.3049535, lng: 103.8238746},
        address: "163 Tanglin Rd",
        iwContentString: "163 Tanglin Rd",
    },
    {
        id: 6,
        location: {lat:1.284788, lng: 103.802358},
        address: "371 Alexandra Rd",
        iwContentString: "371 Alexandra Rd",
    },
    {
        id: 7,
        location: {lat: 1.3114696, lng: 103.8566726},
        address: "180 Kitchener Rd",
        iwContentString: "180 Kitchener Rd",
    },
    {
        id: 8,
        location: {lat: 1.3507748, lng: 103.8722241},
        address: "23 Serangoon Central",
        iwContentString: "23 Serangoon Central",
    },
    {
        id: 9,
        location: {lat: 1.3897308, lng: 103.8566887},
        address: "51 Sunrise Ave",
        iwContentString: "51 Sunrise Ave",
    },
    {
        id: 10,
        location: {lat: 1.353489, lng: 103.765773},
        address: "21 Lor Sesuai",
        iwContentString: "21 Lor Sesuai",
    },
    {
        id: 11,
        location: {lat: 1.3822179, lng: 103.7422791},
        address: "414 Choa Chu Kang Ave 4",
        iwContentString: "414 Choa Chu Kang Ave 4",
    },

    {
        id: 12,
        location: {lat: 1.3017571, lng: 103.8363415},
        address: "8 Grange Road",
        iwContentString: "8 Grange Road,",
    },
];


/////////////////////////////////////////////////////  google map setup
var map;

var markers = [];
var venues_nearby = [];

var currentIW = null;

function initMap(){
    // var mapDiv = $("#map");
    var mapDiv = document.getElementById('map');

    var mLatLng = {lat: 1.347235, lng:103.836250};
    
    map = new google.maps.Map(mapDiv, {
        center: mLatLng,
        zoom: 11,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl:true,
        overViewMapControl: false
    });

    //// add event listener to map
    //// method 1
    // map.addListener('idle', function(e) {
    //    alert('Map loaded!');
    // });

    //// method 2 
    google.maps.event.addListenerOnce(map, 'idle', function(){

        initialDataList.forEach(function(data){
            var marker = addMarker(map, data);
            var latlng = data.location.lat+","+data.location.lng;
            markers.push({
                key: latlng,
                val: marker
            });
        
        });

    });
}


function addMarker(map, data){
    var location = data.location;
    var iwContentString = data.iwContentString;

    var image = {
        url: 'img/map-marker-icon.png',
        // This marker is 20 pixels wide by 20 pixels high.
        size: new google.maps.Size(20, 20),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(10, 10)
    };

    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
        coords: [1, 1, 1, 20, 44, 20, 44, 1],
        type: 'poly'
    };

    var marker = new google.maps.Marker({
        position: location,
        // label: labels[labelIndex++ % labels.length],
        // labelContent: labels[labelIndex++ % labels.length],
        // labelAnchor: new google.maps.Point(0, 0),
        // labelClass: "marker-label", //// the CSS class for the label
        // labelStyle: {opacity: 0.75},
        // title: labels[labelIndex++ % labels.length],
        map: map,
        draggable: true,
        raiseOnDrag: true,
        icon: image,
        shape: shape
    });

    marker.addListener("click", function(e){
        marker_click_handler(marker, data);
    });

    return marker;

}

/// when marker is clicked
function marker_click_handler(marker, data){
    if(currentIW != null){
        currentIW.close();
    }
    currentIW = null;

    var location = data.location;
    // console.log("marker clicked");
    marker.setAnimation(google.maps.Animation.BOUNCE);
                
    // stopAnimation(marker);
    setTimeout(function () {
        // stop marker animation
        marker.setAnimation(null);
        // after stop marker animation, show 

        currentIW = showIW(map, marker, data.iwContentString)
    }, 500);

    // shown the venues nearby the location
    var latlng = data.location.lat+","+data.location.lng;
        // show foursquare venues nearby the clicked place
    var foursquare_url = "https://api.foursquare.com/v2/venues/search?"+
        $.param({
            client_id: '4DTUCXVTVOI15OOMEP5OOZ3004QTAMD3D0IPBFSFQB5143FY',
            client_secret: 'JLWFN5GLMK0POTQHV415XOCTM0NNLVOOEOCVIDCDXHKUDA5W',
            v: '20130815',
            ll: latlng,
            radius:1000, // 1000 meters away from position
            query: 'restaurant'
        });

    // var appElement = document.querySelector('[ng-app=myApp]');
    // var $scope =angular.element(appElement).scope(); 
    // console.log("angular scope: " + $scope.vanues);
    // var scope1  = $scope;


    $.getJSON(foursquare_url, function(data){
        // all the venues nearby
        var venues = data.response.venues;
        // order by the stats.checkinsCount of the venue
        venues = venues.sort(function(item0, item1){
            return item1.stats.checkinsCount - item0.stats.checkinsCount;
        });

        // only show the top ten venues
        if(venues.length >10){
            venues = venues.slice(0, 10);
        }

        venues_nearby = []
        
        venues.forEach(function(item){
            // console.log(JSON.stringify(item.name));
            // console.log("This bug is tough!");
            // $scope.$apply(function(){
            //     $scope.venues.push(item);
            // })
            venues_nearby.push(item);
            
        });
        
    }).fail(function(){
        // $scope.$apply(function(){
        //     $scope.venues = [];
        // })
        // $scope.$apply(function(){
        //     $scope.venues_load_error("Fail to load data!");
        // })
        venues_nearby = []
    });

    $scope.venues  = venues_nearby;

}

function showIW(map, marker, iwContentString){
    var contentString = "<div class='iw-content'>"+ iwContentString +"</div>";

    var iw = new google.maps.InfoWindow({
        content: contentString,
        width: 100,
        padding: 0,
        minHeight: 30,
        closeBoxURL: "",
        closeBoxMargin: ""

    });

    iw.open(map, marker);
    //// map.setZoom(15);
    //// map.setCenter(marker.getPosition());
    return iw;
}

//// set the map on all markers i nteh array
function setMapOnAll(map){
    for (var i=0; i < markers.length; i++){
        markers[i].val.setMap(map);
    }
    
}

//// show all the markers in the list
function clearMarkers(){
    setMapOnAll(null);
    markers= [];
}

//// stop marker animation
function stopAnimation(marker) {
    setTimeout(function () {
        marker.setAnimation(null);
    }, 1000);
}

//////////////////////////////////////////////////////////
// models
var FoursquareVenue = function(data){
    this.id = data.id;
    this.name = data.name;
    this.contact = data.contact.phone;
}

var AddressData = function(addressData){
    this.id = addressData.id;
    this.location = addressData.location;
    this.addresss = addressData.address;;
    this.iwContentString = iwContentString;
}

// controllers
var app = angular.module('myApp', []);

// define enter key being pressed directive
var controller = app.directive('enterKey', function(){
    return function(scope, element, attrs){
        element.bind("keydown keypress", function(event){
            if(event.which ===13){
                scope.$apply(function(){
                    scope.$eval(attrs.enterKey);
                });
                event.preventDefault();
            }
        })
    }
});

app.controller("myController", function($scope){
    $scope.addressList = initialDataList;
    $scope.clickedAddressData = "";
    $scope.venues = [];
    $scope.venues_load_error = "";

    // $scope.markers = [];

    $scope.updateAddressList = function(){  
        var value = $scope.filterValue;
        
        if(value){
            console.log("filtervalue=", value);
            value = value.trim();
            var pattern = new RegExp(value, "i");
            $scope.addressList = initialDataList.filter(function(value){
                // console.log(value.address);
                if(pattern.exec(value.address)!=null){
                    return true;
                }

                return false;
            });



        } else{
            $scope.addressList = initialDataList;
        }

        // updat markers on the map
        clearMarkers();

        // console.log("add markers again!")
        $scope.addressList.forEach(function(data){
            var marker = $scope.addMarker(map, data);
            var latlng = data.location.lat+","+data.location.lng;
            markers.push({
                key: latlng,
                val: marker
            });
        
        });

        
    }

    // when click on address list item or marker, show infowindown
    $scope.showIW = function(data){
        // console.log("clicked in the list: " + data.address);
        $scope.clickedAddressData = data;
        var key = data.location.lat+","+data.location.lng;
        markers.forEach(function(item){
            if(item.key == key){
                marker_click_handler(item.val, data);
            }
        });

        setTimeout(function(){
            $scope.venues = venues_nearby;
        }, 500)

    }
    
});




        




