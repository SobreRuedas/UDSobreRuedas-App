/* global angular */
var host = "http://localhost:8080";
angular.module('app.services', [])

        .factory('rutasFavoritas', function () {
            var path = host + "/UDSobreRuedas/services/SobreRuedas/creaActualizaRutas";
            var request = {};
            /*var data = {};
             return{
             consultaRutas: function(facebookId, codigoID){
             
             data =  {
             facebookID: facebookId,
             codigoID: codigoID
             };
             
             },
             
             creaRuta: function(){
             
             }
             $http.post(host, data).then(function(response){
             console.log(response);
             return response;
             },function (error){
             console.log(error);
             return error;
             })
             };*/

        })

        .service('consultaService', function ($http) {

            this.inicioRutas = function (parametros) {

                $http({
                    method: "POST",
                    url: url,
                    data: {
                        facebookID: "56465",
                        codigoID: "451111"
                    }
                }).then(function success(response) {
                    $scope.myWelcome = response.data;
                }, function error(response) {
                    $scope.myWelcome = response.statusText;
                });

            };

        });