function notepad(id, head, value, nowDate){
    // DIV OLUSTURMA
    var div = document.createElement("div"); 
    // <div class="list-item" draggable="true" ondragstart="event.dataTransfer.setData('text/plain',null)"> ... </div>
    div.className = "list-item";             // class="list-item" 
    div.draggable = "true";                  // draggable="true"
    div.ondragstart="event.dataTransfer.setData('text/plain',null)"; // ondragstart="event.dataTransfer.setData('text/plain',null)"
    // PHD OLUSTURMA
    var phd = document.createElement("p"); // <p class="hd">text</p>
    phd.className = "hd";                  // class="hd"
    var hd = document.createTextNode(head);// text
    phd.appendChild(hd);
    // PACİK OLUSTURMA
    var pacik = document.createElement("p");    // <p class="acikla">text</p>
    pacik.className = "acikla";                 // class="acikla"
    var acik = document.createTextNode(value);  // text
    pacik.appendChild(acik);
    // DATE OLUSTURMA
    var date = document.createElement("date");  // <date class="date">text</date>
    date.className = "date";                    // class="date"
    var dt = document.createTextNode(nowDate);  // text
    date.appendChild(dt);
    
    div.appendChild(phd);
    div.appendChild(pacik);
    div.appendChild(date);
    document.getElementById(id).appendChild(div);
}

function push() {
    // input ları alma
    var inputHeader = document.getElementById('hdr').value; // başlık
    var inputDetail = document.getElementById('acikla').value;  // açıklama
    var inputDate = document.getElementById("bitis").value; // string format: yyyy-aa-gg

    // başlıkta boş olursa uyarlı ver
    var sp = inputHeader.split(" ");
    var spBool = true; 
    var say = 0;
    if ( sp.length != 0 ) { // sp dizisin boş değilse gir
        for ( var key in sp) {
            if ( sp[key] == "") {
                ++say;
            }
        }
        if ( sp.length == say ) // 1 == 1
            spBool = false; // alert ver
    }

    // Aynı div Id var mı? varsa uyarlı ver 
    var header = JSON.parse(localStorage.getItem("header")); // local Storage key sin header olan value sunu çek ( value = data )
                            // getItem("header") return -> string 
                            // JSON.parse(return) -> object
    var headerRandomId = uuidv4();
    var bool = true;
    if (header != null) { // null mu?
        for (var key in header){ // ayni div id var mı
            if (header[key] == headerRandomId){
                bool = false;
                break;
            }
        }
    }

    // tarih format ayarlaması Önceki halli -> yyyy-aa-gg Sonraki halli -> gg/aa/yyyy
    if ( inputDate != "") {
        var strDate = inputDate.split("-");
        inputDate = strDate[2] + "/" + strDate[1] + "/" + strDate[0];
    } else
        inputDate = "";

    // Eger baslık bos veya aynısından varsa else ye düş
    if ( spBool && bool){ 
        header.push(headerRandomId);
                //defualt
        notepad("foo", inputHeader, inputDetail,inputDate);
        // dictionary
        dict = {"id": "foo", "divId": headerRandomId ,"head": inputHeader,"detail": inputDetail,"date":inputDate}; 

        var old = localStorage.getItem("data");
        if ( old == null ) {// 
            arr = []; // array
            arr.push(dict);
            localStorage.setItem("data", JSON.stringify(arr));
        } else {
            arr = JSON.parse(localStorage.getItem("data"));
            arr.push(dict);
            localStorage.setItem("data",JSON.stringify(arr));
        }
        // header push
        localStorage.setItem("header",JSON.stringify(header));
    } else {
        alert("Başlık kısmı boş girdiniz...");
    }
}

// RANDOM DIV ID uret
function uuidv4() {
    return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
  

function del() {
    const parent = document.querySelectorAll(".cvr");
    parent.forEach(prnt => { // 3 parent
        ch = prnt.lastElementChild;
        while ( ch.firstChild ) {
            ch.removeChild(ch.firstChild);
        }
    });
    var old = [];
    localStorage.setItem("data", JSON.stringify(old));  // [] -> "[]"string
    localStorage.setItem("header", JSON.stringify(old));
}

// safyayı yenilendindeki olaylar yada ilk açılış olayı
header = []
arr = JSON.parse(localStorage.getItem("data"));
if (arr != null) {
    for(var i = 0; i < arr.length; ++i) {
        var temp = arr[i];
        header.push(temp.divId);
        notepad(temp.id, temp.head, temp.detail, temp.date);
    }
}
                    // key     ,    data
localStorage.setItem("header",JSON.stringify(header));