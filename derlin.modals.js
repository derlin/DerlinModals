/*
 * ____            _ _         __  __           _       _
 * |  _ \  ___ _ __| (_)_ __   |  \/  | ___   __| | __ _| |___
 * | | | |/ _ \ '__| | | '_ \  | |\/| |/ _ \ / _` |/ _` | / __|
 * | |_| |  __/ |  | | | | | | | |  | | (_) | (_| | (_| | \__ \
 * |____/ \___|_|  |_|_|_| |_| |_|  |_|\___/ \__,_|\__,_|_|___/
 *
 * @author   Lucy Linder <lucy.derlin@gmail.com>
 *
 * Copyright 2015 EIA-FR. All rights reserved.
 * Use of this source code is governed by an Apache 2 license
 * that can be found in the LICENSE file.
 */

(function(){
    angular.module( 'derlin.modals', [] )
        .controller( 'DerlinController', function(){
        } )
        .factory( 'ModalService', DerlinModalService );

    /* *****************************************************************
     *  implementation
     * ****************************************************************/

    var currentModal = null;

    DerlinModalService.$inject = ['$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$templateCache'];
    function DerlinModalService( $document, $compile, $controller, $http, $rootScope, $q, $templateCache ){


        return {
            showModal: showModal,
            close    : closeCurrentModal
        };

        // ----------------------------------------------------

        function closeCurrentModal(){
            if( currentModal ){
                currentModal.scope.close();
            }
        }

        // ----------------------------------------------------

        //  Returns a promise which either resolves upon modal close, or fails
        // because the modal could not be rendered.
        function showModal( options ){

            var closeDeferred = $q.defer();

            //  Get the actual html of the template.
            getTemplate( options.template, options.templateUrl )
                .then( function( template ){
                    //  Create a new scope for the modal.
                    var modalScope = $rootScope.$new();
                    // add the custom inputs to the scope
                    modalScope.inputs = options.inputs || {};

                    if( !options.templateUrl ){
                        // make options available to the scope for the template to work
                        modalScope.positive = options.positive;
                        modalScope.negative = options.negative;
                        modalScope.title = options.title;
                        modalScope.text = options.text;
                    }

                    // create close function
                    modalScope.close = function( result, delay ){
                        if( delay === undefined || delay === null ) delay = 0;
                        window.setTimeout( function(){
                            $(document).unbind("keyup.dialog");

                            //  Resolve the 'close' promise.
                            closeDeferred.resolve( {status: result, inputs: modalScope.inputs} );

                            //  We can now clean up the scope and remove the element from the DOM.
                            modalScope.$destroy();
                            modalElement.remove();

                            //  Unless we null out all of these objects we seem to suffer
                            //  from memory leaks, if anyone can explain why then I'd
                            //  be very interested to know.
                            closeDeferred = null;
                            modalElement = null;
                            modalScope = null;
                            currentModal = null;
                        }, delay );
                    };


                    //  Parse the modal HTML into a DOM element (in template form).
                    var modalElementTemplate = angular.element( template );

                    //  Compile then link the template element, building the actual element.
                    //  Set the $element on the inputs so that it can be injected if required.
                    var linkFn = $compile( modalElementTemplate );
                    var modalElement = linkFn( modalScope );
                    //inputs.$element = modalElement;


                    //  Create the controller, explicitly specifying the scope to use.
                    var modalController = $controller( 'DerlinController as ctrl', {$scope: modalScope} );

                    if(options.cancelable){
                        modalElement.click(function () {
                            modalScope.close();
                        });

                        $(document).bind("keyup.dialog", function (e) {
                            if (e.which == 27)
                                modalScope.close();
                        });

                        modalElement.find('.content').click(function (e) {
                            e.stopPropagation();
                        });
                    }


                    //  Finally, append the modal to the dom.
                    if( options.appendElement ){
                        // append to custom append element
                        options.appendElement.append( modalElement );

                    }else{
                        // append to body when no custom append element is specified
                        $document.find( 'body' ).append( modalElement );
                    }

                    //  We now have a modal object...
                    currentModal = {
                        controller: modalController,
                        scope     : modalScope,
                        element   : modalElement
                    };

                    if(componentHandler) componentHandler.upgradeDom();

                }, function(){
                    // if the template failed
                    closeDeferred.reject();
                } ); // end getTemplate.then

            return closeDeferred.promise;

        }// end showModal


        // ----------------------------------------------------


        function getTemplate( template, templateUrl ){
            var deferred = $q.defer();
            if( !templateUrl ){
                template = template || "";
                var html = '<div id="derlinDialog" class="dialog-container"><div class="mdl-card' +
                    ' mdl-shadow--16dp content"><h5 ng-show="title">{{title}}</h5><p class="dialog-text" ng-show="text">{{text}}</p>' + template + '<div' +
                    ' class="mdl-card__actions' +
                    ' dialog-button-bar"><button ng-show="negative" ng-click="close(false)" ' +
                    'class="mdl-button mdl-js-button mdl-js-ripple-effect" id="negative">{{negative || "No"}}</button>' +
                    '<button ng-show="positive" ng-click="close(true)" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"' +
                    ' id="positive">{{positive || "Yes"}}</button></div></div></div>';

                deferred.resolve( html );

            }else{
                // check to see if the template has already been loaded
                var cachedTemplate = $templateCache.get( templateUrl );
                if( cachedTemplate !== undefined ){
                    deferred.resolve( cachedTemplate );
                }
                // if not, let's grab the template for the first time
                else{
                    $http( {method: 'GET', url: templateUrl, cache: true} )
                        .then( function( result ){
                            // save template into the cache and return the template
                            $templateCache.put( templateUrl, result.data );
                            deferred.resolve( result.data );
                        }, function( error ){
                            deferred.reject( error );
                        } );
                }
            }
            return deferred.promise;
        }


    } // end modalservice


}());