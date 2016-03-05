# DerlinModals - the only AngularJS  Modal Service compatible with both Bootstrap _AND_ MDL

This modal service is light, easy-to-use and highly customizable. It works with AngularJS 1.X, bootstrap 3 and Material Design Light.

## Quick start

1. Download the file `derlin.modals.js` and include it in your html. If you use MDL, don't forget to also include `derlin.modals.css`.
2. register `derlin.modals` as a dependancy to your angular module.
3. inject `ModalService` in your controller.
4. use the function `ModalService.showModal` with the options that suit your needs.

Here is a simple YES/NO dialog:

```javascript
(function(){
   angular.module( 'myApp', ['derlin.modals'] ) // 1.
       .controller( 'MainCtrl', MainCtrl );     // 2.

    // --------------------------

   function MainCtrl( ModalService ){          // 3.   
      this.modal = function(){
	      ModalService.showModal( {            // 4
                bootstrap : true/false,
                title     : "Confirm",
                text      : "Are you sure ?",
                cancelable: true,
                positive  : "yes",
                negative  : "never mind"
            } ).then( function( result ){
                console.log( "Modal closed. Answer is ", result.status );
            });
      }
   }
  
}());
```

here is the html (without the header):

```html
<body ng-app="myApp" ng-controller="MainCtrl as ctrl">

<!-- bootstrap -->
<button type="button" ng-click="ctrl.modal()" class="btn btn-default">
	show modal
</button>

<!-- mdl -->
<button ng-click="ctrl.modal()" 
     class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
     show modal
</button>

</body>
```

Result:

TODO image

## Functionalities

The framework allows you to create modals for bootstrap and/or MDL. You can:
 - customize the content: text or html (`text/template` options),
 - use AngularJS bindings inside the html content without excplicitely creating a controller,
 -  show/hide the positive and negative buttons, with custom label (`positive/negative` options),
 - allow the user to close the dialog by clicking outside the dialog or pressing ESC (`cancelable` option),
 - close the dialog from code-behind (`ModalService.close()`),
 - get the result from a promise,
 - and so much more.

If you don't want to use one of the two frameworks or need a highly customized dialog, no worries. You can also pass your own template (`templateUrl` option) to the service. 


## Options

 - `bootstrap`: `true` for using bootstrap, `false` for MDL;
 - `title` : the modal title
 - `text`: the text, which will be wrapped in `<p></p>`. You can customize its display with the css selector `.derlinContent`.
 - `html`: same as `text`, but allows HTML tags and AngularJS bindings. All the attributes defined in `inputs` is available inside the `html`. Example: 
  `<strong>Fry</strong> lives in {{ inputs.city }}`. 
 - `inputs` : an object whose attributes and/or function which will be injected into the angular scope of the modal. You can refer to it in your html content with `inputs.XX`. The `inputs` properties can be modified (using `<input ng-model="inputs.city">` in the `html` option for example). The promise will also include the `inputs` in the callback.
 - `positive`: text of the positive button. If not defined or left blank, the positive button won't show up. Clicking the positive button will close the dialog and return a `status: true`.
 - `negative`: same as `positive`, but will return a `status: false`.
 - `cancelable`: if set to `true`, the dialog can be closed with the ESCAPE key or by clicking outside the dialog. 

## Result

The `showModal` function returns a promise. The promise is `resolved` when the dialog is closed and returns an object with the boolean property `status` set to `true` if the positive button was pressed, and the `inputs` object passed to the `showModal` on creation.

The promise can be `rejected` if the modal cannot be compiled and/or a problem occurs. 

So, you basically always use:

```javascript
ModalService.showModal({
	// options
}).then(function(result){
	// called upon dialog close. 
	// result.status: true if the positive button was clicked
	// result.inputs: the inputs passed in the options, if any
}, function(){
	// do something in case the modal creation failed.
});
```

## Custom templates

Maybe the options offered don't suit your needs. You may want a really custom dialog content and/or you do not want to use a framework.

In this case, you can leave the options `text,html,positive,negative` and use the `templateUrl` option instead.

__`templateUrl`__ is the id of a template with the full modal structure.  You can still use the `inputs` option.

For the template to work, here are some constraints:

 -  the template is defined in your html inside a `script` tag, like below. The `templateUrl` option will here be `someId.html`.
```html
<script type="ng-template" id="someId.html">
</script>
```

 - If you want your modal to be cancelable, your template must begin with two `div`s, like this:
