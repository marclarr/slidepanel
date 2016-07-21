/*!
 * Slidepanel - A jQuery Framework for Off-Canvas Panels
 * Version: 0.1
 * Url: http://www.github.com/marclarr/slidepanel/
 * Author: Marc Wiest
 * Author url: http://www.marcwiest.com/
 * License: MIT
 * License url: http://www.github.com/marclarr/slidepanel/license/
 */

// adchsm.com/slidebars/help/usage/

var slidepanel = (function( $, window, document ) {
    "use strict";

    var canvasSelector = '[data-slidepanel*=canvas]';
    var $canvas = $(canvasSelector);
    var panelsSelector = '[data-slidepanel]:not([data-slidepanel*=canvas])';
    var allowedSides = ['top','right','bottom','left'];
    var allowedAnimations = ['reveal','slide','overlay','shift'];
    var panels = [];

    function _isValidPanelParam( param ) {

        if ( allowedSides.indexOf(param) >= 0 ) {
            return true;
        }

        if ( allowedAnimations.indexOf(param) >= 0 ) {
            return true;
        }

        return false;
    }

    function _registerPanels() {
        $(panelsSelector).each( function() {

            // get params
            var params = $(this).attr('data-slidepanel').split(' ',5);

			// check for required params
			if ( params[0] === '' || ! _isValidPanelParam(params[1]) || ! _isValidPanelParam(params[2]) ) {
				throw "'Error registering slidepanel, please specifiy a valid id, side and animation parameter.'";
			}

            panels[ params[0] ] = {
                id : params[0],
                side : params[1],
                animation : params[2],
                openDuration : false,
                closeDuration : false,
                active : false,
                $e : $(this)
            };

            if ( params[3] ) {
                panels[ params[0] ].openDuration = parseInt(params[3]);
                panels[ params[0] ].closeDuration = parseInt(params[3]);
            }

            if ( params[4] ) {
                panels[ params[0] ].closeDuration = parseInt(params[4]);
            }
        });
    }

    function _setPanelsCss() {
		for ( var id in panels ) {

			var offset;

            // get height or width
			if ( panels[id].side === 'top' || panels[id].side === 'bottom' ) {
				offset = panels[id].$e.css('height');
			} else {
				offset = panels[id].$e.css('width');
			}

			// apply negative margins
			if ( panels[id].animation === 'slide' || panels[id].animation === 'overlay' || panels[id].animation === 'shift' ) {
				panels[id].$e.css( 'margin-'+panels[id].side, '-'+offset );
			}

		}
    }

    function _getAnimationProperties( effect, id ) {

        var $e = $();
        var amount = '0px, 0px';
        var panelHeight = '';

        // css('transition-duration') returns a decimal number, times 1000 converts it to milliseconds
        // var duration = parseFloat( panels[id].$e.css('transition-duration') ) * 1000;
        var duration = 300;

        if ( 'open' === effect && panels[id].openDuration ) {
            duration = panels[id].openDuration;
        }

        if ( 'close' === effect && panels[id].closeDuration ) {
            duration = panels[id].closeDuration;
        }

        // add the canvas if any of these animation apply and the side is not bottom
        // cavanses that have a bottom/top panel have their own separate css applied
        if ( panels[id].side === 'left' || panels[id].side === 'right' ) {
            if ( panels[id].animation === 'reveal' || panels[id].animation === 'slide' || panels[id].animation === 'shift' ) {
                $e = $e.add( canvasSelector );
            }
        }

        // add the panel if any of these animation apply
        if ( panels[id].animation === 'slide' || panels[id].animation === 'overlay' || panels[id].animation === 'shift' ) {
            $e = $e.add( '[data-slidepanel*='+id+']' );
        }

        // amount to animate
        if ( panels[id].active ) {
            if ( panels[id].side === 'top' ) {

                amount = '0px, '+panels[id].$e.css('height');
                panelHeight = panels[id].$e.height();

            } else if ( panels[id].side === 'right' ) {

                amount = '-'+panels[id].$e.css('width')+', 0px';

            } else if ( panels[id].side === 'bottom' ) {

                amount = '0px, -'+panels[id].$e.css('height');
                panelHeight = panels[id].$e.height();

            } else if ( panels[id].side === 'left' ) {

                amount = panels[id].$e.css('width')+', 0px';

            }
        }

        return { '$e': $e, 'amount': amount, 'duration': duration, 'panelHeight' : panelHeight };
    }

    function _getActivePanels() {

        var activePanels = [];

        for ( var id in panels ) {
            if ( panels[id].active ) {
                activePanels[ panels[id].id ] = panels[id].id;
            }
        }

        return activePanels;
    }

    function close( id ) {

        if ( panels[id].active ) {

            // set panel to inactive
    		panels[id].active = false;

            // get animation properties BEFORE panel is set inactive
            var animProps = _getAnimationProperties( 'close', id );

            animProps.$e.css( 'transition-duration', animProps.duration+'ms' );

            // remove styles
            animProps.$e.css('transform','');
    		setTimeout(function () {
                animProps.$e.css('transition-duration','');
    			panels[id].$e.css('display','');
    		}, animProps.duration );

            // remove _adjustCanvasHeight
            $canvas.css({
                'height' : '',
                'transform' : ''
            });

        } else {

            open( id );

        }
    }

    /**
     * Closes the panel that's currently active, if any.
     *
     * @param  id  The id of the panel that's supposed to open.
     * @return  id  (bool/string)  The ID of the panel that was closed or false.
     */
    function _closeOtherPanel( id ) {

        var activePanels = _getActivePanels();
        var executedId = false;

        for ( var ap in activePanels ) {
            if ( id !== activePanels[ap] ) {
                close( activePanels[ap] );
                executedId = activePanels[ap];
            }
        }

        return executedId;
    }

    /**
     * Applies the CSS needed to animate an open effect to a panel.
     *
     * @param  animProps  The return value of _getAnimationProperties().
     */
    function _setOpenPanelCss( animProps ) {
        // jQuery.fn.css() applies vendor prefixes automatically
        animProps.$e.css({
            'transition-duration' : animProps.duration+'ms',
            'transform' : 'translate('+animProps.amount+')'
        });
    }

    /**
     * @param  id  (string)  The ID of the panel to open.
     * @param  animProps  The return value of _getAnimationProperties().
     */
    function _adjustCanvasHeight( id, animProps ) {

        if ( '' === animProps.panelHeight ) {
            return;
        }

        var newCanvasHeight = ( $canvas.height() - animProps.panelHeight ) + 'px';

        if ( 'overlay' === panels[id].animation ) {

            $canvas.css('transition-duration',animProps.duration+'ms');

        } else {

            var cssProps = {
                'height' : newCanvasHeight,
                'transition-duration' : animProps.duration+'ms'
            };

            if ( 'bottom' === panels[id].side ) {
                cssProps.transform = 'translate(0px,0px)';
            }

            if ( 'top' === panels[id].side ) {
                cssProps.transform = 'translate('+animProps.amount+')';
            }

            $canvas.css(cssProps);

        }
    }

    /**
     * Opens a panel if it's not active or closes it if it's already active.
     *
     * @param  id  (string)  Required. The id of the panel that's supposed to open.
     * @param  speed  (string)  Optional. The transition-duration in milliseconds.
     */
    function open( id ) {

        var otherActivePanelId = _closeOtherPanel(id);

        if ( ! panels[id].active ) {

            // set panel to active
            panels[id].active = true;

            // get animation properties AFTER panel was set active
            var animProps = _getAnimationProperties( 'open', id );

            // apply animation properties
            if ( false !== otherActivePanelId ) {

                var timeout = panels[ otherActivePanelId ].closeDuration;

                panels[id].$e.css('display','block');
                setTimeout( function() {
                    _setOpenPanelCss( animProps );
                    _adjustCanvasHeight( id, animProps );
                }, timeout );

            } else {

                panels[id].$e.css('display','block');
                _setOpenPanelCss( animProps );
                _adjustCanvasHeight( id, animProps );

            }

        } else {

            close( id );

        }
    }

    function init() {

        _registerPanels();

        _setPanelsCss();

        // re-fire css or resize
        $(window).on( 'resize', _setPanelsCss );
    }

    // publicly accessable API
    return {
        init : init,
        close : close,
        open : open,
        toggle : open
    };

})( jQuery, window, document );

// By default, all global objects are attached to the window object.
// This is just here to make slidepanel's location apperant.
window.slidepanel = slidepanel;


///
// Demo
///

jQuery(document).ready(function($) {

    slidepanel.init();

    $('.primer-panel-button').on('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        slidepanel.toggle('panel');
    });

    $('.primer-drawer-button').on('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        slidepanel.toggle('drawer');
    });

    $('.primer-basement-button').on('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        slidepanel.toggle('basement');
    });

});
