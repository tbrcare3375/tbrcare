"use stric";

$(function () {
  /*	const remainTime = document.querySelector(".d-day_date");
    const remainTime2 = document.querySelector(".d-day_date2");
    const remainTime3 = document.querySelector(".d-day_date3");
    const remainTime4 = document.querySelector(".d-day_date4");
    const remainTime5 = document.querySelector(".d-day_datemo");
//    function diffDay(){
      const str_date = "2023-11-28 00:00:00";
  	  const masTime = new Date(str_date.replace(/[.-]/gi, "/"));
  	  const todayTime = new Date();
  	  const diff = masTime - todayTime;
  	  
  	  const diffDay = Math.floor(diff / (1000*60*60*24)) + 1;
  	  
  	  if(diffDay <= 0){
  		remainTime.innerText = 'day';
  		remainTime2.innerText = 'day';
  		remainTime3.innerText = 'day';
    	remainTime4.innerText = 'day';
    	remainTime5.innerText = 'day';
  	  }else{
  	  remainTime.innerText = diffDay;
  	  remainTime2.innerText = diffDay;
  	  remainTime3.innerText = diffDay;
  	  remainTime4.innerText = diffDay;
  	  remainTime5.innerText = diffDay;
  	  }
  	  */
  //    }
  //    diffDay();
  //    setInterval(diffDay, 1000);

  /* =============================================================
		    기능설명 : scrolling fullpage
		============================================================= */
  var scrollLink = $(".navi-dots");

  //Full Height
  // $('section').height($(window).height());
  // $(window).resize(function(){
  //     $('section').height($(window).height());
  // });

  //Smooth scrolling
  scrollLink.click(function (e) {
    e.preventDefault();
    $("body,html").animate(
      {
        scrollTop: $(this.hash).offset().top - 100,
      },
      1000
    );
  });

  //Active Link switching

  // e.stopPropagation();
  var scrollLocation = $(this).scrollTop();

  var sectionOffset = 0;
  var secTopOffset = 0;

  scrollLink.each(function () {
    sectionOffset = $(this.hash).offset().top - 550;
    secTopOffset = $(this.hash).offset().top;
    if (sectionOffset <= scrollLocation) {
      scrollLink.removeClass("active");
      $(this).addClass("active");

      //$('#fullpage-nav').removeAttr('class','');
      //$('#fullpage-nav').addClass($(this.hash).attr('id'));
    }
  });

  $(window).scroll(function (e) {
    // e.stopPropagation();
    var scrollLocation = $(this).scrollTop();

    var sectionOffset = 0;
    var secTopOffset = 0;

    scrollLink.each(function () {
      sectionOffset = $(this.hash).offset().top - 550;
      secTopOffset = $(this.hash).offset().top;
      if (sectionOffset <= scrollLocation) {
        scrollLink.removeClass("active");
        $(this).addClass("active");

        //$('#fullpage-nav').removeAttr('class','');
        //$('#fullpage-nav').addClass($(this.hash).attr('id'));
      }
    });
  });

  AOS.init({
    easing: "ease-out-back",
    duration: 1000,
  });

  var swiper02 = new Swiper(".service-slider", {
    slidesPerView: 3,
    // init: false,
    breakpoints: {
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 7,
      },
      1024: {
        slidesPerView: 12,
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  var swiper03 = new Swiper(".ct-group-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    // init: false,
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      1024: {
        spaceBetween: 40,
        slidesPerView: 3,
      },
    },
    navigation: {
      nextEl: ".notice-button-next",
      prevEl: ".notice-button-prev",
    },
  });

  var swiper04 = new Swiper(".sotong-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    // init: false,
    breakpoints: {
      600: {
        slidesPerView: 2,
      },
      900: {
        slidesPerView: 3,
      },
      1280: {
        slidesPerView: 4,
      },
    },
    /*
          autoplay: {
	          delay: 4000,
	          disableOnInteraction: false,
	      },
	      */
    pagination: {
      el: ".sotong-pagination",
      clickable: true,
    },
  });

  $(".sotong-slider .btn-play").click(function () {
    if ($(this).hasClass("on")) {
      swiper04.autoplay.start();
      $(this).removeClass("on").text("일시정지");
      return false;
    } else {
      swiper04.autoplay.stop();
      $(this).addClass("on").text("재생");
      return false;
    }
  });

  var swiper4 = new Swiper(".policy-banner", {
    slidesPerView: 1,
    speed: 1000,
    effect: "slide",
    breakpoints: {
      1024: {
        effect: "coverflow",
        grabCursor: true,
        spaceBetween: -600,
        loop: false,
        initialSlide: 0,
        centeredSlides: true,
        slidesPerView: "auto",
      },
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    keyboard: {
      enabled: true,
    },
    pagination: {
      el: ".banner-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".banner-button-next",
      prevEl: ".banner-button-prev",
    },
    on: {
      init: function () {
        document.querySelector(".banner-button-prev").focus();
      },
    },
  });

  const slides = document.querySelectorAll(".policy-banner .swiper-slide a");
  const prevButton = document.querySelector(".banner-button-prev");
  const nextButton = document.querySelector(".banner-button-next");

  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      let activeElement = document.activeElement;
      let activeIndex = Array.from(slides).indexOf(activeElement);

      if (activeElement === prevButton) {
        e.preventDefault();
        slides[0].focus();
        swiper4.slideTo(0);
      } else if (activeElement === nextButton) {
        return;
      } else if (activeIndex !== -1) {
        if (!e.shiftKey && activeIndex < slides.length - 1) {
          e.preventDefault();
          slides[activeIndex + 1].focus();
          swiper4.slideTo(activeIndex + 1);
        } else if (e.shiftKey && activeIndex === 0) {
          e.preventDefault();
          prevButton.focus();
        } else if (!e.shiftKey && activeIndex === slides.length - 1) {
          e.preventDefault();
          nextButton.focus();
        }
      }
    }
  });

  slides.forEach((slide, index) => {
    slide.addEventListener("focus", () => {
      swiper4.slideTo(index);
    });
  });

  $(".policy-banner .btn-play").click(function () {
    if ($(this).hasClass("on")) {
      swiper4.autoplay.start();
      $(this).removeClass("on").text("일시정지");
    } else {
      swiper4.autoplay.stop();
      $(this).addClass("on").text("재생");
    }
    return false;
  });

  $(".serv-btn").each(function () {
    $(this).click(function (e) {
      e.preventDefault();
      if ($(this).hasClass("on")) {
        $(".serv-btn").removeClass("on");
        $(this).next(".serv-box").stop().slideUp();
      } else {
        $(".serv-box").stop().slideUp();
        $(".serv-btn").removeClass("on");
        $(this).next(".serv-box").stop().slideDown();
        $(this).addClass("on");
      }
    });
    /*$('.serv-list:last-child').focusout(function(){
    		$('.serv-box').stop().slideUp();
    	});*/
    $(".serv-list:last-child").focusout(function () {
      $(".serv-box").stop().slideUp();
    });
  });

  //search
  $(".searchBox")
    .find(".btn-close")
    .click(function (e) {
      $(".searchBox").hide();
    });

  $(".searchWrap")
    .find(".btn-open")
    .click(function (e) {
      $(".searchBox").show();
    });

  /*
    $('.serv-btn, .serv-box').mouseenter(function(){
    	console.log('enter');
    	$('.serv-box').stop().slideDown();
    	$('.serv-btn, .serv-box').addClass('on');
    	
    });
    $('.serv-box').mouseleave(function(){
    	console.log('leave');
    	$('.serv-box').stop().slideUp();
    	$('.serv-btn, .serv-box').removeClass('on');
    });
    */

  function tabClickEvent(e) {
    var btn = $(e);
    var tab = btn.parents(".tabList");
    var content = btn.next(".tabContent");

    var isGosi = btn.parent().is("#gosi");
    var isEvent = btn.parents().is(".mainEvent");

    Tabs.find(">li>button").off("click");

    function tabEvent() {
      tab.find(">li>button").not(btn).addClass("hide").removeClass("show");
      btn.addClass("active");

      setTimeout(function () {
        if (isEvent) {
          $(".slick-slider[data-function=slider]").slick("unslick");
          $(".slick-slider[data-function=slider]").find(".slick-controls").remove();

          /*if(!btn.parent().is(":has(.tabContent)")){
						var content = document.createElement("div");
						var list = document.createElement("ul");
						var itemNo = btn.data("item");
						var items = Sliders.slider3.find(".item"+itemNo).clone();
						
						content.classList.add("tabContent");
						list.classList.add("itemList");
						content.appendChild(list);
						btn.after(content);
						
						list.setAttribute("data-function","slider");
						
						for(var i=0; i<items.length; i++){
							list.appendChild(items[i]);
						}
							
					}*/

          var slider = btn.parent().find("[data-function=slider]");

          slider.off("init").on("init", function (event, slick) {
            sliderControls(slider, slick);
          });

          slider.off("breakpoint").on("breakpoint", function (event, slick, breakpoint) {
            sliderControls(slider, slick);
          });

          eventBannerInit(slider);
        }

        btn.addClass("show");

        setTimeout(function () {
          tab.find(">li>button").not(btn).removeClass("active hide");

          Tabs.find(">li>button").on("click", function () {
            tabClickEvent(this);
          });
        }, 500);
      }, 500);
    }

    if (!btn.is(".active")) {
      //고시공고 ajax 처리
      tabEvent();

      if (isGosi) {
        var isEmpty = !btn.next(".tabContent").is(":has(.itemList)");
        if (isEmpty) {
          $.ajax({
            url: "/comm/busan/gosiList2",
            type: "GET",
            timeout: 3000,
            beforeSend: function () {
              if (!$("#gosi > .tabContent").is(":has(.loading)")) $("#gosi > .tabContent").append("<div class='loading' />");
            },
            success: function (data) {
              $("#gosi > .tabContent").empty();
              $("#gosi > .tabContent").append(data);
            },
            error: function (err) {
              console.log(err);
            },
          });
        }
      }
    } else {
      Tabs.find(">li>button").on("click", function () {
        tabClickEvent(this);
      });
    }
  }

  function moreClickEvent(e) {
    var isAction = $(e).is(".active");
    var wrap = $(e).parent();

    $(e).off("click");

    setTimeout(function () {
      $(e).on("click", function () {
        moreClickEvent(this);
      });
    }, 500);

    if (!isAction) {
      orgHt = wrap.outerHeight();

      $(e).addClass("active");

      wrap.css("height", "auto");
      var ht = wrap.outerHeight();
      wrap.css("height", orgHt + "px");

      setTimeout(function () {
        wrap.css("height", ht + "px");
        $(e).children("span").text("감추기");
      }, 100);
    } else {
      $(e).removeClass("active");
      wrap.css("height", orgHt + "px");
      setTimeout(function () {
        wrap.removeAttr("style");
        $(e).children("span").text("더보기");
      }, 500);
    }
  }

  function serviceList() {
    var sl = $(".serviceList").children().length;
    if (sl > 12) {
      $(".mainService").addClass("active");
    }
  }

  //	2023-09-05 스크립트 추가

  var swiper1 = new Swiper(".mainimg-slider", {
    effect: "fade",
    slidesPerView: 1,
    speed: 1500,
    loop: true,
    loopedSlides: 1,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".main_pagenation",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init: function () {
        var index = this.activeIndex;
        var inputNum = this.realIndex + 1;
        $(".swiper-slide").addClass("changed");
        $(".main_pagenation .current").text(this.inputNum);
        $(".main_pagenation .all").text(this.loopedSlides - 1);
        mainVisualRefresh(index);
      },
      slideChangeTransitionStart: function () {
        var index = this.activeIndex;
        $(".swiper-slide").addClass("changing");
        $(".swiper-slide").removeClass("changed");
        $(".main_pagenation .current").text(this.realIndex + 1);
        mainVisualRefresh(index);
      },
      slideChangeTransitionEnd: function () {
        $(".swiper-slide").removeClass("changing");
        $(".swiper-slide").addClass("changed");
      },
      setTransition: function (speed) {
        var swiper = this;
        for (var i = 0; i < swiper.slides.length; i++) {
          swiper.slides[i].style.transition = speed + "ms";
        }
      },
    },
  });

  var sw = 0;
  $(".btn_pause").click(function () {
    if (sw == 0) {
      $(".btn_pause").addClass("on");
      swiper1.autoplay.stop();
      sw = 1;
    } else {
      $(".btn_pause").removeClass("on");
      swiper1.autoplay.start();
      sw = 0;
    }
  });
  function mainVisualRefresh(index) {
    $mainVisualImage = $(".mainimg-slider .swiper-slide:eq(" + index + ")").find(".main_visual_img");
    TweenMax.killTweensOf($mainVisualImage);
    TweenMax.fromTo($mainVisualImage, 2, { transform: "scale(1)" }, { transform: "scale(1) rotate(0.002deg)", force3D: true, ease: Circ.easeOut, delay: 0 });
  }
  /*
  var swiper001 = new Swiper(".mainimg-slider-tour", {
    effect: "fade",
    zoom: {
      maxRatio: 1.5,
      minRatio: 1,
    },
    slidesPerView: 1,
    speed: 100,
    loop: true,
    loopedSlides: 1,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".main_pagenation",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init: function () {
        var index = this.activeIndex;
        var inputNum = this.realIndex + 1;
        $(".swiper-slide").addClass("changed");
        $(".main_pagenation .current").text(this.inputNum);
        $(".main_pagenation .all").text(this.loopedSlides - 1);
        mainVisualRefresh(index);
      },
      slideChangeTransitionStart: function () {
        var index = this.activeIndex;
        $(".swiper-slide").addClass("changing");
        $(".swiper-slide").removeClass("changed");
        $(".main_pagenation .current").text(this.realIndex + 1);
        mainVisualRefresh(index);
      },
      slideChangeTransitionEnd: function () {
        $(".swiper-slide").removeClass("changing");
        $(".swiper-slide").addClass("changed");
      },
      setTransition: function (speed) {
        var swiper = this;
        for (var i = 0; i < swiper.slides.length; i++) {
          swiper.slides[i].style.transition = speed + "ms";
        }
      },
    },
  });

  var sw001 = 0;
  $(".btn_pause").click(function () {
    if (sw001 == 0) {
      $(".btn_pause").addClass("on");
      swiper001.autoplay.stop();
      sw001 = 1;
    } else {
      $(".btn_pause").removeClass("on");
      swiper001.autoplay.start();
      sw001 = 0;
    }
  });
  function mainVisualRefresh(index) {
    $mainVisualImage = $(".mainimg-slider-tour .swiper-slide:eq(" + index + ")").find(".main_visual_img");
    TweenMax.killTweensOf($mainVisualImage);
    TweenMax.fromTo($mainVisualImage, 2, { transform: "scale(1)" }, { transform: "scale(1) rotate(0.002deg)", force3D: true, ease: Circ.easeOut, delay: 0 });
  }*/

  // 2025-05-13 슬라이드 추가
  var jumpSwiper = new Swiper(".jump_slide", {
    effect: "fade",
    loop: false,
    slidesPerView: 1,
    speed: 1500,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".jump_page",
    },
    on: {
      slideChange: function () {
        const currentIndex = this.realIndex; // 현재 슬라이드 인덱스
        $(".go_slide").removeClass("active");
        $(".go_slide").eq(currentIndex).addClass("active");

        // 첫 번째 슬라이드일 때만 두 번째 버튼에 on 클래스 추가
        if (currentIndex === 0) {
          $(".go_slide").addClass("on");
        } else {
          $(".go_slide").removeClass("on");
        }
      },
    },
  });

  // 버튼 클릭 시 슬라이드 이동 + active 처리
  $(".go_slide").each(function (index) {
    $(this).attr("data-index", index); // data-index 자동 지정
  });

  $(".go_slide").on("click", function () {
    const index = $(this).data("index");

    // 슬라이드 이동 및 active 처리
    jumpSwiper.slideTo(index);
    $(".go_slide").removeClass("active");
    $(this).addClass("active");

    // index가 0이면 전체에 on 클래스 추가
    if (index === 0) {
      $(".go_slide").addClass("on");
    } else {
      $(".go_slide").removeClass("on");
    }
  });

  // 자동재생 제어
  let stop = 0;
  $(".jump_slide .pause").click(function () {
    if (sw == 0) {
      $(".pause").addClass("on");
      jumpSwiper.autoplay.stop();
      sw = 1;
    } else {
      $(".pause").removeClass("on");
      jumpSwiper.autoplay.start();
      sw = 0;
    }
  });
});

/*document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("keydown", function (e) {
  const video = document.querySelector(".video-bg");
  const videoLink = document.querySelector(".video-link");

  video.addEventListener("keydown", function (e) {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      videoLink.focus();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  	});
  });
});*/
