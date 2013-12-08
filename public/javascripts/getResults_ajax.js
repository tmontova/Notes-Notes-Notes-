function getResults ( d, url, callback ) {
	$.ajax( {
		type : 'POST',
		url : url,
		data : { data : d },
		success : callback
	} );
}

function getSidebarResults () {
	getResults( '', 'share/edit', function ( shared ) {
		$( '#sharedList' ).html( '' );
		var html = '',
			i;
		for ( i = 0; i < shared.length; i++ ) {
			html = html + '<li class="sharedData">' + shared[i].name + ' <br>';
			if ( shared[i].canEdit === true ) {
				html = html + 'Can Edit </li>';
			} else {
				html = html + 'Can View </li>';
			}
			html = html + '<br>';
		}
		$( '#sharedList' ).html( html );
		return false;
	} );
}

function onAjaxLoadReadyHandlers () {
	$( '.searchData' ).on( 'click', function () {				//selection highlighting
		var that = $( this ),
			state = that.attr( 'class' );
		$( '.selected' ).each( function () {
			$( this ).removeClass( 'selected' );
		} );
		if ( state !== 'searchData selected' ) {
			that.addClass( 'selected' );
		}
	} );

	$( '#search_view_button' ).on( 'click', function () {				//add user from search, able to view
		var id = $( '.selected' ).attr( 'id' );
		getResults( id, '/share/canViewChange', function () {
			getResults( id, '/share/addUser', function () {
				$( '#search_results_div' ).html( '' );
				getSidebarResults();
			} );
		} );
	} );

	$( '#search_edit_button' ).on( 'click', function () {				//add user from search, able to edit
		var id = $( '.selected' ).attr( 'id' );
		getResults( id, '/share/canEditChange', function () {
			getResults( id, '/share/addUser', function () {
				$( '#search_results_div' ).html( '' );
				getSidebarResults();
			} );
		} );
	} );

	$( '#allow_edit_button' ).on( 'click', function () {		//change permission from edit users, allowed to edit
		var id = $( '.selected' ).attr( 'id' );
		getResults( id, '/share/canEditChange', function () {
			getSidebarResults();
			getEditResults();
		} );
	} );
	$( '#allow_view_button' ).on( 'click', function () {		//change permission from edit users, allowed to view
		var id = $( '.selected' ).attr( 'id' );
		getResults( id, '/share/canViewChange', function () {
			getSidebarResults();
			getEditResults();
		} );
	} );
	$( '#delete_button' ).on( 'click', function () {			//delete user from edit useres
		var id = $( '.selected' ).attr( 'id' );
		getResults( id, '/share/deleteUser', function ( msg ) {
			getSidebarResults();
			getEditResults();
		} );
	} );
}

function getEditResults () {
	getResults( '', 'share/edit', function ( msg ) {
		var html = '<h2 id="edit_results_header"> Edit: </h2><button type="submit" id="delete_button" class="btn btn-primary">Delete!</button>';
		html = html + '<button type="submit" id="allow_edit_button" class="btn btn-primary">User can edit</button>';
		html = html + '<button type="submit" id="allow_view_button" class="btn btn-primary">User can view only</button><table id="edit_results">';
		for ( var i = 0; i < msg.length; i++ ) {
			html = html + '<tr id="' + msg[i].userid + '" class="searchData">';
			html = html + '<td>' + msg[i].userid + '</td>';
			html = html + '<td>' + msg[i].name + '</td>';
			html = html + '<td>' + msg[i].email + '</td>';
			if ( msg[i].canEdit === true ) {
				html = html + '<td>Can Edit</td>'
			}
			else {
				html = html + '<td>Can View</td>'
			}
			html = html + '</tr>'
		}
		html = html + '</table></div>'

		$( '#edit_results_div' ).html( html );
		getSidebarResults();
		onAjaxLoadReadyHandlers();
		return false;
	} );
}

function bindSearchResults () {
	$( '#search_form' ).on( 'submit', function ( e ) {
		e.preventDefault();

		var query = $( '#share-email' ).val();
		$( '#edit_results_div' ).html( '' );

		getResults( query, '/share/search', function ( data ) {
			console.dir( query );
			var i,
				html = '<h2 id="search_results_header"> Search Results: </h2>';
			html = html + '<button type="submit" id="search_edit_button" class="btn btn-primary">User can edit</button>';
			html = html + '<button type="submit" id="search_view_button" class="btn btn-primary">User can view only</button><table id="search_results">';
			for ( i = 0; i < data.length; i++ ) {
				html = html + '<tr id="' + data[i]._id + '" class="searchData">';
				html = html + '<td class="uid">' + data[i]._id + '</td>';
				html = html + '<td>' + data[i].name + '</td>';
				html = html + '<td>' + data[i].email + '</td>';
				html = html + '</tr>';
			}
			html = html + '</table></div>';

			$( '#search_results_div' ).html( html );
			$( 'input' ).val( '' );
			onAjaxLoadReadyHandlers();
			return false;
		} );
	} );
}

function bindEditResults () {
	$( '#edit_button' ).bind( 'click', function () {
		$( '#search_results_div' ).html( '' );
		getEditResults();
	} );
}

$( function () {
	if( '#search' ){
		bindSearchResults();
		bindEditResults();
	}
} );