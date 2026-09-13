/* PC GNB: 흰 패널·서브메뉴·구분선을 매 프레임 동일 높이로 동기화 */
(function ($) {
  "use strict";

  var careGnbMs = 350;
  var careGnbH = 260;
  var gnbTween = null;

  function syncHeaderActive() {
    if ($(window).scrollTop() > 50) {
      $(".header").addClass("active");
    } else {
      $(".header").removeClass("active");
    }
  }

  function applyGnbHeight(h) {
    var $pc = $(".hd-gnb.pc");
    var $bg = $pc.find(".gnb-bg");
    var $d2 = $pc.find(".depth02");
    $bg.css({
      display: "block",
      overflow: "hidden",
      height: h,
      boxSizing: "border-box",
    });
    $d2.css({
      display: "block",
      overflow: "hidden",
      height: h,
      boxSizing: "border-box",
    });
  }

  function stopTween() {
    if (gnbTween) {
      gnbTween.stop(true, false);
      gnbTween = null;
    }
  }

  function openPcGnb() {
    var $pc = $(".hd-gnb.pc");
    var $bg = $pc.find(".gnb-bg");
    var start = $bg.is(":visible") ? $bg.height() : 0;

    $(".header").addClass("active");
    $pc.find(".shadow").stop(true, false).fadeIn(careGnbMs);

    stopTween();
    gnbTween = $({ h: start }).animate(
      { h: careGnbH },
      {
        duration: careGnbMs,
        easing: "swing",
        step: function (now) {
          applyGnbHeight(now);
        },
        complete: function () {
          applyGnbHeight(careGnbH);
          gnbTween = null;
        },
      }
    );
  }

  function closePcGnb() {
    var $pc = $(".hd-gnb.pc");
    var $bg = $pc.find(".gnb-bg");
    var start = $bg.is(":visible") ? $bg.height() : 0;

    $pc.find(".shadow").stop(true, false).fadeOut(careGnbMs);

    stopTween();
    gnbTween = $({ h: start }).animate(
      { h: 0 },
      {
        duration: careGnbMs,
        easing: "swing",
        step: function (now) {
          applyGnbHeight(now);
        },
        complete: function () {
          $pc.find(".depth02").hide().css({ height: "", overflow: "" });
          $pc.find(".gnb-bg").hide().css({ height: "", overflow: "" });
          gnbTween = null;
          syncHeaderActive();
        },
      }
    );
  }

  function bindCarePcGnb() {
    $(".hd-gnb.pc .depth01")
      .off("mouseenter mouseleave focusin focusout")
      .on("mouseenter.careGnb focusin.careGnb", openPcGnb)
      .on("mouseleave.careGnb focusout.careGnb", closePcGnb);
  }

  $(function () {
    bindCarePcGnb();
    setTimeout(bindCarePcGnb, 0);
  });
})(jQuery);
