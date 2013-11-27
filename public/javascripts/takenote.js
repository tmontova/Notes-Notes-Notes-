$(document).ready(function () {

	/* TODO:
			navbar:
				Add Download support
				Add Sharing support
				Add tagging support
			Sidebar:
				Add search capabilities
				Show active users
			User stuff
	*/
	var doc;
	var textE = new nicEditor().panelInstance('text-editor');
	var text = textE.instanceById('text-editor');
	var text_jq = $( "div.nicEdit-main ");
	var title = $("#title");
	var title_i = $("#title_input");

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

	socket.on("connect", function(){

		socket.on("view_update", function(item){
			console.log("wut");
			updateDoc(item);
		})
	});

	// Updates current document on database
	function updateData(item){
		$.ajax({
			type: "POST",
			url: '/update',
			data:{ doc: item }
		}).done(function(item){
			doc = item;
		});
	}
	// Updates text and title of current page
	function updateDoc(item){
		title.text(item.title);
		text.setContent(item.note);
	}

	function bind_events() {
		// Bind every keyup to a socket event
		var i = 0;
		text_jq.bind( "keyup", function(e){
			doc.note = text.getContent();
			// updateData(doc);
			socket.emit('doc_change', doc);

			// Update the doc every 10 keystrokes? Need to figure out when to save doc..
			
			i++;
			console.log(i);
			if (i == 10){
				updateData(doc);
				i = 0;
			}
		});
		title.bind("click", function(){
			$(this).hide();
			title_i.attr( "value", $(this).text() );
			title_i.show();
		});
		// Bind enter key(event 13) to title input
		title_i.bind( "keydown" , function(event) {
			if(event.which == 13){
				$(this).hide();
				doc.title = $(this).val() 
				updateDoc(doc);
				title.show();
				updateData(doc);
				socket.emit('doc_change', doc);
				return false;
		}
		});
	}

	bind_events();
})