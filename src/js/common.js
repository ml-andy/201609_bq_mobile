$(document).ready(function(){
	var o ={
		wrp: $('.wrapper'),
		loading: $('.loading'),
		menuTimeout:''
	};


	//AddListener
	$('.menubtn').on('click',function(){
		if($(this).parent().hasClass('on')){
			showMenu(false);
		}else{
			showMenu(true);
		}
	});

	$(window).load(function(){
		o.loading.fadeOut();
		if(o.wrp.hasClass('idx')) initIdx();
	});








	//Event
	function initIdx(){
		$('.index').addClass('on');
	}
	function showMenu(_t){
		if(_t){
			clearTimeout(o.menuTimeout);
			$('.head_top').addClass('on');
			$('.menu').removeClass('on').removeClass('off').addClass('on');
		}else{
			$('.head_top').removeClass('on');
			$('.menu').removeClass('on').addClass('off');
			o.menuTimeout = setTimeout(function(){
				$('.menu').removeClass('off');
			},800);
		}
	}
})//ready end  
