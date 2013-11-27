$(function (){
	function getResults(d, url, callback){
		$.ajax({
			type: 'POST',
			url: url,
			data: {data: d},
		}).done(function(msg){
			callback(msg);
		});
	}

	function bindSearchResults(){
		$('#search_form').bind('submit', function(e) {
		e.preventDefault();
		var query = $('#share-email').val();
		$('#edit_results_div').html('');

			getResults(query, 'share/search', function(msg){
				var html = '<h2 id="search_results_header"> Search Results: </h2>';
				html = html + '<button type="submit" id="search_edit_button" class="btn btn-primary">User can edit</button>';
				html = html + '<button type="submit" id="search_view_button" class="btn btn-primary">User can view only</button><table id="search_results">';
				for(var i=0; i<msg.length; i++){
					html = html + 	'<tr id="'+msg[i]._id+'" class="searchData">'; 
					// html = html +	'<td class="uid">'+msg[i]._id+'</td>';
					html = html +	'<td>'+msg[i].fname+'</td>';
					html = html +	'<td>'+msg[i].lname+'</td>';
					html = html +	'<td>'+msg[i].username+'</td>';
					html = html +	'<td>'+msg[i].email+'</td>';
					html = html +	'</tr>';
				}
				html = html + '</table></div>';

				$('#search_results_div').html(html);
				$('input').val('');
				onAjaxLoadReadyHandlers();
				return false;
			});
		});
	}

	function bindEditResults(){
		$('#edit_button').bind('click', function() {
			$('#search_results_div').html('');
			getEditResults();
		});
	}


	function getEditResults(){
		getResults('', 'share/edit', function(msg){
		var html = '<h2 id="edit_results_header"> Edit: </h2><button type="submit" id="delete_button" class="btn btn-primary">Delete!</button>';
		html = html + '<button type="submit" id="allow_edit_button" class="btn btn-primary">User can edit</button>';
		html = html + '<button type="submit" id="allow_view_button" class="btn btn-primary">User can view only</button><table id="edit_results">';
		for(var i=0; i<msg.userInfo.length; i++){
			html = html+'<tr id="'+msg.userInfo[i]._id+'" class="searchData">';
			html = html +	'<td>'+msg.userInfo[i].fname+'</td>';
			html = html +	'<td>'+msg.userInfo[i].lname+'</td>';
			html = html +	'<td>'+msg.userInfo[i].email+'</td>';
				if(msg.editInfo[i].edit===true){
					html = html + '<td>Can Edit</td>'
				}
				else{
					html = html + '<td>Can View</td>'
				}
					html = html + '</tr>'
		}
		html = html + '</table></div>'

		$('#edit_results_div').html(html);
		getSidebarResults();
		onAjaxLoadReadyHandlers();
		return false;
		});
	}

	function getSidebarResults(){
		getResults('', 'share/edit', function(msg){
		$('#sharedList').html('');
			var html = '';
			for(var i=0; i<msg.userInfo.length; i++) {
   				html = html + '<li class="sharedData">'+msg.userInfo[i].fname+' '+msg.userInfo[i].lname+'<br>';
   				if(msg.editInfo[i].edit===true){ 
   					html = html + 'Can Edit </li>';
   				} else{ 
   					html = html + 'Can View </li>';
   				} 
   					html = html + '<br>';
				}
			$('#sharedList').html(html); 
			return false;
		});
	}

	function onAjaxLoadReadyHandlers(){
		$('.searchData').bind('click', function(){				//selection highlighting
			var that = $(this);
			var state = that.attr('class');
			$('.selected').each(function(){
					$(this).removeClass('selected');
			})
			if(state !== 'searchData selected'){
				that.addClass('selected');
			}
		});

		$('#search_view_button').bind('click', function(){				//add user from search, able to view
			var id = $('.selected').attr('id');
			getResults(id, '/share/canViewChange', function(){
				getResults(id, '/share/addUser', function(){
				$('#search_results_div').html('');
				getSidebarResults();
				});
			});
		});	
		$('#search_edit_button').bind('click', function(){				//add user from search, able to edit
			var id = $('.selected').attr('id');
			getResults(id, '/share/canEditChange', function(){
				getResults(id, '/share/addUser', function(){
				$('#search_results_div').html('');
				getSidebarResults();
				});
			});
		});	

		$('#allow_edit_button').bind('click', function(){		//change permission from edit users, allowed to edit
			var id = $('.selected').attr('id');
			console.log("id: "+id);
			getResults(id, '/share/canEditChange', function(){
				getSidebarResults();
				getEditResults();
			});
		});
		$('#allow_view_button').bind('click', function(){		//change permission from edit users, allowed to view
			var id = $('.selected').attr('id');
			getResults(id, '/share/canViewChange', function(){
				getSidebarResults();
				getEditResults();
			});
		});		
		$('#delete_button').bind('click', function(){			//delete user from edit useres
			var id = $('.selected').attr('id');
			getResults(id, '/share/deleteUser', function(msg){
				getSidebarResults();
				getEditResults();

			});
		});		
	}



bindSearchResults();
bindEditResults();
});