$(function(){


$('#search_form').bind('submit', function (e) {
	e.preventDefault();
	var query = '/share/search/?x='+$('#share-email').val();
  window.location.replace(query);  

});

$('#edit_button').bind('click', function (e) {
	e.preventDefault();
  window.location.replace('share/edit');  

});


	$('.classData').bind('click', function(){		//selecting user to share with from search results

		//get data from the database
		//add name to list in database
		//re render
		//add item to name in database
	
	});

	$('#item_to_share').bind('click', function(){
		var conf = window.confirm("Choose new notebook to share?");
		if(conf){
			window.location.replace("/selectNotebook");
		}
	});

$('.searchData').bind('click', function(){
	if($(this).attr('class') != 'searchData selected'){
		$(this).addClass('selected');
	}
	else{
		$(this).removeClass('selected');
	}
});


$('#share_button').bind('click', function(){
	$('.searchData.selected').each(function(){
		console.log($(this).html());

	});
	window.location.replace('/share');
	
});

$('#save_button').bind('click', function(){

	window.location.replace('/share');
	
});





});

