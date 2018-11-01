/*
.......................................................
.                ????? ?????? ? ????                  .
.                ?????? ?? 18.08.2015                 .
.                                                     .
.                  (C) By Protocoder                  .
.                     protocoder.ru                   .
.                                                     .
. ???????????????? ?? ???????? Creative Commons BY-NC .
.   http://creativecommons.org/licenses/by-nc/3.0/    .
.......................................................
*/
function ymCal( o, c, dir, month, year, handler, zIndex, distance ) {
    var monthNames = [ "January","February","March","April","May","June","July","August","September","October","November","December" ];

    var cd = new Date();
    var cy = cd.getFullYear(), cm = cd.getMonth() + 1;

    if ( month === null || month === undefined ) month = cm;
    if ( month < 1 || month > 12 ) month = 0;
    if ( year === null || year === undefined ) year = cy;
    var sy = year !== 0 && ( year < cy - 3 || year > cy + 2 ) ? year - 3 : cy - 3;

    if ( !zIndex ) zIndex = 100;

    if ( !c ) c = document.body;

    if ( distance === null || distance === undefined ) distance = 5;

    if ( dir != "left" && dir != "right" && dir != "top" && dir != "bottom" ) dir = "right";

    var $o = $( o );

    var html = '<div class="ymCal ym' + dir.substring( 0, 1 ).toUpperCase() + dir.substring( 1 ) + '"><div class="ugol"><div></div></div><div class="msg"><table cellspacing="0" cellpadding="0" border="0">';
    html += '<tr><td colspan="2" class="mc"><div class="btn mDec">\u25B2</div></td><td class="yc"><div class="btn yDec">\u25B2</div></td></tr>';
    for ( var i  = 0, m1 = 1, m2 = 7, y = sy; i < 6; i++, m1++, m2++, y++ ) {
        html += '<tr>';
        html += '<td class="m" data-m="' + m1 + '"><div><span>' + ( ( m1 < 10 ? "0" : "" ) + m1 ) + ". </span>" + monthNames[m1 - 1].toLowerCase() + '</div></td>';
        html += '<td class="m" data-m="' + m2 + '"><div><span>' + ( ( m2 < 10 ? "0" : "" ) + m2 ) + ". </span>" + monthNames[m2 - 1].toLowerCase() + '</div></td>';
        html += '<td class="y" data-y="' + y + '"><div>' + y + '</div></td></tr>';

    }
    html += '<tr><td colspan="2" class="mc"><div class="btn mInc">\u25BC</div></td><td class="yc"><div class="btn yInc">\u25BC</div></td></tr>';
    html += '</table><div class="btn ok">OK</div><div class="btn curDate" title="??????? ????">&#x25CF;</div><div class="btn cancel">Cancel</div></div></div>';

    var $d = $( html );

    $d.css( {
        "position":	"absolute",
        "display":	"none",
        "opacity":	0,
        "z-index":	zIndex
    } );
    $d.appendTo( c );
    html = undefined;

    var iface = {
        get: function() {
            return {
                cMonth:		cm,
                cYear:		cy,
                sYear:		sy,
                month:		month ? month : null,
                year:		year ? year : null,
                obj:		$o[0],
                dom:		$d[0],
                "interface":iface
            }
        },

        clear: function() {
            year = 0;
            month = 0;
            refreshSel();
        },

        set: function( m, y, sYear, cMonth, cYear ) {
            if ( year ) year = y;
            if ( month ) month = m;

            if ( cMonth ) cm = cMonth;
            if ( cYear ) cy = cYear;
            if ( sYear ) sy = sYear;

            if ( year && year < sy && !sYear ) sy = year - 3;

            refreshYears();
            refreshSel();
        },

        show: function( state ) {
            if ( state ) {
                if ( $d.css( "opacity" ) > 0 ) return;

                $d.stop( true, false );

                var c = $o.offset();
                var ow = $o.outerWidth();
                var oh = $o.outerHeight();

                $d.css( {
                    "display":	"inline-block",
                    "opacity": 0
                } );

                if ( dir == "right" ) {
                    c.left += distance + ow;
                    c.top += ( oh >> 1 ) - ( $d.outerHeight( true ) >> 1 );
                }

                if ( dir == "left" ) {
                    c.left += distance - $d.outerWidth( true );
                    c.top += ( oh >> 1 ) - ( $d.outerHeight( true ) >> 1 );
                }

                if ( dir == "top" ) {
                    c.left += ( ow >> 1 ) - ( $d.outerWidth() >> 1 );
                    c.top += distance - $d.outerHeight( true );
                }

                if ( dir == "bottom" ) {
                    c.left += ( ow >> 1 ) - ( $d.outerWidth( true ) >> 1 );
                    c.top += distance + oh;
                }

                $d.css( {
                    left: c.left + "px",
                    top: c.top + "px"
                } );

                c = undefined;

                $( document ).off( "mousedown", hide ).on( "mousedown", hide );
                $d.fadeTo( "fast", 1 );

                eHandler( "show" );
            }
            else {
                if ( $d.css( "display" ) == "none" ) return;
                hide();
            }
        }
    };

    function hide( e ) {
        if ( e ) {
            if ( e.target && $.contains( $d[0], e.target ) ) return;

            eHandler( "outside" );
        }

        $d.stop( true, false ).fadeTo( "fast", 0, function() { $d.css( "display", "none" ); } );
        $( document ).off( "mousedown", hide );

        eHandler( "hide" );
    }

    function eHandler( event ) {
        if ( handler ) handler(
            event,
            month ? month : 0,
            year ? year : 0,
            iface.get()
        );
    }

    eHandler( "created" );

    var $m = $d.find( '.m' );
    var $y = $d.find( '.y' );
    function refreshSel() {
        $m.removeClass( "cur" );
        $y.removeClass( "cur" ).filter( '[data-y=' + cy + ']:first' ).addClass( "cur" );
        if ( year == cy ) $m.filter( '[data-m=' + cm + ']:first' ).addClass( "cur" );

        $m.removeClass( "sel" ).filter( '[data-m=' + month + ']:first' ).addClass( "sel" );
        $y.removeClass( "sel" ).filter( '[data-y=' + year + ']:first' ).addClass( "sel" );
    }

    function refreshYears() {
        for ( var i  = 0; i < $y.length; i++ ) $y.eq( i ).attr( "data-y", sy + i ).find( "div:first" ).html( sy + i );
    }

    refreshSel();

    $d.click( function( e ) {
        var el = e.target;

        while ( el && el.tagName != "TD" ) el = el.parentNode;

        if ( el ) {
            if ( el.hasAttribute( "data-m" ) ) month = parseInt( el.getAttribute( "data-m" ), 10 );
            if ( el.hasAttribute( "data-y" ) ) year = parseInt( el.getAttribute( "data-y" ), 10 );

            refreshSel();
        }
    } );

    $d.find( ".mInc:first" ).click( function( e ) {
        if ( !month ) month = 1;
        else {
            month++;
            if ( month > 12 ) {
                month = 1;
                $d.find( ".yInc:first" ).click();
                return;
            }
        }
        refreshSel();
    } ).attr( "unselectable", "on" ).css( "user-select", "none" ).on( "selectstart", false );

    $d.find( ".mDec:first" ).click( function( e ) {
        if ( !month ) month = 12;
        else {
            month--;
            if ( month < 1 ) {
                month = 12;
                $d.find( ".yDec:first" ).click();
                return;
            }
        }
        refreshSel();
    } ).attr( "unselectable", "on" ).css( "user-select", "none" ).on( "selectstart", false );

    $d.find( ".yInc:first" ).click( function( e ) {
        if ( !year ) year = cy;
        else year++;

        if ( year >= sy + 6 ) sy++;

        refreshYears();
        refreshSel();
    } ).attr( "unselectable", "on" ).css( "user-select", "none" ).on( "selectstart", false );

    $d.find( ".yDec:first" ).click( function( e ) {
        if ( !year ) year = cy;
        else year--;

        if ( year < sy ) sy--;

        refreshYears();
        refreshSel();
    } ).attr( "unselectable", "on" ).css( "user-select", "none" ).on( "selectstart", false );

    $d.find( ".ok:first" ).click( function( e ) {
        eHandler( "ok" );

        hide();
    } );

    $d.find( ".curDate:first" ).click( function( e ) {
        if ( cy < sy || cy >= sy + 6 ) sy = cy - 3;
        refreshYears();
        month = cm;
        year = cy;
        refreshSel();
    } );

    $d.find( ".cancel:first" ).click( function( e ) {
        e.stopPropagation();
        eHandler( "cancel" );

        hide();
    } );

    $o.click( function() { iface.show( true ); } );

    return iface;
}
