function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for ( var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie
						.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
function ajaxRequest(url,data,succesFunction,errorFunction,completeFunction){
	$.ajax({
        url: url,
        type: "POST",
        beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'))
		},
        data:{"data":data},
        datatype: "json",
        success : function(response,textStatus, jqXHR) {
        	if(succesFunction)
        	succesFunction()
		},
		error : function(jqXHR, textStatus,errorThrown) {
			if(errorFunction){
				errorFunction()
			}else{
				console.log("The following error occured: "+ textStatus,errorThrown);
			}
		},
		complete : function() {
			if(completeFunction)
			completeFunction()
		}
    });
}

function createIconImage(path){
	if(path && path!="None")
		return new google.maps.MarkerImage(path);
}