var chatImgPath = "/humanframe/theme/busan22/assets/img/chatbot";
var $itemArea = "";
var $slideBtn = "";
var chatVideo = "";
var chatStartX = 0;
var chatCurrentX = 0;
var chatIsDragging = false;
var chatTranslateX = 0;
var chatMaxSlide = 0;
var charLoadFleg = false;
var welcomeFleg = true;
var audio = "";
var glbMsgId = "";
var userId = "";
var convId = "";

var chatStream = function(text, url){
	dataLoading(1);
	let fullAnswer = '';
	const $chat  = $('.chat_box');
	if (text) {
		let userHtml = "<div class=\"cb_user_chat\"> ";
		userHtml += "	<div class=\"cb_txt\"> ";
		userHtml += "		<p class=\"chat\">"+text+"</p> ";
		userHtml += "		<p class=\"time\">"+getWriteTime()+"</p>  ";
		userHtml += "	</div> ";
		userHtml += "</div> ";
		$chat.append(userHtml);
		scrollBottom();
	}
	let aiHtml ="<div class=\"cb_boogi_chat\"> ";
	aiHtml +=" 	<div class=\"cb_pic\"><img src=\""+chatImgPath+"/c_b_boogi.png\" alt=\"AI부기사진\"></div> ";
	aiHtml +=" 		<div class=\"cb_txt chatai\"> ";
	aiHtml +="			<div class=\"cb_answer\"> ";
	aiHtml +=" 				<p class=\"name\">AI 부기</p> ";
	aiHtml +=" 				<div class=\"chat_ready\"> ";
	aiHtml +=" 					<div class=\"dot-container\"><img src=\""+chatImgPath+"/loging.gif\"/></div>";
	aiHtml +="				</div> ";
	aiHtml +=" 				<div class=\"answer_chat\"> ";
	aiHtml +=" 					<div class=\"chat\"> ";
	aiHtml +=" 						<p></p> ";
	aiHtml +=" 					</div> ";
	aiHtml +=" 				</div> ";
	aiHtml +=" 				<p class=\"time\">"+getWriteTime()+"</p> ";
	aiHtml +=" 			</div> ";
	aiHtml +=" 		</div> ";
	aiHtml +="	</div> ";	
	$chat.append(aiHtml);
	scrollBottom();

	const $latest = $chat.find('.chatai').last();
	const $select = $latest.find('.refs-select');
	const source = new EventSource("/sock/ai/"+encodeURIComponent(url)+"?userId="+encodeURIComponent(userId)+"&conversationId="+encodeURIComponent(convId)+"&userInput="+encodeURIComponent(text));
	source.onmessage = function(e) {
		let msg;
		try { 
			msg = JSON.parse(e.data); 
		}catch { return; }
		if (msg.result !== undefined) {
			const docList = msg.result.source_documents;
			if(docList.length>0){
				let refList = "";
				refList +=" 											<div class=\"chatDesc\"><p>* 아래내용은 답변을 위해 일부 참고한 자료입니다.</p></div> ";
				refList +="				 								<ul class=\"content\"> ";
				for(let q=0;q<docList.length;q++){
					let subitem = docList[q];
					refList +="												<li><button onclick=\"window.open('"+subitem.source_url+"');\" title=\"[새창] "+subitem.source_title+"\">"+subitem.source_title+"</button></li> ";	
				}
				refList +=" 											</ul> ";
				$latest.find('.answer_chat').append(refList);
				scrollBottom();
			}
		}else if (msg.end !== undefined) {
			dataLoading(0);
		}else if (msg.answer !== undefined) {
			$latest.find(".chat_ready").hide();
			$latest.find(".answer_chat").css("opacity","1").show();
			fullAnswer += msg.answer;
			const html = fullAnswer.replace(
				/\*\*(.*?)\*\*/g,
				'<span style="font-weight:bold;color:#000;">$1</span>'
			).replace(/\n/g, '<br>');
			$latest.find('.chat p').html(html);
			scrollBottom();
		}
	};
	source.onerror = function() { 
		source.close();
	};
	$('#chatInput').val('');
}

