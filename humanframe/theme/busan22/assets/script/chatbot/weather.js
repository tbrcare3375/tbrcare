//위경도 위치 확인 후 호출
function weatherInfo(site){
	var latitude = 35.1814194444444, longitude = 129.078355555556;
	var rs = dfs_xy_conv("toXY",latitude,longitude);
	xml2jsonCurrentWth(rs.nx, rs.ny, site);
};

//locationError
function locationError(error){
	var errorTypes = {
			0 : "ETC Error",
			1 : "권한 없음(permission denied)",
			2 : "위치확인 불가(position unavailable)",
			3 : "시간초과(timeout)"
	};
	var errorMsg = errorTypes[error.code];
	console.log(errorMsg);
};

//geo_options
var geo_options = {
		enableHighAccuracy : true,
		maximumAge : 30000,
		timeout : 27000
};

//LCC DFS 좌표변환을 위한 기초 자료
var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)

// 위경도 -> 기상청 좌표x / 좌표 y 변환 : LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
        rs['nx'] = v1;
        rs['ny'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        } else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            } else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
};

//xml2jsonCurrentWth
function xml2jsonCurrentWth(nx, ny, site) {
	
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();

    if(minutes < 30) {
        // 30분보다 작으면 한시간 전 값
        hours = hours - 1;
        if(hours < 0) {
            // 자정 이전은 전날로 계산
            today.setDate(today.getDate() - 1);
            dd = today.getDate();
            mm = today.getMonth()+1;
            yyyy = today.getFullYear();
            hours = 23;
        }
    }
    if(hours<10) hours='0'+hours;
    if(mm<10) mm='0'+mm;
    if(dd<10) dd='0'+dd;

    var _nx = nx,
    	_ny = ny,
    	today = yyyy+""+mm+""+dd,
    	basetime = hours + "00";
    
    var serviceKey = "ygg%2BxlAeYFB0izyIHJ8OUV9I798v6R0YIOApJhW6VkI1hYIQNAMudyuSL0WTW3iZq1RE01p0Le0a8juPl4Gf6w%3D%3D";
	var baseDate = "";
	var baseTime = "";
	var sky = "";
	var temp = "";
	var rain = "";
	
    $.ajax ({
	    url: "/comm/weather",
	    data : {
	    	"url" : "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",
	    	"serviceKey" : serviceKey,
	    	"base_date" : today,
	    	"base_time" : basetime,
	    	"nx" : _nx,
	    	"ny" : _ny,
	    	"pageNo" : 1,
	    	"numOfRows" : 10
	    },
	    cache: false,
	    success: function(data) {
	    	
	    	var result = JSON.parse(data);

	    	if (result != undefined && result.length > 0) {
	    		for (var i=0; i<result.length; i++) {
	    			baseDate = result[i].baseDate;
	    			baseTime = result[i].baseTime;
	    			var category = result[i].category;
	    			var obsrValue = result[i].obsrValue;
	    			if(category == "SKY") sky = obsrValue;
	    			if(category == "T1H") temp = obsrValue;
	    			if(category == "PTY") rain = obsrValue;
	    		}
	    		$.cookie('weather', skyType(sky, rain, site));
	    		$.cookie('temp', parseFloat(temp).toFixed(1));
	    		$.cookie('time', timeFormat(baseDate+baseTime));
	    		$.cookie('icon', iconType(sky, rain, site));
	    		
	    		if ((parseFloat(temp).toFixed(1)) > -50) {
	    		viewWeather(site);
	    		}
	    	}

	    },
	    error:function(request,status,error){
	        alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	    }
    });
}

function viewWeather(site) {
    $('#chatbotWrap .cb_deg').text($.cookie('temp')+" ℃");
    $('#chatbotWrap .cb_weather').append($.cookie('icon'));
}

function skyType(sky, rain, site) {

	if(site == "global" || site == "global_dev"){
		sky = "Clean" ;
		
		if(sky == 1) sky = "Clean" ;
		//else if(sky == 2) sky = "Partly Cloudy" ;
		else if(sky == 3) sky = "Mostly Cloudy" ;
		else if(sky == 4) sky = "Cloudy" ;

		if(rain == 1) sky = "Rain";
		else if(rain == 2 || rain == 3) sky = "Snow" ;
		else if(rain == 4) sky = "Rain";
	}else{
		sky = "맑음" ;
		
		if(sky == 1) sky = "맑음" ;
		//else if(sky == 2) sky = "구름조금" ;
		else if(sky == 3) sky = "구름많음" ;
		else if(sky == 4) sky = "흐림" ;

		if(rain == 1) sky = "비";
		else if(rain == 2 || rain == 3) sky = "눈" ;
		else if(rain == 4) sky = "비";
	}

	return sky;
};

function iconType(sky, rain, site) {
	sky = '<img src="/resource/img/global_dev/common/icon_weather_01.png" alt="맑음">';
	
	if(sky == 1) sky = '<img src="/resource/img/global_dev/common/icon_weather_01.png" alt="맑음">';
	//else if(sky == 2) sky = '<img src="/resource/img/'+site+'/common/icon_weather_02.png" alt="구름 조금">';
	else if(sky == 3) sky = '<img src="/resource/img/global_dev/common/icon_weather_03.png" alt="구름 많음">';
	else if(sky == 4) sky = '<img src="/resource/img/global_dev/common/icon_weather_04.png" alt="흐림">';

	if(rain == 1) sky = '<img src="/resource/img/global_dev/common/icon_weather_05.png" alt="비">';
	else if(rain == 2 || rain == 3) sky = '<img src="/resource/img/global_dev/common/icon_weather_06.png" alt="눈">';
	else if(rain == 4) sky = '<img src="/resource/img/global_dev/common/icon_weather_05.png" alt="비">';
	return sky;
}

function timeFormat(date) {
	var ampm = "오전 ";
	var time = parseInt(date.substr(8, 2));
	var hour = "";
	var result = null;
	result = date.substr(0, 4)+"년 "+date.substr(4, 2)+"월 "+date.substr(6, 2)+"일 ";
	if(time >= 12) ampm = "오후 ";
	if(time > 12) hour = time - 12;
	else hour = time;
	result = result + ampm + hour + ":" + date.substr(10, 2);
	return result;
};

function microDust() {
    $.ajax ({
	    url: "/comm/microdust",
	    cache: false,
	    success: function(data) {
	    	if(data){
	    		var md = document.querySelector(".microdust");
	    		var txt = new String();
	    		
	    		if(data !== 0){
		    		md.dataset.state = data;
	    		}
	    		
	    		switch(data){
	    			case "1" : txt = "좋음"; break;
	    			case "2" : txt = "보통"; break;
	    			case "3" : txt = "나쁨"; break;
	    			case "4" : txt = "아주나쁨"; break;
	    			default : txt = "";
	    		}
	    		md.innerHTML = "<span>미세먼지("+txt+")</span>"
	    		
	    	}
	    },
	    error: function(request,status,error){
	    	alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	    }
    });
}