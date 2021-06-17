$(document).ready(function () {

  let sorular = [
    {
      id: 1,
      type: 0,
      path: "./img/1.webp",
      ques: "Kıbrıs Barış harekatı hangi tarihte gerçekleşmiştir?",
      cevaplar: ["1960", "1964", "1972", "1974"],
      cvp: 3 // index
    },
    {
      id: 2,
      type: 1,
      path: "./videos/gs.mp4",
      ques: "Galatasaray hangi yıl UEFA kupasını almıştır?",
      cevaplar: ["1998", "1999", "2000", "2001", "2002"],
      cvp: 2
    },
    {
      id: 3,
      type: 0,// resim
      path: "./img/3.webp",
      ques: "Hangisi kuvvet birimidir?",
      cevaplar: ["Joule", "Newton", "Pascal", "Nouma"],
      cvp: 1
    },
    {
      id: 4,
      type: 1,//video
      path: "./videos/4.mp4",
      ques: "Bir elektrik devresinde direnç hangi harfle gösterilir?",
      cevaplar: ["D", "R", "A"],
      cvp: 1
    },
  ];


  let skor = document.getElementById("puan");
  let soruBaslik = document.getElementById("soru");
  let soruMetin = document.getElementById("soru_metin");
  let imagesVideosDiv = document.getElementById("imagesVideos");
  let cevapText = document.getElementById("cevap");
  let cevapVerdi = false;

  let index = 0;
  let dogruCevap = 0;
  let watch;

  let buttonsAdd = document.getElementById("buttons");

  let startBtn = document.getElementById("startBtn");
  startBtn.addEventListener("click", function () {
    startGame("00:11");
  });

  function startGame(time) {
    watch = new timerStart();
    watch.startTime(time);
    if (index < sorular.length) {
      quizLoad();
      activateButtons();
      cevapVerdi = false;
      cevapText.innerText = "Sorunun cevabı nedir?";
    }
  }

  function next() {
    if (index < sorular.length) {
      setTimeout(function () {
        console.log("Next  " + index);
        startGame("00:11");
      }, 2000);
    } else {
      setTimeout(function () {
        del();
        resetBtnCreate();
        cevapText.innerText = "";
        soruBaslik.innerText = "Oyun Sona Erdi";
        soruMetin.innerText = "Toplam Puanınız : " + dogruCevap + " / " + index;
        createImageTag("./img/gameover.png");
        let resetBtn = document.getElementById("resetBtn");
        resetBtn.addEventListener("click", function () {
          index = 0;
          dogruCevap = 0;
          startGame("00:11");
        });
      }, 2000);
    }
  }

  // <button id="resetBtn" class="btn defuatBtn">YENİDEN BAŞLAT</button>
  function resetBtnCreate() {
    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("defuatBtn");
    button.setAttribute("id", "resetBtn");
    var txt = document.createTextNode("YENİDEN BAŞLAT");
    button.appendChild(txt);
    buttonsAdd.appendChild(button);
  }

  function quizLoad() {
    var soru = sorular[index];
    del();
    soruBaslik.innerText = "Soru #" + soru.id;
    soruMetin.innerText = soru.ques;
    if (soru.type === 0) {
      // images
      createImageTag(soru.path);
    } else if (soru.type === 1) {
      // videos
      var video = document.createElement("video");
      video.setAttribute("id", "pic");
      video.setAttribute("autoplay", "autoplay");
      video.classList.add("iv");
      // <video id ="pic", autoplay = "autoplay" class = "iv"></video>
      var source = document.createElement("source");
      source.src = soru.path;
      source.type = "video/mp4";
      // <source src = path type ="video/mp4"></source>
      video.appendChild(source);
      /*
      <video id ="pic", autoplay = "autoplay" class = "iv">
          <source src = path type ="video/mp4"></source>
      </video>
      */ 
      imagesVideosDiv.appendChild(video);
      /*
       <div id="imagesVideos" class="row imageDiv">
        <video id ="pic", autoplay = "autoplay" class = "iv">
          <source src = path type ="video/mp4"></source>
        </video>
       </div>
      */
    }
    index++;
    for (let i = 0; i < soru.cevaplar.length; i++) {
      const element = soru.cevaplar[i];
      var button = document.createElement("button");
      button.classList.add("btn");
      button.classList.add("defuatBtn");
      button.classList.add("cvpBtn");
      button.setAttribute("id", "c" + i);
      var txt = document.createTextNode(element);
      button.appendChild(txt);
      buttonsAdd.appendChild(button);
    }
    skor.innerText = dogruCevap + " / " + index;
  }
  
  function createImageTag(path) {
    var img = document.createElement("img");
    img.setAttribute("id", "pic");
    img.classList.add("iv");
    img.src = path;
    imagesVideosDiv.appendChild(img);
  }

  function activateButtons() {
    var cvp = sorular[index - 1].cvp; // doğru cevapları alıyor
    document.querySelectorAll(".cvpBtn").forEach(function (button) {
      button.addEventListener("click", function () {
        // örn : c1 ---> 1
        var kulCvp = parseInt(button.id.split("")[1]); // kullancının tıkladığı cevabı
        //                alert("helo " + button.id + " " + cvp + " " + kulCvp);
        if (cevapVerdi) {
          return;
        }
        cevapVerdi = true;

        if (kulCvp === cvp) {
          // cevap dogruysa
          cevapText.innerText = "Doğru!";
          //
          button.classList.remove("defuatBtn");
          button.classList.add("dogruBtn");
          dogruCevap += 1;
        } else {
          // cevap yanlissa
          cevapText.innerText = "Yanlış!";

          button.classList.remove("defuatBtn");
          button.classList.add("yanlisBtn");

          setTimeout(function () {
            button.classList.remove("yanlisBtn");
            button.style.background = "white";
          }, 1000);

          setTimeout(countdownFinished, 1000);
        }
        skor.innerText = dogruCevap + " / " + index;
        next();
      });
    });
  }

  function del() {
    $("#buttons .btn").remove();
    $("#imagesVideos .iv").remove();
  }

  function timerStart() {
    var self = this,
      timerEl = document.querySelector(".timer"),
      minutesGroupEl = timerEl.querySelector(".minutes-group"), // dakika
      secondsGroupEl = timerEl.querySelector(".seconds-group"), // saniye
      minutesGroup = {
        firstNum: minutesGroupEl.querySelector(".first"),
        secondNum: secondsGroupEl.querySelector(".second"),
      },
      secondsGroup = {
        firstNum: secondsGroupEl.querySelector(".first"),
        secondNum: secondsGroupEl.querySelector(".second"),
      };

    var time;
    console.log("test");

    self.startTime = function (timeVal) {
      time = {
        min: timeVal.split(":")[0], // dakika
        sec: timeVal.split(":")[1], // saniye
      };
      setTimeout(updateTimer, 1000);
      console.log("Time Start");
    };

    // console.log(time.min + " : " + time.sec);
    var timeNumbers;

    function updateTimer() {
      var timerString;
      var date = new Date(); // şu an ki tarihi al
      // console.log(date);

      date.setHours(0);
      date.setMinutes(time.min);
      date.setSeconds(time.sec);
      // console.log(date);

      var newDate = new Date(date.valueOf() - 1000); // sadece dk sn
      // console.log(newDate);
      var temp = newDate.toTimeString().split(" "); // temp[0] => 00:00:09
      // console.log(temp[0]);
      var tempSlpit = temp[0].split(":"); // ["00", "00", "09"]

      time.min = tempSlpit[1]; // dakika 00
      time.sec = tempSlpit[2]; // saniye 09

      timerString = time.min + time.sec; // 00:09
      timeNumbers = timerString.split(""); // ["0", "0", "0", "9"]

      updateTimerDisplay(timeNumbers);

      if (timerString === "0000") {
        setTimeout(function () {
          cevapText.innerText = "Süre doldu!!";
          countdownFinished();
          next();
        }, 500);
      }
      if (timerString != "0000" && !cevapVerdi) setTimeout(updateTimer, 1000);
    }

    function updateTimerDisplay(timeNumbers) {
      animateNum(minutesGroup.firstNum, timeNumbers[0]);
      animateNum(minutesGroup.secondNum, timeNumbers[1]);
      animateNum(secondsGroup.firstNum, timeNumbers[2]);
      animateNum(secondsGroup.secondNum, timeNumbers[3]);
    }

    function animateNum(group, timeValue) {
      var grp = group.querySelector(".number-grp-wrp");
      TweenMax.killTweensOf(grp);
      TweenMax.to(grp, 1, {
        y: -grp.querySelector(".num-" + timeValue).offsetTop,
      });
    }
  }

  function countdownFinished() {
    console.log("finished");
    cevapVerdi = true;
    var cvp = sorular[index - 1].cvp;
    document.querySelectorAll(".cvpBtn").forEach(function (dogru) {
      var dc = parseInt(dogru.id.split("")[1]);
      if (dc === cvp) {
        dogru.classList.remove("defuatBtn");
        dogru.classList.add("dogruBtn");
      }
    });
  }
});
