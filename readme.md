# eShop to OLX bot

This script is for scraping product info from eShop and post a OLX offer with the same info. Multiple products available. One thing that can't be automated is product photo upload.



## Installation

To run in You must install TamperMonkey (i've used it on Chrome):

```
https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=pl
```

Then You must go to specific page on eShop to start script.


## How it works

* Script will scrape title, price, description and download photo of product on eShop,
* If product doesn't have description - it will get general info, if product has description it will scrape it and if description is in 2 parts - it will join it and will delete <br> tags,
* Image will be download to default downloads folder with pattern name product_image_TZ{integer from 0 to 99999}
* Title will be transformed into lower case letters, first letter will be upper case letter,
* Script will go to OLX page with adding new offers, then it will fill out title, price, description, category (category is constant), type of account, phone numer (constant value) and popup dialog to upload image if product has image on eShop,
* Then it will click to post offer
* Will repeat it for other products in array

## Author

Mateusz Kulik