'use stric';

$(function() {
	var Width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var Header = $("#header")
		,Nav = $("#topNav")
		,Menu = Nav.find(".topNavMenus > li > a")
		,Btn = $(".btnNav")
		,NavBack = $("#navBack")
		,TopNavBack = $("#topNavBack")
		,Search = $(".btnSearch")
		,SideNavMenu = $('.sideNavMenu')
		,ScrollTop = $("#scrollTop")
		,SkipNav = $("#skipNav > a")
		,FamilySite = $(".familySite")
		,DropDown = Nav.find(".dropdown")
		,Language = Header.find(".language");

	
	function menuDropEvent(e){
		
		var isSub = $(e).parent().is(":has(.topNavSub)");
		var isAnimated = $
		
		if(isSub){
			var TopNavSub = $(e).parent().find(".topNavSub");
			var isAnimated = TopNavSub.is(":animated");
			
			if(!isAnimated){
				TopNavSub.css("display","block");
				
				TopNavBack.css("display","block").find(".topNavTit").width(((Width - Nav.outerWidth()) / 2) + (Nav.outerWidth() - TopNavSub.outerWidth())).find("span").text($(e).text());
				
				var areaHeight = $(".topNavSub.areaType").outerHeight();
				
				var listHeight1 = new Array();
				var listHeight2 = new Array();
				var listHeight3 = new Array();
				
				for(var i=0; i<TopNavSub.find(">li").length; i++){
					if(i < 4){
						listHeight1.push(TopNavSub.find(">li").eq(i).outerHeight());
					} else
					if(i >= 4 && i < 8){
						listHeight2.push(TopNavSub.find(">li").eq(i).outerHeight());
					} else {
						listHeight3.push(TopNavSub.find(">li").eq(i).outerHeight());
					}
				}
				
				listHeight1.sort(function(a, b){
					return b - a;
				});
				
				listHeight2.sort(function(a, b){
					return b - a;
				});
				
				listHeight3.sort(function(a, b){
					return b - a;
				});
				
				for(var i=0; i<TopNavSub.find(">li").length; i++){
					if(i < 4){
						TopNavSub.find(">li").eq(i).outerHeight(listHeight1[0]);
					} else
					if(i >= 4 && i < 8){
						TopNavSub.find(">li").eq(i).outerHeight(listHeight2[0]);
					} else {
						TopNavSub.find(">li").eq(i).outerHeight(listHeight3[0]);
					}
				}
				
				TopNavSub.css("display","none").removeAttr("style");
				
				$(".topNavSub").not(TopNavSub).stop().slideUp(500, function(){
					$(".topNavSub").not(TopNavSub).removeAttr("style").find(">li").removeAttr("style");
				});
				
				var navHeight = function(){
					var result = 0;
					
					if(listHeight1.length){
						result = result + listHeight1[0]
					}
					if(listHeight2.length){
						result = result + listHeight2[0]
					}
					
					if(listHeight3.length){
						result = result + listHeight3[0]
					}
					
					result = result + 30; //30은 위아래 1em씩 padding 값
					
					/*if(result < 350) { //최소높이값 - 높이값 관련 요청시
						result = 350;
					}*/
					
					if(TopNavSub.is(".areaType")){
						result = areaHeight; //분야별 서브메뉴 높이값
					}
					
					
					return result;
					
				}
				
				TopNavSub.stop().slideDown(500);
				TopNavBack.stop().animate({"height":navHeight()},500); 
				NavBack.stop().fadeIn(500);
			}
			
		} else {
			$(".topNavSub").stop().slideUp(500, function(){
				$(".topNavSub").removeAttr("style").find(">li").removeAttr("style");
			});
			
			TopNavBack.stop().animate({"height":0},500, function(){
				TopNavBack.removeAttr("style");
			});
			
			NavBack.stop().fadeOut(500, function(){
				NavBack.removeAttr("style");
			})
		}
		
		Nav.off("mouseleave").on("mouseleave", function(){
			$(".topNavSub").stop().slideUp(500, function(){
				$(".topNavSub").removeAttr("style").find(">li").removeAttr("style");
			});
			
			TopNavBack.stop().animate({"height":0},500, function(){
				TopNavBack.removeAttr("style");
			});
			
			NavBack.stop().fadeOut(500, function(){
				NavBack.removeAttr("style");
			})
		});
	}
	
	function topNavEvent(){
		var isActive = Header.is(".active");
		
		Btn.off("click");
		
		setTimeout(function(){
			Btn.on("click", topNavEvent);
		}, 500);
		
		if(isActive){
			Btn.attr("title","메뉴 열기");
			Header.removeClass("show");
			setTimeout(function(){
				Header.removeClass("active");
			}, 500);
		} else {
			Btn.attr("title","메뉴 닫기");
			Header.addClass("active");
			setTimeout(function(){
				Header.addClass("show");
				activeMenuEvent();
			});
		}
		
		DropDown.off("click").on("click", function(){
			dropDownEvent(this);
		});
	}
	
	function dropDownEvent(e){
		var isActive = $(e).parent().is(".active");
		var ul = $(e).parent().find(">ul");
		var height = 0;
		
		if(isActive){
			height = ul.outerHeight();
			ul.parent().removeClass("active");
			ul.height(0);
			
			$(e).text("하위메뉴 열기");
			
			ul.parents("ul").filter(function(idx, obj){
				var isParent = $(obj).is("ul:not(.topNavMenus)");
				
				if(isParent){
					$(obj).outerHeight($(obj).outerHeight() - height);
				}
			});
			
			setTimeout(function(){
				ul.css("display", "none").removeAttr("style");
			},500);
			
		} else {
			
			$(e).text("하위메뉴 닫기");
			
			ul.css("display","block");
			
			height = ul.outerHeight();
			
			ul.css("height","0px");
			
			setTimeout(function(){
				ul.parent().addClass("active");
				ul.outerHeight(height);
				ul.parents("ul").filter(function(idx, obj){
					var isParent = $(obj).is("ul:not(.topNavMenus)");
					
					if(isParent){
						$(obj).height($(obj).height() + height);
					}
				});
			});
		}
	}

	function activeMenuEvent(){
		var activeMenu = Nav.find(".topNavMenus li.superActive");
		activeMenu.addClass("active");
		activeMenu.find(">ul").removeAttr("style").css("display","block");
		
		activeMenu.map(function(idx, obj){
			var ul = $(obj).find(">ul");
			var height = ul.outerHeight();
			
			ul.outerHeight(height);
		});
	}
	
	var reset = function(){
		
		//event reset
		Menu.off("mouseenter focus");
		Btn.off("click");
		Nav.off("mouseleave");
		Search.off("click");
		SideNavMenu.find('.btnMenuDropDown').off("click");
		FamilySite.find(".btnGo").off("click");
		ScrollTop.off("click");
		SkipNav.off("click");
		DropDown.off("click");
		Language.find("button").off("click");
		Menu.last().parent().find("a").last().off("focusout");
		
		//style reset
		Header.removeClass("show active");
		Search.removeClass("show active");
		DropDown.find("ul").removeAttr("style").find("li").removeAttr("style");
		$(".topNavSub").removeAttr("style").find(">li").removeAttr("style");
		TopNavBack.removeAttr("style");
		NavBack.removeAttr("style");
		
		Btn.attr("title","메뉴 열기");
	}
	
	var init = function(){
		Width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		
		reset();
		
		if(Width > 1200) {
			
			Menu.on("mouseenter focus", function(){
				menuDropEvent(this);
			});
			
			Menu.last().parent().find("a").last().on("focusout", function(){
				$(".topNavSub:visible").hide();
				TopNavBack.hide();
				NavBack.hide();
			})
			
		} else {
			Btn.on("click", topNavEvent);
			
			Search.on("click", function(){
				var isActive = $(this).is(".active");
				var Close = $(this).siblings("#topSearch").find(".close");
				
				if(isActive) {
				} else {
					$(this).addClass("active");
					setTimeout(function(){
						 Search.addClass("show");
					})
				}
				
				Close.off("click").on("click", function(){
					Search.removeClass("show");
					setTimeout(function(){
						Search.removeClass("active");
					},500);
				});
			});
		}
		
		Language.find("button").on("click", function(){
			var href = $(this).parent().find("select").val();
			if(href !== ""){
				window.open(href, "_blank", "");
			}
		});
		
		SideNavMenu.find('.btnMenuDropDown').on('click', function() {
			if ($(this).parent('li').is('.active')) {
				$(this).siblings('ul').slideUp(350, function() {
					$(this).parent('li').removeClass('active');
				});
				$(this).text("하위메뉴 열기");
			} else {
//				$(this).closest('ul').find('li').removeClass('active').find('>ul').hide();
				$(this).siblings('ul').hide().slideDown(350, function() {
					$(this).parent('li').addClass('active');
				});
				$(this).text("하위메뉴 닫기");
			}
		});
		// global link
		$('.global-sel').click(function(e){
			e.preventDefault();
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$(this).next('ul').hide();
				$(this).attr('title', '언어선택 열기');
			}else{
				$(this).addClass('active');
				$(this).next('ul').show();
				$(this).attr('title', '언어선택 닫기');
			}
		});
		
		//패밀리 사이트 바로가기
		FamilySite.find(".btnGo").on("click",function(){
			if($("select[name="+$(this).attr("id")+"]").val() != "") {
				window.open($("select[name="+$(this).attr("id")+"]").val(), "_blank", "");
			}
		});
		
		//최상단으로 이동
		ScrollTop.on("click", function(e){
			$("html, body").animate({scrollTop:0},300);
			$(document).focusout();
		});
		
		//본문의로 건너뛰기
		SkipNav.on("click",function(e){
			e.preventDefault();
			var skipTo= $(this).attr("href");
			$(skipTo).attr("tabindex",0).focus().removeAttr("tabindex");
			$("html, body").scrollTop(0);
		});
		
		
	}
	
	init();
	
	$(window).on("resize", function(){
		
		if(Width !== window.innerWidth){ //가로사이즈만 구분
			init();
		}
		
	});
	
});


