// ==UserScript==
// @name         TZ Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  TwojaZagroda.pl bot to post oferts from eShop to OLX
// @author       Mateusz Kulik
// @match        http*://twojazagroda.pl/*
// @match        http*://www.twojazagroda.pl/*
// @match        http*://olx.pl/*
// @match        http*://www.olx.pl/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==

(function() {
    'use strict';


     //init GM values
     if( window.location.href.indexOf( 'Regulamin-Newsletter-SMS' ) > -1 ){
        GM_setValue('price', '');
        GM_setValue('title', '');
        GM_setValue('descr', '');
        GM_setValue('img_file', '');
        GM_setValue( 'pro_img', 'false' );
        GM_setValue( 'url_tz', '' );
        GM_setValue( 'OLX_ready', '' );
        var i = 0;
     }
     // init values
     var url_tz;
     // products array
     var products_tz = [''];

     //empty array
     //var products_tz = [];


    //use this site to make array from links https://delim.co/#



// main page for script launch - https://www.twojazagroda.pl/pl/i/Regulamin-Newsletter-SMS/27

 if( window.location.href.indexOf( 'Regulamin-Newsletter-SMS' ) > -1 ){


     //first init open product page
     url_tz = products_tz[i];
     GM_setValue( 'url_tz', url_tz );
     // go to product page
     var tz_tab = window.open( url_tz , '_blank' );


     // event listener for OLX_ready variable
     GM_addValueChangeListener("OLX_ready", function() {
         // if  yes then product is done and can go to another one
         if( GM_getValue( 'OLX_ready' ) == '1' ) {
             i++;
             // if there are products to scrape
             if ( i != products_tz.length ) {
                 url_tz = products_tz[ i ];
                 GM_setValue( 'url_tz', url_tz );
                 // go to another product page
                 var tz_tab = window.open( url_tz , '_blank' );
             }
         }
       });


    }



function twojazagroda(){

    //////// PRODUCT PAGE ////////

    var win_location_tz = null;
    win_location_tz = window.location.href;

    // reset variable for product ready - event listener for OLX_ready
    GM_setValue( 'OLX_ready', '0' );

    // debug console.logs
    // console.log(win_location_tz +' aktualna lokalizacja');
    // console.log(GM_getValue( 'url_tz' ) +' lokalizacja produktu');

    // if on product page
    if( win_location_tz == GM_getValue( 'url_tz' ) ){

    // init get values
    var title_raw = document.getElementsByClassName( 'name' )[0].innerHTML;
    var price_raw = document.getElementsByClassName( 'main-price' )[0].innerHTML;
    var descr_raw = document.querySelector( '[itemprop=description]' );
    var elementp = '';
    var img_link = document.createElement('a');
    var img_url = document.getElementsByClassName( 'mainimg row' )[0].getElementsByTagName( 'img' )[0].src;
    var temp_name = 0;
    var img_name = 'Produkt_zdjecie_TZ' + temp_name;
    var no_image_test = /overlay/.test(img_url);
    var product_scrap = false;


    // for each loop change name +1
    temp_name++;

    // get title
    // trim spaces before and afer title and transform it to LoweCase
    var title = title_raw.trim().toLowerCase();
    // make first letter UpperCase and join it
    title = title.charAt( 0 ).toUpperCase() + title.slice( 1 );
    // replace in title over 4 numbers and stings after that to first space, replace to nothing
    title = title.replace(/\d{4,}\/*\w*\/*\w*/g,'');
    // replace in title producents name to First letter UpperCase
    title = title.replace(/zetor/g,'Zetor').replace(/ursus/g,'Ursus');
    // set title to GM
    GM_setValue('title', title);
    // set raw title to GM
    GM_setValue('title_raw', title_raw.trim());



    // get price
    var price = price_raw.match(/^\d{1,}.*,\d{1,}/)[0].replace( '&nbsp;','' );
    // set price to GM
     GM_setValue('price', price);



    // check if product have description
    if (descr_raw != null){
      // if has join it to one piece
      var descr = descr_raw.querySelectorAll( ':scope p' );
      descr = descr.forEach( function ( elementp_raw ) {
        elementp = elementp + elementp_raw.innerHTML;
      } );
      // delete br tags
      elementp = elementp.split( '<br>' ).join( ' ' );
    }
    else {
        // if doesn't have add general info
      elementp = 'Wszystkie szczegóły dostępne po kontakcie telefonicznym';
    }

    // set descr to GM
    GM_setValue('descr', elementp);


    // check if product have image

    if ( no_image_test == false ){
        // if has - download it
       img_link.setAttribute( 'href', img_url );
       img_link.setAttribute( 'download', img_name );
       img_link.setAttribute( 'target', '_blank' );
       img_link.style.display = 'none';
       document.body.appendChild ( img_link );
       img_link.click();
       document.body.removeChild( img_link );
       GM_setValue( 'pro_img', 'true' );
    }



    // console logs for debug

    //  console.log( title );
    //  console.log( price );
    //  console.log( descr_raw );
    //  console.log( elementp );



    // done product scrpaping
    product_scrap = 1;
    // window.close();

    // open OLX page
    var url_olx_add = 'https://www.olx.pl/nowe-ogloszenie/';
    window.close();
    window.open( url_olx_add , '_blank' );

 }

    // end function twojazagroda
}

// call function
twojazagroda();



function olx(){


     //////// OLX PAGE ////////


     // set OLX page
     var url_olx_add = 'https://www.olx.pl/nowe-ogloszenie/';

     // temp variables
     var olx_temp1 = false;
     var olx_temp2 = false;
     var olx_temp3 = false;
     var olx_temp4 = false;
     var olx_ready = 0;
     // desc with title
     var desc_full = null;
     var win_location_olx = null;

     // get acutal location
     win_location_olx = window.location.href;

     // console logs for debug
     // console.log(win_location_olx +' loklaizacja aktualna');
     // console.log(url_olx_add +' loklaizacja olx');

    // if at OLX page
    if( win_location_olx == url_olx_add){
       desc_full = GM_getValue( 'title_raw' ) + '. ' + GM_getValue( 'descr' );
       document.getElementById( 'add-description' ).value = desc_full;
       olx_ready++;
       document.getElementById( 'add-phone' ).value = '533 111 477';
       olx_ready++;
       // click on select for category choose
       document.getElementById('targetrenderSelect1-0').click();



        // function for wait for element and click it

        function waitForElementToDisplayAndClick( selector, time ) {
        if( document.querySelector( selector )!= null) {
            document.querySelector( selector ).click();
            return;
        }
        else {
            setTimeout( function() {
                waitForElementToDisplayAndClick( selector, time );
            }, time );
        }
    }

          // function for wait for price element and input value

        function waitForPrice(selector, time) {
        if(document.querySelector( selector )!= null) {
            document.querySelector( selector ).value = GM_getValue( 'price' );
            olx_temp1 = true;
            olx_ready++;
            return;
        }
        else {
            setTimeout( function() {
                waitForPrice( selector, time );
            }, time );
        }
    }


         // function for wait for type of the offer and clik to show options

        function waitForOfferType( selector, time ) {
        if( olx_temp1 == true ) {
            document.querySelector( selector ).click();
            olx_temp2 = true;
            return;
        }
        else {
            setTimeout( function() {
                waitForOfferType( selector, time );
            }, time);
        }
    }



        // function for wait for type of the offer and choose business

        function waitForOfferTypeBusiness( selector, time ) {
        if(olx_temp2 == true) {
            document.querySelectorAll( selector )[3].click();
            olx_temp3 = true;
            olx_ready++;
            return;
        }
        else {
            setTimeout( function() {
                waitForOfferTypeBusiness( selector, time );
            }, time);
        }
    }


          // function for wait for element and upload

        function waitForElementsReadyAndUpload(selector, time ) {
        if( olx_temp3 == true ) {
            document.querySelector( selector ).click();
            olx_temp4 = true;
            return;
        }
        else {
            setTimeout( function() {
                waitForElementsReadyAndUpload( selector, time );
            }, time );
        }
    }

        // function for wait for upload ready

        function waitForUploadReady( time ) {
           if( olx_temp4 == true && document.querySelector( '.photos-show-mini #add-img-1' ) != null ){
                  olx_ready++;
                  return;
            }
           else {
              setTimeout( function() {
                 waitForUploadReady( time );
               }, time );
           }
    }



        // function for product added and complete

        function waitForOfferReady( time ) {
           // console log for debug
           // console.log( olx_ready );
           // check if all steps of product adding to OLX are done (done number is 6)
           if( olx_ready == 6 ){
             // save and go next
             waitForElementToDisplayAndClick( '#save.cfff', 1000 );
             return;
           }
           else {
              setTimeout( function() {
                 waitForOfferReady( time );
               }, time );
           }
        }


        // call functions for product paremeters

        //choose Rolnictwo category
        waitForElementToDisplayAndClick( '.cat-icon-757', 1000 );
        //choose Czesci do maszyn rolniczych subcategory
        waitForElementToDisplayAndClick( '[data-category="1265"]', 2000 );
        waitForPrice( '.paramPriceInput', 1000 );
        waitForOfferType( '#targetid_private_business a', 1000 );
        waitForOfferTypeBusiness( '#targetid_private_business a', 1000 );

        //add title - it must be here (that low) to properly choose category and subcategory - if title will be filled out earlier OLX will suggest and limit categories
        document.getElementById( 'add-title' ).value = GM_getValue( 'title' );
        olx_ready++;

        // if product has image
        if( GM_getValue('pro_img') == 'true' ) {
           waitForElementsReadyAndUpload( '#add-file-1 a', 1000 );
           waitForUploadReady( 1000 );
        }
        else{
        // if doesn't have
           olx_ready++;
        }

        // check if product is added to OLX
       waitForOfferReady( 1000 );


//end if lokalizacja olx

    }

  //end of olx function
}


// call function for OLX
olx();






    function olx_success(){


     //////// OLX SUCCESS PAGE ////////


     // get acutal location
    var win_location_olx = window.location.href;


    // if at OLX page
    if( win_location_olx.search(/(bundles\/promote)*/g) === 0 ){



        // function for wait for element and click it

        function waitForElementToDisplayAndClick( selector, time ) {
        if( document.querySelector( selector )!= null) {
            document.querySelector( selector ).click();
            return;
        }
        else {
            setTimeout( function() {
                waitForElementToDisplayAndClick( selector, time );
            }, time );
        }
    }

         //kolejne przejscie dalej bez promowania
         waitForElementToDisplayAndClick( '.qa-button-promo-without', 1000 );




         // function for wait for element and click it - final function

        function waitForElementToDisplayAndClickFinish( selector, time ) {
        if( document.querySelector( selector )!= null) {
            document.querySelector( selector ).click();
            // set variable for product done scrapping and added to olx
            GM_setValue( 'OLX_ready', '1' );
            // console.log(GM_getValue( 'OLX_ready' ));
            //reset variables after product scrapping and adding it to OLX
            GM_setValue('price', '');
            GM_setValue('title', '');
            GM_setValue('descr', '');
            GM_setValue('img_file', '');
            GM_setValue( 'pro_img', 'false' );
            GM_setValue( 'url_tz', '' );
            GM_setValue( 'OLX_ready', '' );
            GM_setValue('title_raw', '');
            window.close();
            return;
        }
        else {
            setTimeout( function() {
                waitForElementToDisplayAndClickFinish( selector, time );
            }, time );
        }
    }

             //potwierdzenie dodania ogloszenia i reset parametrow, zamkniecie strony
             waitForElementToDisplayAndClickFinish( '.olx-confirm.olx-confirm--success', 1000 );


    } //end if on olx success page


    } //end olx_success function


olx_success();


})();