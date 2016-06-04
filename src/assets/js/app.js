$(document).foundation();

$(document).ready(function () {

    var myResult = $.getJSON('/brewdb-api', function (response) {
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
				  	console.log('key: ' + key + '   value: ' + value);
				  });
				
				});

			});

    });

});
