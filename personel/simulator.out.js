
var Simulator = {
	$isInit : false, $algorithm : 3, $startDay : null, $endDay : null, $startTime : null, $endTime : null, $euid : null,
	$plan : {planId : 100},  $tags : new HashMap(), $raps : [], 
	$features : [], $lastPoints : new HashMap(),
	$worker : null, $console : null, $isAutoScroll : false,
	$logs : [],
	$map : null, $vectorLayer : null, $mapControls : null,
	close : function(){
		$("#dialog-message").dialog({
			title : $.rtls.simulator.dialog.title[0],
	        width: "400",
	        bgiframe: true,
	        autoOpen: false,
	        modal: true,
	        resizable: false,
	        buttons: [{
	        	text : $.rtls.commons.button.ok,
				click: function() {
					$( this ).dialog( "close" );
					window.self.close();
				}
			}],
			close: function() {
				$("#dialog-message").empty();
				if(window.parent.Position != undefined && window.parent.Position != null) window.parent.Position.windowClose(Simulator.$plan.planId);
	        }
	        
	    });
		$("#dialog-message").append($.rtls.simulator.message.disconnected);
		$('#dialog-message').dialog('open');
	},
	getRaps : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/rap.json?action=get.raps",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : 100
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
				Simulator.$raps = data.raps;
			}
		});
	},
	getTags : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/tag.json?action=get.issued.tags",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Simulator.$plan.planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
				for(var i=0; i < data.length; i++){
					Simulator.$tags.put(data[i].euid, data[i]);
        		}
				Simulator.$isInit = true;
            	Simulator.start();
			}
		});
	},
	start : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/simulator.json?action=start.simulator",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : 100,
            	"algorithm" : 3,
            	"startDay" : Simulator.$startDay,
            	"endDay" : Simulator.$endDay,
            	"startTime" : Simulator.$startTime,
            	"endTime" : Simulator.$endTime,
            	"euid" : Simulator.$euid
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		Simulator.clearConsole();
            		$('#but_startstop').html("<button type='button' onclick='Simulator.stop()'><img src='/resources/commons/images/icon/icon_start_off.png'/>"+$.rtls.simulator.button.simulatoroff+"</button>");
            	}else if(data.result == 'error.already.start'){
            		$("#dialog-message").dialog({
	        			title:$.rtls.commons.dialog.title.ok,
	        			autoOpen: false,
	        			height: 200,
	        			width: 400,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					$( this ).dialog( "close" );
	        					
	        				}
	        			}],
	        			open: function() {
	        				var html = $.rtls.simulator.message.alreadyon;
							$(this).html(html);
	        			},
	        			close: function() {
	        				$("#dialog-message").empty();
	        			}
	        		});
	        		$( "#dialog-message" ).dialog( "open" );
            	}
				
			}
		});
	},
	stop : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/simulator.json?action=stop.simulator",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"euid" : Simulator.$euid
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		if(window.parent.Position != undefined && window.parent.Position != null) window.parent.Position.windowClose(Simulator.$plan.planId);
            	}else if(data.result == 'error.already.stop'){
            		$("#dialog-message").dialog({
	        			title:$.rtls.commons.dialog.title.ok,
	        			autoOpen: false,
	        			height: 200,
	        			width: 400,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					$( this ).dialog( "close" );
	        					
	        				}
	        			}],
	        			open: function() {
	        				var html = $.rtls.simulator.message.alreadyoff;
							$(this).html(html);
	        			},
	        			close: function() {
	        				$("#dialog-message").empty();
	        			}
	        		});
	        		$( "#dialog-message" ).dialog( "open" );
            	}
				
			}
		});
	},
	pause : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/simulator.json?action=pause.simulator",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"euid" : Simulator.$euid
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		if(data.isPause == "true"){
            			$('#but_pause').html('<button type="button" onclick="Simulator.pause()"><img src="/resources/commons/images/icon/icon_pause_on.png"/>'+$.rtls.simulator.button.simulatorpause+'</button>');
            			
            		}else{
            			$('#but_pause').html('<button type="button" onclick="Simulator.pause()"><img src="/resources/commons/images/icon/icon_pause_off.png"/>'+$.rtls.simulator.button.simulatorpause+'</button>');
            		}
            		
            	}else if(data.result == 'error.already.stop'){
            		$("#dialog-message").dialog({
	        			title:$.rtls.commons.dialog.title.ok,
	        			autoOpen: false,
	        			height: 200,
	        			width: 400,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					$( this ).dialog( "close" );
	        					
	        				}
	        			}],
	        			open: function() {
	        				var html = $.rtls.simulator.message.alreadyoff;
							$(this).html(html);
	        			},
	        			close: function() {
	        				$("#dialog-message").empty();
	        			}
	        		});
	        		$( "#dialog-message" ).dialog( "open" );
            	}
				
			}
		});
	},
	initConsole : function(){
		Simulator.$console = $('#map-logs');
		Simulator.$console.css('width', ($(window).width()-parseInt(Simulator.$plan.width)-20)+'px');
		Simulator.$console.css('min-width', '350px');
		Simulator.$console.css('height', $(window).height()-20);
		Simulator.$console.on("DOMSubtreeModified", function() { 
			var elem = $("#map-logs");
			if (elem[0].scrollHeight > elem.outerHeight() && Simulator.$isAutoScroll) {
	        	Simulator.$console.animate({scrollTop : elem[0].scrollHeight}, 100);
	        }
		});
		
	},
	clearConsole : function(){
		$('#log-items').html('');
		this.$logs = [];
	},
	autoConsoleScroll : function(){
		if(Simulator.$isAutoScroll){
			Simulator.$isAutoScroll = false;
			$('#but_autoscroll').html('<button type="button" onclick="Simulator.autoConsoleScroll()"><img src="/resources/commons/images/icon/icon_power_off.gif"/>'+$.rtls.simulator.button.scroll+'</button>');
		}else{
			Simulator.$isAutoScroll = true;
			$('#but_autoscroll').html('<button type="button" onclick="Simulator.autoConsoleScroll()"><img src="/resources/commons/images/icon/icon_power_on.gif"/>'+$.rtls.simulator.button.scroll+'</button>');
		}
	},
	appendConsole : function(ix, euid, lat, lon, distance, time, delayTime, status, tagColor){
		var color = "", bgcolor = "", statusChar;
		var html = '<li style="background-color:#FFFFFF;color:#000000;">';
		html += '<table class="console_table">';
		html += '<tr>';
		html += '	<td style="width:25px;">'+ix+'</td>';
		html += '	<td style="width:85px">'+Simulator.getLogTime(time)+'</td>';
		html += '	<td style="width:35px;background-color:'+tagColor+';">'+euid+'</td>';
		html += '	<td> 纬度 : '+lat.toFixed(8)+', 经度 : '+lon.toFixed(8)+'</td>';
		html += '	<td style="width:80px">'+distance.toFixed(2)+'m</td>';
		html += '	<td style="width:70px">'+(delayTime/1000).toFixed(0)+' sec</td>';
		html += '</tr>';
		html += '</table>';
		html += '</li>';
		$('#log-items').append(html);
	},
	getLogTime : function(milliseconds){
		var d = new Date(milliseconds);
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		var ms = d.getMilliseconds();
		if(h < 10) h = "0"+h;
		if(m < 10) m = "0"+m;
		if(s < 10) s = "0"+s;
		if(ms < 100) ms = "0"+ms;
		return h+":"+m+":"+s+":"+ms;
	},
	addAlarm : function(data){
		if(Simulator.$isInit){
			var alarm  = $.parseJSON(data);
			if(alarm.planId == Simulator.$plan.planId){
				if(alarm.eventType == '20'){
					if(alarm.algorithm == '1'){
						Simulator.$worker.postMessage(data);
					}else{
						Simulator.$worker.postMessage(data);	
					}
				}else if(alarm.eventType == '100'){ //종료
					$('#but_startstop').html('<button type="button" onclick="Simulator.start()"><img src="/resources/commons/images/icon/icon_start_on.gif"/>'+$.rtls.simulator.button.simulatoron+'</button>');
				}
			}
		}
		
	},
	init : function(startDay, endDay, startTime, endTime, euid){
		$('#buttons').html(
				'<span class="button" id="but_autoscroll"><button type="button" onclick="Simulator.autoConsoleScroll()"><img src="/resources/commons/images/icon/icon_power_off.gif"/>'+$.rtls.simulator.button.scroll+'</button></span>'+
				'<span class="button"><button type="button" onclick="Simulator.clearConsole()"><img src="/resources/commons/images/icon/icon_set.png"/>'+$.rtls.simulator.button.clear+'</button></span>'+
				'<span class="button" id="but_pause"><button type="button" onclick="Simulator.pause()"><img src="/resources/commons/images/icon/icon_pause_off.png"/>'+$.rtls.simulator.button.simulatorpause+'</button></span>'+
				'<span class="button" id="but_startstop"><button type="button" onclick="Simulator.stop()"><img src="/resources/commons/images/icon/icon_start_off.png"/>'+$.rtls.simulator.button.simulatoroff+'</button></span>'
		);
		Simulator.$startDay = startDay;
		Simulator.$endDay = endDay;
		Simulator.$startTime = startTime;
		Simulator.$endTime = endTime;
		Simulator.$euid = euid;
		
		Simulator.getRaps();
		Simulator.initMap();
		Simulator.initConsole();
       	Simulator.initWorker();
       	Simulator.getTags();
		$( window ).resize(function() {
    		$("#viewport").css("width", Simulator.$plan.width+"px");
    		Simulator.$console.css('width', ($(window).width()-parseInt(Simulator.$plan.width)-5)+'px');
    		Simulator.$console.css('height', $(window).height()-20);
    	});
		
	},
	initMap : function(){
		if(this.$map == null){
			$("#viewport").css('height', $(document).height()+"px");
			var latlng = new google.maps.LatLng(37.56621, 126.9779); 
			var options = {
				zoom : 16, 
				center : latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP 
			};
			this.$map = new google.maps.Map(document.getElementById('viewport'), options); 
			
			var latlon  = new google.maps.LatLng(Simulator.$raps[0].latitude, Simulator.$raps[0].longitude);
            this.$map.setCenter(latlon);
			
		}
		
	},
	initWorker : function(){
		this.$worker = new Worker('/resources/commons/js/idolink/ido.worker.js'),
		this.$worker.onmessage = function(e){
			var data = $.parseJSON(e.data);
			if(Simulator.$euid == data.tagEuid){
				var euid = data.tagEuid.substring(data.tagEuid.length-4, data.tagEuid.length);
				var name = data.tagAlias;
				var lat = parseFloat(data.latitude);
				var lon = parseFloat(data.longitude);
				var time = parseInt(data.addTime);
				var delayTime = parseInt(data.delayTime);
				var processTime = parseInt(data.processTime);
				var distance = parseFloat(parseFloat(data.distance).toFixed(2));
				var status = parseInt(data.status);
				var proTime = new Date().getTime() - time;
				var moveTime =  delayTime;
				
				
				var latlon = new google.maps.LatLng(lat, lon);
				
				var lastMarker = Simulator.$lastPoints.get(data.tagEuid);
				if(lastMarker != null){
					lastMarker.setPosition(latlon);
				}else{
					var marker = new MarkerWithLabel({
						position : latlon,
						map : Simulator.$map,
						icon: {
							path: google.maps.SymbolPath.CIRCLE,
							fillColor: data.tagColor,
							fillOpacity: 0.5,
						    scale: parseInt(data.tagSize),
						    strokeColor: "#000000",
						    strokeWeight: 1
						},
						title : euid,
						labelText: euid,
						labelAnchor: new google.maps.Point(-15, 40),
						labelClass: "labels", 
					    labelInBackground: false
					});
					Simulator.$map.setCenter(latlon);
				    Simulator.$lastPoints.put(data.tagEuid, marker);    
				}
				Simulator.appendConsole(data.index, euid, lat, lon, distance, time, delayTime, status, data.tagColor);
			}
			
		};
		
	},
	
	
};