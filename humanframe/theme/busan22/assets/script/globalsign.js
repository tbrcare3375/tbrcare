$(function(){
	var currentCnt = 0;
	var numberWithCommas = function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	var dateLoad = function(){
		// POST 요청 비활성화 - 로컬 서버에서 지원하지 않음
		/*
		$.ajax({
			type : 'post',
			url : '/fnct/globalsign/totalCnt',
			dataType : 'json',    
			success : function(result) {
				let max = result.offline + result.online;        				
				counter(max);
			},
			error : function(request, status, error) {
			}
		});
		*/
		// 기본값으로 카운터 설정
		counter(1234567);
	}

	var counter = function(max){
		let du = (currentCnt==0) ? 1500 : 500;
		$({val:currentCnt}).animate(
			{val:max},
			{
				duration: du,
				step: function() {
					var num = numberWithCommas(Math.floor(this.val));
					$("#cnt").text(num);
				},
				complete: function() {
					var num = numberWithCommas(Math.floor(this.val));
					$("#cnt").text(num);
					setTimeout(function(){
						dateLoad();
					}, 10000);
				}
			}
		);
		currentCnt = max;
	}	

	dateLoad();
});