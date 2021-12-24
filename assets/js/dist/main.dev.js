"use strict";

function lazyForSlider(el) {
  var showActiveSlides = function showActiveSlides(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  };

  var imageWidth = el.find("li").outerWidth() + "px";
  var observer = new window.IntersectionObserver(showActiveSlides, {
    root: el.parent()[0],
    rootMargin: " 0px " + imageWidth + " 0px " + imageWidth
  });
  console.log(observer);
  el.find("li img").each(function () {
    observer.observe(this);
  });
}

lightGallery(document.getElementById('light_gallery'), {
  speed: 500,
  thumbnail: true
});
$(function () {
  // Фикс Хедер
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 0) {
      if (!$('body').hasClass('fixed_nav')) {
        $('body').addClass('fixed_nav');
      }
    } else {
      if ($('body').hasClass('fixed_nav')) {
        $('body').removeClass('fixed_nav');
      }
    }
  }); // Гамбургер меню

  $(".hamburger, #page_overlay").on('click', function () {
    $("#mobile_menu_wrap .hamburger").toggleClass("is-active");
    $("body").toggleClass("open");
  }); // Плавный скрол

  $('.anchor').on('click', function (e) {
    e.preventDefault();
    var top = $($(this).attr('href')).offset().top;
    $('html, body').animate({
      scrollTop: top + 'px'
    }, 900);
  }); // НОВОСТИ + слайдер

  $.ajax({
    url: 'common/news.json',
    type: 'get',
    dataType: 'json',
    success: function success(json) {
      var html = '';

      for (var i = 0; i < json.length; i++) {
        html += "\n                <li>\n                    <a href=\"\" class=\"item\">\n                        <div class=\"item_image\"><img data-src=\"assets/images/".concat(json[i].pic, "\" alt=\"news image\"></div>\n                        <div class=\"item_content\">\n                            <h4 class=\"title\">").concat(json[i].title, "</h4>\n                            <p class=\"text\">").concat(json[i].text, "</p>\n                            <div class=\"author\">\n                                <div class=\"author_avatar\"><img data-src=\"assets/images/").concat(json[i].author.avatar, "\"></div>\n                                <div class=\"author_wrap\">\n                                    <p class=\"author_name\">").concat(json[i].author.name, "</p>\n                                    <span class=\"author_date\">").concat(json[i].author.date, "</span>\n                                </div>\n                            </div>\n                        </div>\n                    </a>\n                </li>");
      }

      $('.news_list').html(html);
      var slider = $("#slider_news").lightSlider({
        item: 3,
        auto: false,
        speed: 2000,
        pause: 3000,
        slideMargin: 30,
        onSliderLoad: function onSliderLoad(el) {
          lazyForSlider(el);
        },
        responsive: [{
          breakpoint: 1300,
          settings: {
            item: 2,
            slideMargin: 30
          }
        }, {
          breakpoint: 745,
          settings: {
            item: 1
          }
        }]
      });
      $(".prev").on('click', function () {
        slider.goToPrevSlide();
      });
      $(".next").on('click', function () {
        slider.goToNextSlide();
      });
    }
  }); // КАРТА
  // Инициализация при клике загружается карта

  $("#init_map").on('click', function () {
    $(this).remove(); // Этого достаточно для отображения карты, без всяких инициализаций и маркеров

    var map = L.map('map').setView([40.674948, -73.9016258], 13);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map); //можно коректировать пути к маркеру, или менять на кастомный

    var myIcon = L.icon({
      iconUrl: 'assets/plugins/leflet/images/my_marker.png',
      iconSize: [106, 106]
    }); //вставляем маркер

    var marker = L.marker([40.674948, -73.9016258], {
      icon: myIcon
    }).addTo(map).bindPopup("\n        <div class=\"map_popup\">\n        <img src=\"assets/images/car_1.jpg\" alt=\"\">\n        <div class=\"map_info\">\n        <b>Hello</b>\n        <p>I am here</p>\n        </div>\n        </div>\n        ");
  }); // отправка данных из формы в телеграмм

  $("#get_form").on('submit', function (e) {
    var UserName = $(".inp_name").val();
    var UserEmail = $(".inp_mail").val();

    if (UserName == '') {
      alert('Enter Name');
      return false;
    }

    if (UserEmail == '') {
      alert('Enter Email');
      return false;
    }

    e.preventDefault();
    var BOT_TOKEN = '5003716983:AAEDXQ0C0Ljct6LZJkOWu2nh2Im_0qY6RXY'; // @get_id_bot and /get_id

    var CHAT_ID = '-1001631956890';
    var text = encodeURI("<b>Name:</b> " + UserName + "\r\n<b>Email:</b>" + UserEmail);
    $.get("https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage?chat_id=").concat(CHAT_ID, "&text=") + text + '&parse_mode=html', function (json) {
      console.log(json);

      if (json.ok) {
        $("#get_form").trigger('reset');
        alert("Message successfully send");
      } else {
        alert(json.description);
      }
    });
  }); // СЛАЙДЕР Верхней секции

  $("#slider").lightSlider({
    item: 1,
    // auto:true,
    speed: 2000,
    pause: 3000,
    loop: true,
    vertical: true,
    verticalHeight: 800,
    vThumbWidth: 50,
    thumbItem: 8,
    thumbMargin: 4,
    slideMargin: 0
  });
});