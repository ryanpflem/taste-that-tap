$(document).foundation();

$(document).ready(function () {

	//----------------------------------------
	//Global variables
	//----------------------------------------

	var params,
			searchType,
			page,
			currentPage,
			numPages,
			totalResponses,
			lat,
			lng,
			source,
			template,
			$menuItem = $('.menu-item'),
			$breweries = $('#breweries'),
			$brewerRadiusBtn = $('#brewerRadiusBtn'),
			$brewerSearch = $('#brewerSearch'),
			$brewerSearchBtn = $('#brewerSearchBtn'), 
			$contentFeed = $('#contentFeed'), 
			$bgImg = $('.bg-img'),
			$searchGeoPoint = $('.search-geo-point'),
			$locationType = $('.location-type'), 
			$location = $('.location'), 
			$distance = $('.distance'), 
			$description = $('.description');


	var MyApp = {};
	MyApp.data = [];
	MyApp.metaData = [];
	var myData = MyApp.data;
	var myMetaData = MyApp.metaData;

	//----------------------------------------
	//DOM event handlers
	//----------------------------------------

	//Toggle active class on selected menu item
	$menuItem.children('a').on('click', function () {
		if ( $(this).parent().siblings().hasClass('active') ) {
			$(this).parent().siblings().removeClass('active'); 
		}
		$(this).parent().toggleClass('active');
	});

	//Exec geo search on brewerRadiusBtn click
	$brewerRadiusBtn.on('click', function (e) {
		e.preventDefault();
		console.log('clicked show me button');

		var $radius = $('input[name=brewerRadius]:checked').val();
		console.log($radius);

		searchType = 'searchGeoPoint';
		console.log(searchType);
		
		getGeoSearchParams($radius);
	});

	//Exec brewer search on brewerSearchBtn click
	$brewerSearchBtn.on('click', function (e) {
		e.preventDefault();
		console.log('clicked brewer serch input');

		var $q = $brewerSearch.val();
		$brewerSearch.val('');  //Clear the input field

		searchType = 'searchBrewerQuery';
		console.log(searchType);
		
		getBrewerSearchParams($q);
	});

	//Submit handler on brewerSearchBtn
	$brewerSearchBtn.on('submit', function(e) {
	  event.preventDefault(e);
	  console.log('Handler for .submit() called')
	  $brewerSearchBtn.trigger('click');  //Trigger the click function on submit
	});

	$('.pagination-previous').on('click', function (e) {
		 e.preventDefault();
		 console.log('clicked prev page btn')
		 console.log(searchType);
		 console.log(currentPage);
		 console.log(numPages);
		 console.log(params);
		 delete params.key;

		 params.p = --currentPage;
		 params.searchType = searchType;

		 console.log(params);
		 postResponse(params, searchType);  //Exec postResponse fn
	});

	$('.pagination-next').on('click', function (e) {
		 e.preventDefault();
		 console.log('clicked next page btn')
		 console.log(searchType);
		 console.log(currentPage);
		 console.log(numPages);
		 console.log(params);
		 delete params.key;

		 params.p = ++currentPage;
		 params.searchType = searchType;

		 console.log(params);
		 postResponse(params, searchType);  //Exec postResponse fn
	});


	function filterStyle (myStyleNames) {
		var filteredStyleNames = [];

		$('#searchStyleCategory').on('change', function () {
			var $defaultCategory = $( '#searchStyleCategory option[value=default]:selected' ).text();
			var $selectedCategory = "";

			$( '#searchStyleCategory option:selected' ).each(function() {
	    	$selectedCategory += $(this).text();
	    	$selectedCategory = $.trim($selectedCategory);
	    });

	    if ($selectedCategory === $defaultCategory) {
	    	filteredStyleNames.length = 0;

	    	for (var i = 0; i < myStyleNames.length; i++) {
	    		var styleCategory = myStyleNames[i].styleCategory;
		    	var styleName = myStyleNames[i].styleName;

	    		filteredStyleNames.push({
	    			styleCategory: styleCategory,
	    			styleName: styleName
	    		});
	    	}
	    } else {
	    	filteredStyleNames.length = 0;

		    for (var i = 0; i < myStyleNames.length; i++) {
		    	var styleCategory = myStyleNames[i].styleCategory;
		    	var styleName = myStyleNames[i].styleName;

		    	if ($selectedCategory === styleCategory) {
		    		filteredStyleNames.push({
		    			styleCategory: styleCategory,
		    			styleName: styleName
		    		});
		    	}
		    }
	    }

	    var defaultStyleName = $('#searchStyleName option[value=default]')
			$('#searchStyleName option').remove();
			$('#searchStyleName').append(defaultStyleName);
	    compileStyles(filteredStyleNames);
		});
	}

	function searchBeerByStyleName (myStyleNames) {		
		$('#searchStyleName').on('change', function () {
			console.log(myStyleNames);

			var $styleName = $('#searchStyleName option:selected').html();
			$styleName = $.trim($styleName);
			console.log($styleName)

			for (var i = 0; i < myStyleNames.length; i++) {
    		var styleId = myStyleNames[i].styleId;
	    	var styleName = myStyleNames[i].styleName;

	    	if (styleName === $styleName) {
	    		var styleToLookUp = styleId;
	    	}    		
    	}

			searchType = 'searchBeerByStyle';
			console.log(searchType);
			console.log(styleToLookUp);

			getBeerByStyleSearchParams(styleToLookUp);
		});
	}


	//----------------------------------------
	//Search and Response functions
	//----------------------------------------


	//remove duplicate values in array of objects
	function cleanup(arr, prop) {
    var newArr = [];
    var lookup  = {};
 
    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }
 
    for (i in lookup) {
        newArr.push(lookup[i]);
    }
    return newArr;
	}

	//Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
	function truthy (Obj) {
		console.log('removing falsy values');
	  for (var i in Obj) {
	    if (!Obj[i]) {
	      delete Obj[i];
	    }
	  }
	  Obj = Obj;
	  return Obj;
	}	
	
	//SearchParams contructor function
	function SearchBrewerNameParams ($q, type, withBreweries, searchType) {
		this.q = $q;
		this.type = type;
		this.withBreweries = withBreweries;
		this.searchType = searchType;
	}

	//SearchGeoPointParams contructor function
	function SearchGeoPointParams (lat, lng, $radius, searchType) {
		this.lat = lat;
		this.lng = lng;
		this.radius = $radius;
		this.searchType = searchType;
	}

	//SearchBeerByStyle contructor function
	function SearchBeerByStyleParams (styleToLookUp, withBreweries, searchType) {
		this.styleId = styleToLookUp;
		this.withBreweries = withBreweries;
		this.searchType = searchType;
	}

	//Search for breweries by geo location
	function getGeoSearchParams ($radius) {
		console.log('getting SearchGeo parameters');
		params = new SearchGeoPointParams(lat, lng, $radius, searchType);  //New params instance
		console.log('params =');
		console.log(params);
		
		params = truthy(params);  //Exec truthy fn
		console.log('params =');
		console.log(params);

		postResponse(params, searchType);  //Exec postResponse fn
	}

	//Search for breweries by name
	function getBrewerSearchParams ($q) {
		console.log('getting Search parameters');
		var type = 'brewery';
		var withBreweries = 'Y';
		
		params = new SearchBrewerNameParams($q, type, withBreweries, searchType);  //New params instance
		console.log('params =');
		console.log(params);
		
		params = truthy(params);  //Exec truthy fn
		console.log('params =');
		console.log(params);
		
		postResponse(params, searchType);  //Exec postResponse fn
	}

	//Search for beers by style Id
	function getBeerByStyleSearchParams (styleToLookUp) {
		console.log('getting BeerSearchByStyle parameters');
		var withBreweries = 'Y';

		params = new SearchBeerByStyleParams(styleToLookUp, withBreweries, searchType);  //New params instance
		console.log('params =');
		console.log(params);
		
		params = truthy(params);  //Exec truthy fn
		console.log('params =');
		console.log(params);

		postResponse(params, searchType);  //Exec postResponse fn
	}

	//Post query params to the server
	function postResponse (params, searchType) {
		console.log('posting response to server');
		console.log(params);

		$.ajax({
	 		method: 'POST',
	 		url: '/search-api',
	 		contentType: 'application/json',
	 		data: JSON.stringify(params),
	 		timeout: 10000
	 	})
		 	.done(function (response) {
		 		console.log('POST success');
		 	})
		 	.fail(function (err) {
		 		//console.log('POST error');
		  	//throw err;
		 	})
		setTimeout(function(){
			getResponse(searchType);  //Exec getResponse fn
		},1500);  //1 sec delay to account for server response latency
	}

	//Get query response from the server
	function getResponse (searchType) {
		console.log('response from server');

	 	$.ajax({
	 		method: 'GET',
	 		url: '/brewdb-api',
	 		dataType: 'json',
	 		timeout: 10000
	 	})
	 		.done(function(response) {
		 		console.log('GET success');
		  	console.log('searchType = '+ searchType);
		  	console.log('response = ');
		  	console.log(response);

			  switch(searchType) {
			  	case 'searchGeoPoint':
			  		geoPointResponse(response, searchType);
			  		break;
			  	case 'searchBrewerQuery':
			  		brewerQueryResponse(response, searchType);
			  		break;
			  	case 'searchBeerByStyle':
			  		beerByStyleQueryResponse(response, searchType);
			  		break;
			  	default:
			  		// statements_def
			  		break;
			  }
			
		  })
		  .fail(function (err) {
		  	console.log('GET error');
		  	throw err;
		  })
	}

	function getStyleResponse () {
		console.log('response from server');

	 	$.ajax({
	 		method: 'GET',
	 		url: '/brewdb-styles-api',
	 		dataType: 'json',
	 		timeout: 10000
	 	})
	 		.done(function(response) {
		 		console.log('GET STYLES success');
		  	console.log('response = ');
		  	console.log(response);

		  	styleResponse(response);	
		  })
		  .fail(function (err) {
		  	console.log('GET error');
		  	throw err;
		  })
	}

	function styleResponse (response) {

	  MyApp.styleCategories = [];
	  MyApp.styleNames = [];
		var myStyleCategories = MyApp.styleCategories;
		var myStyleNames = MyApp.styleNames;

		Object.keys(response).forEach(function (key) {
	  	var stylesObj = response[key];
	  	console.log('stylesObj = ');
	  	console.log(stylesObj);

	  	for (var i = 0; i < stylesObj.length; i++) {
	  		var styleName = stylesObj[i].name;
	  		var styleId = stylesObj[i].id;
	  		var styleCategory = stylesObj[i].category.name;

	  		myStyleCategories.push({
	  			styleCategory: styleCategory
	  		});

	  		myStyleNames.push({
	  			styleName: styleName,
	  			styleId: styleId,
	  			styleCategory: styleCategory
	  		});
	  	}

	  });

	  console.log(myStyleNames);

	  myStyleCategories = cleanup(myStyleCategories, 'styleCategory');

	  filterStyle(myStyleNames);
	  searchBeerByStyleName(myStyleNames);

	  compileCategories(myStyleCategories);
	  compileStyles(myStyleNames);
	}

	//Extract data from geoPointResponse searchType
	function geoPointResponse (response, searchType) {		
		myData.length = 0; //empty myData array
		myMetaData.length = 0;

		console.log('geoPointResponse GET success');
		console.log('response = ');
		console.log(response);
	 	Object.keys(response).forEach(function (key) {
	  	var responseObj = response[key];
	  	console.log('responseObj = ');
	  	console.log(responseObj);

	  	currentPage = responseObj.page;
	  	numPages = responseObj.numPages;
	  	totalResponses = responseObj.data.length;
	  	params = responseObj.params;

	  	myMetaData.push({
		  	totalResponses: totalResponses,
  			currentPage: currentPage,
  			numPages: numPages,
  			params: params
		  });

	  	var breweries = responseObj.data;
	  	console.log('breweries = ');
	  	console.log(breweries);

	  	for (var i = 0; i < breweries.length; i++) {
	  		var breweryName = breweries[i].brewery.name;
	  		var breweryImages = breweries[i].brewery.images;
	  		var breweryDesc = breweries[i].brewery.description;
	  		var breweryDescShort;
	  		var breweryType = breweries[i].locationTypeDisplay;
	  		var breweryDistance = breweries[i].distance;
	  		var breweryWebsite = breweries[i].website;
	  		var breweryWebsiteDisplay;
	  		var breweryLocality = breweries[i].locality;
	  		var breweryRegion = breweries[i].region;
	  		var breweryId = breweries[i].breweryId;

	  		//build content object
	  		myData.push({
	  			breweryName: breweryName,
	  			breweryImages: breweryImages,
	  			breweryDesc: breweryDesc,
	  			breweryDescShort: breweryDescShort,
	  			breweryType: breweryType,
	  			breweryDistance: breweryDistance,
	  			breweryWebsite: breweryWebsite,
	  			breweryWebsiteDisplay: breweryWebsiteDisplay,
	  			breweryLocality: breweryLocality,
	  			breweryRegion: breweryRegion,
	  			breweryId: breweryId,
	  		});
		  }
		});
		console.log('myMetaData =');
		console.log(myMetaData);
		console.log('myData =');
		console.log(myData);

		populateData(myData, myMetaData, searchType);
	}

	//Extract data from brewerQueryResponse searchType
	function brewerQueryResponse (response, searchType) {
		myData.length = 0; //empty myData array
		myMetaData.length = 0;

		console.log('brewerQueryResponse GET success');
		console.log('response = ');
		console.log(response);
	 	Object.keys(response).forEach(function (key) {
	  	var responseObj = response[key];
	  	console.log('responseObj = ');
	  	console.log(responseObj);

	  	currentPage = responseObj.page;
	  	numPages = responseObj.numPages;
	  	totalResponses = responseObj.data.length;
	  	params = responseObj.params;

	  	myMetaData.push({
		  	totalResponses: totalResponses,
  			currentPage: currentPage,
  			numPages: numPages,
  			params: params
		  });

	  	var breweries = responseObj.data;
	  	console.log('breweries = ');
	  	console.log(breweries);

	  	for (var i = 0; i < breweries.length; i++) {
	  		var breweryName = breweries[i].name;
	  		var breweryImages = breweries[i].images;
	  		var breweryDesc = breweries[i].description;
	  		var breweryDescShort;
	  		var breweryWebsite = breweries[i].website;
	  		var breweryWebsiteDisplay;
	  		var breweryEstablished = breweries[i].established;

	  		
	  		//build content object
	  		myData.push({
	  			breweryName: breweryName,
	  			breweryImages: breweryImages,
	  			breweryDesc: breweryDesc,
	  			breweryDescShort: breweryDescShort,
	  			breweryWebsite: breweryWebsite,
	  			breweryWebsiteDisplay: breweryWebsiteDisplay,
	  			breweryEstablished: breweryEstablished
	  		});
	  	}
		});
		console.log('myMetaData =');
		console.log(myMetaData);
		console.log('myData =');
		console.log(myData);
		populateData(myData, myMetaData, searchType);
	}

	function beerByStyleQueryResponse(response, searchType) {
		myData.length = 0; //empty myData array
		myMetaData.length = 0;

		console.log('beerByStyleQueryResponse GET success');
		console.log('response = ');
		console.log(response);
		Object.keys(response).forEach(function (key) {
	  	var responseObj = response[key];
	  	console.log('responseObj = ');
	  	console.log(responseObj);

	  	currentPage = responseObj.page;
	  	numPages = responseObj.numPages;
	  	totalResponses = responseObj.data.length;
	  	params = responseObj.params;

	  	myMetaData.push({
		  	totalResponses: totalResponses,
  			currentPage: currentPage,
  			numPages: numPages,
  			params: params
		  });

	  	var beers = responseObj.data;
	  	console.log('beers = ');
	  	console.log(beers);

	  	for (var i = 0; i < beers.length; i++) {
	  		var beerName = beers[i].name;
	  		var beerDesc;
	  		var breweryName;
	  		var breweryImages;
	  		var breweryWebsite;
	  		var breweryWebsiteDisplay;
	  		var breweryLocality;
	  		var breweryRegion;

	  		if (beers[i].style.description) {
	  			beerDesc = beers[i].style.description;
	  		}

	  		if (beers[i].breweries) {	  			
	  			breweryName = beers[i].breweries[0].name;
		  		breweryImages = beers[i].breweries[0].images;
		  		breweryWebsite = beers[i].breweries[0].website;

		  		if (beers[i].breweries[0].locations) {
	  				breweryLocality = beers[i].breweries[0].locations[0].locality;
		  			breweryRegion = beers[i].breweries[0].locations[0].region;
	  			}		  		
	  		}
	  		
	  		//build content object
	  		myData.push({
	  			beerName: beerName,
	  			beerDesc: beerDesc,
	  			breweryName: breweryName,
	  			breweryImages: breweryImages,
	  			breweryWebsite: breweryWebsite,
	  			breweryWebsiteDisplay: breweryWebsiteDisplay,
	  			breweryLocality: breweryLocality,
	  			breweryRegion: breweryRegion
	  		});
	  	}
		});
		console.log('myMetaData =');
		console.log(myMetaData);
		console.log('myData =');
		console.log(myData);
		populateData(myData, myMetaData, searchType);
	}

	//Handle undefined values and edit key values
	function editData (myData) {
		for (var i=0; i<myData.length; ++i) {
			if (typeof myData[i].breweryDesc === 'undefined') {
				myData[i].breweryDescShort = '';

			} else {
					myData[i].breweryDescShort = myData[i].breweryDesc.slice(0,90) + '...';
			}

			if (typeof myData[i].breweryImages === 'undefined') {
				myData[i].breweryImages = Object.assign({squareLarge: 'http://placehold.it/400.png'});
			}

			if (typeof myData[i].breweryWebsite === 'undefined') {
				myData[i].breweryWebsiteDisplay = '';
			} else if (myData[i].breweryWebsite.startsWith('http://www') === true) {
					myData[i].breweryWebsiteDisplay = myData[i].breweryWebsite.slice(11, -1).substring(0, 25);
			} else if (myData[i].breweryWebsite.startsWith('http://') === true) {
					myData[i].breweryWebsiteDisplay = myData[i].breweryWebsite.slice(7, -1).substring(0, 25);
			}
			if (typeof myData[i].breweryEstablished === 'undefined') {
				myData[i].breweryEstablished = 'N/A';
			}
		}
	}

	//Compile Handlebarsjs templates for style categories
	function compileCategories (myStyleCategories) {
		for (var i=0; i<myStyleCategories.length; ++i) {
	  	source = $('#styleCategoryTemplate').html();
			template = Handlebars.compile(source);
			var categories = template(myStyleCategories[i]);			
		  $('#searchStyleCategory').append(categories);
	  }
	}

	//Compile Handlebarsjs templates for style names
	function compileStyles (myStyleNames) {
		for (var i=0; i<myStyleNames.length; ++i) {
	  	source = $('#styleNameTemplate').html();
			template = Handlebars.compile(source);
			var styles = template(myStyleNames[i]);
		  $('#searchStyleName').append(styles);
	  }
	}

	//Compile Handlebarsjs templates for meta data
	function compileMetaData (myMetaData) {
		$('#metaData').empty();
		for (var i=0; i<myMetaData.length; ++i) {
	  	source = $('#metaDataTemplate').html();
			template = Handlebars.compile(source);
			var metaData = template(myMetaData[i]);
		  $('#metaData').append(metaData);
	  }
	}

	//Check the meta data to see if there are multiple pages
	function addPagination (myMetaData) {
		if (myMetaData[0].numPages > 1) {
	  	$('.pagination').removeClass('hide');

	  	if (myMetaData[0].currentPage === 1) {
	  		$('.pagination-previous').addClass('disabled');
	  	} else {
	  		$('.pagination-previous').removeClass('disabled');
	  	}

	  	if (myMetaData[0].currentPage === myMetaData[0].numPages) {
	  		$('.pagination-next').addClass('disabled');
	  	} else {
	  		$('.pagination-next').removeClass('disabled');
	  	}

	  } else {
	  	$('.pagination').addClass('hide');
	  }
	}

	//Compile Handlebarsjs templates for content feed
	function compileContentFeed (myData, searchType) {
		switch (searchType) {
			case 'searchGeoPoint':
				source = $('#searchGeoPointTemplate').html();
				template = Handlebars.compile(source);
			  return template(myData);
				break;
			case 'searchBrewerQuery':
				source = $('#searchBrewerQueryTemplate').html();
				template = Handlebars.compile(source);
			  return template(myData);
				break;
			case 'searchBeerByStyle':
				source = $('#searchBeerByStyleTemplate').html();
				template = Handlebars.compile(source);
			  return template(myData);
				break;
			default:
				// statements_def
				break;
		}
	}

	//Render the content feed templates
	function populateData (myData, myMetaData, searchType) {
		editData(myData);  //Prep the key values in myData object before compiling in Handlebars
		console.log('myData =');
		console.log(myData)
		console.log(searchType)
		
		$contentFeed.empty();  //Empty content feed on new search response
		$bgImg.removeClass('bg-img-repeat');  //Remove bg-img-repeat class on new search response

		for (var i=0; i<myData.length; ++i) {
	    var newData = compileContentFeed(myData[i], searchType);  //Compile all the data in the array

	    if (myData.length > 7) {
	    	$bgImg.addClass('bg-img-repeat');  //Add bg-img-repeat class when more than 8 objects
	    }
	    $('#landingPage').addClass('hide');
	    $contentFeed.append(newData);  //Append all the data in the $contentFeed
	  }
	  compileMetaData(myMetaData); //Compile meta data
	  addPagination(myMetaData);  //Add pagination
	  $('#mainContent').foundation(); //Re-initialize all plugins within $contentFeed
	}

	//Request user to allow geo location
	function geoFindUser() {
	  if (!navigator.geolocation){
	    console.log('Geolocation is not supported by your browser');
	    return;
	  }

	 	function success(position) {
	    lat  = position.coords.latitude;
	    lng = position.coords.longitude;
	    console.log('Latitude is ' + lat + '° Longitude is ' + lng + '°');
	  };

	  function error() {
	    console.log('Unable to retrieve your location');
	  };

	  navigator.geolocation.getCurrentPosition(success, error);
	}

	geoFindUser();  //Get user location data on page load

	getStyleResponse();  //Get beer styles from API to populate dropdowns on page load

	console.log('ready');
});
