$(document).ready(function(){
	var o ={
		wrp: $('.wrapper'),
		loading: $('.loading'),
		backEndUrl: 'http://benefique-event.medialand.com.tw/xml/',
		menuTimeout:''
	};

	//Common
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
		if(o.wrp.hasClass('ipt')) initIpt();
	});
	function showMenu(_t){
		if(_t){
			clearTimeout(o.menuTimeout);
			$('.head_top').addClass('on');
			$('.menu').removeClass('on').removeClass('off').addClass('on');
			o.wrp.addClass('on');
		}else{
			$('.head_top').removeClass('on');
			$('.menu').removeClass('on').addClass('off');
			o.menuTimeout = setTimeout(function(){
				$('.menu').removeClass('off');
				o.wrp.removeClass('on');
			},800);
		}
	}


	//Input
	function initIpt(){
		changeCode();
		getData();

		$('.respend').click(function(){
			showResendpop(true);
		});
		$('.resend_pop .closebtn').click(function(){
			showResendpop(false);
		});
		$('.success_pop .closebtn').click(function(){
			showSuccesspop(false);
		});
		$('.checkbox').click(function(){
			if($(this).hasClass('on')) $(this).removeClass('on');
			else $(this).addClass('on');
		});
		$('.changeimg').click(changeCode);
		$('.message_box .message').on('blur',function(){
			if($(this).val()) $(this).addClass('on');
			else $(this).removeClass('on');
		});

		function showResendpop(_t){
			if(_t){
				$('.resend_pop').fadeIn();
			}else{
				$('.resend_pop').fadeOut();
			}
		}
		function showSuccesspop(_t){
			if(_t){
				$('.success_pop').fadeIn();
			}else{
				$('.success_pop').fadeOut();
			}
		}
		function changeCode(){
			var randomForCode = Math.floor(Math.random()*10000) + 1;
			$('.codeimg').attr('src','http://benefique-event.medialand.com.tw/xml/api_vcode.ashx?' + randomForCode);
		}
		function getData(){
			$.ajax({
				url: o.backEndUrl + 'api_store.ashx',
				type: 'POST',
				dataType: 'json',      
				success: function(data) {
				if(data.RS=="OK"){
					o.StoreData = data.DATA;
					console.log(o.StoreData);
					$('.data_box').each(data_boxFC);
				}else alert(data.RS);
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			}); 
		}
		function data_boxFC(){
			var _this = $(this),
				_city = _this.find('.city'),
				_area =  _this.find('.area'),
				_store = _this.find('.store'),
				_address = _this.find('.address'),
				_mapDom = document.getElementById('mapCanvas'),
				nowCity = 0,
				nowArea = 0,
				nowStore = 0;
			_city.html('');

			if(_this.hasClass('mom_data_box')) _mapDom = document.getElementById('mapCanvas2');

			var _pp = new google.maps.LatLng(25.0857656,121.4729057);
			var mapOptions = {zoom: 18,center: _pp};
			var map = new google.maps.Map(_mapDom,mapOptions);	
			var beachMarker = new google.maps.Marker({position: _pp,map: map});
			map.setCenter(_pp);
			
			for(i in o.StoreData) _city.append('<option value="'+ o.StoreData[i].city +'">'+ o.StoreData[i].city +'</option>');
			cityChange();

			_city.change(function(){
				nowCity = _city.find('option:selected').index();
				cityChange();
			});
			_area.change(function(){
				nowArea = _area.find('option:selected').index();
				areaChange();
			});
			_store.change(function(){
				nowStore = _store.find('option:selected').index();
				storeChange();
			});
			function cityChange(){
				_area.html('');
				for(i in o.StoreData[nowCity].areas) _area.append('<option value="'+ o.StoreData[nowCity].areas[i].area +'">'+ o.StoreData[nowCity].areas[i].area +'</option>');
				nowArea = 0;
				areaChange();
			}
			function areaChange(){
				_store.html('');
				for(i in o.StoreData[nowCity].areas[nowArea].STORES) _store.append('<option value="'+ o.StoreData[nowCity].areas[nowArea].STORES[i].STORE +'">'+  o.StoreData[nowCity].areas[nowArea].STORES[i].STORE +'</option>');
				nowStore = 0;
				storeChange();
			}
			function storeChange(_n){
				var _t = o.StoreData[nowCity].areas[nowArea].STORES[nowStore];
				_address.html(
					_t.STORE +'<br>'+
					_t.TEL +'<br>'+
					_t.CITY + _t.AREA + _t.ADDRESS
				);
				_pp = new google.maps.LatLng(_t.LAT,_t.LNG);
				beachMarker.setMap(null);
				beachMarker = new google.maps.Marker({position: _pp,map: map});
				map.setCenter(_pp);
			}
		}
		
	}


	//Index
	function initIdx(){
		$('.index').addClass('on');
	}
	
})//ready end  
