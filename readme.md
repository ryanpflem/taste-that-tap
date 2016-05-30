# TasteThatTap

## ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) JSD: Final Project

### Overview

**TasteThatTap** is a JavaScript web application that allows users to search for breweries, beers and events all within a SPA (single page application).

### Technolgies

[BreweryDB API](http://www.brewerydb.com/developers)

[Google Maps API](https://developers.google.com/maps/web/)

[geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation)

[Firebase](https://firebase.google.com/)

[ZURB Foundation](http://foundation.zurb.com/)

### RoadMap
### Phase 1:

#### Utilize the following API endpoints:
#### [BreweryDB](http://www.brewerydb.com/developers/docs)

[Endpoint for Search by Geographic Coordinate](http://www.brewerydb.com/developers/docs-endpoint/search_geopoint)

- When given ***lat*** and ***lng*** coordinates and ***radius***, returns brewery information matching criteria.
- Will allow user to search for:
	- Breweries within a specific radius
	- Events within a specific radius

[Endpoint for Brewery -> Location](http://www.brewerydb.com/developers/docs-endpoint/brewery_location)

- Gets a listing of all locations for the specified brewery.
- Will allow for user search with input such as:
	- name
	- region
	- postalCode

[Endpoint for Beer](http://www.brewerydb.com/developers/docs-endpoint/beer_index)

- Gets a listing of all beers. Will allow user to search for beers by name.

[Endpoint for Search](http://www.brewerydb.com/developers/docs-endpoint/search_index)

- Allows for searching all items or just breweries, beers, guilds, or events. Will allow user to search for beers by brewer.

[Endpoint for Search by Style](http://www.brewerydb.com/developers/docs-endpoint/search_style)

- Allows for searching beer styles (i.e. IPA, ale, stout, etc...)

#### [geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation)

- Obtain the user's current location as ***lat*** and ***lng***, with the ```getCurrentPosition()``` method when search is requested.

#### [Google Places API](https://developers.google.com/places/javascript/)

- Use functions in the Google Places JavaScript library to plot and show a map of search results related to ***brewery search*** or ***event search*** triggered by the user.


#### Utilize Firebase

Allow user to sign in with authorization. Store user key and data in the database.

Once signed in, allow the user to **star** breweries, beers or events in a **favorites** node.

### Phase 2:

Develop a **Current Tap List** feature that shows the user the current beers on tap at that brewery (i.e. being served in their restaurant, tasting room)

Could be a combination of user submission and brewer submission by date.