var isScriptLoaded = function(url) {
	return Array.from(document.querySelectorAll("script")).some(script => script.src.includes(url));
}
var loadScriptPromise = function(url) {	
	return new Promise((resolve, reject) => {			
		var script = document.createElement("script");
		script.src = url;
		script.type = "text/javascript";
		script.async = true;
		script.onload = () => resolve(url + " 로드 완료!");
		script.onerror = () => reject(new Error("스크립트 로드 실패: " + url));
		document.body.appendChild(script);
	});
}
var loadMultipleScripts = function(scripts) {
	let promise = Promise.resolve();
    scripts.forEach(script => {
		if (isScriptLoaded(script)) {
			//console.log("이미 "+script+"로드됨!");
		}else{			
	        promise = promise.then(() => loadScriptPromise(script));
		}
    });
    return promise;
}

var initButton = function(){
	let htmlCd = "<div id=\"chatbotBtn\">";
	htmlCd += "<a href=\"#\" id=\"btnChatbotShow\"><img src=\"/humanframe/theme/busan22/assets/img/chatbot/btn_bugi.png\"/></a>";
	htmlCd += "</div>";

	if($("#chatbotBtn").length==0){
		//버튼 
		$("body").append(htmlCd).find("#btnChatbotShow").click(function(){
			showChatbot();
			return false;
		});
	}
}

var getLoadingSize = function() {
	const windowWidth = $(window).width();
	return {
		width: windowWidth < 769 ? "100vw" : "1022px",
		height: windowWidth < 769 ? "100vh" : "709px",
		borderRadius: windowWidth < 769 ? "0" : "44",
		border : windowWidth < 769 ? "25px solid #121212" : "0"
	};
}

var updateMaxSlide = function() {
	chatMaxSlide = -$itemArea.outerWidth();
	return chatMaxSlide;
}

var initializeSlide = function() {
	updateMaxSlide();
	chatTranslateX = 0;

	let windowWidth = $(window).width();
	if (windowWidth > 768) {
		$itemArea.css({
			'transition': 'none',
			'transform': 'translateX(0px)'
		});
		$slideBtn.removeClass('open');
	} else {
		$itemArea.css({
			'transition': 'none',
			'transform': 'translateX(-100%)'
		});
		$slideBtn.removeClass('open');
	}
}

var chatbotInit = function(){
	loadMultipleScripts([
    	"/humanframe/theme/busan22/assets/script/chatbot/gsap.min.js",
        "/humanframe/theme/busan22/assets/script/chatbot/draggable.min.js",
        "/humanframe/theme/busan22/assets/script/chatbot/weather.js",
		"/humanframe/theme/mayor24/assets/script/dash.all.min.js"
	]).then(() => {
    	console.log("init success.");
		chatbotTemplate();
		initButton();
	}).catch(err => console.error(err));
}

