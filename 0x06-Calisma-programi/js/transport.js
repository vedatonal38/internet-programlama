var dragged;

/* events fired on the draggable target */
/* sürüklenebilir hedefte tetiklenen olaylar */
document.addEventListener("drag", function( event ) {
	
});

document.addEventListener("dragstart", function( event ) {
    // store a ref. on the dragged element
	// bir ref saklayın sürüklenen öğede
    dragged = event.target;
	// make it half transparent
	// yarı şeffaf yap
    event.target.style.opacity = .5;
	// veri güvenliği
	event.dataTransfer.setData("text/plain",null);
});

/* This event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key). */
/* Bu olay, bir sürükleme işlemi sona erdiğinde (bir fare düğmesini bırakarak veya kaçış tuşuna basılarak) tetiklenir. */
document.addEventListener("dragend", function( event ) {
	// reset the transparency
	// şeffaflığı sıfırla
	event.target.style.opacity = "";
});

/* This event is fired continuously when an element or text selection is being dragged and the mouse pointer is over a valid drop target (every 
	50 ms WHEN mouse is not moving ELSE much faster between 5 ms (slow movement) and 1ms (fast movement) approximately. This firing pattern 
	is different than mouseover ) */
/*   Bu olay, bir öğe veya metin seçimi sürüklenirken ve fare imleci geçerli bir bırakma hedefinin üzerindeyken sürekli olarak tetiklenir 
	(her 50 ms'de bir fare hareket etmediğinde ELSE 5 ms (yavaş hareket) ile 1 ms (hızlı hareket) arasında çok daha hızlı hareket etmez. 
	Bu ateşleme modeli fareyle üzerine gelmekten farklıdır). */
document.addEventListener("dragover", function( event ) {
    // prevent default to allow drop
	// düşmeye izin vermek için varsayılanı engelle
	if ( event.target.className == "list" || event.target.className == "copluk" ) {
		event.preventDefault();
	}
});

/* This event is fired when a dragged element or text selection enters a valid drop target. */
/* Bu olay, sürüklenen bir öğe veya metin seçimi geçerli bir bırakma hedefine girdiğinde tetiklenir. */
document.addEventListener("dragenter", function( event ) {
	event.preventDefault();
    // highlight potential drop target when the draggable element enters it
	// sürüklenebilir öğe girdiğinde olası bırakma hedefini vurgulayın
    if ( event.target.className == "list" ) {
        event.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    }
	if ( event.target.className == "copluk" ) {
		event.target.style.backgroundImage = "url(./img/acikCop.png) "
		event.target.style.backgroundRepeat = "no-repeat center"
	}
	
});

/* This event is fired when a dragged element or text selection leaves a valid drop target. */
/* Bu olay, sürüklenen bir öğe veya metin seçimi geçerli bir bırakma hedefinden çıktığında tetiklenir. */
document.addEventListener("dragleave", function( event ) {
    // reset background of potential drop target when the draggable element leaves it
	// sürüklenebilir öğe terk ettiğinde potansiyel bırakma hedefinin arka planını sıfırlayın
    if ( event.target.className == "list" ) {
		event.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
	}
	if ( event.target.className == "copluk" ) {
		event.target.style.backgroundImage = "url(./img/kapalıCop1.png)"
	}
	
});

/* This event is fired when an element or text selection is dropped on a valid drop target. */
/* Bu olay, bir öğe veya metin seçimi geçerli bir bırakma hedefine bırakıldığında tetiklenir. */
document.addEventListener("drop", function( event ) {
    // prevent default action (open as link for some elements)
	// varsayılan eylemi engelleme (bazı öğeler için bağlantı olarak aç)
	event.preventDefault();
    // move dragged elem to the selected drop target
	// sürüklenen elemanı seçilen bırakma hedefine taşı
    if ( event.target.className == "list" ) {
    	event.target.style.background = "";
		targetID = event.target.id;
		// local storage update 
		var head = dragged.firstChild.textContent;
		localStorageUpdate(head, targetID);

		event.target.appendChild( dragged );
	}
	if ( event.target.className == "copluk" ) {
    	event.target.style.background = "";
		dragged.parentNode.removeChild( dragged );
		// local storage delete
		var head = dragged.firstChild.textContent;
		localStorageDelete(head);
    }
});

function localStorageUpdate(head, targetID) {
	var old = JSON.parse(localStorage.getItem("data"));
	for (var i = 0; i< old.length; i++) {
		if (old[i].head == head){
			old[i].id = targetID;
			break;
		}
	}
	localStorage.setItem("data", JSON.stringify(old));
}

function localStorageDelete(head) {
	// local storage verileri silme
	var old = JSON.parse(localStorage.getItem("data"));
	for (var i = 0; i< old.length; i++) {
		if (old[i].head == head){
			old.splice(i, 1)
			break;
		}
	}
	localStorage.setItem("data", JSON.stringify(old));
	// local storage header silme
	var old = JSON.parse(localStorage.getItem("header"));
	for (var i = 0; i< old.length; i++) {
		if (old[i] == head){
			old.splice(i, 1)
			break;
		}
	}
	localStorage.setItem("header", JSON.stringify(old));
}