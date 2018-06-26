/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global facebookConnectPlugin */



var showDialog = function () {
    facebookConnectPlugin.showDialog({method: "feed"},
            function (response) {
                alert(JSON.stringify(response));
            },
            function (response) {
                alert(JSON.stringify(response));
            });
};

var api = function () {
    facebookConnectPlugin.api("me/?fields=id,name,picture,email", ["public_profile"],
            function (response) {
                return response;
                //ModalError("BIEN",JSON.stringify(response));
            },
            function (response) {
                return response;
//                document.getElementById('load').style.display = 'none';
//                ModalError("OOOpsss Error: "+response.error.code,response.error.message);
            });

};

var getAccessToken = function () {
    facebookConnectPlugin.getAccessToken(
            function (response) {
                console.log(JSON.stringify(response));
            },
            function (response) {
                alert(JSON.stringify(response));
            });
};

var getStatus = function () {
    facebookConnectPlugin.getLoginStatus(
            function (response) {
                document.getElementById('load').style.display = 'none';
                //console.log(JSON.stringify(response));
            },
            function (response) {
                alert(JSON.stringify(response));
            });
};

var logout = function () {
    if (!window.cordova) {
        //alert("Ingresa al 1 er IF");
        var appId = "162991017845696";
        var version = "v2.12";
        facebookConnectPlugin.browserInit(appId, version);
        //alert(FB);
        //alert("termino plugin");
    }
    facebookConnectPlugin.logout(
            function (response) {
                //alert(JSON.stringify(response));
                window.localStorage.setItem("ingresoFB", "0");
                location.href = "#/login";
            },
            function (response) {
                alert(JSON.stringify(response));
            });
};