/* global angular, $ionicSideMenuDelegate, facebookConnectPlugin, google */
//var objetos.data.host = 'http://186.155.146.245:8080';
angular.module('app.controllers', ['ionic'])

        .controller('rutasFavoritasCtrl', function ($scope, $http, $rootScope, $ionicLoading, $ionicPopup,
                $ionicPopover, objetos, $location) {

            $scope.searchPropertiesSearchModel = '';
            var url = objetos.data.host + '/UDSobreRuedas/services/SobreRuedas/creaActualizaRutas';
            $http({
                method: "POST",
                url: url,
                data: {
                    facebookID: window.localStorage.getItem("facebookId"),
                    codigoID: window.localStorage.getItem("codigoUD"),
                    metodoConsulta: "5"
                }
            }).then(function success(response) {
                $scope.myWelcome = response.data;
                console.log(response.data);
            }, function error(response) {
                $scope.myWelcome = response.statusText;
            });
            $scope.inicioRutas = function () {


            };
            var miUbicacion = {

            };
            var url = objetos.data.host + '/UDSobreRuedas/services/SobreRuedas/creaActualizaRutas';
            var consultaRutas = function () {
                $ionicLoading.show({});
                $http({
                    method: "POST",
                    url: url,
                    data: {
                        facebookID: window.localStorage.getItem("facebookId"),
                        codigoID: window.localStorage.getItem("codigoUD"),
                        metodoConsulta: 5
                    }
                }).then(function success(response) {
                    $ionicLoading.hide();
                    if (response.data.codigoError === 0) {
                        $scope.selectableRutas = response.data.rutas;
                    } /*else {
                     $ionicPopup.alert({
                     title: "Error: " + response.data.codigoError,
                     subTitle: response.data.msjError,
                     okType: 'button-energized'
                     
                     });
                     }*/


                }, function error(response) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Error En La Red: " + response.status,
                        subTitle: "Por Favor Valida Tu Configuración De Internet",
                        okType: 'button-energized'

                    });
                });
            };
            $scope.traceRuteUser = function () {
                var ptoPartida = new google.maps.LatLng(objetos.data.rutas.latitudPartida, objetos.data.rutas.longitudPartida);
                var ptoDestino = new google.maps.LatLng(objetos.data.rutas.latitudDestino, objetos.data.rutas.longitudDestino);
                traceRoute(ptoPartida, ptoDestino);
            };
            $scope.shoutLoudRutas = function (newValue, oldValue) {
                var ptoPartida = new google.maps.LatLng(newValue.latitudOrigen, newValue.longitudOrigen);
                var ptoDestino = new google.maps.LatLng(newValue.latitudDestino, newValue.longitudDestino);
                traceRoute(ptoPartida, ptoDestino);
            };
            /* $ionicModal.fromTemplateUrl('templates/Modals/registroRutasModal.html', {
             scope: $scope
             }).then(function (modal) {
             
             $scope.rutas = modal;
             animation: 'slide-in-up';
             });*/


            $scope.nuevaRuta = function () {
                $scope.popover.hide();
                $location.url("/userRoutes/registroRutas");
                /*
                 $scope.popover.hide();
                 $ionicPopup.show({
                 templateUrl: 'templates/Modals/creaRutaPopUp.html',
                 scope: $scope,
                 title: 'Crea Tu Nueva Ruta',
                 subTitle: 'Describe el Punto de Inicio y de Partida',
                 buttons: [{
                 text: 'Cancelar',
                 //type: 'button-positive',
                 onTap: function (e) {
                 
                 }
                 }, {
                 text: '<b>Guardar</b>',
                 type: 'button-energized',
                 onTap: function (e) {
                 var descRuta = document.getElementById('nombreRuta').value;
                 traceRoute();
                 if (descRuta === undefined) {
                 
                 } else {
                 
                 }
                 }
                 }]
                 
                 });*/
            };
            var traceRoute = function (origen, destino) {
                initMap();
                var directionDisplay = new google.maps.DirectionsRenderer({
                    map: $scope.map
                });
                var request = {
                    destination: destino,
                    origin: origen,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                var directioServices = new google.maps.DirectionsService();
                directioServices.route(request, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionDisplay.setDirections(response);
                    }
                });
            };
            $ionicPopover.fromTemplateUrl('templates/Modals/popOverMaps.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            var locateMeBtn = document.getElementById('locateMeBtn');
            var deleteBtn = document.getElementById('deleteBtn');
            var saveBtn = document.getElementById('saveBtn');
            var position = {
                lat: 4.632267,
                lng: -74.178155
            };
            var miUbicacion = {

            };
            initMap = function () {
                var mapDiv = document.getElementById('map');
                var myOptions = {
                    zoom: 16,
                    center: position,
                    zoomControl: false,
                    scaleControl: false,
                    mapTypeControl: true,
                    fullscreenControl: false,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
                    rotateControl: true
                };
                $scope.map = new google.maps.Map(mapDiv, myOptions);
                //$scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locateMeBtn);
                $scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(deleteBtn);
                $scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(saveBtn);
                $scope.locateMe();
                consultaRutas();
            };
            $scope.locateMe = function () {
                $ionicLoading.show({});
                var mapsOption = {
                    maximumAge: 500000,
                    enableHighAccuracy: true,
                    timeout: 5000
                };
                navigator.geolocation.getCurrentPosition(
                        function (pos) {

                            miUbicacion.lat = pos.coords.latitude;
                            miUbicacion.lng = pos.coords.longitude;
                            $scope.map.setCenter(miUbicacion);
                            addMarker(miUbicacion);
                            $ionicLoading.hide();
                        },
                        function (error) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Error en la Geolocalización',
                                templeate: error.message,
                                okType: 'button-energized'

                            });
                        }, mapsOption);
            };
            addMarker = function (ubicacion) {
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: ubicacion
                });
            };
            var layer;
            $scope.change = function () {
                $scope.value = !$scope.value;
                if ($scope.value) {
                    $scope.showTraffic();
                } else {
                    $scope.clearLayer();
                }
            };
            $scope.clearLayer = function () {
                layer.setMap(null);
            };
            $scope.showTraffic = function () {
                layer = new google.maps.TrafficLayer();
                layer.setMap($scope.map);
            };
            if (document.readyState === "complete") {
                initMap();
            } else {
                google.maps.event.addDomListener(window, "load", initMap);
            }

            $scope.refrescarRutas = function () {
                $scope.popover.hide();
                consultaRutas();
            };
        })

        .controller('crearRutaCtrl', function ($scope, $stateParams, $ionicPlatform, objetos) {
            console.log("crearRutaCtrl");
            $scope.searchPlaceOrigen = function () {
                var search = document.getElementById('searchOrigen');
                var searchBox = new google.maps.places.SearchBox(search);
                searchBox.addListener('places_changed', function () {
                    var places = searchBox.getPlaces();
                    places.forEach(function (place) {
                        //objetos.data.rutaOrigen.name = document.getElementById('searchOrigen').value;
                        objetos.data.ptoOrigen = place.geometry.location;
                    });
                });
            };
            $scope.searchPlaceDestino = function () {
                var search = document.getElementById('searchDestino');
                var searchBox = new google.maps.places.SearchBox(search);
                searchBox.addListener('places_changed', function () {
                    var places = searchBox.getPlaces();
                    places.forEach(function (place) {
                        //objetos.data.rutaDestino.name = document.getElementById('searchDestino').value;
                        objetos.data.ptoDestino = place.geometry.location;
                    });
                });
            };
            var marker = new google.maps.Marker({
                position: miUbicacion,
                map: $scope.map,
                title: "Posción",
                draggable: false,
                animation: google.maps.Animation.BOUNCE
            });
            var miUbicacion = {

            };
            $scope.ubicaDir = function () {
                console.log("ubicaDir");
            };
            var searchOrigen;
            $ionicPlatform.ready(function () {
                searchOrigen = document.getElementById('searchOrigen');
                console.log(searchOrigen);
                $scope.searchPlaceOrigen();
                $scope.searchPlaceDestino();
            });
        })

        .controller('modoDeViajeCtrl', function ($scope, objetos, $ionicPopover, $rootScope, $http, $ionicLoading, $ionicPopup) {
            $rootScope.toggledrag = true;
            var fecha = new Date();
            var dia = fecha.getDate();
            var mes = fecha.getMonth() + 1;
            var request = {};
            //var año = fecha.getFullYear();
            // var hora = fecha.getHours();
            //var min = fecha.getMinutes();
            //var seg = fecha.getSeconds();
            var urlRutas = objetos.data.host + '/UDSobreRuedas/services/SobreRuedas/creaActualizaRutas';
            var urlVehiculos = objetos.data.host + '/UDSobreRuedas/services/SobreRuedas/registroVehiculo';
            var urlConsultaViaje = objetos.data.host + '/UDSobreRuedas/services/SobreRuedas/consultaCreaActualizaViaje';
            if (dia < 10) {
                dia = '0' + dia;
            }
            if (mes < 10) {
                mes = '0' + mes;
            }
            $scope.calendario = fecha; //año+'-'+mes+'-'+dia;
            $scope.hora = fecha;
            $scope.modoViaje = [{
                    name: "PIE",
                    value: 1
                }, {
                    name: "CICLA",
                    value: 2
                }, {
                    name: "MOTO",
                    value: 3
                }, {
                    name: "CARRO",
                    value: 4
                }];
            $scope.modoViajeSelect = $scope.modoViaje[0];
            $scope.searchCarModel = '';
            $scope.searchPropertiesSearchModel = '';
            $ionicPopover.fromTemplateUrl('templates/Modals/popOverModoViaje.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            var rutaSeleccionada = "";
            var vehiculoSeleccionado = "";
            var longitudVehiculos;
            var longitudRutas;
            var getFecha;
            var getHora;
            $scope.actualizaViaje = function () {
                //console.log($scope.searchPropertiesSearchModel);
                getFecha = document.getElementById('fecha').value;
                if (document.getElementById('hora').value.length <= 5) {
                    getHora = document.getElementById('hora').value + ':00';
                } else {
                    getHora = document.getElementById('hora').value;
                }
                if (rutaSeleccionada === "") {
                    if ($scope.searchPropertiesSearchModel === "") {
                        $ionicPopup.alert({
                            title: "Error: Datos",
                            subTitle: "Debes Seleccionar Una Ruta",
                            okType: 'button-energized'

                        });
                    } else {
                        rutaSeleccionada = $scope.searchPropertiesSearchModel;
                        if (document.getElementById('tipoViaje').value == 3 || document.getElementById('tipoViaje').value == 4) {
                            if (vehiculoSeleccionado === "") {
                                if ($scope.searchCarModel === "") {
                                    $ionicPopup.alert({
                                        title: "Error: Datos",
                                        subTitle: "Debes Seleccionar Una Vehículo",
                                        okType: 'button-energized'

                                    });
                                } else {
                                    vehiculoSeleccionado = $scope.searchCarModel;
                                    consultaVehiculosRutas(1, urlConsultaViaje);
                                }
                            } else {
                                consultaVehiculosRutas(1, urlConsultaViaje);
                            }
                        } else {
                            consultaVehiculosRutas(1, urlConsultaViaje);
                        }
                    }
                } else {
                    if (document.getElementById('tipoViaje').value == 3 || document.getElementById('tipoViaje').value == 4) {
                        if (vehiculoSeleccionado === "") {
                            if ($scope.searchCarModel === "") {
                                $ionicPopup.alert({
                                    title: "Error: Datos",
                                    subTitle: "Debes Seleccionar Una Vehículo",
                                    okType: 'button-energized'

                                });
                            } else {
                                vehiculoSeleccionado = $scope.searchCarModel;
                                consultaVehiculosRutas(1, urlConsultaViaje);
                            }
                        } else {
                            consultaVehiculosRutas(1, urlConsultaViaje);
                        }
                    } else {
                        consultaVehiculosRutas(1, urlConsultaViaje);
                    }
                }

            };
            $scope.shoutLoudRuta = function (newValuea, oldValue) {
                rutaSeleccionada = newValuea;
                //console.log("changed from " + JSON.stringify(oldValue) + " to " + JSON.stringify(newValuea));
            };
            $scope.shoutLoudVehiculo = function (newValuea, oldValue) {
                vehiculoSeleccionado = newValuea;
                //console.log("changed from " + JSON.stringify(oldValue) + " to " + JSON.stringify(newValuea));
            };
            var consultaVehiculosRutas = function (metodo, url) {
                $ionicLoading.show({});
                switch (metodo) {
                    case 3:
                        request = {
                            facebookID: window.localStorage.getItem("facebookId"),
                            codigoID: window.localStorage.getItem("codigoUD"),
                            metodoConsulta: metodo
                        };
                        break;
                    case 5:
                        request = {
                            facebookID: window.localStorage.getItem("facebookId"),
                            codigoID: window.localStorage.getItem("codigoUD"),
                            metodoConsulta: metodo
                        };
                        break;
                    case 2:
                        request = {
                            facebookID: window.localStorage.getItem("facebookId"),
                            codigoID: window.localStorage.getItem("codigoUD"),
                            metodo: metodo
                        };
                        break;
                    case 1:

                        request = {
                            facebookID: window.localStorage.getItem("facebookId"),
                            codigoID: window.localStorage.getItem("codigoUD"),
                            nombreUsuario: window.localStorage.getItem("Name"),
                            grupoFacebookID: "1640356149585169",
                            grupoFacebookDesc: "UD Sobre Ruedas",
                            descripcionViaje: rutaSeleccionada.descRuta,
                            observacionFlag: document.getElementById('toggleObservacion').value = true ? 1 : 0,
                            observacionDesc: document.getElementById('observacionTxt').value,
                            fechaViaje: getFecha + 'T' + getHora,
                            longitudPartida: rutaSeleccionada.longitudOrigen,
                            latitudPartida: rutaSeleccionada.latitudOrigen,
                            longitudDestino: rutaSeleccionada.longitudDestino,
                            latitudDestino: rutaSeleccionada.latitudDestino,
                            modoViaje: document.getElementById('tipoViaje').value, //$scope.modoViajeSelect.value,
                            placaVehiculo: vehiculoSeleccionado.placa,
                            direccionParitda: rutaSeleccionada.descOrigen,
                            direccionDestino: rutaSeleccionada.descDestino,
                            imgPerfilFacebook: "http://graph.facebook.com/" + window.localStorage.getItem("facebookId") + "/picture?type=large",
                            nombreRuta: rutaSeleccionada.nombreRuta,
                            metodo: metodo
                        };

                        break;
                    default:
                        break;
                }
                $http({
                    method: "POST",
                    url: url,
                    data: request
                }).then(function success(response) {
                    $ionicLoading.hide();
                    if (response.data.codigoError === 0) {
                        switch (metodo) {
                            case 3:

                                $scope.selectableNamesCar = response.data.vehiculosReg;
                                longitudVehiculos = response.data.vehiculosReg.length;
                                //console.log("rutas: "+$scope.searchPropertiesSearchModel);
                                break;
                            case 5:
                                $scope.selectableNames = response.data.rutas;
                                longitudRutas = response.data.rutas.length;
                                //console.log("carros: "+$scope.searchCarModel);
                                break;
                            case 2:
                                $scope.calendario = new Date(response.data.viajes.fechaViaje);
                                $scope.hora = new Date(response.data.viajes.fechaViaje);
                                $scope.modoViajeSelect = $scope.modoViaje[response.data.viajes.modoViaje - 1];
                                $scope.modoViajeSelect.value = response.data.viajes.modoViaje;
                                if (response.data.viajes.modoViaje === 3 || response.data.viajes.modoViaje === 4) {

                                    for (var i = 0; i < longitudVehiculos; i++) {
                                        if ($scope.selectableNamesCar[i].placa === response.data.viajes.placaVehiculo) {
                                            $scope.searchCarModel = $scope.selectableNamesCar[i];
                                            break;
                                        }
                                    }
                                }
                                if (response.data.viajes.observacionFlag === 1) {
                                    $scope.condicion = true;
                                    $scope.condicionText = response.data.viajes.observacionDesc;
                                } else {
                                    $scope.condicion = false;
                                }
                                //console.log("Consulta Rutas"+$scope.selectableNames);

                                for (var j = 0; j < longitudRutas; j++) {
                                    if ($scope.selectableNames[j].nombreRuta === response.data.viajes.nombreRuta) {
                                        $scope.searchPropertiesSearchModel = $scope.selectableNames[j];
                                        break;
                                    }
                                }

                                break;
                            case 1:
                                $ionicPopup.alert({
                                    title: "OK",
                                    subTitle: response.data.msjError,
                                    okType: 'button-energized'

                                });
                                //var fecha = Date.parse(getFecha + 'T' + getHora);
                                //console.log("Fecha Timesptamp = "+getFecha);
                                window.localStorage.setItem("modoViaje", document.getElementById('tipoViaje').value);
                                window.localStorage.setItem("fechaViaje", getFecha);
                                break;
                            default:
                                break;
                        }
                    } /*else {
                     $ionicPopup.alert({
                     title: "Error: " + response.data.codigoError,
                     subTitle: response.data.msjError,
                     okType: 'button-energized'
                     
                     });
                     }*/
                    console.log(response.data);
                }, function error(response) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Error: " + response.status,
                        subTitle: response.statusText,
                        okType: 'button-energized'

                    });
                });
            };
            $scope.consultaRutas = function () {
                $scope.popover.hide();
                consultaVehiculosRutas(5, urlRutas);
            };
            $scope.consultaVehiculos = function () {
                $scope.popover.hide();
                consultaVehiculosRutas(3, urlVehiculos);
            };
            consultaVehiculosRutas(5, urlRutas);
            consultaVehiculosRutas(3, urlVehiculos);
            consultaVehiculosRutas(2, urlConsultaViaje);
        })

        .controller('ajustesCtrl', function ($scope, objetos, $rootScope, $http, $ionicLoading, $ionicPopup, $ionicPopover) {
            $rootScope.toggledrag = true;
            $scope.origen = 0;
            $scope.destino = 0;
            var url = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/consultaConfiguracion";
            var rutaFavorita;
            var modoViaje;
            var placa;
            var puestosDisponibles;
            var consulta = function () {
                $ionicLoading.show({});
                $http({
                    method: "POST",
                    url: url,
                    data: {
                        facebookID: window.localStorage.getItem("facebookId"),
                        codigoID: window.localStorage.getItem("codigoUD")

                    }
                }).then(function success(response) {
                    $ionicLoading.hide();
                    if (response.data.codigoError === 0) {
                        $scope.respuesta = [response.data.notificaciones];
                        $scope.origen = response.data.notificaciones.filtroOrigenMts;
                        $scope.destino = response.data.notificaciones.filtroDestinoMts;
                        rutaFavorita = response.data.notificaciones.rutaFavorita;
                        modoViaje = response.data.notificaciones.modoViaje;
                        placa = response.data.notificaciones.placa;
                        puestosDisponibles = response.data.notificaciones.puestosDisponibles;
                        console.log($scope.respuesta);
                    } /*else {
                     $ionicPopup.alert({
                     title: "Error: " + response.data.codigoError,
                     subTitle: response.data.msjError,
                     okType: 'button-energized'
                     
                     });
                     }*/


                }, function error(response) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Error En La Red: " + response.status,
                        subTitle: "Por Favor Valida Tu Configuración De Internet",
                        okType: 'button-energized'

                    });
                });
            };
            $ionicPopover.fromTemplateUrl('templates/Modals/popOverUsuarios.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            consulta();
            $scope.consultaUsuario = function () {
                $scope.popover.hide();
                consulta();
            };
            $scope.actualizaDatos = function () {
                $ionicLoading.show({});
                var correo = document.getElementById("correo").value;
                var telefono = document.getElementById("telefono").value;
                var nombreUsuario = document.getElementById("nombre").value;
                var filtroOrigen = document.getElementById("filtroOrigen").value;
                var filtroDestino = document.getElementById("filtroDestino").value;
                var urlActualiza = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/creaActualizaConfiguracion";
                $http({
                    method: "POST",
                    url: urlActualiza,
                    data: {
                        facebookID: window.localStorage.getItem("facebookId"),
                        codigoID: window.localStorage.getItem("codigoUD"),
                        correoContacto: correo,
                        telefonoContacto: telefono,
                        nombreUsuario: nombreUsuario,
                        filtroOrigenMts: filtroOrigen,
                        filtroDestinoMts: filtroDestino,
                        puestosDisponibles: puestosDisponibles,
                        placa: placa,
                        modoViaje: modoViaje,
                        rutaFavorita: rutaFavorita

                    }
                }).then(function success(response) {
                    $ionicLoading.hide();
                    if (response.data.codigoError === 0) {
                        $ionicPopup.alert({
                            title: "OK",
                            subTitle: response.data.msjError,
                            okType: 'button-energized'

                        });
                        console.log($scope.respuesta);
                    } /*else {
                     $ionicPopup.alert({
                     title: "Error: " + response.data.codigoError,
                     subTitle: response.data.msjError,
                     okType: 'button-energized'
                     
                     });
                     }*/


                }, function error(response) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Error En La Red: " + response.status,
                        subTitle: "Por Favor Valida Tu Configuración De Internet",
                        okType: 'button-energized'

                    });
                });
            };
        })


        .controller('loginCtrl', function ($rootScope, $http, $scope, $state, $ionicLoading, $ionicPopup, $ionicModal, objetos, $location) {
//            console.log("loginCtrl");
//            var validaIngreso = window.localStorage.getItem("ingresoFB");
//            var facebookId;
//            var codigoId;
//            var cerrarCodigo = false;
//            var popup;
//            var codigoUD;
            $scope.logOut = function () {
                $rootScope.toggledrag = false;
                facebookConnectPlugin.logout(function (response) {
                    //alert(JSON.stringify(response));
                    window.localStorage.setItem("ingresoFB", "0");
                    location.href = "#/login";
                },
                        function (response) {
                            alert(JSON.stringify(response));
                        });
            };
            /*if (validaIngreso ==="1"){
             $state.go('uDSobreRuedas.uDSobreRuedas2');
             }*/
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $ionicLoading.hide();
            $rootScope.toggledrag = false;
            var urlInicioSesion = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/inicioSesion";
            var urlValidaUsuario = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/validaUsuario";
            var urlConfiguracion = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/creaActualizaConfiguracion";
            /*
             * Se valida cuando cargue la aplicación, que previamente ya se haya invocado el metodo login()
             */
            var invocaService = function (url, request, metodo) {
                $http({
                    method: "POST",
                    url: url,
                    data: request
                }).then(function success(response) {

                    switch (metodo) {
                        case 1:
                            $ionicLoading.hide();
                            if (response.data.acceso) {
                                if (response.data.codigoError === 0 && response.data.validaCodigo === false) {
                                    window.localStorage.setItem("facebookID", response.data.facebookID);
                                    window.localStorage.setItem("codigoUD", response.data.codigoID);
                                    objetos.data.codigoId = response.data.codigoID;
                                    objetos.data.facebookId = response.data.facebookID;
                                    window.localStorage.setItem("ingresoFB", "1");
                                    $state.go('uDSobreRuedas.uDSobreRuedas2');
                                } else if (response.data.validaCodigo) {
                                    creaCodigo();
                                } /*else {
                                 $ionicPopup.alert({
                                 title: "Error: " + response.data.codigoError,
                                 subTitle: response.data.msjError,
                                 okType: 'button-energized'
                                 
                                 });
                                 }*/
                            } else {

                                $ionicPopup.alert({
                                    title: "Error: " + response.data.codigoError,
                                    subTitle: response.data.msjError,
                                    okType: 'button-energized'

                                });
                            }
                            break;
                        case 2:
                            $ionicLoading.hide();
                            if (response.data.codError === 0) {
                                window.localStorage.setItem("ingresoFB", "1");
                                datosPersonales();
                                //popup.close();
                            } else {
                                $ionicPopup.alert({
                                    title: response.data.codError !== 0 ? "Error: " + response.data.codError : "OK",
                                    subTitle: response.data.msjError,
                                    okType: 'button-energized'

                                });
                                creaCodigo();
                            }
                            break;
                        case 3:
                            $ionicLoading.hide();
                            if (response.data.codigoError === 0) {
                                $state.go('uDSobreRuedas.uDSobreRuedas2');

                            } else {
                                $ionicPopup.alert({
                                    title: response.data.codError !== 0 ? "Error: " + response.data.codError : "OK",
                                    subTitle: response.data.msjError,
                                    okType: 'button-energized'

                                });
                            }

                            $ionicPopup.alert({
                                title: response.data.codigoError !== 0 ? "Error: " + response.data.codigoError : "OK",
                                subTitle: response.data.msjError,
                                okType: 'button-energized'

                            });
                            break;
                        default:
                            break;
                    }
                }, function error(response) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Error En La Red: " + response.status,
                        subTitle: "Por Favor Valida Tu Configuración De Internet",
                        okType: 'button-energized'

                    });
                });
            };
            $scope.loginFB = function () {

                $ionicLoading.show();
                if (!window.cordova) {
                    //alert("Ingresa al 1 er IF");
                    var appId = "162991017845696";
                    var version = "v2.12";
                    facebookConnectPlugin.browserInit(appId, version);
                    //alert(FB);
                    //alert("termino plugin");
                }

                //alert("ingresa al Login");
                facebookConnectPlugin.login(["public_profile"],
                        function (response) {
                            //document.getElementById('load').style.display = 'block';
                            //var data = JSON.stringify(response);

                            console.log(JSON.stringify(response));
                            window.localStorage.setItem("token", response.authResponse.accessToken);
                            window.localStorage.setItem("userID", response.authResponse.userID);
                            if (response.status === 'connected') {
                                //window.localStorage.setItem("primerIngreso", "1");
//                                $ionicLoading.hide();
//                                $ionicHistory.clearHistory();
//                                $rootScope.toggledrag = true;
//                                alert(response.authResponse.userID);
//                                alert(JSON.stringify(response));
//                                accesToken = response.authResponse.accessToken;
//                                var limite = 2000;
                                //creacionCodigo("1640356149585169", accesToken, limite);

                                $http({
                                    method: 'GET',
                                    url: "https://graph.facebook.com/v2.12/me?access_token=" + response.authResponse.accessToken
                                            + "&fields=name,email"
                                }).then(function successCallback(response) {
                                    //alert(JSON.stringify(response));
                                    window.localStorage.setItem("Name", response.data.name);
                                    objetos.data.name = response.data.name;
                                    document.getElementById("nombreFacebook").innerHTML = response.data.name;
                                    window.localStorage.setItem("email", response.data.email);
                                    objetos.data.email = response.data.email;
                                }, function errorCallback(response) {
                                    //alert(JSON.stringify("MAL " + response));
                                    // called asynchronously if an error occurs
                                    // or server returns response with an error status.
                                });
                                document.getElementById("imagenPerfil").src = "http://graph.facebook.com/" + window.localStorage.getItem("facebookId") + "/picture?type=large";
                                document.getElementById("nombreFacebook").innerHTML = window.localStorage.getItem("Name");
                                document.getElementById("codigoUd").innerHTML = window.localStorage.getItem("codigoUD");
                                window.localStorage.setItem("facebookId", response.authResponse.userID)
                                creacionCodigo(response.authResponse.userID, response.authResponse.accessToken);

                                /// onDeviceReady();
                                //getStatus();
                            } else {
                                localStorage.setItem("primerIngreso", "0");
                                $ionicLoading.hide();
                                //document.getElementById('load').style.display = 'none';
                            }
                            //alert(JSON.stringify(response));
                        },
                        function (response) {
                            $ionicLoading.hide();
                            console.log(response);
                            //alert(JSON.stringify(response));
                        });
            };
            var creacionCodigo = function (facebookID, accessToken) {
//                $http({
//                    method: 'GET',
//                    url: "https://graph.facebook.com/v2.12/me?access_token=" + tokenFB + "&fields=groups"
//                }).then(function successCallback(response) {
//                    alert(JSON.stringify(response));
//                }, function errorCallback(response) {
//                    alert(JSON.stringify("MAL " + response));
//                    // called asynchronously if an error occurs
//                    // or server returns response with an error status.
//                });


                var requestInicioSesion = {
                    facebookID: facebookID,
                    nameFacebook: window.localStorage.getItem("Name"),
                    accesToken: accessToken,
                    administradorFlag: false,
                    metodo: "2"

                };
                invocaService(urlInicioSesion, requestInicioSesion, 1);


            };
            $ionicModal.fromTemplateUrl('templates/Modals/terminosCondiciones.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.terms = modal;
                animation: 'slide-in-up';
            });
            var api = function () {

                facebookConnectPlugin.api("me/?fields=id,picture,name,email,groups", ["public_profile"],
                        function (response) {
                            return response;
                            alert("BIEN" + JSON.stringify(response));
                        },
                        function (response) {
                            //document.getElementById('load').style.display = 'none';
                            alert("OOOpsss Error: " + response.error.code, response.error.message);
                        });
                document.getElementById("imagenPerfil").src = "http://graph.facebook.com/" + window.localStorage.getItem("facebookId") + "/picture?type=large";
                document.getElementById("nombreFacebook").innerHTML = window.localStorage.getItem("Name");
                document.getElementById("codigoUd").innerHTML = window.localStorage.getItem("codigoUD");

            };
            var enviarCodigo = function (codigoUD) {

                // = document.getElementById("codigoUD").value;
                if (isNaN(codigoUD) || codigoUD.length >= 12 || codigoUD <= 20000000000) {
                    $ionicPopup.alert({
                        title: "Error",
                        subTitle: "Por Favor Valida Los Datos Ingresados",
                        okType: 'button-energized'

                    }).then(function (res) {
                        //console.log('Thank you for not eating my delicious ice cream cone');
                        creaCodigo();
                    });

                } else {
                    var virtual = 1;
                    /*if (device.isVirtual === "VALUE_FALSE") {
                     virtual = 0;
                     }*/
                    var requestValidaInicio = {
                        idFacebook: window.localStorage.getItem("facebookId"),
                        idCodigo: codigoUD,
                        idPhone: codigoUD + "-" + window.localStorage.getItem("facebookId"),
                        idGrupo: "1640356149585169",
                        modelPhone: device.model,
                        nombreUsuario: window.localStorage.getItem("Name"),
                        ipUsuario: "192.168.0.30",
                        uuidPhone: device.uuid,
                        platformPhone: device.platform,
                        versionPhone: device.version,
                        manufacturePhone: device.manufacturer,
                        isVirtualPhone: virtual,
                        serialPhone: device.serial
                    };
                    objetos.data.codigoId = codigoUD;
                    objetos.data.facebookId = window.localStorage.getItem("facebookId");
                    window.localStorage.setItem("codigoUD", codigoUD);
                    document.getElementById("codigoUd").innerHTML = codigoUD;
                    invocaService(urlValidaUsuario, requestValidaInicio, 2);

                }
            };
            var datosPersonales = function () {
                var requestDatos = {
                    facebookID: window.localStorage.getItem("facebookId"),
                    codigoID: window.localStorage.getItem("codigoUD"),
                    rutaFavorita: "",
                    modoViaje: "1",
                    placa: "",
                    puestosDisponibles: "",
                    correoContacto: window.localStorage.getItem("email"),
                    telefonoContacto: "+57",
                    filtroOrigenMts: "0",
                    filtroDestinoMts: "0",
                    nombreUsuario: window.localStorage.getItem("Name")
                };
                invocaService(urlConfiguracion, requestDatos, 3);
            };
            var creaCodigo = function () {
                $ionicPopup.prompt({
                    title: 'CÓDIGO U DISTRITAL',
                    subTitle: 'Ingresa Tu Código De La Universidad',
                    inputType: 'tel',
                    inputPlaceholder: 'Código UD',
                    okType: 'button-energized'
                }).then(function (res) {
                    //console.log('Your name is', res);
                    enviarCodigo(res);
                });
//                popup = $ionicPopup.show({
//                    templateUrl: 'templates/Modals/creaCodigoIDPopUp.html',
//                    scope: $scope,
//                    title: "INGRESA TU CÓDIGO",
//                    buttons: [{
//                            text: 'Aceptar',
//                            type: 'button-energized',
//                            //type: 'button-positive',
//                            onTap: function (e) {
//                                //enviarCodigo();
//                            }
//                        }]
//                });
            };

        })

        .controller('uDSobreRuedas2Ctrl', function ($rootScope, $scope, $ionicPopup, $ionicLoading, $http, objetos, $ionicPopover, $location, $state) {
            $rootScope.toggledrag = true;
            document.getElementById("imagenPerfil").src = "http://graph.facebook.com/" + window.localStorage.getItem("facebookId") + "/picture?type=large";
            document.getElementById("nombreFacebook").innerHTML = window.localStorage.getItem("Name");
            document.getElementById("codigoUd").innerHTML = window.localStorage.getItem("codigoUD");
            var fecha = new Date();
            var dia = fecha.getDate();
            var mes = fecha.getMonth() + 1;
            var anio = fecha.getFullYear();
            var urlConsultaViajes = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/consultaViajes";
            //var urlConsultaRutas = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/creaActualizaRutas";
            var validaNavegacion = function () {
                if (window.localStorage.getItem("fechaViaje") == 'undefined' || window.localStorage.getItem("fechaViaje") == null) {
                    $state.go('uDSobreRuedas.registroRutas');
                } else {
                    if (dia < 10) {
                        dia = '0' + dia;
                    }
                    if (mes < 10) {
                        mes = '0' + mes;
                    }
                    var fechaViaje = Date.parse(window.localStorage.getItem("fechaViaje"));
                    var fechaActual = Date.parse(anio + "-" + mes + "-" + dia);
                    if (fechaViaje < fechaActual) {
                        $state.go('uDSobreRuedas.modoDeViaje');
                    } else {
                        var req = {
                            facebookID: window.localStorage.getItem("facebookId"),
                            codigoID: window.localStorage.getItem("codigoUD"),
                            modoViaje: window.localStorage.getItem("modoViaje")
                        };
                        consulta(urlConsultaViajes, req)
                    }
                }
            };
            //var fechaViaje = Date.parse(window.localStorage.getItem("fechaViaje"));


            var titulo;
            var mensaje;
            var consulta = function (url, request) {
                $ionicLoading.show({});
                $http({
                    method: "POST",
                    url: url,
                    data: request
                }).then(function success(response) {
                    $ionicLoading.hide();
                    if (response.data.codigoError === 0) {
                        $scope.respuesta = response.data.viajes;
                        console.log($scope.respuesta);
                    } else {
                        $scope.respuesta = [];
                        titulo = response.data.codigoError;
                        mensaje = response.data.msjError;
                        $ionicPopup.alert({
                            title: titulo,
                            subTitle: mensaje,
                            okType: 'button-energized'

                        });
                    }


                }, function error(response) {
                    $ionicLoading.hide();
                    titulo = "Error En La Red: " + response.status;
                    mensaje = "Por Favor Valida Tu Configuración De Internet";
                    $ionicPopup.alert({
                        title: titulo,
                        subTitle: mensaje,
                        okType: 'button-energized'

                    });
                });
            };
            $scope.verImgenPerfil = function (imagen, nombre) {
                $ionicPopup.show({
                    template: '<img src = "http://graph.facebook.com/' + imagen + '/picture?type=large"' + '" style="width: 100%;">',
                    scope: $scope,
                    title: nombre,
                    buttons: [{
                            text: 'Cerrar',
                            type: 'button-energized',
                            //type: 'button-positive',
                            onTap: function (e) {

                            }
                        }]

                });
            };
            $ionicPopover.fromTemplateUrl('templates/Modals/popOverUsuarios.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            $scope.detalleUsuario = function (facebookId, codigoId) {
                objetos.data.usuario.facebookID = facebookId;
                objetos.data.usuario.codigoID = codigoId;
                objetos.data.usuario.tipoConsulta = 1;
                $location.url("/userRoutes/user");
            };
            validaNavegacion();
            $scope.consultaUsuario = function () {
                $scope.popover.hide();
                validaNavegacion();
            };
        })

        .controller('usuarioCtrl', function ($scope, objetos, $ionicPopup, $ionicLoading, $http, $ionicConfig, $location, $rootScope) {
            $ionicConfig.backButton.text("");
            var usuario = {};
            $ionicLoading.show();
            usuario.facebook = objetos.data.usuario.facebookID;
            usuario.codigo = objetos.data.usuario.codigoID;
            var respuesta = {};
            var request = {};
            var urlCreaActualizaViaje = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/consultaCreaActualizaViaje";
            var urlSolicitudPendiente = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/solicitudesPendientes";
            var urlConfirmacion = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/solicitudesConfirmadas";
            var invocacionService = function (metodo, url) {
                var invocacionFlag = false;
                switch (metodo) {
                    case 2:
                        request = {
                            facebookID: usuario.facebook,
                            codigoID: usuario.codigo,
                            metodo: 2
                        };
                        invocacionFlag = true;
                        break;
                    case 1:
                        request = {
                            facebookID: usuario.facebook,
                            codigoID: usuario.codigo,
                            solicitanteCodeID: objetos.data.codigoId,
                            nombreSolicitante: respuesta.nombreUsuario,
                            imgFacebookSolicitante: respuesta.imgPerfilFacebook,
                            descRutaSolicitante: respuesta.descripcionViaje,
                            flagObsevacion: respuesta.observacionFlag,
                            descObservacionSol: respuesta.observacionDesc,
                            fechaPartida: respuesta.fechaViajeFormat,
                            metodo: "1"
                        };
                        invocacionFlag = true;
                        break;
                    case 3:
                        request = {
                            facebookID: usuario.facebook,
                            codigoID: usuario.codigo,
                            confirmanteCodeID: objetos.data.codigoId,
                            nombreConfirmante: respuesta.nombreUsuario,
                            imgFacebookConfirmante: respuesta.imgPerfilFacebook,
                            descRutaConfirmante: respuesta.descripcionViaje,
                            flagObsevacion: respuesta.observacionFlag,
                            descObservacionConfirm: respuesta.observacionDesc,
                            fechaPartida: respuesta.fechaViajeFormat,
                            metodo: "1"
                        };
                        invocacionFlag = true;
                        break;
                    case 4:
                        request = {
                            facebookID: usuario.facebook,
                            codigoID: usuario.codigo,
                            solicitanteCodeID: objetos.data.codigoId,
                            nombreSolicitante: respuesta.nombreUsuario,
                            imgFacebookSolicitante: respuesta.imgPerfilFacebook,
                            descRutaSolicitante: respuesta.descripcionViaje,
                            flagObsevacion: respuesta.observacionFlag,
                            descObservacionSol: respuesta.observacionDesc,
                            fechaPartida: respuesta.fechaViajeFormat,
                            metodo: "2"
                        };
                        break;
                    default:
                        invocacionFlag = false;
                        break;
                }
                if (invocacionFlag) {
                    $http({
                        method: "POST",
                        url: url,
                        data: request
                    }).then(function success(response) {
                        switch (metodo) {
                            case 2:
                                $ionicLoading.hide();
                                if (response.data.codigoError === 0) {
                                    //respuesta.grupoFacebookID = response.data.viajes.grupoFacebookID;
                                    //respuesta.grupoFacebookDesc = response.data.viajes.grupoFacebookDesc;
                                    respuesta.descripcionViaje = response.data.viajes.descripcionViaje;
                                    respuesta.observacionFlag = response.data.viajes.observacionFlag;
                                    respuesta.observacionDesc = response.data.viajes.observacionDesc;
                                    respuesta.fechaViaje = response.data.viajes.fechaViaje;
                                    var fecha = new Date(response.data.viajes.fechaViaje);
                                    $scope.fecha = fecha;
                                    respuesta.fechaViajeFormat = fecha;
                                    //respuesta.fechaActual = response.data.viajes.fechaActual;
                                    respuesta.longitudPartida = response.data.viajes.longitudPartida;
                                    respuesta.latitudPartida = response.data.viajes.latitudPartida;
                                    respuesta.longitudDestino = response.data.viajes.longitudDestino;
                                    respuesta.latitudDestino = response.data.viajes.latitudDestino;
                                    respuesta.modoViaje = response.data.viajes.modoViaje;
                                    respuesta.placaVehiculo = response.data.viajes.placaVehiculo;
                                    respuesta.direccionParitda = response.data.viajes.direccionParitda;
                                    respuesta.direccionDestino = response.data.viajes.direccionDestino;
                                    respuesta.imgPerfilFacebook = response.data.viajes.imgPerfilFacebook;
                                    datosPersonales();
                                } else {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: response.data.codigoError,
                                        subTitle: response.data.msjError,
                                        okType: 'button-energized'

                                    });
                                }
                                break;
                            case 1:
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: response.data.codigoError !== 0 ? "Error: " + response.data.codigoError : "OK",
                                    subTitle: response.data.msjError,
                                    okType: 'button-energized'

                                });
                                break;
                            case 3:
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: response.data.codigoError !== 0 ? "Error: " + response.data.codigoError : "OK",
                                    subTitle: response.data.msjError,
                                    okType: 'button-energized'

                                });
                                if (response.data.codigoError === 0) {
                                    invocacionService(4, urlSolicitudPendiente);
                                }
                                break;
                            default:
                                break;
                        }
                    }, function error(response) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: "Error En La Red: " + response.status,
                            subTitle: "Por Favor Valida Tu Configuración De Internet",
                            okType: 'button-energized'

                        });
                    });
                }
            };
            var urlDatosPersonales = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/consultaConfiguracion";
            var datosPersonales = function () {
                $http({
                    method: "POST",
                    url: urlDatosPersonales,
                    data: {
                        facebookID: usuario.facebook,
                        codigoID: usuario.codigo

                    }
                }).then(function success(response) {

                    $ionicLoading.hide();
                    if (response.data.codigoError === 0) {
                        respuesta.correoContacto = response.data.notificaciones.correoContacto;
                        respuesta.telefonoContacto = response.data.notificaciones.telefonoContacto;
                        respuesta.nombreUsuario = response.data.notificaciones.nombreUsuario;
                        respuesta.puestosDisponibles = response.data.notificaciones.puestosDisponibles;
                        respuesta.rutaFavorita = response.data.notificaciones.rutaFavorita;
                        respuesta.tipoConsulta = objetos.data.usuario.tipoConsulta;
                        $scope.datosUsuarios = [respuesta];
                        console.log($scope.respuesta);
                    } /*else {
                     $ionicPopup.alert({
                     title: "Error: " + response.data.codigoError,
                     subTitle: response.data.msjError,
                     okType: 'button-energized'
                     
                     });
                     }*/


                }, function error(response) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Error En La Red: " + response.status,
                        subTitle: "Por Favor Valida Tu Configuración De Internet",
                        okType: 'button-energized'

                    });
                });
            };
            $scope.verImgenUsuario = function (imagen, nombre) {
                $ionicPopup.show({
                    template: '<img src ="' + imagen + '" style="width: 100%;">',
                    scope: $scope,
                    title: nombre,
                    buttons: [{
                            text: 'Cerrar',
                            type: 'button-energized',
                            //type: 'button-positive',
                            onTap: function (e) {

                            }
                        }]
                });
            };
            $scope.verRuta = function (longitudPartida, latitudPartida, longitudDestino, latitudDestino, modoViaje, nombreUsuario) {
                objetos.data.rutas.longitudPartida = longitudPartida;
                objetos.data.rutas.latitudPartida = latitudPartida;
                objetos.data.rutas.longitudDestino = longitudDestino;
                objetos.data.rutas.latitudDestino = latitudDestino;
                objetos.data.rutas.modoViaje = modoViaje;
                objetos.data.rutas.nombreUsuario = nombreUsuario;
                objetos.data.rutas.estado = 1;
                $location.url("/userRoutes/favorites");
                $rootScope.toggledrag = false;
            };
            invocacionService(2, urlCreaActualizaViaje);
            $scope.solicitarUser = function () {
                invocacionService(1, urlSolicitudPendiente);
            };
            $scope.confirmarUser = function () {
                invocacionService(3, urlConfirmacion);
            };
        })
        .controller('registerCarCtrl', function ($scope, $stateParams, objetos, $http, $ionicLoading, $ionicPopup) {
            $scope.tipoVehiculo = [{
                    name: "MOTO",
                    value: 1
                }, {
                    name: "CARRO",
                    value: 2
                }, {
                    name: "CAMIONETA",
                    value: 3
                }, {
                    name: "VAN",
                    value: 4
                }];
            $scope.searchPropertiesSearchModel = {
                descVehiculo: '',
                tipoVehiculo: 1
            };
            var url = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/registroVehiculo";
            var idCarro;
            var marca;
            var placa;
            var color;
            var tipo;
            var puestos;
            var observacion;
            var registro = function (metodo) {
                var titulo;
                var mensaje;
                if (metodo === 3) {
                    idCarro = "";
                    marca = "";
                    placa = "";
                    color = "";
                    tipo = "";
                    puestos = "";
                    observacion = "";
                } else {
                    idCarro = document.getElementById("idCar").value;
                    marca = document.getElementById("marca").value;
                    placa = document.getElementById("placa").value;
                    color = document.getElementById("colorCar").value;
                    tipo = document.getElementById("tipo").value;
                    puestos = document.getElementById("puestos").value;
                    observacion = document.getElementById("observacion").value;
                }
                $ionicLoading.show({});
                $http({
                    method: "POST",
                    url: url,
                    data: {
                        facebookID: window.localStorage.getItem("facebookId"),
                        codigoID: objetos.data.codigoId,
                        placa: placa,
                        marca: marca,
                        tipoVehiculo: tipo,
                        puestosMax: puestos,
                        descVehiculo: idCarro,
                        colorVehiculo: color,
                        observaciones: observacion,
                        metodoConsulta: metodo
                    }
                }).then(function success(response) {
                    $ionicLoading.hide();
                    var desc;
                    if (response.data.codigoError === 0 && metodo === 3) {
                        /*for (var i = 0; i <response.data.vehiculosReg.length; i++) {
                         desc = $scope.tipoVehiculo.filter(function (item) {
                         return item.value === response.data.vehiculosReg[i].tipoVehiculo;
                         });
                         response.data.vehiculosReg[i].vehiculoSelect = $scope.tipoVehiculo[response.data.vehiculosReg[i].tipoVehiculo - 1];
                         
                         }*/

                        $scope.selectableNames = response.data.vehiculosReg;
                        //$scope.respuesta = response.data.notificaciones;
                        //console.log($scope.selectableNames);
                    } else if (response.data.codigoError === 0 && metodo !== 3) {
                        titulo = "OK ";
                        mensaje = response.data.msjError;
                        $ionicPopup.alert({
                            title: titulo,
                            subTitle: mensaje,
                            okType: 'button-energized'

                        });
                    } else {
                        titulo = response.data.codigoError;
                        mensaje = response.data.msjError;
                        $ionicPopup.alert({
                            title: titulo,
                            subTitle: mensaje,
                            okType: 'button-energized'

                        });
                    }


                }
                , function error(response) {
                    $ionicLoading.hide();
                    titulo = "Error En La Red: " + response.status;
                    mensaje = "Por Favor Valida Tu Configuración De Internet";
                    $ionicPopup.alert({
                        title: titulo,
                        subTitle: mensaje,
                        okType: 'button-energized'

                    });
                }
                );
            };
            registro(3);
            $scope.actualizaCrea = function () {

                idCarro = document.getElementById("idCar").value;
                marca = document.getElementById("marca").value;
                placa = document.getElementById("placa").value;
                color = document.getElementById("colorCar").value;
                tipo = document.getElementById("tipo").value;
                puestos = document.getElementById("puestos").value;
                observacion = document.getElementById("observacion").value;
                var estado = true;
                var mensaje;
                if (idCarro === "" || idCarro === undefined || marca === "") {
                    mensaje = "Por Favor Diligencia Todos Los Campos Correctamente";
                } else if (placa.length > 6) {
                    mensaje = "Placa No Valida";
                } else if (isNaN(puestos)) {
                    mensaje = "Por Favor Ingresa Números De Puestos Maximos Validos";
                } else if ((tipo === 1 && puestos > 2) || (tipo === 2 && puestos > 4) || (tipo === 3 && puestos > 5) || (tipo === 4 && puestos > 20)) {
                    mensaje = "Excede El Número De Puestos Maximos Permitidos";
                } else {
                    registro(1);
                    estado = false;
                    registro(3);
                }

                if (estado) {
                    $ionicPopup.alert({
                        title: "Valida Campos",
                        subTitle: mensaje,
                        okType: 'button-energized'

                    });
                }

            };
        })
        .controller('notifyCtrl', function ($scope, $stateParams, $ionicLoading, $http, $ionicPopup, $location, objetos) {
            var url = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/consultaNotificaciones";
            $ionicLoading.show({});
            /*
             $scope.datos ={
             titulo: $routeParams.titulo,
             imagen: $routeParams.imagen,
             descripcion: $routeParams.descripcion,
             enlace: $routeParams.enlace
             };*/
            var titulo;
            var mensaje;
            $http({
                method: "POST",
                url: url,
                data: {
                    facebookID: objetos.data.facebookId,
                    codigoID: objetos.data.codigoId

                }
            }).then(function success(response) {
                $ionicLoading.hide();
                if (response.data.codigoError === 0) {
                    $scope.respuesta = response.data.notificaciones;
                    console.log($scope.respuesta);
                } /* else {
                 titulo = "Error: " + response.data.codigoError;
                 mensaje = response.data.msjError;
                 $ionicPopup.alert({
                 title: titulo,
                 subTitle: mensaje,
                 okType: 'button-energized'
                 
                 });
                 }*/


            }, function error(response) {
                $ionicLoading.hide();
                titulo = "Error En La Red: " + response.status;
                mensaje = "Por Favor Valida Tu Configuración De Internet";
                $ionicPopup.alert({
                    title: titulo,
                    subTitle: mensaje,
                    okType: 'button-energized'

                });
            });
            $scope.envirMail = function () {
                var para = " miguel.chapariza@gmail.com";
                var asunto = "?subject= NOTIFICACIÓN: UD Sobre Ruedas";
                var cuerpo = "&body= Titulo Notificación:\n\
                            Descripción:\n\
                            resumen:\n\
                            Nombre imagen:\n\
                            Url Imagen:";
                window.location.href = "mailto:" + para + asunto + cuerpo;
            };
            $scope.parametros = function (titulo, imagen, descripcion, enlace) {
                objetos.data.notificacion.titulo = titulo;
                objetos.data.notificacion.imagen = imagen;
                objetos.data.notificacion.descripcion = descripcion;
                objetos.data.notificacion.enlace = enlace;
                $location.url("/userRoutes/notificacionVista");
            };
        })

        .controller('detalleNotifyCtrl', function ($scope, objetos, $location) {
            console.log(objetos.data.titulo);
            var detalle = {};
            detalle.titulo = objetos.data.notificacion.titulo;
            detalle.descripcion = objetos.data.notificacion.descripcion;
            detalle.imagen = objetos.data.notificacion.imagen;
            detalle.enlace = objetos.data.notificacion.enlace;
            $scope.detalleNotificacion = [detalle];
            $scope.enlace = function () {
                console.log(detalle.enlace);
                $location.url(detalle.enlace);
            };
        })
        .controller('pendingCtrl', function ($scope, $ionicPopover, $http, $ionicLoading, $ionicPopup, $location, objetos) {
            var titulo = "";
            var mensaje = "";
            $ionicPopover.fromTemplateUrl('templates/Modals/popOverSolPendiente.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            var detalleSolicitud = {};
            $scope.solicitudes = function () {
                $scope.popover.hide();
                consulta(4);
            };
            $scope.solicitudPendiente = function () {
                $scope.popover.hide();
                consulta(3);
            };
            var url = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/solicitudesPendientes";
            var consulta = function (metodo) {
                $http({
                    method: "POST",
                    url: url,
                    data: {
                        facebookID: window.localStorage.getItem("facebookId"),
                        codigoID: objetos.data.codigoId,
                        metodo: metodo

                    }
                }).then(function success(response) {

                    $ionicLoading.hide();
                    if (response.data.codigoError === 0) {

                        $scope.datosUsuarios = response.data.solicitudes;
                        console.log($scope.respuesta);
                    } else {
                        $scope.datosUsuarios = [];
                        titulo = response.data.codigoError;
                        mensaje = response.data.msjError;
                        $ionicPopup.alert({
                            title: titulo,
                            subTitle: mensaje,
                            okType: 'button-energized'

                        });
                    }


                }, function error(response) {
                    $scope.datosUsuarios = [];
                    $ionicLoading.hide();
                    titulo = "Error En La Red: " + response.status;
                    mensaje = "Por Favor Valida Tu Configuración De Internet";
                    $ionicPopup.alert({
                        title: titulo,
                        subTitle: mensaje,
                        okType: 'button-energized'

                    });
                });
            };
            consulta(3);
            $scope.detalleUsuario = function (facebookId, codigoId) {
                objetos.data.usuario.facebookID = facebookId;
                objetos.data.usuario.codigoID = codigoId;
                objetos.data.usuario.tipoConsulta = 2;
                $location.url("/userRoutes/user");
            };
        })
        .controller('confirmCtrl', function ($scope, $ionicPopover, $http, $ionicLoading, $ionicPopup, objetos, $location) {
            var titulo = "";
            var mensaje = "";
            $ionicPopover.fromTemplateUrl('templates/Modals/popOverSolConfirm.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            $scope.solicitudes = function () {
                $scope.popover.hide();
                consulta(4);
            };
            $scope.confirmadas = function () {
                $scope.popover.hide();
                consulta(3);
            };
            var url = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/solicitudesConfirmadas";
            var consulta = function (metodo) {
                $http({
                    method: "POST",
                    url: url,
                    data: {
                        facebookID: window.localStorage.getItem("facebookId"),
                        codigoID: objetos.data.codigoId,
                        metodo: metodo

                    }
                }).then(function success(response) {

                    $ionicLoading.hide();
                    if (response.data.codigoError === 0) {

                        $scope.datosUsuarios = response.data.solicitudes;
                        console.log($scope.respuesta);
                    } else {
                        $scope.datosUsuarios = [];
                        titulo = response.data.codigoError;
                        mensaje = response.data.msjError;
                        $ionicPopup.alert({
                            title: titulo,
                            subTitle: mensaje,
                            okType: 'button-energized'

                        });
                    }


                }, function error(response) {
                    $ionicLoading.hide();
                    $scope.datosUsuarios = [];
                    titulo = "Error En La Red: " + response.status;
                    mensaje = "Por Favor Valida Tu Configuración De Internet";
                    $ionicPopup.alert({
                        title: titulo,
                        subTitle: mensaje,
                        okType: 'button-energized'

                    });
                });
            };
            consulta(4);
            $scope.detalleUsuario = function (facebookId, codigoId) {
                objetos.data.usuario.facebookID = facebookId;
                objetos.data.usuario.codigoID = codigoId;
                objetos.data.usuario.tipoConsulta = 3;
                $location.url("/userRoutes/user");
            };
        })

        .controller('registroRutasCtrl', function ($scope, $location, $rootScope, $http, $ionicPopover, $ionicPlatform, objetos, $ionicLoading, $ionicPopup) {
            $scope.irMapa = function () {
                $location.url('userRoutes/favorites');
                //$window.location.reload();
                $rootScope.toggledrag = false;
            };
            $scope.disableTap = function () {
                var container;
                container = document.getElementsByClassName('pac-container');
                angular.element(container).attr('data-tap-disabled', 'true');
                return angular.element(container).on('click', function () {
                    return document.getElementById('search-input').blur();
                });
            };
            $scope.searchPropertiesSearchModel = "";
            $ionicPopover.fromTemplateUrl('templates/Modals/popOverRutas.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            var descRuta = "";
            $scope.condicion = false;
            var descripcionRutaFlag = false;
            $scope.changeCondicion = function () {
                $scope.value = !$scope.value;
                if ($scope.value) {
                    descripcionRutaFlag = true;
                } else {
                    descripcionRutaFlag = false;
                    descRuta = "";
                }
            };
            var url = objetos.data.host + '/UDSobreRuedas/services/SobreRuedas/creaActualizaRutas';
            $scope.shoutLoudRutas = function (newValue, oldValue) {
                $scope.nombreRutaModel = newValue.nombreRuta;
                $scope.descOrigenModel = newValue.descOrigen;
                $scope.descDestinoModel = newValue.descDestino;
                $scope.descRutaModel = newValue.descRuta;
                descRuta = newValue.descRuta;
                objetos.data.rutasOrigen.desc = newValue.descOrigen;
                objetos.data.rutasDestino.desc = newValue.descDestino;
                objetos.data.rutasOrigen.lat = newValue.latitudOrigen;
                objetos.data.rutasOrigen.lng = newValue.longitudOrigen;
                objetos.data.rutasDestino.lat = newValue.longitudDestino;
                objetos.data.rutasDestino.lng = newValue.latitudDestino;
            };
            var request = {};
            var consultaRutas = function (metodo) {
                $ionicLoading.show({});
                var invocacionFlag = false;
                switch (metodo) {
                    case 1:
                        request = {
                            facebookID: window.localStorage.getItem("facebookId"),
                            codigoID: objetos.data.codigoId,
                            metodoConsulta: 5
                        };
                        invocacionFlag = true;
                        break;
                    case 2:
                        request = {
                            facebookID: window.localStorage.getItem("facebookId"),
                            codigoID: objetos.data.codigoId,
                            nombreRuta: document.getElementById('nombreRuta').value,
                            descRuta: descRuta === "" ? ((document.getElementById('descOrigen').value).split(",", 2) + " - " + (document.getElementById('descDestino').value).split(",", 2)) : descRuta,
                            longitudOrigen: objetos.data.rutasOrigen.lng,
                            latitudOrigen: objetos.data.rutasOrigen.lat,
                            longitudDestino: objetos.data.rutasDestino.lng,
                            latitudDestino: objetos.data.rutasDestino.lat,
                            flagFavorita: "0",
                            descOrigen: document.getElementById('descOrigen').value,
                            descDestino: document.getElementById('descDestino').value,
                            metodoConsulta: 1
                        };
                        invocacionFlag = true;
                        break;
                    default:
                        invocacionFlag = false;
                        break;
                }
                if (invocacionFlag) {
                    $http({
                        method: "POST",
                        url: url,
                        data: request
                    }).then(function success(response) {
                        $ionicLoading.hide();
                        if (response.data.codigoError === 0) {
                            if (metodo === 1) {
                                $scope.selectableRutas = response.data.rutas;
                            } else {
                                $ionicPopup.alert({
                                    title: "OK",
                                    subTitle: response.data.msjError,
                                    okType: 'button-energized'
                                });
                                window.localStorage.setItem("fechaViaje", "2018-05-09");
                                consultaRutas(1);
                            }
                        } /*else {
                         $ionicPopup.alert({
                         title: "Error: " + response.data.codigoError,
                         subTitle: response.data.msjError,
                         okType: 'button-energized'
                         
                         });
                         }*/


                    }, function error(response) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: "Error En La Red: " + response.status,
                            subTitle: "Por Favor Valida Tu Configuración De Internet",
                            okType: 'button-energized'

                        });
                    });
                }
            };
            //console.log("crearRutaCtrl");
            searchPlaceOrigen = function () {
                var search = document.getElementById('descOrigen');
                var searchBox = new google.maps.places.Autocomplete(search);
                searchBox.setComponentRestrictions(
                        {'country': ['col']});
                google.maps.event.addListener(searchBox, 'place_changed', function () {
                    var places = searchBox.getPlace();
                    var coordenadas = places.geometry.location;
                    objetos.data.rutasOrigen.lat = coordenadas.lat();
                    objetos.data.rutasOrigen.lng = coordenadas.lng();
                    objetos.data.rutasOrigen.desc = search.value;
                    console.log(objetos.data);
                });
            };
            searchPlaceDestino = function () {
                var search = document.getElementById('descDestino');
                var searchBox = new google.maps.places.Autocomplete(search);
                searchBox.setComponentRestrictions(
                        {'country': ['col']});
                google.maps.event.addListener(searchBox, 'place_changed', function () {
                    var places = searchBox.getPlace();
                    var coordenadas = places.geometry.location;
                    objetos.data.rutasDestino.lat = coordenadas.lat();
                    objetos.data.rutasDestino.lng = coordenadas.lng();
                    objetos.data.rutasDestino.desc = search.value;
                    console.log(objetos.data);
                });
            };
            searchPlaceDestino();
            searchPlaceOrigen();
            $scope.refrescarRutas = function () {
                $scope.popover.hide();
                consultaRutas(1);
                $scope.selectableRutas[0];
                //console.log(objetos.data.rutasOrigen);
            };
            $scope.actualizaRuta = function () {
                if (objetos.data.rutasDestino.lat === undefined || objetos.data.rutasOrigen.lng === undefined || document.getElementById('nombreRuta').value === "") {
                    $ionicPopup.alert({
                        title: "Valida Datos",
                        subTitle: "Por Favor Valida Todos Los Datos Ingresados",
                        okType: 'button-energized'
                    });
                } else if (descripcionRutaFlag && document.getElementById('descRuta').value === "") {
                    $ionicPopup.alert({
                        title: "Valida Datos",
                        subTitle: "Describe Tu Ruta",
                        okType: 'button-energized'
                    });
                } else {
                    consultaRutas(2);
                }
            };
            consultaRutas(1);
        })
        .controller('navegacionCtrl', function ($scope, $location, $rootScope, $window) {
            $scope.irMapa = function () {
                $location.url('userRoutes/favorites');
                //$window.location.reload();
                $rootScope.toggledrag = false;
            };
            $scope.irUsuarios = function () {
                $location.url('userRoutes/viajesUsuarios');
                //$window.location.reload();
                $rootScope.toggledrag = true;
            };
            $scope.irAjustes = function () {
                $location.url('userRoutes/Ajustes');
                //$window.location.reload();
                $rootScope.toggledrag = true;
            };
            $scope.irModoDeViaje = function () {
                $location.url('userRoutes/rutes');
                //$window.location.reload();
                $rootScope.toggledrag = true;
            };
        })

        .controller('promptCtrl', function ($scope, $ionicLoading, $ionicPopup, $http, objetos) {
            var url = objetos.data.host + "/UDSobreRuedas/services/SobreRuedas/creaSugerencias";
            var mensaje;
            var titulo;
            $scope.toggle = {};
            $scope.error = true;
//            $scope.mejoras = false;
//            $scope.proyecto = false;
//            $scope.otros = false;

            $scope.change = function () {
                $scope.error = !$scope.error;
                $scope.mejoras = !$scope.mejoras;
                $scope.proyecto = !$scope.proyecto;
                $scope.otros = !$scope.otros;
                if ($scope.error) {
                    $scope.mejoras = false;
                    $scope.proyecto = false;
                    $scope.otros = false;
                }
                if ($scope.mejoras) {
                    $scope.error = false;
                    $scope.proyecto = false;
                    $scope.otros = false;
                }
                if ($scope.proyecto) {
                    $scope.error = false;
                    $scope.mejoras = false;
                    $scope.otros = false;
                }
                if ($scope.otros) {
                    $scope.error = false;
                    $scope.mejoras = false;
                    $scope.proyecto = false;
                }
            };
            $scope.enviarSug = function () {
                var sugerenciaTitulo = document.getElementById('tituloSugerencia');
                var sugerenciaDesc = document.getElementById('descripcionSugerencia');
                $ionicLoading.show({});
                $http({
                    method: "POST",
                    url: url,
                    data: {
                        facebookID: window.localStorage.getItem("facebookId"),
                        codigoID: window.localStorage.getItem("codigoUD"),
                        titulo: sugerenciaTitulo.value,
                        mensaje: sugerenciaDesc.value,
                        clasificacion: 1
                    }
                }).then(function success(response) {
                    $ionicLoading.hide();
                    if (response.data.codigoError === 0) {
                        titulo = "OK";
                    } else {
                        titulo = "Error: " + response.data.codigoError;
                    }
                    mensaje = response.data.msjError;
                    $ionicPopup.alert({
                        title: titulo,
                        subTitle: mensaje,
                        okType: 'button-energized'

                    });
                }, function error(response) {
                    $ionicLoading.hide();
                    titulo = "Error En La Red: " + response.status;
                    mensaje = response.statusText;
                    $ionicPopup.alert({
                        title: titulo,
                        subTitle: mensaje,
                        okType: 'button-energized'

                    });
                });
            };
        });
 