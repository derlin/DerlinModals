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

        self.dialogs = [
            {
                title: "cancelable text",
                func : dialogInfoCancellable
            },
            {
                title: "MDL input",
                func : dialogInputMdl
            }, {
                title: 'custom MDL template',
                func : dialogCustomMdlTemplate
            }];

        self.dial = function( dialog ){
            dialog.func();
        };

        self.closeModal = function(){
            ModalService.close();
        };
        // ----------------------------------------------------

        function dialogInputMdl(){
            var inputs = {city: 'New York'};
            ModalService.showModal( {
                title     : "Fry City",
                template  : '<div ng-class="{\'is-dirty\': inputs.city}" class="mdl-textfield mdl-js-textfield' +
                ' mdl-textfield--floating-label">' +
                '<input class="mdl-textfield__input" type="text" id="sample" ng-model="inputs.city">' +
                '<label class="mdl-textfield__label" for="sample">Fry lives in</label>' +
                '</div>',
                positive  : 'validate',
                negative  : 'cancel',
                cancelable: true,
                inputs    : inputs
            } ).then( modalClosed, modalError );

        }

        function dialogInfoCancellable(){

            ModalService.showModal( {
                title     : "What is lorem ipsum?",
                text      : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                cancelable: true
            } ).then( modalClosed, modalError );

        }

        function dialogCustomMdlTemplate(){

            ModalService.showModal( {
                templateUrl: "runDialogTemplate.html",
                inputs     : {
                    run : function(){
                        console.log( "run" );
                    },
                    stop: function(){
                        console.log( "stop" );
                    }
                }
            } ).then( modalClosed, modalError );

        }


        // ----------------------------------------------------

        function modalClosed( result ){
            self.lastResults = result;
            console.log( "Modal closed" );
            console.log( "raw results: ", result, "\nstatus: ", status, "\ninputs: ", result.inputs );
        }

        function modalError(){
            self.lastResults = "ERROR";
            console.log( "error creating modal." );
        }


    }

}());