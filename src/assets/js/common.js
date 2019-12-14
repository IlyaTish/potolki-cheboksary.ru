jQuery(document).ready(function($) {

  // ====== Swiper slider options ====== //

  var s1 = new Swiper ('.s1', {
    loop: true,
    grabCursor: true,
    slidesPerView: 'auto',
    centerSlides: true,
    navigation: {
      nextEl: '.s1-next',
      prevEl: '.s1-prev',
    }
  });

  var s2 = new Swiper ('.s2', {
    loop: true,
    grabCursor: true,
    slidesPerView: 'auto',
    centerSlides: true,
    navigation: {
      nextEl: '.s2-next',
      prevEl: '.s2-prev',
    }
  });

  var s3 = new Swiper ('.s3', {
    loop: true,
    grabCursor: true,
    slidesPerView: 'auto',
    centerSlides: true,
    navigation: {
      nextEl: '.s3-next',
      prevEl: '.s3-prev',
    }
  });

  var s4 = new Swiper ('.s4', {
    loop: false,
    autoplay: {
      delay: 5000
    },
    freeMode: true,
    freeModeMomentumRatio: 0.1,
    freeModeSticky: true,
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: {
      nextEl: '.s4-next',
      prevEl: '.s4-prev',
    },
    breakpoints: {
      599: {
        slidesPerView: 'auto',
      }
    }
  });

  var s5 = new Swiper ('.s5', {
    loop: false,
    autoplay: {
      delay: 5000
    },
    spaceBetween: 20,
    slidesPerView: 1,
    centeredSlides: true,
    navigation: {
      nextEl: '.s5-next',
      prevEl: '.s5-prev',
    },
    breakpoints: {
      599: {
        slidesPerView: 'auto',
        centeredSlides: false,
        freeMode: true,
        freeModeMomentumRatio: 0.1,
        freeModeSticky: true,
        autoplay: false
      },
      1199: {
        slidesPerView: 'auto',
        centeredSlides: false,
        freeMode: false,
        allowTouchMove: false,
        autoplay: false
      }
    }
  });

  if ($(window).width() >= 1199) {
    s5.destroy(true, true);
  }


  // ====== Teleport elements ====== //

  var $window     = $(window),
      isActive,

      //Elements
      logo         = $('.header__img-cont'),
      mainBtn      = $('.main__btn'),
      mapP         = $('.map__phone__p'),

      //Destination
      header       = $('.header'),
      main         = $('.main'),
      mainCont     = $('.main__content'),
      phoneCont    = $('.map__phone__cont'),
      mapForm      = $('.map__phone'),
      calculations = $('.calculations');


  teleportFunc();
  $window.on('resize', teleportFunc);

  function teleportFunc() {
    var initNeeded = $window.width() < 767;

    isActive = isActive !== undefined ? isActive : !initNeeded;

    if (initNeeded && !isActive) {
      logo.appendTo(mainCont).insertAfter('.main__title');
      mainBtn.appendTo(calculations).insertBefore('.calculations__p');
      mapP.appendTo(phoneCont).insertAfter('.map__phone__input-cont');
      isActive = true;
    }

    if (!initNeeded && isActive) {
      logo.appendTo(header).insertAfter('.header__nav');
      mainBtn.appendTo(main);
      mapP.appendTo(mapForm);
      isActive = false;
    }
  }


  $('.i1').keyup(function() {
    var $i1    = $(this),
        number = $i1.val(),
        rng    = $i1.parent().parent().parent().find('.r1');

    rng.val(number);

    number = 20 * (Number(number) - 3) / 7.5;

    rng.css({'background':'-webkit-linear-gradient(left ,#276147 0%,#276147 '+number+'%,#fff '+number+'%, #fff 100%)'});
  });

  $('.calculator__input').click(function(event) {
    $(this).find('input').focus();
  });


  $('.r1').on('change', function () {
    var $min = 500,
        $max = 1000,
        $el  = $(this),
        $val = $(this).val();

    var loader   = $el.parent().parent().parent().find('.loader'),
        text     = $el.parent().parent().parent().find('.calculator__text'),
        priceMin = $el.parent().parent().parent().find('.pricemin'),
        priceMax = $el.parent().parent().parent().find('.pricemax');

    $min = $min * $val;
    $max = $max * $val;

    loader.addClass('active');
    text.addClass('hidden');

    priceMin.text($min);
    priceMax.text($max);

    setInterval(function () {
      clearInterval();

      loader.removeClass('active');
      text.removeClass('hidden');
    }, 1500);
  });


  // ====== Initialize library to lazy load images ====== //

  var observer = lozad('.lozad', {
    threshold: 0.1,
    load: function(el) {
      $target = $(el);
      el.src = el.getAttribute('data-src');
      $target.parent().parent().parent().find('.cube-loader').css('display', 'none');
    }
  });

  // Picture observer
  // with default `load` method
  var pictureObserver = lozad('.lozad-picture', {
    threshold: 0.1
  });

  // Background observer
  // with default `load` method
  var backgroundObserver = lozad('.lozad-background', {
    threshold: 0.1
  });

  observer.observe();
  pictureObserver.observe();
  backgroundObserver.observe();


  /* Mask for input fields */
  $('.phone-input').mask('+7 (999) 999-99-99');


  /* Ajax form send */
  var forms = $('.form');

  forms.submit(function() {
    var th = $(this);
    $.ajax({
      type: 'POST',
      url: 'mail.php',
      data: th.serialize()
    }).done(function() {
      $('body').removeClass('body--active');
      $('.popup-wrapper').removeClass('popup-wrapper--active');

      alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время');
      setTimeout(function() {
        th.trigger('reset');
      }, 1000);
    });
    return false;
  });


  // ====== Magnific popup options ====== //

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: true
  });

  $('.popup-with-move-anim').magnificPopup({
    type: 'inline',

    fixedContentPos: false,
    fixedBgPos: true,

    overflowY: 'auto',

    closeBtnInside: true,
    preloader: false,

    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-slide-bottom'
  });
});


function calc(event) {
  $el   = $(event);
  elVal = event.value;

  var i1     = $el.parent().parent().parent().find('.i1');
  var rngMin = $el.parent().parent().parent().find('.r-min');

  i1.val(elVal);
  rngMin.text(elVal);

  elVal = 20 * (Number(elVal) - 3) / 7.5;

  $el.css({'background':'-webkit-linear-gradient(left ,#276147 0%,#276147 '+elVal+'%,#fff '+elVal+'%, #fff 100%)'});
}