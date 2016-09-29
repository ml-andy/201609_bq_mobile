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
		mainurl: 'http://benefique-event.medialand.com.tw/m/',
		videolink: 'https://www.youtube.com/watch?v=8bko-b90m_M',
		exchangeTitle:'已經將您的留言傳送給媽媽了！',
		exchangeTxt:'送您一份禮物',
		exchangeTitle_mom:'親愛的媽媽<br>這是女兒給您的溫暖留言：',
		exchangeTxt_mom:'還有一份禮物'
	};
	if(device.desktop()){
		if(!o.wrp.hasClass('exchange')) window.location.href = window.location.href.replace('/m/','/');
	}

	//Common
	$('.logo').on('click',function(){
		tracker_btn('/m/index_btn.html');
		window.location.href='index.html';
	})
	$('.menua_box .m1').on('click',function(){
		tracker_btn('/m/trial_btn.html');
		window.location.href="trial.html";
	});
	$('.menua_box .m2').on('click',function(){
		tracker_btn('/m/video_btn.html');
		window.location.href="video.html";
	});
	$('.menua_box .m3').on('click',function(){
		tracker_btn('/m/product_btn.html');
		window.location.href="product.html";
	});
	$('.menua_box .m4').on('click',function(){
		tracker_btn('/m/blogger_btn.html');
		window.location.href="blogger.html";
	});
	$('.menua_box .m5').on('click',function(){
		tracker_btn('/m/tips_btn.html');
		window.location.href="tips.html";
	});
	$('.menu_social .home_btn').on('click',function(){
		tracker_btn('/m/official_btn.html');
		window.open('http://www.shiseido.com.tw/');
	});
	$('.menu_social .fb_btn').on('click',function(){
		tracker_btn('/m/fbshare_btn.html');
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
		if(o.wrp.hasClass('blogger')) initBlogger();
		if(o.wrp.hasClass('tips')) initTips();
		
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


	//Tips
	function initTips(){
		tracker_pg('/m/tips.html');
		$('.content .btn a').on('click',function(){
			tracker_btn('/m/tips_shop_btn.html');
			window.open('http://benefique.shiseido.com.tw/shop/');
		})
	}

	//Blogger
	function initBlogger(){
		tracker_pg('/m/blogger.html');
		$('.n').on('click',function(){
			if($(this).attr('blogger') == 1) tracker_btn('/m/blogger_mom1.html');
			else if($(this).attr('blogger') == 2) tracker_btn('/m/blogger_mom2.html');
			else if($(this).attr('blogger') == 3) tracker_btn('/m/blogger_mom3.html');
			else if($(this).attr('blogger') == 4) tracker_btn('/m/blogger_warm4.html');
			else if($(this).attr('blogger') == 5) tracker_btn('/m/blogger_warm5.html');
			else if($(this).attr('blogger') == 6) tracker_btn('/m/blogger_warm6.html');
		});
	}

	//exchange
	function initExchange(){
		getExchange();
		var mom = false;

		$('.go_btn').on('click',function(){
			if(!$(this).hasClass('on')){
				if(mom) tracker_btn('/m/momcoupon_use_btn.html');
				else tracker_btn('/m/daughtercoupon_use_btn.html');
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
				if(mom) tracker_pg('/m/momcoupon_use.html');
				else tracker_pg('/m/daughtercoupon_use.html');
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
			$('.go_btn').addClass('on');
			if(o.exchangeData.EXCHANGE!=0) $('.go_btn').addClass('on');
			else{
				$('.go_btn').removeClass('on');
				$('.yes_btn').on('click',function(){
					if(mom) tracker_btn('/m/momcoupon_use_yes.html');
					else tracker_btn('/m/daughtercoupon_use_yes.html');
					sureChange();
				});
				$('.no_btn').on('click',function(){
					if(mom) tracker_btn('/m/momcoupon_use_no.html');
					else tracker_btn('/m/daughtercoupon_use_no.html');
					showConform_pop(false);
				});
			}
			$('.store').html(o.exchangeData.STORE);

			if(o.exchangeData.TYPE !=0) mom = true;
			else mom = false;

			if(mom){
				tracker_pg('/m/momcoupon.html');
				$('.message .t').html(o.exchangeTitle_mom);
				$('.message .w').html(o.exchangeData.MESSAGE);
				$('.type').html(o.exchangeTxt_mom);
			}else{
				tracker_pg('/m/daughtercoupon.html');
				$('.message .t').html(o.exchangeTitle);
				$('.message .w').html(o.exchangeData.MESSAGE);
				$('.type').html(o.exchangeTxt);
			}

		}
	}

	//product
	function initProduct(){
		tracker_pg('/m/product.html');
		$('.pd_box').addClass('on');

		$('.more').on('click',function(){
			tracker_btn('/m/product_more_btn.html');
			window.open('http://www.shiseido.com.tw/brand.aspx?b=1#/new');
		});
		
	}

	//video
	function initVideo(){
		tracker_pg('/m/video.html');
		FB.init({
	        appId      : o.FBAppId,
	        channelUrl : o.mainurl,
	        status     : true,
	        xfbml      : true,
	        cookie     : true
	    });

		$('.award_btn').on('click',function(){
			tracker_btn('/m/video_winner_btn.html');
			showAwardpop(true);
		});
		$('.about_btn').on('click',function(){
			tracker_btn('/m/video_rule_btn.html');
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
		$('.video_data_pop .agree_box .txt a').on('click',function(){
			tracker_btn('/m/videodata_privacy_btn.html');
		});
		$('.video_data_pop .agree_box .checkbox').on('click',function(){
			if($(this).hasClass('on')) $(this).removeClass('on');
			else $(this).addClass('on');
		});
		$('.video_data_pop .closebtn').on('click',function(){
			showVideoPop(false);
		});
		$('.sharebtn a').on('click',function(){
			tracker_btn('/m/video_fbshare_btn.html');
			shareVideo();
			showVideoPop(true);
		});
		$('.video_success_pop .sendbtn a').on('click',function(){
			tracker_btn('/m/videodone_trial_btn.html');
			window.location.href="input.html";
		});

		function showAwardpop(_t){
			if(_t){
				tracker_pg('/m/videowinner.html');
				$('.award_pop').fadeIn();
			}else{
				$('.award_pop').fadeOut();
			}
		}
		function showSuccessVideopop(_t){
			if(_t){
				tracker_pg('/m/videodone.html');
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
			// console.log(_data);
			if(_data.name == "" || _data.name == undefined){alert(o.nameTxt);_o.removeClass('on');return;}
			if(_data.mob == "" || _data.mob == undefined){alert(o.phoneTxt);_o.removeClass('on');return;}
			if(_data.email == "" || _data.email == undefined){alert(o.emailTxt);_o.removeClass('on');return;}
			if(_data.ccc == "" || _data.ccc == undefined){alert(o.codeTxt);_o.removeClass('on');return;}
			if(!$('.agree_box .checkbox').hasClass('on')){alert(o.agreeTxt);_o.removeClass('on');return;}

			tracker_btn('/m/videodata_send_btn.html');

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
				tracker_pg('/m/videodata.html');
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
				tracker_pg('/m/videorule.html');
				$('.about_pop').fadeIn();
			}else{
				$('.about_pop').fadeOut();
			}
		}
	}

	//trial
	function initIpt(){
		tracker_pg('/m/trial.html');
		changeCode();
		getData();

		$('.agree_box .txt a').on('click',function(){
			tracker_btn('/m/trial_privacy_btn.html');
		});
		$('.resend_pop .sendbtn a').click(function(){
			if(!$(this).hasClass('on')){
				$(this).addClass('on');
				tracker_btn('/m/resend_send_btn.html');
				resendData();
			}
		});
		$('.success_pop .sendbtn a').click(function(){
			tracker_btn('/m/trialdone_resend_btn.html');
			showResendpop(true);
			showSuccesspop(false);
		});
		$('.stage_input .sendbtn a').click(function(){
			if(!$(this).hasClass('on')){
				$(this).addClass('on');
				tracker_btn('/m/trial_send_btn.html');
				saveData();
			}
		});
		$('.respend').click(function(){
			tracker_btn('/m/trial_resend_btn.html');
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
						alert('已重新發送，還有影片分享抽活動唷！');
						window.location.href = "video.html";
						// clearResendpop();
						// showResendpop(false);
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
				tracker_pg('/m/resend.html');
				$('.resend_pop').fadeIn();
			}else{
				$('.resend_pop').fadeOut();
			}
		}
		function showSuccesspop(_t){
			if(_t){
				tracker_pg('/m/trialdone.html');
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
		tracker_pg('/m/index.html');
		$('.index').addClass('on');

		$('.btn').on('click',function(){
			tracker_btn('/m/index_trial_btn.html');
			window.location.href="trial.html";
		});
	}
	
})//ready end  
