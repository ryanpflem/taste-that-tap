$(document).foundation();

$(document).ready(function () {

	var params;
	var q = 'dogfish';
	var type = 'brewery';
	var withBreweries = 'Y';
	
	function postResponse (params) {
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
		 		console.log('POST error');
		  	throw err;
		 	})

		responseClass.getResponse();  //exec getResponse fn
	}

	function getParameters (params) {
		console.log('getting parameters');
		params = new Params(q, type, withBreweries);  //new params instance
		console.log('params =');
		console.log(params);
		truthy(params);  //exec truthy fn
		console.log('params =');
		console.log(params);
		postResponse(params);  //exec postResponse fn
	}

	// Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
	function truthy (params) {
		console.log('removing falsy values');
	  for (var i in params) {
	    if (!params[i]) {
	      delete params[i];
	    }
	  }
	  params = params;
	}

	//Params contructor function
	var Params = function (q, type, withBreweries, name, ids, category, categoryId) {
		this.q = q;
		this.type = type;
		this.withBreweries = withBreweries;
		this.name = name;
		this.ids = ids;
		this.category = category;
		this.categoryId = categoryId;
	}

	$('#breweries').on('click', function (e) {
		e.preventDefault();
		console.log('clicked show me button');
		getParameters(params);
	});

	responseClass.getResponse();
	console.log('ready');

});

var responseClass = (function () {

	function getResponse () {

		console.log('response from server');

	 	$.ajax({
	 		method: 'GET',
	 		url: '/brewdb-api',
	 		dataType: 'json',
	 		timeout: 10000
	 	})
	 		.done(function (response) {
		 		console.log('GET success');
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

					  Object.keys(data).forEach(function (key) {						  	
					  	var value = data[key];
					  	//console.log('key: ' + key + '   value: ' + value);
					  });
					
					});

				});				
		  })
		  .fail(function (err) {
		  	console.log('GET error');
		  	throw err;
		  })

	}

	return {
    getResponse: getResponse
  };

})();