var videoPlay = function(){
	if (chatVideo) {
		chatVideo.muted = true;
		chatVideo.pause();
		/*
		chatVideo.play().catch(function(error) {
			console.log("자동 재생 실패:", error);
		});
		*/
	}
}
var firstMotion = function(){
	const $scrollContainer = $('.chat_scroll');
	$scrollContainer.scrollTop($scrollContainer.prop('scrollHeight'));

	const t0 = gsap.timeline();
	const tl = gsap.timeline({ repeat: -1 });
	const t2 = gsap.timeline({ 
		onComplete: function() { 
			tl.play(); 
			scrollBottom();
			if(welcomeFleg){
				chatStream('', 'greeting'); 
				welcomeFleg = false;
			}
		}
	});

	t2.add(() => { tl.play(); });


	t2.set(".boogi_loading", { 
		scale: 0, 
			display: "block" 
	}).to(".boogi_loading", {
		scale: 1,
		duration: 0.5,
		ease: "back.out(1.5)"
	}).to(".boogi_loading img:nth-child(1)", {
		yPercent: $(window).width() < 768 ? "-90" : "-100",
		duration: 0.45,
		ease: "power2.out"
	}, 0.5).to(".boogi_loading img:nth-child(1)", {
		yPercent: 0,
		opacity: 0,
		duration: 0.2,
		ease: "power2.in"
	}).to(".boogi_loading img:nth-child(2)", {
		yPercent: $(window).width() < 768 ? "-90" : "-100",
		duration: 0.45,
		ease: "power2.out"
	}, 1).to(".boogi_loading img:nth-child(2)", {
		yPercent: 0,
		opacity: 0,
		duration: 0.2,
		ease: "power2.in"
	}).to(".boogi_loading", {
		width: () => getLoadingSize().width, 
		height: () => getLoadingSize().height,
		borderRadius:  () => getLoadingSize().borderRadius,
		backgroundColor: "#212121",
		border: "25px solid #121212",
		duration: 0.7,
		ease: "power2.inOut",
		onStart: () => {
			gsap.set(".chatbot_area", { display: "block" });
		}
	}, 2).to(".boogi_loading", {
		opacity: 0,
		duration: 0.3,
		ease: "power2.in"
	}, 2.5).to(".boogi_loading", {
		display:"none"
	}, 2.6).to(".chatbot_area", {
		opacity: 1,
		duration: 0.5,
		ease: "power2.out",
		onComplete: () => {
			videoPlay();
		}
	}, 2.5).to(".chatbot_top", {
		y: 0,
		opacity: 1,
		duration: 0.5,
		ease: "sine.out",
		onComplete: () => {
			gsap.to(".move_heart", {
				opacity: 1,
				duration: 0.3,
				ease: "power2.out",
				delay:0.25,
				onComplete: () => {
					const heartBeat = gsap.timeline({ repeat: -1 });
					heartBeat.to(".move_heart", {
						scale: 0.9,
						duration: 0.5,
						ease: "sine.inOut"
					}).to(".move_heart", {
						scale: 0.8,
						duration: 0.25,
						ease: "sine.inOut"
					}).to(".move_heart", {
						scale: 1,
						duration: 0.25,
						ease: "sine.inOut"
					}).set({}, {}, "+=0.1");
				}
			});
		}
	}, 3.1);

    if ($(window).width() > 1100) {
        t2.to(".chatbot_area", {
            marginTop: "109px",
            duration: 0.5,
            ease: "power2.out"
        }, 3);
    } else {
        gsap.set(".chatbot_area", { marginTop: "0px" });
    }
}

var generateRandomId = function(){
    return "id-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
}

var showChatbot = function(){
	$("#chatbotWrap").fadeIn(200,function(){
		initializeSlide();
		firstMotion();
	});
}

var dataLoading = function(fleg){
	let iptObj = $(".chatbot_wrap input[name=msg]");
	if(fleg){
		iptObj.val("");
		iptObj.attr("disabled",true);		 
		iptObj.attr("placeholder","데이터를 가져오는 중이에요~");
		$("#loding").fadeIn(200);		
		charLoadFleg = true;
	}else{
		iptObj.attr("disabled",false).focus();
		iptObj.attr("placeholder","궁금하신 점을 입력해주세요");
		$("#loding").fadeOut(200);
		charLoadFleg = false;
	}
}

var getWriteTime = function(){
	let now = new Date();
	let hours = now.getHours();
	let minutes = now.getMinutes();
	minutes = minutes < 10 ? "0" + minutes : minutes;
	return hours + ":" + minutes;
}
var scrollBottom = function(){
	if($(".chat_box")[0]!=undefined){
		$(".chat_scroll").scrollTop($(".chat_box")[0].scrollHeight);
	}
}

var getDayOfWeek = function(dateString) {
    let days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    let date = new Date(dateString);
    return days[date.getDay()];
}