$(document).ready(function(){
	
	if( $(window).scrollTop() > 50 ){
        $('.header').addClass('active');
        $('#scrollTop').addClass('show');
    }else{
        $('.header').removeClass('active');
        $('#scrollTop').removeClass('show');
    }
	  
	 $(window).scroll(function(){
	    let scrollTop = $(window).scrollTop();
        $('.header').each(function(){
            if( $(window).scrollTop() > 50 ){
                $(this).addClass('active');
                $('#scrollTop').addClass('show');
            }else{
                $(this).removeClass('active');
                $('#scrollTop').removeClass('show');
            }
        });
	 });
	 


	    $('.hd-gnb-mobile .depth01-link').each(function(){
	        $(this).click(function(e){
	            e.preventDefault();
	            if($(this).parent('li').hasClass('open')){
	                return;
	            }else{
	                $('.hd-gnb-mobile .depth01-list').removeClass('open');
	                $(this).parent('li').addClass('open');
	                $(this).next('ul').show();
	            }
	        });
	    });


	    $('.hd-gnb-mobile .submenu-btn').each(function(){
	        $(this).click(function(e){
	            e.preventDefault();
	            if($(this).parent('.depth02-list').hasClass('open')){
	                $('.hd-gnb-mobile .depth02-list').removeClass('open');
	                $(this).removeClass('open');
	                $(this).next('.depth03').slideUp();
	            }else{
	                $('.hd-gnb-mobile .depth02-list').removeClass('open');
	                $(this).parent('.depth02-list').addClass('open');
	                $(this).addClass('open');
	                $(this).next('.depth03').slideDown();
	            }
	        });
	    });
	    
	    $('.depth03 .submenu-btn').each(function(){
	        $(this).click(function(e){
	            e.preventDefault();
	            if($(this).parent('li').hasClass('open')){
	                $('.depth03 li').removeClass('open');
	                $(this).removeClass('open');
	                $(this).next('ul').slideUp();
	            }else{
	                $('.depth03 li').removeClass('open');
	                $(this).parent('li').addClass('open');
	                $(this).addClass('open');
	                $(this).next('ul').slideDown();
	            }
	        });
	    });
	    

	    $('.hd-gnb-mobile').find('.btn-link').click(function(e){
	        e.preventDefault();
	        if($(this).parent('.hd-gnb-mobile').hasClass('close')){
	            $('.hd-gnb-mobile').removeClass('close');
	            setTimeout(function(){
	                $('.hd-gnb-mobile .hd-gnb').hide();
	            },400);
	            $('.header').removeClass('active');

	            if( $(window).scrollTop() > 50 ){
	                $('.header').addClass('active');
	            }

	        }else{
	            $('.hd-gnb-mobile .hd-gnb').show();
	            setTimeout(function(){
	                $('.hd-gnb-mobile').addClass('close');
	            },100);
	            $('.header').addClass('active');

	        }
	        $('.superOpen').addClass('open');
	        $('.superOpen').children('.submenu-btn').addClass('open');
	        $('.superOpen').children('ul').slideDown();
	        
	        $('.depth01-list.superOpen').addClass('open');
	        $('.depth02-list.superOpen').addClass('open');
	        $('.depth02-list.superOpen').children('.submenu-btn').addClass('open');
	        $('.depth02-list.superOpen').children('.depth03').slideDown();
	        
	    });
	    
	    

	    $('.hd-gnb.pc .depth01').focusin(function(){
	        $('.hd-gnb.pc .depth02').stop().slideDown();
	        $('.hd-gnb.pc').find('.shadow').stop().fadeIn();
	        $('.hd-gnb.pc').find('.gnb-bg').stop().slideDown();
	        $('.header').addClass('active');
	    });
	    $('.hd-gnb.pc .depth01').focusout(function(){
	        $('.hd-gnb.pc .depth02').stop().slideUp();
	        $('.hd-gnb.pc').find('.shadow').stop().fadeOut();
	        $('.hd-gnb.pc').find('.gnb-bg').stop().slideUp();
	        $('.header').removeClass('active');

	        if( $(window).scrollTop() > 50 ){
	            $('.header').addClass('active');
	        }else{
	            $('.header').removeClass('active');
	        }
	    });
	    $('.hd-gnb.pc .depth01').mouseenter(function(){
	        $('.hd-gnb.pc .depth02').stop().slideDown();
	        $('.hd-gnb.pc').find('.shadow').stop().fadeIn();
	        $('.hd-gnb.pc').find('.gnb-bg').stop().slideDown();
	        $('.header').addClass('active');
	    });
	    $('.hd-gnb.pc .depth01').mouseleave(function(){
	        $('.hd-gnb.pc .depth02').stop().slideUp();
	        $('.hd-gnb.pc').find('.shadow').stop().fadeOut();
	        $('.hd-gnb.pc').find('.gnb-bg').stop().slideUp();
	        $('.header').removeClass('active');

	        if( $(window).scrollTop() > 50 ){
	            $('.header').addClass('active');
	        }else{
	            $('.header').removeClass('active');
	        }

	    });
	    
//	    $('.clickArrow').each(function(){
//			$(this).click(function(e){
//				e.preventDefault();
//		    	if($(this).hasClass('open')){
//		    		$('.clickArrow').next('ul').hide();
//		    		$('.clickArrow').removeClass('open');
//		    	}else{
//		    		$('.clickArrow').next('ul').hide();
//		    		$(this).next('ul').show();
//		    		$('.clickArrow').removeClass('open');
//		    		$(this).addClass('open');
//		    	}
//			});
//		});

	    $('.clickArrow.office_access').each(function(){
			$(this).click(function(e){
				e.preventDefault();
		    	if($(this).hasClass('open')){
		    		$('.clickArrow').next('ul').hide();
		    		$('.clickArrow').removeClass('open');
					$(this).attr('title', '사업소사이트리스트 열기');
		    	}else{
		    		$('.clickArrow').next('ul').hide();
		    		$(this).next('ul').show();
		    		$('.clickArrow').removeClass('open');
		    		$(this).addClass('open');
					$(this).attr('title', '사업소사이트리스트 닫기');
		    	}
			});
		});
	    $('.clickArrow.site_access').each(function(){
			$(this).click(function(e){
				e.preventDefault();
		    	if($(this).hasClass('open')){
		    		$('.clickArrow').next('ul').hide();
		    		$('.clickArrow').removeClass('open');
					$(this).attr('title', '관련사이트리스트 열기');
		    	}else{
		    		$('.clickArrow').next('ul').hide();
		    		$(this).next('ul').show();
		    		$('.clickArrow').removeClass('open');
		    		$(this).addClass('open');
					$(this).attr('title', '관련사이트리스트 닫기');
		    	}
			});
		});

	    /*$('.disasterClose').find('button').click(function(){
	    	$('#disaster').hide();
	    	$('#header').removeClass('disasterOn');
	    });*/
	    
	    
	    
});

