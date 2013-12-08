$( document ).ready( function () {

	/* TODO:
	 navbar:
	 Add Download support
	 Sidebar:
	 Show active users
	 */
	var doc;
	var textE = new nicEditor().panelInstance( 'text-editor' );
	var text = textE.instanceById( 'text-editor' );
	var text_jq = $( "div.nicEdit-main " );
	var title = $( "#title" );
	var title_i = $( "#title_input" );
	

	$.ajax({
		type: "POST",
		url: '/getnote',
		data: { _id : id},
	}).done(function(d){
		console.log("Got document");
		doc = d;
		updateDoc(doc);
	});

 	var socket = io.connect();

	socket.on( "connect", function () {
		socket.emit('subscribe', {id: id});
		socket.on( "view_update", function ( item ) {
			$('li').css('color', 'red');
			$('#save').text("Not Saved");
			updateDoc( item );
		} )
	} );

	function update(item){
			updateData( item );
			updateDoc( item );
			socket.emit( 'doc_change', item);
	}

	// Updates current document on database
	function updateData( item ) {
		if(item){
			$('#save').text("Saving...");
			$('li').css('color', 'red');
			$.ajax( {
				type : "POST",
				url : '/update',
				data : { doc : item }
			} ).done( function ( item ) {
					console.log("Saved on db");
					doc = item;
					$('#save').text("Saved");
					$('li').css('color', 'green');
				} );
		}
	}

	// Updates text, title and tags of current page
	function updateDoc( item ) {
		$('#tagContainer').text(item.tags.join(' '));
		title.text( item.title );
		text.setContent( item.note );	
	}


	function bind_events() {
		// Bind every keyup to a socket event
		text_jq.bind( "keyup", function ( e ) {
			doc.note = text.getContent();
			$('li').css('color', 'red');
			$('#save').text("Not Saved");
			socket.emit( 'doc_change', doc );
		} );

		$('#navAddTag').bind( "click", function( e ) {
			$('#tag_input').attr("value", doc.tags.join(" "));
			var pos = $(this).offset();
			$('#tag_input').slideDown();
			$('#tag_input').offset({top: pos.top+30, left: pos.left});		
		});
		$('#tag_input').bind( 'keydown', function(e) {
			if(event.which == 13) {
				$(this).slideUp();
				doc.tags = $(this).val().split(" ");
				update(doc);
				return false;
			}
		});

		title.bind( "click", function () {
			$( this ).hide();
			title_i.attr( "value", $( this ).text() );
			title_i.show();
		} );
		// Bind enter key(event 13) to title input
		title_i.bind( "keydown", function ( event ) {
			if ( event.which == 13 ) {
				$( this ).hide();
				doc.title = $( this ).val()
				title.show();
				update(doc);
				return false;
			}

		} );

	// Update the db every 10 seconds
	setInterval( function(){
		updateData(doc); }, 10000);
	}
	bind_events();
} );