$(document).ready(function(){ // Belge "hazır" olana kadar bir sayfa güvenli bir şekilde değiştirilemez
    //jQuery, bu hazır olma durumunu sizin için algılar.Yani dosya yuklendi "ready" artık degistirilebilir.
    $('.modal').modal();

    /* tüm DOM öğelerini alın ve tüm oyun durumu değişkenlerini ayarlayın */

    
  let cardClassesList = [ // font-awes iconlar
    'fa-diamond',
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-anchor',
    'fa-bolt',
    'fa-bolt',
    'fa-cube',
    'fa-cube',
    'fa-bomb',
    'fa-bomb',
    'fa-bicycle',
    'fa-bicycle',
    'fa-leaf',
    'fa-leaf'
  ];

 // html kısmında script ile github sayfasına bağlanarak aktif ettiğimiz yapısı
 let watch = new StopWatch(); // kronometreyi baslat.    
 // bu kısmı oyunu alanımız için değişkenler
 let modal = document.getElementById('game_modal'); // oyun bitiş panelinin ilk div in id sin
 let modal_instance = M.Modal.getInstance(modal); // Oyun bitis ekranında cikacak yapıları gostermek icin kullanılan bir yapı (instance.open ile aciliyor)
 let deck = document.getElementById('deck');        // Oyun alanını oluşturan ul yapısını secme
 let gradeSpan = document.getElementById('grade'); // oyun bitis ekranında dereceyi gosteren kısım(poor,avarage,great)
 let heartsList = document.getElementById('hearts-list'); // kalplerin olduğu liste ul > il yapısı
 let resetBtn = document.getElementById('reset-btn'); // reset buttonu
 let infoBtn = document.getElementById('info-btn'); // ipucu bilgi buttonu
 let hintBtn = document.getElementById('hint-btn');
 let msgText = document.getElementById('msg-text'); // match-found, no match kısmı
 let movesText = document.getElementById('moves-text'); // hareket sayısı 
 let timeText = document.getElementById('time-text'); // kronometreyi görterme yeri
  // Oyun bitiş paneli için değişkenler
  let time_results = document.getElementById('time_results');
  let moves_results = document.getElementById('moves_results');
  let grade_results = document.getElementById('grade_results');
  let modal_reset_btn = document.getElementById('modal_reset_btn');

  let moves = 0; // toplam hareket sayısını saymak icin degisken
  let grade = 'Great!'; // hareketler sonucunda derecelendirme kısmını gostermek icin yazı

  let isGameOver = false; // oyun bitti mi ? kriteri
  let didGameStart = false; // oyun basladı mı ? kriteri

  let matches = []; // eşleşenleri tutacağımız yapı
  let lastFlipped = null; // tıklanan kağıtla bir sonraki kartı karsılastırma icin kullanulıyor
  let pause = false; // durdur

  gradeSpan.innerText = grade; 
  movesText.innerText = moves;
  timeText.innerText = watch.getTimeString(); // kronometreyi görterme için innerText atama


  function generateCards() {
    let card_classes = shuffle(cardClassesList);
    for(let index = 0; index < card_classes.length; index++) {
      let card_class = card_classes[index];
      let new_elm = createCard(card_class);
      deck.appendChild(new_elm);
    }
  }


  // creates li cards, gives data-card attr to each
  function createCard(card_class) {
    let li = document.createElement('li');                  //          YAPI
    li.classList.add('card');                               // <li class="card card-fa-bolt" data-card="fa-bolt">
    li.classList.add('card-' + card_class);                 // <i class="card-icon fa fa-bolt" data-card="fa-bolt"></i>
    li.setAttribute('data-card', card_class);               // </li>
    let i = document.createElement('i');
    i.classList.add('card-icon', 'fa', card_class);
    i.setAttribute('data-card', card_class);
    li.appendChild(i); 
    /* <li class = "card card-fa-bolt" data-card = "fa-bolt">
            <i class = "card-icon fa fa-bolt" data-card = "fa-bolt"></i>
       </li>
    */
    return li;
  }
  
  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) { // kartların karıştırma için oluşturun metod 
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

    function activateCards() {
        document.querySelectorAll('.card').forEach(function(card) { // <li> tagları al
            card.addEventListener('click', function() { // kartlar tıklama olayı 
               // console.log(card);
                if(didGameStart === false) { // oyuna başlama için ilk tıkladığında krometreyi başlatma 
                    // set timer on first click
                    didGameStart = true;
                    watch.startTimer(function(){
                        timeText.innerText = watch.getTimeString(); // süreyi string olarak baslat "00:01:17"
                    });
                }

                if (card === lastFlipped || matches.includes(card) || pause || isGameOver) {
                    // kartları kendileriyle karşılaştırmayı veya oyun bittiğinde oynamayı engeller
                    return;
                }

                card.classList.add('open', 'show'); // li tag na open ve show diye class ekliyor
                //   1.            2.
                // lastFlipped = card
                if (lastFlipped) { // a previous card was clicked; compare last clicked to this click
                    let thisCard = card.childNodes[0].getAttribute('data-card'); // attribute value alıryor (li nin icinde ki i tagi)
                   // console.log(typeof(thisCard)) //--> string donuyor
                    let lastCard = lastFlipped.childNodes[0].getAttribute('data-card'); // attribute value alıryor (li nin icinde ki i tagi)
                    moves++; // hareket sayısını bir artır
                    movesText.innerText = moves;
                    
                    updateGrade(); // durumu güncelleme

                    if (thisCard === lastCard) {// ilk tıklanan kartla ikinci tıklanan kart eşit mi ?
                        let message = 'match found!';
                        console.log(message);  // konsola match found yaz
                        flash_msg(message);
                        card.classList.add('match'); // card ın classına match'i ekle
                        lastFlipped.classList.add('match'); // lastFlipped'ın içine match ekle
                        matches.push(card); // yukarıda boş olarak tanımladığımız listeye eşleşen kartları ekle
                        matches.push(lastFlipped); // ikinci tıklananı da ekle
                        console.log(matches);
                        lastFlipped = null; 
                        if(matches.length === 16) { // tüm kartlar eşlendi ve matches'ın içi 16 olduğunda oyunu bitir
                          gameOver();
                          return;
                        }
                    } else { // kartları eşleşmediği an 
                      let message = 'no match.';
                      console.log(message);
                      flash_msg(message);
                      pause = true;
                      setTimeout(function() { // aşağıdaki işlemleri gerçekleşrene kadar oyunu pause yap
                        card.classList.remove('open', 'show');
                        lastFlipped.classList.remove('open', 'show');
                        lastFlipped = null;
                        pause = false;
                      }, 1725);
                    }

                } else {
                    // first click, so save it as a reference
                    lastFlipped = card;
                }
            });
        });
    }

    /* add the show/open classes then removes them after timeout */
  function flash_cards() {
    // oyun ilk başladığı anda ya da sayfayı yenilediğimizde tüm kartları göster ve 3 sn sonra kapat
    document.querySelectorAll('.card').forEach(function(card) {
      card.classList.add('open', 'show');
    });
    setTimeout(function(){
      document.querySelectorAll('.card').forEach(function(card) {
        card.classList.remove('open', 'show');
      });
    }, 3000);
  }
  
    // updates grade with every move
    function updateGrade() {
        if(moves > 12) {
            if(grade !== "Average") {
                grade = "Average";
                gradeSispan.innerText = grade;
                heartsList.removeChild(heartsList.children[0]); // children -> il tagları 
            }
        }
        if(moves > 24) {
            if(grade !== "Poor...") {
                grade = "Poor...";
                gradeSpan.innerText = grade;
                heartsList.removeChild(heartsList.children[0]);
            }
        }
    }

    function gameOver(){
      isGameOver = true;
      watch.stopTimer();

      grade_results.innerText = grade;
      moves_results.innerText = moves;
      time_results.innerText = watch.getTimeString();

      modal_instance.open();
    }
  
    // bu fonksiyon cagrildiginda parametre olarak gelen mesajı ekrana 1.725 saniye kadar goster.
    function flash_msg(message) { 
      msgText.innerText = message;
      setTimeout(function(){ msgText.innerText = ''; }, 1725);
    }
   
  function start() {
    generateCards();
    activateCards();
    flash_cards();
  }

  /* Resets the game */
  function resetGame(e) {
    // if(e && e.preventDefault) { e.preventDefault(); }

    // clears board then regenerate cards
    deck.innerHTML = "";
    // start metodu start();
    generateCards();
    activateCards();
    flash_cards();
    //------------
    watch.resetTimer();

    // reset game state
    moves = 0;
    grade = 'Great!';
    isGameOver = false;
    matches = [];
    lastFlipped = null;
    pause = false;
    didGameStart = false;

    // reset DOM state
    heartsList.innerHTML = '';
    heartsList.innerHTML += '<li><i class="fa fa-heart"></i></li>';
    heartsList.innerHTML += '<li><i class="fa fa-heart"></i></li>';
    heartsList.innerHTML += '<li><i class="fa fa-heart"></i></li>';
    gradeSpan.innerText = grade;
    movesText.innerText = moves;
    timeText.innerText = watch.getTimeString();

    flash_msg('New Game!');
    console.log('game re-started.');
  }

  function info() {
    alert('Grading System: \n\n\
    0-12 Moves = Great! \n\
    13-24 Moves = Average \n\
    25+ Moves = Poor...  \
    ');
  }

function getRandomItem(array_obj) {
  return array_obj[Math.floor(Math.random() * array_obj.length)];
}

  function hint() {
    let hiddenCards = Array.from(document.querySelectorAll('.card')).filter(function(card){
//      console.log(card.classList.contains("open"))
      // .contains icerisine girilen yaziyi card'lar icinde arıyor icerirse true icermezse false donuyor
      // false'a esitledik cunku gizli kartlari dondermek istiyoruz
      return card.classList.contains('open') === false;// return true;
    });
    let cardItem = getRandomItem(hiddenCards); // yukarıda ki yapıyı diziye cevir burada diziyi functiona gonder
    let card_name = '.card-' + cardItem.getAttribute('data-card');

    pause = true;
    document.querySelectorAll(card_name).forEach(function(card) { // iki tane eşlesen yapıyı gosterme yeri
      card.classList.add('open', 'show');
    });
    setTimeout(function(){
      document.querySelectorAll(card_name).forEach(function(card) { // 3 sn sonra kartları kapat
        card.classList.remove('open', 'show');
      });
      pause = false;
    }, 3000);
  }
  
  resetBtn.addEventListener('click', resetGame);
  modal_reset_btn.addEventListener('click', resetGame);
  infoBtn.addEventListener('click', info);
  hintBtn.addEventListener("click", hint);

  start();
  
});