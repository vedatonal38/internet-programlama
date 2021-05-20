function pushRules(list) {
    var inputDegeri = document.getElementById('i1').value.toUpperCase();
    // sondaki fazla boşluklar silme
    var templist = inputDegeri.split(" ");
    inputDegeri = "";
    for (var i = 0; i < templist.length; i++){
        if (templist[i] != "")
            inputDegeri += " " + templist[i];
    }
    // li ekleme 
    var retun = varMı(inputDegeri);
    if (!retun && inputDegeri != "") {
        var li = document.createElement("li");
        var rule = document.createTextNode(inputDegeri + "-x1");
        li.appendChild(rule);// malzeme ekleme
        removeBtn(li);       // kaldır buton ekleme
        document.getElementById("list").appendChild(li); // ul ye il ekleme
    }
}
// aynı malzeme varsa miktari artır ve true dönder
function varMı(nesne) { 
    var lst = document.getElementById('list');
    for (var i = 0; i < lst.children.length; i++) {
        var templist = lst.children[i].innerHTML;
        var ns = templist.split("-x");
        if (ns[0] == nesne) {
            ns[1] = parseInt(ns[1]) + 1;
            var vr = ns[0] + "-x" + ns[1];
            lst.children[i].innerHTML = vr;
            removeBtn(lst.children[i]);
            return true;
        }
    }
    return false;
}
// kaldır buton ekle
function removeBtn(btn) {
    var removeBtn = document.createElement("input");
    removeBtn.type = "image";
    removeBtn.className = "kal";
    removeBtn.src = "./img/delete.png";
    removeBtn.alt = "delete";
    removeBtn.onclick = remove;
    btn.appendChild(removeBtn);
}
// kaldır butona tıklayınca mazlameyi hepsini kaldır
function remove(e) {
    var el = e.target;
    el.parentNode.remove();
}
// temizle butonu 
function removeRules() {
    const parent = document.querySelector('#list');
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}