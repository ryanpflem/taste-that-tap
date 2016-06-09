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
			$brewerSearchBtn = $('#brewerSearchBtn')

	var focusable = Foundation.Keyboard.findFocusable($('#breweries'));
	console.log(focusable);

	//SearchParams contructor function
	var SearchParams = function($q, type, withBreweries, searchType) {
		this.q = $q;
		this.type = type;
		this.withBreweries = withBreweries;
		this.searchType = searchType;
	}

	//SearchGeoPointParams contructor function
	var SearchGeoPointParams = function(lat, lng, $radius, searchType) {
		this.lat = lat;
		this.lng = lng;
		this.radius = $radius;
		this.searchType = searchType;
	}	

	//Search for breweries by geo location
	function getGeoSearchParams($radius) {
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
	function getBrewerSearchParams($q) {
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
	function truthy(params) {
		console.log('removing falsy values');
	  for (var i in params) {
	    if (!params[i]) {
	      delete params[i];
	    }
	  }
	  params = params;
	}

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
	  $brewerSearchBtn.trigger('click'); //Trigger the click function on submit
	});

	//Post query params to the server
	function postResponse(params, searchType) {
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
			responseClass.getResponse(searchType);  //Exec getResponse fn
		},500);
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

	geoFindUser(); //Get user location data on page load	

	console.log('ready');
});

var responseClass = (function () {

	function getResponse(searchType) {

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
			  		geoPointResponse(response);
			  		break;
			  	case 'searchBrewerQuery':
			  		brewerQueryResponse(response);
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

	function geoPointResponse(response) {
		console.log('geoPointResponse GET success');
		console.log('response = ');
		console.log(response);
	 	Object.keys(response).forEach(function (key) {
	  	var obj = response[key];
	  	console.log('obj = ');
	  	console.log(obj);

			Object.keys(obj).forEach(function (key) {
				var data = obj[key];
			  console.log('data = ');
			  console.log(data);
			  console.log('data.brewery = ');
			  console.log(data.brewery);
			});
		});		
	}

	function brewerQueryResponse(response) {
		console.log('brewerQueryResponse GET success');
		console.log('response = ');
		console.log(response);
	 	Object.keys(response).forEach(function (key) {
	  	var obj = response[key];
	  	console.log('obj = ');
	  	console.log(obj);

			Object.keys(obj).forEach(function (key) {
				var brewer = obj[key];
			  console.log('brewer = ');
			  console.log(brewer);

			  Object.keys(brewer).forEach(function (key) {						  	
			  	var value = brewer[key];
			  	//console.log(key + ': ' + value);
			  });
			});
		});
	}

	return {
    getResponse: getResponse
  };

})();
