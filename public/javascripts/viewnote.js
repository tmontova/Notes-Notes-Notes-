$( function () {
	if( $( '#viewNote' ).size() > 0 ) {
		/* TODO:
		 Sidebar:
		 show active users
		 search
		 Download document support
		 */
		var text = $( '#text' );
		var title = $( '#title' );
		var doc;

		var socket = io.connect();

		$.ajax( {
			type : "POST",
			url : '/getnote',
			data : { _id : id},
		} ).done( function ( d ) {
				console.log( "Got document" );
				doc = d;
				text.html( doc.note );
				title.text( doc.title );
			} );

		socket.on( 'connect', function () {
			socket.on( 'view_update', function ( data ) {
				text.html( data.note );
				title.text( data.title );
			} );
		} );

		// var text = $("#text");
		// var download-b = "<div id='download'><a download='Title' href=Download</div>";
		// var navbar = $("#navbar");
		// navbar.append(download-b);

		// }
	}
} )