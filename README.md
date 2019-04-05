# Start Page
A start page based on Bootstrap 4 and Material Design 2 (specifically the Google Material Theme).

![alt text](https://github.com/maxdmyers/startpage/raw/master/screenshot.png "Start Page")

Contributors
---
[ars75](https://github.com/ars75)

Dependencies
---
- [Bootstrap](http://getbootstrap.com)
- [Node.js](http://nodejs.org)
- [SASS](http://sass-lang.com/install)
- [Gulp CLI](http://gulpjs.com/)
- [Browsersync](https://browsersync.io/)
- [Google Sans Font](https://devfiles.co/download/vSxQjI5P/Google-Sans-Font.zip)

Setup
---
- Assuming you have installed all the dependencies, 

   `cd` into the project directory

   `npm install`

- Edit `gulpfile.js` and set `devUrl` to your local URL of choice
- Edit `assets/src/js/site.js` and replace bookmarks with your own
- Run `gulp`

Todo
---
- ~~Allow setting of bookmarks in json config~~
- ~~Use javascript to fetch favicons and cache them~~
- ~~Get weather from openweathermap.org api or similar~~
- ~~Dynamically set days and weather icons~~
- ~~Pull zip code from json config for weather~~
- ~~Get Google News from https://newsapi.org/s/google-news-api~~
- Experiment with vertical cards with images for news headlines
- Consider adding autocomplete to search bar
- Improve responsive styling (desktop only for now)
- ~~Improve code quality and legibility~~
- Add options menu
- Add Dark Mode option
- Add option to add bookmark, saving to config file