var chatbotTemplate = function(){
	$("body").append("<div id=\"chatbotWrap\" style=\"display:none;\"></div>");		

	let preDt = "";
	let rst = "";
	let preList = "";
	$.ajax({
		type: "post",
		url: "/fnct/chatbot/setbot",		
		dataType: "json",
		async: false,
		type: "POST",		
        success: function(data){
			userId = data.uniqId;
			convId = data.convId;

        	rst = data;
			for(let i=0;i<rst.chatList.length;i++){
				let item = rst.chatList[i];
				if(preDt==""){
					preDt = item.regdt.substring(0,10).split("-");
					preDt = preDt[0]+"년 "+preDt[1]+"월 "+preDt[2]+"일 "+getDayOfWeek(item.regdt.substring(0,10));
				}
				if(item.talkTy=="U"){
					preList += "							<div class=\"cb_user_chat\"> ";
					preList += "								<div class=\"cb_txt\"> ";
					preList += "									<p class=\"chat\">"+item.contents+"</p> ";
					preList += "									<p class=\"time\">"+item.regdt.substring(0,16)+"</p>  ";
					preList += "								</div> ";
					preList += "							</div> ";
				}
				if(item.talkTy=="A"){
					let contents = item.contents.replace(/\*\*(.*?)\*\*/g,'<span style="font-weight:bold;color:#000;">$1</span>').replace(/\n/g, '<br>');

					let id = generateRandomId();
					preList +="							<div class=\"cb_boogi_chat\" id=\""+id+"\"> ";
					preList +=" 								<div class=\"cb_pic\"><img src=\""+chatImgPath+"/c_b_boogi.png\" alt=\"AI부기사진\"></div> ";
					preList +=" 								<div class=\"cb_txt\"> ";
					preList +="									<div class=\"cb_answer\"> ";
					preList +=" 										<p class=\"name\">AI 부기</p> ";
					preList +=" 										<div class=\"answer_chat\" style=\"display:block;opacity:1;\"> ";
					preList +=" 											<div class=\"chat\"> ";
					preList +=" 												<p>"+contents+"</p> ";
					preList +=" 											</div> ";
			
					if(item.docList.length>0){
						preList +=" 											<div class=\"chatDesc\"><p>* 아래내용은 답변을 위해 일부 참고한 자료입니다.</p></div> ";
						preList +="				 								<ul class=\"content\"> ";
						for(let q=0;q<item.docList.length;q++){
							let subitem = item.docList[q];
							preList +="												<li><button onclick=\"window.open('"+subitem.sourceUrl+"');\" title=\"[새창] "+subitem.sourceTitle+"\">"+subitem.sourceTitle+"</button></li> ";	
						}
						preList +=" 											</ul> ";
					}

					preList += "											<p class=\"time\">"+item.regdt.substring(0,16)+"</p>  ";
					preList +=" 										</div> ";
					preList +=" 									</div> ";
					preList +=" 								</div> ";
					preList +="							</div> ";	
				}
			}

        }
	});

	if(preList!=""){
		preList = "							<p class=\"cb_date_txt\">"+preDt+"</p> " + preList; 
		welcomeFleg = false;
	}

	let htmlCd = "";
	htmlCd += "<div class=\"chatbot_wrap\"> ";
	htmlCd += "	<div class=\"boogi_loading\"> ";
	htmlCd += "		<img src=\""+chatImgPath+"/boogi_loading_01.png\"> ";
	htmlCd += "		<img src=\""+chatImgPath+"/boogi_loading_02.png\"> ";
	htmlCd += "	</div> ";
	htmlCd += "	<div class=\"chatbot_area\"> ";
	htmlCd += "		<div class=\"chatbot_top\"> ";
	htmlCd += "			<div class=\"cb_top_boogi_bx\"> ";
	htmlCd += "				<img src=\""+chatImgPath+"/c_b_top_item_01.png\" alt=\"부기 이미지\" /> ";
	htmlCd += "				<img src=\""+chatImgPath+"/c_b_top_item_02.png\" alt=\"하트\" class=\"move_heart\"/> ";
	htmlCd += "			</div> ";
	htmlCd += "			<button class=\"cb_close\"><p class=\"txt\">챗봇닫기</p></button> ";
	htmlCd += "		</div> ";
	htmlCd += "		<div class=\"chatbot_bx\"> ";
	htmlCd += "			<div class=\"cb_item_area\"> ";
	htmlCd += "				<div class=\"cb_info_bx\"> ";
	htmlCd += "					<div class=\"cb_weather_bx\"> ";
	htmlCd += "						<p class=\"cb_deg\"><span>℃</span></p> ";
	htmlCd += "						<p class=\"cb_weather\"></p> ";
	htmlCd += "					</div> ";
	htmlCd += "					<div class=\"cb_date_bx\"> ";
	htmlCd += "						<p class=\"cb_date\">"+rst.shotDay+"</p> ";
	htmlCd += "						<p class=\"cb_local\">부산광역시</p> ";
	htmlCd += "					</div> ";
	htmlCd += "					<button class=\"cb_close\"><p class=\"txt\">챗봇닫기</p></button> ";
	htmlCd += "				</div> ";
	htmlCd += "			<div class=\"cb_video_bx\"> ";
	htmlCd += "				<video id=\"videoPlayer\" data-dashjs-player=\"\" id=\"chatVideo\" src=\""+rst.rs.sumry+"\" controls=\"\" preload=\"auto\"></video> ";
	htmlCd += "			</div> ";
	htmlCd += "			<button class=\"slide-btn\"><p>왼쪽으로 밀면 채팅창이 나옵니다</p></button> ";
	htmlCd += "		</div> ";
	htmlCd += "		<div class=\"cb_chat_wrap\"> ";
	htmlCd += "			<div class=\"cb_title_bx\"> ";
	htmlCd += "				<p class=\"cb_title\">부산 시정의 <strong class=\"icon_news\">최신정책 소식</strong>을 알려주는 <strong>AI부기뉴스</strong><span class=\"chatSource\">[출처 : 부산시보, 보도자료 기반]</span></p> " ;                            
	htmlCd += "				<ul class=\"cb_btn_area\"> ";
	htmlCd += "					<li><a href=\"\" style=\"display:none;\"><span class=\"txt\">refresh</span></a></li> ";
	htmlCd += "					<li><button class=\"infoBtn\"><span class=\"txt\">info</span></button></li> ";
	htmlCd += "				</ul> ";
	htmlCd += "				<button class=\"cb_close\"><p class=\"txt\">챗봇닫기</p></button> ";
	htmlCd += "			</div> ";
	htmlCd += "			<div class=\"cb_chat_bx\"> ";
	htmlCd += "				<div class=\"cb_chat_area\"> ";
	htmlCd += "					<div class=\"chat_scroll\"> ";
	htmlCd += "						<div class=\"chat_box\"> ";
	htmlCd += preList;
	htmlCd += "							<p class=\"cb_date_txt\">"+rst.date+"</p> ";
	htmlCd += "						</div> ";
	htmlCd += "					</div> ";
	htmlCd += "					<div class=\"cb_type_area\"> ";
	htmlCd += "						<input type=\"text\" name=\"msg\" id=\"chatInput\" placeholder=\"궁금하신 점을 입력해주세요.\"> ";
	htmlCd += "						<button class=\"btn_send\" id=\"send_chat\"><p class=\"txt\">보내기</p></button> ";
	htmlCd += "					</div> ";
	htmlCd += "					<div class=\"eventFloating\">";
	htmlCd += "					    <button class=\"closeEvent\"><img src=\""+chatImgPath+"/c_b_icon_close.png\" ></button>";
	htmlCd += "					    <a href=\"/minwon/survey/view?qestnarNo=486\" target=\"_blank\" title=\"ai부기 설문조사 새 창 열기\"><img src=\""+chatImgPath+"/aiboogiEventBanner.png\" alt=\"AI 부기뉴스 설문 이벤트 바로가기\"></a>";
	htmlCd += "					</div>";

	htmlCd += "				</div> ";
	htmlCd += "				<div class=\"cb_notice\"><p class=\"version\">AI 부기는 계속 공부중이라 실수를 할 수 있습니다.</p><p class=\"txt\">Beta ver 0.9</p></div> ";
	htmlCd += "				<div class=\"info_popup_wrap\">";
	htmlCd += "				    <div class=\"info_popup\">";
	htmlCd += "						<div class=\"title_bx\">";
	htmlCd += "						    <p class=\"title\">부산시 AI 부기뉴스</p>";
	htmlCd += "						    <button class=\"close_info\"><p class=\"txt\">닫기</p></button>";
	htmlCd += "						</div>";

	htmlCd += "						<div class=\"content_bx\">";
	htmlCd += "							<div class=\"img_bx\">";
	htmlCd += "								<img src=\""+chatImgPath+"/info_boogi_item.png\" alt=\"ai 부기뉴스 부기\"/>";
	htmlCd += "							</div>";
	htmlCd += "							<div class=\"txt_Bx\">";
	htmlCd += "								<div class=\"txt1\">부산시는 <span class=\"colorPP\">시민소통</span>과 <span class=\"colorPP\">정책 홍보</span>를 위해";
	htmlCd += "								<span class=\"colorPP\">인공지능(AI) 챗봇</span>을 <span class=\"colorPP\">시범 운영</span> 중입니다.</div>";
	htmlCd += "								<div class=\"txt2\">이 챗봇은 부산의 다양한 소식을 쉽고 빠르게 전달하고,";
	htmlCd += "									궁금한 정보를 24시간 안내하는 소통 창구로";
	htmlCd += "									<span class=\"colorPP\">다양한 서비스</span>로 <span class=\"colorPP\">점차 확대</span>할 예정입니다.<br/>";
	htmlCd += "									<span class=\"colorPP\">AI부기</span>는 현재 <span class=\"colorPP\">부산사투리</span>로 서비스되고 있습니다.";	
	htmlCd += "								</div>";
	htmlCd += "							</div>";
	htmlCd += "						</div>";

	htmlCd += "				    </div>";
	htmlCd += "				</div>";
	htmlCd += "			</div> ";
	htmlCd += "		</div> ";
	htmlCd += "	</div> ";
	htmlCd += "</div> ";

	$("#chatbotWrap").html(htmlCd);
	
	//임시
    $('.closeEvent').on('click', function() {
		$(".eventFloating").fadeOut(200);
	});

	//스크립트로 동적url 사용시 플레이어 다시 생성해줘야함.
	var url = rst.rs.sumry;
	var player = dashjs.MediaPlayer().create();
        player.initialize(document.querySelector("#videoPlayer"), url, true);

	weatherInfo("bugi");
	//audio = document.getElementById("ttsAudio");

	chatVideo = document.getElementById("videoPlayer");
    $itemArea = $('.cb_item_area');
    $slideBtn = $('.slide-btn');

	$(".cb_close").click(function(){
		$(".boogi_loading,.boogi_loading img:nth-child(1),.boogi_loading img:nth-child(2),.chatbot_area,.chatbot_top,.move_heart").removeAttr("style");		
		$(".chatbot_area").fadeOut(200).css("opacity","0");
		$("#chatbotWrap").fadeOut(200);
		$slideBtn.removeClass('open');
		chatVideo.pause();
		scrollBottom();
	});

	$("#send_chat").click(function(){		
		let msg = $("input[name=msg]").val();
		if(msg==""){
			alert("메세지를 입력해주세요.");
			$("input[name=msg]").focus();
			return false;
		}
		const text = $('#chatInput').val().trim(); 
		if (text) chatStream(text, 'chat'); 
	});

	$("input[name=msg]").on("keyup",function(key){
		if(key.keyCode==13) {
			$("#send_chat").click();
		}     
	}); 	
    $(window).on('resize', function() {
        const prevMaxSlide = chatMaxSlide;
        const windowWidth = $(window).width();
        
        if (windowWidth > 768) {
            chatTranslateX = 0;
            $itemArea.css({
                'transition': 'none',
                'transform': 'translateX(0px)'
            });
            $slideBtn.removeClass('open');
        } else {
            updateMaxSlide();
            if (chatTranslateX !== 0) {
                chatTranslateX = (chatTranslateX / prevMaxSlide) * chatMaxSlide;
                $itemArea.css({
                    'transition': 'none',
                    'transform': `translateX(-100%)`
                });
                $slideBtn.addClass('open');
            } else {
                $itemArea.css({
                    'transition': 'none',
                    'transform': `translateX(-100%)`
                });
                $slideBtn.addClass('open');
            }
        }
    });



    $slideBtn.on('click', function(e) {
        if ($(window).width() >= 768) return;
        
        updateMaxSlide();
        if (chatTranslateX === 0) {
            chatTranslateX = chatMaxSlide;
            $slideBtn.addClass('open');
            if (chatVideo) chatVideo.pause();
        } else {
            chatTranslateX = 0;
            $slideBtn.removeClass('open');
			videoPlay();
        }
        
        $itemArea.css({
            'transition': 'transform 0.3s ease-out',
            'transform': 'translateX('+chatTranslateX+'px)'
        });
    });

	let startX;

	$('.chatbot_bx').on('touchstart', function(e) {
		startX = e.originalEvent.touches[0].clientX;
	});

	$('.chatbot_bx').on('touchend', function(e) {
		let endX = e.originalEvent.changedTouches[0].clientX;
		if (startX - endX > 50) {
			$slideBtn.click();
		}
	});

	$('.infoBtn').on('click', function() {
		$('.info_popup_wrap').addClass('on');
	});
	$('.close_info').on('click', function() {
		$('.info_popup_wrap').removeClass('on');
	});

	$("#voice_popup_wrap .close_voice").click(function(){
		$("#voice_popup_wrap").removeClass("on");
		audio.pause();
	});
}
