/* global google */

function initMap() {
    //var defaultPos = new google.maps.LatLng(4.632267, -74.178155);
    if (navigator.geolocation) {
        function exito(pos) {
            MuestraMapa(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            searchPlace();
        }

        function falla(error) {

            alert("Ud Sobre Ruedas, Desea Conocer Su Ubicación, Por Favor Valide La Configuración del GPS De Su Móvil");
            initMap();

        }

        var options = {
            maximumAge: 500000
            , enableHighAccuracy: true
            , timeout: 5000
        };
        navigator.geolocation.getCurrentPosition(exito, falla, options);
    } else {
        alert("Ud Sobre Ruedas, Desea Conocer Su Ubicación, Por Favor Valide La Configuración del GPS De Su Móvil");
        initMap();
    }

    function MuestraMapa(latlng) {
        var myOptions = {
            zoom: 16
            , center: latlng
            , zoomControl: false
            , scaleControl: false
            , mapTypeControl: true
            , mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
                , position: google.maps.ControlPosition.LEFT_BOTTOM
            }
            , rotateControl: true
        };
        posicionOrigen = latlng;
        var map = new google.maps.Map(document.getElementById('map'), myOptions);

        var marker = new google.maps.Marker({
            position: latlng
            , map: map
            , title: "Posción"
            , draggable: false
            , animation: google.maps.Animation.BOUNCE
        });

        addMarker = function (ubicacion) {
            var marker2 = new google.maps.Marker({
                map: map
                , position: ubicacion
            })
        }
        var options = {

            Country: 'Colombia'
        };

        searchPlace = function () {
            var search = document.getElementById('search');
            var searchBox = new google.maps.places.SearchBox(search);
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();
                places.forEach(function (place) {
                    var ubicacion = place.geometry.location;
                    addMarker(ubicacion);
                    map.setCenter(ubicacion);
                    //nuevo
                    var objConfigDR = {
                        map: map
                    }
                    var objConfigDS = {
                        origin: latlng
                        , destination: ubicacion
                        , travelMode: google.maps.TravelMode.DRIVING

                    }
                    posicionDestino = ubicacion;
                    var ds = new google.maps.DirectionsService();
                    var dr = new google.maps.DirectionsRenderer(objConfigDR);
                    ds.route(objConfigDS, fnRutear);

                    function fnRutear(result, estado) {
                        if (estado == "OK") {
                            dr.setDirections(result);
                            document.getElementById('inferior').style.visibility = "visible";
                        } else {
                            alert('error');
                        }
                    }
                })
            })
        }
        var infowindow;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'latLng': marker.getPosition()
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                address = results[0]['formatted_address'];
                localStorage.setItem("DesUbicacion", address);
                infowindow = new google.maps.InfoWindow({
                    position: latlng
                    , content: 'Su Posición Actual, Aprox.</br><p>' + address + '</p>Sus Coordenadas Actules</br><p>' + latlng + '</p>'
                });
            }
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
    }
}