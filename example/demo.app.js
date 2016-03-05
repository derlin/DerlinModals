/*
 * @author   Lucy Linder <lucy.derlin@gmail.com>
 * @date     February 2016
 * @context  Thymio Captain
 *
 * Copyright 2016 BlueMagic. All rights reserved.
 * Use of this source code is governed by an Apache 2 license
 * that can be found in the LICENSE file.
 */
(function(){

    /**
     * @ngdoc controller
     * @name modal.app.MainCtrl
     *
     * @description
     * Main controller
     */
    angular
        .module( 'modal.app', ['derlin.modals'] )
        .controller( 'MainCtrl', MainCtrl );

    // --------------------------

    function MainCtrl( ModalService, $scope ){
        var self = this;
        self.dialog1 = dialog1;
        self.dialog2 = dialog2;
        self.dialog3 = dialog3;


        self.closeModal = function(){
            ModalService.close();
        } ;
        // ----------------------------------------------------

        function dialog1(){
            $scope.lala = "lala";
            var inputs = {city: $scope.lala};
            ModalService.showModal( {
                title   : "Fry City",
                template: "<div>Fry lives in <input type='text' ng-model='inputs.city'></div>",
                positive: 'validate',
                negative: 'cancel',
                cancelable: true,
                inputs  : inputs
            } ).then( function( result ){
                console.log( "Modal closed", result,status, result.inputs );
            }, function(){
                console.log( "error creating template" );
            } );

        }

        function dialog2(){

            ModalService.showModal( {
                title: "What is lorem ipsum?",
                text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                cancelable: true
            } ).then( function( result ){
                console.log( "Modal closed", result,status, result.inputs );
            }, function(){
                console.log( "error creating template" );
            } );

        }

        function dialog3(){

            ModalService.showModal( {
                templateUrl: "runDialogTemplate.html",
                inputs: {
                    run: function(){console.log("run");},
                    stop: function(){console.log("stop");}
                }
            } ).then( function( result ){
                console.log( "Modal closed", result,status, result.inputs );
            }, function(){
                console.log( "error creating template" );
            } );

        }



    }

}());