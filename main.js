// ==UserScript==
// @name         TZ Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  TwojaZagroda.pl bot to post oferts from eShop to OLX
// @author       Mateusz Kulik
// @match        https://www.twojazagroda.pl/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==

(function() {
    'use strict';




     //init declarations
     var url_tz = 'https://www.twojazagroda.pl/pl/p/AGREGAT-PRADOTWORCZY-ESE-3200-P-2800W-230V/2745';
     var win_location_olx = null;
     var win_location_tz = null;
     var url_olx_add = 'https://www.olx.pl/nowe-ogloszenie/';
     var executed_tz = false;
     var executed_olx = false;
     var executed_redirect = false;
     var olx_temp1 = false;
     var olx_temp2 = false;
     var olx_temp3 = false;


    //init GM values
  //  GM_setValue('price', '');
  //  GM_setValue('title', '');
  //  GM_setValue('descr', '');
  //  GM_setValue('img_file', '');



if ( executed_redirect == false ) {

    // run script and go to product page
    if( window.location.href.indexOf( 'Regulamin-Newsletter-SMS' ) > -1 ){
     window.open( url_tz , '_blank' );
    }

    win_location_tz = window.location.href;
    executed_redirect = true;
}


if ( executed_tz == false && executed_redirect == true ) {

    //////// PRODUCT PAGE ////////



    // if on product page
    if( win_location_tz == url_tz ){

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
    var title = title_raw.trim().toLowerCase();
    title = title.charAt( 0 ).toUpperCase() + title.slice( 1 );
    // set title to GM
    GM_setValue('title', title);



    // get price
    var price = price_raw.match(/^\d{1,}.*,\d{1,}/)[0].replace( '&nbsp;','' );
    // set price to GM
     GM_setValue('price', price);




            (async () => {
  let count_before = await GM_getValue('count', 0);

  // Note awaiting the set -- required so the next get sees this set.
  await GM_setValue('count', count_before + 1);

  // Get the value again, just to demonstrate order-of-operations.
  let count_after = await GM_getValue('count');

  console.log('Greasemonkey set-and-get Example has run', count_after, 'times');
})();














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
        // if doesn't have
      elementp = 'Wszystkie szczegóły dostępne po kontakcie telefonicznym';
    }

    // set descr to GM
    GM_setValue('descr', elementp);

    // check if product have image

    if ( no_image_test == false ){
        // if has download it
       img_link.setAttribute( 'href', img_url );
       img_link.setAttribute( 'download', img_name );
       img_link.setAttribute( 'target', '_blank' );
       img_link.style.display = 'none';
       document.body.appendChild ( img_link );
       img_link.click();
       document.body.removeChild( img_link );
    }



     // console logs for testing

  //  console.log( title );
  //  console.log( price );
  //  console.log( descr_raw );
  //  console.log( elementp );


    // close page with product
   // window.close();

    // done product scrpaping
    product_scrap = 1;

 }

        executed_tz = true;

}



if (executed_tz == true & executed_olx == false ) {

        //////// OLX PAGE ////////

    if ( product_scrap == true ){
       // open OLX page
       window.open( url_olx_add , '_blank' );
        // reset product scrape variable
        product_scrap = false;
        }

        win_location_olx = window.location.href;



    if( win_location_olx == url_olx_add){
       document.getElementById( 'add-title' ).value = GM_getValue('title');
       document.getElementById( 'add-description' ).value = GM_getValue('descr');
       document.getElementById( 'add-phone' ).value = '533 111 477';
       document.getElementById('targetrenderSelect1-0').click();





        // function for wait for element and click it

        function waitForElementToDisplayAndClick(selector, time) {
        if(document.querySelector(selector)!=null) {
            document.querySelector(selector).click();
            console.log(document.querySelector(selector));
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplayAndClick(selector, time);
            }, time);
        }
    }


          // function for wait for price element and input value

        function waitForPrice(selector, time) {
        if(document.querySelector(selector)!=null) {
            document.querySelector(selector).value = GM_getValue('price');
            olx_temp1 = true;
            return;
        }
        else {
            setTimeout(function() {
                waitForPrice(selector, time);
            }, time);
        }
    }


         // function for wait for type of the offer  input value

        function waitForOfferType(selector, time) {
        if( olx_temp1 == true ) {
            document.querySelector(selector).click();
            olx_temp2 = true;
            return;
        }
        else {
            setTimeout(function() {
                waitForOfferType(selector, time);
            }, time);
        }
    }



        // function for wait for type of the offer  input value

        function waitForOfferTypeBusiness(selector, time) {
        if(olx_temp2 == true) {
            document.querySelectorAll(selector)[2].click();
            olx_temp3 = true;
            return;
        }
        else {
            setTimeout(function() {
                waitForOfferTypeBusiness(selector, time);
            }, time);
        }
    }


          // function for wait for element and upload

        function waitForElementToDisplayAndUpload(selector, time) {
        if(olx_temp3 == true) {
            document.querySelector(selector).click();
            console.log(document.querySelector(selector));
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplayAndUpload(selector, time);
            }, time);
        }
    }


        waitForElementToDisplayAndClick('.cat-icon-757', 1000);
        waitForElementToDisplayAndClick('[data-category="765"]', 2000);
        waitForPrice('.paramPriceInput', 1000);
        waitForOfferType('#targetid_private_business a', 1000);
        waitForOfferTypeBusiness('#targetid_private_business a', 1000);
        waitForElementToDisplayAndUpload('#add-file-1 a', 1000);




    }

  executed_olx = true;
}














})();