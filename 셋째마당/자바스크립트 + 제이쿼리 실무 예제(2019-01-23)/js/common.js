(function(win, $){
	var $html = $("html");
	//반응형 웹의 중단점에 사용할 값을 객체 속성으로 등록합니다.
	var deviceSize = {
		pc:1009,
		tablet:801,
		mobile:800
	};

	//매개변수에 전달된 값이 "scroll"이면 스크롤바가 생성되고 너빗값을 반환합니다.
	function scrollShowHide(status) {
		$html.css({"overflow-y":status});
		return $html.width();    
	}

	var sc_w1 = scrollShowHide("hidden"),
		sc_w2 = scrollShowHide("scroll"),
		sc_w3 = sc_w1 - sc_w2;

	//제이쿼리의 부라우저 너비 계산 방식에서는 스크롤바의 너비를 제외합니다.
	//하지만 미디어 쿼리는 스크롤바를 포함한 브라우저의 너비를 계산합니다.
	//즉, 제이쿼리와 미디어쿼리의 브라우저 너비 계산방식이 달라 오차가 발생합니다.
	if(sc_w3 > 0) {
		deviceSize.pc = deviceSize.pc -  sc_w3;
		deviceSize.tablet = deviceSize.tablet -  sc_w3;
		deviceSize.mobile = deviceSize.mobile -  sc_w3;
	}
	//console.log(deviceSize.pc);

	$(win).on("resize", function() {
		var w_size = $(win).width();
		if(w_size >= deviceSize.pc 
		&& !$("html").hasClass("pc")) {
			$html.removeClass("mobile tablet").addClass("pc");
			scrollShowHide("scroll");
		} else if(w_size < deviceSize.pc 
		&& w_size >= deviceSize.tablet 
		&& !$("html").hasClass("tablet")) {
			$html.removeClass("mobile pc").addClass("tablet");
			scrollShowHide("scroll");
		} else if(w_size <= deviceSize.mobile 
		&& !$html.hasClass("mobile")) {
			$html.removeClass("pc tablet").addClass("mobile");
			var menu_pos = parseInt($(".mobile-menu-wrap").css("left"));
			if(menu_pos >= 0) {
							scrollShowHide("hidden");
						}
		}
	});

	$(function(){
		$(win).trigger("resize");
		//데스크톱, 태블릿은 마우스 포인터를 상위 메뉴에 올리면 gnbPlay를 호출합니다.
		$(document).on("mouseover focus",
		".pc #gnb>ul>li>a, .tablet #gnb>ul>li>a", 
		gnbPlay);

		//모바일은 상위 메뉴를 터치하면 gnbPlay를 호출합니다.
		$(document).on("click",
		".mobile #gnb>ul>li:not(.no-sub)>a", 
		gnbPlay);
					
		function gnbPlay() {
			var $ts = $(this);
			if($("html").hasClass("mobile")) {
				
				$(".mobile #gnb>ul>li>a").removeClass("on");
				$("#gnb ul ul:visible").slideUp(300);
				
				if($ts.next().is(":hidden")) {
					$ts.addClass("on");
					$ts.next().stop(true,true).slideDown(300);
				}
			} else {
				$("#gnb ul ul:visible").slideUp(300);
				$ts.next().stop(true,true).slideDown(300);
			}
		} 

		$(document).on("mouseleave", ".pc #gnb, .tablet #gnb", gnbleave);
		function gnbleave() {
			$("#gnb ul ul:visible").slideUp(300);
			$("#gnb>ul>li>a").removeClass("on");
		}
		$(".mobile-menu-open button").on("click", function() {
			$(".mobile-menu-wrap").animate({"left":0}, 200);
			scrollShowHide("hidden");
		});
		$(".mobile-menu-close button").on("click", function() {
			$(".mobile-menu-wrap").animate({"left":"-1000px"}, 200);
			scrollShowHide("scroll");
			gnbleave();
		});
	});
}(window, jQuery));