```html
   <div>
      <div>
          // content
      </div>
   </div>
```
 - to close the modal, use the function `close(true/false)` which is available to the modal scope. The boolean parameter will be passed to the promise callback (see `result.status`).
 - if you do not use any framework, don't define the `bootstrap` option, or set it to `false`.
 - in case you don't use a framework, it is up to you to make the template appears like a modal (see the example for more info).
 - if you want to use a custom MDL dialog, you can use the class `derlinModal mdl` to wrap your template and the `button-bar` class for the buttons on the bottom. Or else, you can handle the display yourself.

## Some examples

A lot of examples are available in the `example` folder. A JSFiddle is also available here: TODO.

##### simple cancelable text

```javascript
ModalService.showModal( {
    bootstrap : true, // or false
    title     : "What is lorem ipsum?",
    text      : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    cancelable: true
} );
```

##### dialog with MDL-styled input

```javascript
ModalService.showModal( {
    bootstrap : false,
    title     : "Fry City",
    html      : '<div ng-class="{\'is-dirty\': inputs.city}" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
    '<input class="mdl-textfield__input" type="text" id="sample" ng-model="inputs.city">' +
    '<label class="mdl-textfield__label" for="sample">Fry lives in</label>' +
    '</div>',
    positive  : 'ok',
    negative  : 'cancel',
    cancelable: true,
    inputs    : myInputs
} ).then( function( result ){
    // result.inputs.city == result.myInputs.city
    console.log( "raw results: ", result,
        "\nstatus: ", status,
        "\ninputs: ", result.inputs );
} );   
```

##### custom template skeletons

With _bootstrap__ :

```html
<!--custom BOOTSTRAP template -->
<script type="text/ng-template" id="bootstrapDialogTemplate.html">
    <div class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" ng-click="close(false)" data-dismiss="modal"
                            aria-hidden="true">&times;</button>
                    <h4 class="modal-title">
                    // ...
                    </h4>
                </div>
                <div class="modal-body">
                    // ...
                </div>
                <div class="modal-footer">
                    <button type="button" ng-click="close(false)" class="btn btn-default" data-dismiss="modal">close</button>
                </div>
            </div>
        </div>
    </div>
</script>
```
For MDL:

```html
<!--custom MDL template -->
<script type="text/ng-template" id="mdlDialogTemplate.html">
    <div class="derlinModal mdl">
        <div class="mdl-card mdl-shadow--16dp">
            <div>
                <h2>
                // ... title
                </h2>
               // ... content               
            </div>
            <div class="mdl-card__actions button-bar">
                <button ng-click="close(false)" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">close</button>
            </div>
        </div>
    </div>
</script>
```
##### custom template without any framework

The template, defined in the html:

```html
<!-- custom no framework template -->
<script type="text/ng-template" id="myCustomModal.html">
    <div id="pureHtmlCssDialog">
        <div>
            <div ng-click="close(false)"><span class="my-close">X</span></div>
            <h4>No frameworks!</h4>
            <div>content of "more" : {{ inputs.more }}</div>
        </div>
    </div>
</script>
```
The controler call:

```javascript
ModalService.showModal( {
    bootstrap  : false,
    templateUrl: "myCustomModal.html",
    inputs     : {
        more: "akldjWEXCF.44"
    },
    cancelable: true
} ).then( modalClosed, modalError );
```

The css:
```css
#pureHtmlCssDialog {
    position: fixed;
    font-family: Arial, Helvetica, sans-serif;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 99999;
    opacity:1;
    pointer-events: auto;
}
#pureHtmlCssDialog > div {
    width: 400px;
    position: relative;
    margin: 10% auto;
    padding: 5px 20px 13px 20px;
    border-radius: 10px;
    background: #fff;
    background: -moz-linear-gradient(#fff, #999);
    background: -webkit-linear-gradient(#fff, #999);
    background: -o-linear-gradient(#fff, #999);
}
#pureHtmlCssDialog .my-close {
    background: #606061;
    color: #FFFFFF;
    line-height: 25px;
    position: absolute;
    right: -12px;
    text-align: center;
    top: -10px;
    width: 24px;
    text-decoration: none;
    font-weight: bold;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    -moz-box-shadow: 1px 1px 3px #000;
    -webkit-box-shadow: 1px 1px 3px #000;
    box-shadow: 1px 1px 3px #000;
}

#pureHtmlCssDialog .my-close:hover {
    background: #00d9ff;
}
```