$(document).ready(function(){
	var o ={
		wrp: $('.wrapper'),
		loading: $('.loading'),
		backEndUrl: 'http://benefique-event.medialand.com.tw/xml/',
		menuTimeout:'',
		agreeTxt:'請同意個人條款',
		nameTxt:'請輸入真實姓名',
		phoneTxt:'請輸入聯絡手機',
		codeTxt:'請輸入驗證碼',
		emailTxt:'請輸入E-mail',
		messageTxt:'請輸入留言',
		FBAppId: '176845812757265',
		mainurl: 'http://benefique-event.medialand.com.tw/',
		videolink: 'https://www.youtube.com/watch?v=8bko-b90m_M',
		exchangeTitle:'已經將您的留言傳送給媽媽了！',
		exchangeTxt:'送您一份禮物',
		exchangeTitle_mom:'親愛的媽媽<br>這是女兒給您的溫暖留言：',
		exchangeTxt_mom:'還有一份禮物'
	};

	//Common
	$('.logo').on('click',function(){
		window.location.href="http://benefique-event.medialand.com.tw/m/";
	})
	$('.menu_social .fb_btn').on('click',function(){
		window.open('https://www.facebook.com/taiwanshiseido/');
	});
	$('.menubtn').on('click',function(){
		if($(this).parent().hasClass('on')){
			showMenu(false);
		}else{
			showMenu(true);
		}
	});
	window.onorientationchange = readDeviceOrientation;
	$(window).load(function(){
		
		readDeviceOrientation();
		if(o.wrp.hasClass('idx')) initIdx();
		if(o.wrp.hasClass('ipt')) initIpt();
		if(o.wrp.hasClass('video')) initVideo();
		if(o.wrp.hasClass('product')) initProduct();
		
		if(o.wrp.hasClass('exchange')) initExchange();
		else o.loading.fadeOut();
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
	function readDeviceOrientation() {                 		
	    if (Math.abs(window.orientation) === 90) {
	        // Landscape
	        $('.turn_straight').fadeIn();
	    } else {
	    	// Portrait
	    	$('.turn_straight').fadeOut();
	    }
	}


	
	//product
	function initExchange(){
		getExchange();

		$('.go_btn').on('click',function(){
			if(!$(this).hasClass('on')){
				showConform_pop(true);
			}
		});
		$('.conform_pop .closebtn').on('click',function(){
			showConform_pop(false);
		});

		function sureChange(){
			var getcode = window.location.href.split('.html?')[1];
			$.ajax({
				url: o.backEndUrl + 'api_exchange_confirm.ashx',
				type: 'POST',
				dataType: 'json',  
				data:{
					qs:getcode
				},    
				success: function(data) {
					if(data.RS=="OK"){
						$('.go_btn').addClass('on');
						showConform_pop(false);
					}else{
						alert(data.RS);
					}
				},error: function(xhr, textStatus, errorThrown) {
					console.log("error:", xhr, textStatus, errorThrown);
				}
			}); 
		}
		function showConform_pop(_t){
			if(_t){
				$('.conform_pop').fadeIn();
			}else{
				$('.conform_pop').fadeOut();
			}
		}
		function getExchange(){
			var getcode = window.location.href.split('.html?')[1];
			$.ajax({
				url: o.backEndUrl + 'api_exchange.ashx',
				type: 'POST',
				dataType: 'json',  
				data:{
					qs:getcode
				},    
				success: function(data) {
					if(data.RS=="OK"){
						o.exchangeData = data;
						console.log(o.exchangeData);
						afterGetdata();
						o.loading.fadeOut();
					}else{
						o.loading.fadeOut();
						alert(data.RS);
					}
				},error: function(xhr, textStatus, errorThrown) {       
					o.loading.fadeOut();    
					console.log("error:", xhr, textStatus, errorThrown);
				}
			}); 
		}
		function afterGetdata(){
			if(o.exchangeData.EXCHANGE!=0) $('.go_btn').addClass('on');
			else{
				$('.yes_btn').on('click',function(){
					sureChange();
				});
				$('.no_btn').on('click',function(){
					showConform_pop(false);
				});
			}
			$('.store').html(o.exchangeData.STORE);

			var mom = false;

			if(mom){
				$('.message .t').html(o.exchangeTitle_mom);
				$('.message .w').html(o.exchangeData.MESSAGE);
				$('.type').html(o.exchangeTxt_mom);
			}else{
				$('.message .t').html(o.exchangeTitle);
				$('.message .w').html(o.exchangeData.MESSAGE);
				$('.type').html(o.exchangeTxt);
			}

		}
	}
	function initProduct(){
		$('.pd_box').addClass('on');
	}
	//video
	function initVideo(){
		FB.init({
	        appId      : o.FBAppId,
	        channelUrl : o.mainurl,
	        status     : true,
	        xfbml      : true,
	        cookie     : true
	    });

		$('.about_btn').on('click',function(){
			showAboutpop(true);
		});
		$('.about_pop .closebtn').on('click',function(){
			showAboutpop(false);
		});
		$('.video_success_pop .closebtn').on('click',function(){
			showSuccessVideopop(false);
		});
		$('.video_data_pop .sendbtn a').on('click',function(){
			if(!$(this).hasClass('on')) video_send_data();
		});
		$('.video_data_pop .agree_box .checkbox').on('click',function(){
			if($(this).hasClass('on')) $(this).removeClass('on');
			else $(this).addClass('on');
		});
		$('.video_data_pop .closebtn').on('click',function(){
			showVideoPop(false);
		});
		$('.sharebtn a').on('click',function(){
			shareVideo();
			showVideoPop(true);
		});

		function showSuccessVideopop(_t){
			if(_t){
				$('.video_success_pop').fadeIn();
			}else{
				$('.video_success_pop').fadeOut();
			}
		}
		function clearVideopop(){
			var _data_box = $('.video_data_box');
			_data_box.find('.name').val('');
			_data_box.find('.phone').val('');
			_data_box.find('.email').val('');
			_data_box.find('.code').val('');
		}
		function video_send_data(){
			var _o = $('.video_data_pop .sendbtn a');
			_o.addClass('on');

			var _data_box = $('.video_data_box');
			var _data = {
				name:_data_box.find('.name').val(),
				mob:_data_box.find('.phone').val(),
				email:_data_box.find('.email').val(),
				ccc:_data_box.find('.code').val(),
			};
			console.log(_data);
			if(_data.name == "" || _data.name == undefined){alert(o.nameTxt);_o.removeClass('on');return;}
			if(_data.mob == "" || _data.mob == undefined){alert(o.phoneTxt);_o.removeClass('on');return;}
			if(_data.email == "" || _data.email == undefined){alert(o.emailTxt);_o.removeClass('on');return;}
			if(_data.ccc == "" || _data.ccc == undefined){alert(o.codeTxt);_o.removeClass('on');return;}
			if(!$('.agree_box .checkbox').hasClass('on')){alert(o.agreeTxt);_o.removeClass('on');return;}

			$.ajax({
				url: o.backEndUrl + 'api_info.ashx',
				type: 'POST',
				dataType: 'json',  
				data:_data,    
				success: function(data) {
					if(data.RS=="OK"){
						clearVideopop();
						showVideoPop(false);
						showSuccessVideopop(true);
					}else{
						_o.removeClass('on');
						alert(data.RS);
					}
				},error: function(xhr, textStatus, errorThrown) {       
					_o.removeClass('on');      
					console.log("error:", xhr, textStatus, errorThrown);
				}
			}); 
		}
		function showVideoPop(_t){
			if(_t){
				$('.video_data_pop').fadeIn();
			}else{
				$('.video_data_pop').fadeOut();
			}
		}
		function shareVideo(){
			FB.ui({             
				method: 'feed',
				// name: o.sharetitle,
				// description: o.sharedes,
				display:"popup",
				link: o.videolink
			}, function(response) {

			});    
		}
		function showAboutpop(_t){
			if(_t){
				$('.about_pop').fadeIn();
			}else{
				$('.about_pop').fadeOut();
			}
		}
	}

	//Input
	function initIpt(){
		changeCode();
		getData();

		$('.resend_pop .sendbtn a').click(function(){
			if(!$(this).hasClass('on')){
				$(this).addClass('on');
				resendData();
			}
		});
		$('.success_pop .sendbtn a').click(function(){
			showResendpop(true);
			showSuccesspop(false);
		});
		$('.stage_input .sendbtn a').click(function(){
			if(!$(this).hasClass('on')){
				$(this).addClass('on');
				saveData();
			}
		});
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


		function clearResendpop(){
			var _resend_data_box = $('.resend_data_box');
			_resend_data_box.find('.phone').val('');
			_resend_data_box.find('.email').val('');
			_resend_data_box.find('.code').val('');
		}
		function resendData(){
			var _o = $('.resend_pop .sendbtn a');
			_o.addClass('on');

			var _resend_data_box = $('.resend_data_box');
			var _data = {
				mob:_resend_data_box.find('.phone').val(),
				email:_resend_data_box.find('.email').val(),
				ccc:_resend_data_box.find('.code').val()
			};
			console.log(_data);
			if(_data.mob == "" || _data.mob == undefined){alert(o.phoneTxt);_o.removeClass('on');return;}
			if(_data.email == "" || _data.email == undefined){alert(o.emailTxt);_o.removeClass('on');return;}
			if(_data.ccc == "" || _data.ccc == undefined){alert(o.codeTxt);_o.removeClass('on');return;}

			$.ajax({
				url: o.backEndUrl + 'api_resend.ashx',
				type: 'POST',
				dataType: 'json',  
				data:_data,    
				success: function(data) {
					if(data.RS=="OK"){
						alert('補發成功');
						clearResendpop();
						showResendpop(false);
					}else{
						_o.removeClass('on');
						alert(data.RS);
					}
				},error: function(xhr, textStatus, errorThrown) {       
					_o.removeClass('on');      
					console.log("error:", xhr, textStatus, errorThrown);
				}
			}); 
		}
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
				$('.stage_input .sendbtn a').removeClass('on');
				clearSavedata();
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
						// console.log(o.StoreData);
						$('.data_box').each(data_boxFC);
					}else alert(data.RS);
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			}); 
		}
		function clearSavedata(){
			var _data_box = $('.your_data_box');
			var _data_box2 = $('.mom_data_box');
			_data_box.find('.name').val('');
			_data_box.find('.phone').val('');
			_data_box2.find('.name').val('');
			_data_box2.find('.phone').val('');
			$('.message_box .message').val('');
			$('.stage_input .code_box .code').val('');
		}
		function saveData(){
			var _o = $('.stage_input .sendbtn a');
			_o.addClass('on');

			var _data_box = $('.your_data_box');
			var _data_box2 = $('.mom_data_box');
			var _data = {
				name:_data_box.find('.name').val(),
				mob:_data_box.find('.phone').val(),
				storeid:_data_box.find('.store').find('option:selected').attr('storeid'),
				city:_data_box.find('.city').find('option:selected').val(),
				name2:_data_box2.find('.name').val(),
				mob2:_data_box2.find('.phone').val(),
				storeid2:_data_box2.find('.store').find('option:selected').attr('storeid'),
				city2:_data_box2.find('.city').find('option:selected').val(),
				message:$('.message_box .message').val(),
				ccc:$('.stage_input .code_box .code').val()
			};
			console.log(_data);
			if(_data.name == "" || _data.name == undefined){alert(o.nameTxt);_o.removeClass('on');return;}
			if(_data.mob == "" || _data.mob == undefined){alert(o.phoneTxt);_o.removeClass('on');return;}
			if(_data.name2 == "" || _data.name2 == undefined){alert(o.nameTxt);_o.removeClass('on');return;}
			if(_data.mob2 == "" || _data.mob2 == undefined){alert(o.phoneTxt);_o.removeClass('on');return;}
			if(_data.ccc == "" || _data.ccc == undefined){alert(o.codeTxt);_o.removeClass('on');return;}
			if(_data.message == "" || _data.message == undefined){alert(o.messageTxt);_o.removeClass('on');return;}
			if(!$('.agree_box .checkbox').hasClass('on')){alert(o.agreeTxt);_o.removeClass('on');return;}

			$.ajax({
				url: o.backEndUrl + 'api_save.ashx',
				type: 'POST',
				dataType: 'json',  
				data:_data,    
				success: function(data) {
					if(data.RS=="OK"){
						showSuccesspop(true);
					}else{
						_o.removeClass('on');
						alert(data.RS);
					}
				},error: function(xhr, textStatus, errorThrown) {  
					_o.removeClass('on');           
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
				for(i in o.StoreData[nowCity].areas[nowArea].STORES) _store.append('<option storeid="'+ o.StoreData[nowCity].areas[nowArea].STORES[i].ID +'" value="'+ o.StoreData[nowCity].areas[nowArea].STORES[i].STORE +'">'+  o.StoreData[nowCity].areas[nowArea].STORES[i].STORE +'</option>');
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
