$(document).ready(function(){
	var userColor = $('#user').val();
	if (userColor){
		$('body').css('background-color', userColor);
		$('#colorPicker').css('color', userColor);
	}
	$('#colorPick').submit(function () {
		var color = $('#color').val();
		if (color){		
			$.post("/color", { "color": color },
				function(err){
		            if (err){
						console.log('error', err);
					}
					else {
						$('#color').val('');
						$('body').css('background-color', color);
						$('#colorPicker').css('color', color);
					}
		        }, 'json');
		}
		return false;
	});
	console.log($('.commentForm'));
	$('.commentForm').submit(function () {
		var comment = $('#comment').val();
		var photoID = $('.commentForm').parent().attr('id');
		console.log(photoID);
		if(comment){
			console.log('what');
			$.post("/comment", {"message": comment, "id": photoID},
				function(err) {
			   if (err) {
			   	console.log('error', err);
			   }	
			   else {
			   	$('#comment').val('');
			   }
				}, 'json');
		}
		return false;
	});
});