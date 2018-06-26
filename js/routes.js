/* global angular */

angular.module('app.routes', [])

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'loginCtrl'

                    })

                    .state('uDSobreRuedas', {
                        url: '/userRoutes',
                        templateUrl: 'templates/uDSobreRuedas.html',
                        controller: 'navegacionCtrl'
                    })



                    .state('uDSobreRuedas.uDSobreRuedas2', {
                        url: '/viajesUsuarios',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/uDSobreRuedas2.html',
                                controller: 'uDSobreRuedas2Ctrl'
                            }
                        }
                    })

                    .state('uDSobreRuedas.usuario', {
                        url: '/user',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/usuario.html',
                                controller: 'usuarioCtrl'
                            }
                        }
                    })
                    .state('uDSobreRuedas.modoDeViaje', {
                        url: '/rutes',
                        views: {
                            'tab2': {
                                templateUrl: 'templates/modoDeViaje.html',
                                controller: 'modoDeViajeCtrl'
                            }
                        }
                    })

                    .state('uDSobreRuedas.ajustes', {
                        url: '/Ajustes',
                        views: {
                            'tab3': {
                                templateUrl: 'templates/ajustes.html',
                                controller: 'ajustesCtrl'
                            }
                        }
                    })
                    .state('uDSobreRuedas.rutasFavoritas', {
                        url: '/favorites',
                        views: {
                            'tab4': {
                                templateUrl: 'templates/rutasFavoritas.html',
                                controller: 'rutasFavoritasCtrl'
                            }
                        }
                    })
                    .state('uDSobreRuedas.registerCar', {
                        url: '/registerCar',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/registroVehiculo.html',
                                controller: 'registerCarCtrl'
                            }

                        }

                    })
                    .state('uDSobreRuedas.notify', {
                        url: '/notify',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/notificaciones.html',
                                controller: 'notifyCtrl'
                            }
                        }

                    })
                    .state('uDSobreRuedas.notificacionVista', {
                        url: '/notificacionVista',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/notificacionVista.html',
                                controller: 'detalleNotifyCtrl'
                            }
                        }

                    })
                    .state('uDSobreRuedas.prompts', {
                        url: '/promts',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/sugerencias.html',
                                controller: 'promptCtrl'
                            }
                        }

                    })
                    .state('uDSobreRuedas.pending', {
                        url: '/pending',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/solPendientes.html',
                                controller: 'pendingCtrl'
                            }
                        }

                    })

                    .state('uDSobreRuedas.registroRutas', {
                        url: '/registroRutas',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/registroRutas.html',
                                controller: 'registroRutasCtrl'
                            }
                        }

                    })
                    .state('uDSobreRuedas.confirm', {
                        url: '/confirm',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/solConfirmadas.html',
                                controller: 'confirmCtrl'
                            }
                        }
                    });
            //$urlRouterProvider.otherwise('/userRoutes/viajesUsuarios');
            $urlRouterProvider.rule(function ($injector, $location) {
                var state = $injector.get('$state');
                //var estado = 2;
                if (window.localStorage.getItem("ingresoFB") === "1") {
                    state.go('uDSobreRuedas.uDSobreRuedas2');
                } else {
                    state.go('login');
                }
                return $location.path();
            });


        });