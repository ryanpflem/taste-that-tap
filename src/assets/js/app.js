$(document).foundation();

$(document).ready(function () {

	var params,
			searchType,
			lat,
			lng,
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
	var myData = MyApp.data;

	//----------------------------------------
	//DOM event handlers
	//----------------------------------------

	//Toggle active class on selected menu item
	$menuItem.on('click', function () {
		if ( $(this).siblings().hasClass('active') ) {
			$(this).siblings().removeClass('active'); 
		}
		$(this).toggleClass('active');
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

	function toggleDesc ($breweryId) {
		$contentFeed.on('click', $(this), function () {
			var $this = $(this);
			console.log($this)
		});
	}

	//----------------------------------------
	//Search and Response functions
	//----------------------------------------

	//SearchParams contructor function
	function SearchParams ($q, type, withBreweries, searchType) {
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

	//Search for breweries by geo location
	function getGeoSearchParams ($radius) {
		console.log('getting SearchGeo parameters');
		params = new SearchGeoPointParams(lat, lng, $radius, searchType);  //New params instance
		console.log('params =');
		console.log(params);
		
		truthy(params);  //Exec truthy fn
		console.log('params =');
		console.log(params);

		postResponse(params, searchType);  //Exec postResponse fn
	}

	//Search for breweries by name
	function getBrewerSearchParams ($q) {
		console.log('getting Search parameters');
		var type = 'brewery';
		var withBreweries = 'Y';
		
		params = new SearchParams($q, type, withBreweries, searchType);  //New params instance
		console.log('params =');
		console.log(params);
		
		truthy(params);  //Exec truthy fn
		console.log('params =');
		console.log(params);
		
		postResponse(params, searchType);  //Exec postResponse fn
	}

	//Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
	function truthy (params) {
		console.log('removing falsy values');
	  for (var i in params) {
	    if (!params[i]) {
	      delete params[i];
	    }
	  }
	  params = params;
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
		},1000);
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

	//Extract data from geoPointResponse searchType
	function geoPointResponse (response, searchType) {		
		myData.length = 0; //empty myData array

		console.log('geoPointResponse GET success');
		console.log('response = ');
		console.log(response);
	 	Object.keys(response).forEach(function (key) {
	  	var breweries = response[key];
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
		  			breweryLocality: breweryLocality,
		  			breweryRegion: breweryRegion,
		  			breweryId: breweryId
		  		});

		  		var $breweryId = $('.breweryId-' + breweryId);
		  		toggleDesc($breweryId);				
		  	}
		});
		console.log('myData =');
		console.log(myData);		
		populateData(myData, searchType);
	}

	//Extract data from brewerQueryResponse searchType
	function brewerQueryResponse (response, searchType) {
		myData.length = 0; //empty myData array

		console.log('brewerQueryResponse GET success');
		console.log('response = ');
		console.log(response);
	 	Object.keys(response).forEach(function (key) {
	  	var breweries = response[key];
	  	console.log('breweries = ');
	  	console.log(breweries);

	  	for (var i = 0; i < breweries.length; i++) {
	  		var breweryName = breweries[i].name;
	  		var breweryImages = breweries[i].images;
	  		var breweryDesc = breweries[i].description;
	  		var breweryDescShort;
	  		
	  		//build content object
	  		myData.push({
	  			breweryName: breweryName,
	  			breweryImages: breweryImages,
	  			breweryDesc: breweryDesc,
	  			breweryDescShort: breweryDescShort
	  		});
	  	}

		});
		console.log('myData =');
		console.log(myData);
		populateData(myData, searchType);
	}

	//Handle undefined values
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
		}
	}

	//Compile Handlebarsjs templates
	function compile (myData, searchType) {		
		console.log('compile started')

		switch (searchType) {
			case 'searchGeoPoint':
				var source = $('#searchGeoPointTemplate').html();
				var template = Handlebars.compile(source);
			  return template(myData);
				break;
			case 'searchBrewerQuery':
				var source = $('#searchBreweryQueryTemplate').html();
				var template = Handlebars.compile(source);
			  return template(myData);
				break;
			default:
				// statements_def
				break;
		}
	}

	//Render the templates
	function populateData (myData, searchType) {
		editData(myData);  //Edit the undefined objects in myData
		console.log('myData =');
		console.log(myData)
		console.log(searchType)
		
		$contentFeed.empty();  //Empty content feed on new search response
		$bgImg.removeClass('bg-img-repeat');  //Remove bg-img-repeat class on new search response

		for (var i=0; i<myData.length; ++i) {
	    var newData = compile(myData[i], searchType);  //Compile all the data in the array

	    if (myData.length > 7) {
	    	$bgImg.addClass('bg-img-repeat');  //Add bg-img-repeat class when more than 8 objects
	    }
	    $contentFeed.append(newData);  //Append all the data in the content feed
	  }
	}

	//Will request user to allow geo location
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

	console.log('ready');
});
