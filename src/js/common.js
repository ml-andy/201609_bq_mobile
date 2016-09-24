$(document).ready(function(){
	var o ={
		wrp: $('.wrapper')
	};
	
	$('.menubtn').on('click',function(){
		if($(this).parent().hasClass('on')){
			showMenu(false);
		}else{
			showMenu(true);
		}
	});







	//Event
	function showMenu(_t){
		if(_t){
			$('.head_top').addClass('on');
		}else{
			$('.head_top').removeClass('on');
		}
	}
})//ready end  
