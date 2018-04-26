
var Playback = {
	$sessionId : null,
	get : {
		$day : null, $days : [], $hour : null, $hours : [], $min : null, $mins : [], 
		$plan : null, $plans : [], $tag : null, $tags : [], $raps : [], $issuedTags : new HashMap()
	},
	init : function(sessionId){
		this.$sessionId = sessionId;
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[9]+'</span>');
		this.ui.layout();
		Playback.worker.notify();//1.1.4.6中加入
	},
	play : function(){
		var euids = "";
		$("#tags .ui-selected").each(function() {
			var ix = $( "#tags li" ).index( this );
			euids += Playback.get.$tags[ix]+"|";
		});
		
		if($.string(euids).blank()){
			Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.playback.message.choosetag);
		}else{
			$("#dialog").dialog({
				title:'Loading',
				autoOpen: false,
				height: 100,
				width: 300,
				modal: true,
				buttons: [],
				position : {my: "center", at: "center", of: '.inner-layout-center'},
				open: function() {
					$(this).html('Loading...<img src="/resources/commons/images/icon/icon_load.gif"/>');
				},
				close: function() {
					$("#dialog").empty();
		        	$('#dialog').dialog('destroy');
				}
			});
			$("#dialog").dialog("open");
			$(".ui-dialog-titlebar").hide();
			var date = new Date(Playback.get.$day.year, Playback.get.$day.month, Playback.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/playback.json?action=play.playback",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Playback.get.$plan.planId == 0 ? 1 :  Playback.get.$plan.planId,
	            	"day" : date.format('yyyy-MM-dd'),
	            	"startTime" : Playback.ui.$progress.slider("option", "value")	,
					"endTime" : Playback.ui.$progress.slider("option", "max")	,
	            	"euids" : euids
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	if(data.result == 'success'){
	            		Playback.ui.$toolbar.isPlay = true;
	            		Playback.ui.$toolbar.isPause = false;
	            		$('#but_play').button("option", { 
	    			        icons: { primary: 'ui-icon-stop'}
	    			    });
	            		$('#but_play').addClass('ui-state-highlight');
	            		
	            		$("#but_pause").button("enable");
	        	        $("#but_slow").button("enable");
	        	        $("#but_fast").button("enable");
	        	        $("#but_movement").button("enable");

	            		$("#dialog").dialog("close");
	            	}else if(data.result == 'error.already.start'){
	            		Playback.ui.$toolbar.isPlay = true;
	            		Playback.ui.$toolbar.isPause = false;
	            		$('#but_play').button("option", { 
	    			        icons: { primary: 'ui-icon-stop'}
	    			    });
	            		$('#but_play').addClass('ui-state-highlight');
	            		$("#dialog").dialog("close");
	            	}
				}
			});
		}
	},
	stop : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/playback.json?action=stop.playback",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		Playback.worker.$stopCount = data.count;
            		Playback.ui.$toolbar.isPlay = false;
            		Playback.ui.$toolbar.isPause = false;
            	}
			}
		});
	},
	pause : function(){
		var date = new Date(Playback.get.$day.year, Playback.get.$day.month, Playback.get.$day.day);
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/playback.json?action=pause.playback",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		Playback.ui.$toolbar.isPause = data.isPause;
            		if(Playback.ui.$toolbar.isPause){
            			$('#but_pause').addClass('ui-state-highlight');	
            		}else{
            			$('#but_pause').removeClass('ui-state-highlight');
            		}
            	}
			}
		});
	},
	speed : function(speed){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/playback.json?action=set.playback.speed",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	'speed' : speed
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result = 'success'){
            		Playback.ui.$toolbar.speed = data.speed;
            		$('#speed').html(data.speed+"x");
            	}
			}
		});
	},
	status : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/playback.json?action=get.playback.status",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result = 'success'){
                	Playback.ui.$toolbar.isPlay = data.isPlay;
                	Playback.ui.$toolbar.isPause = data.isPause;
                	if(Playback.ui.$toolbar.isPlay) $('#but_play').addClass('ui-state-highlight');
        	        if(Playback.ui.$toolbar.isPause) $('#but_pause').addClass('ui-state-highlight');
            	}
			}
		});
	},
	ui : {
		$layout : null, $innerLayout : null, $calendar : null, $map : null, $toolbar : {isPlay : false, isPause : false, isMovement : false, speed : 1}, $progress : null,
		$startTime : null, $endTime : null,
		layout : function(){
			$('#contents').css('height', ($(window).height() - 150)+'px');
			this.$layout = $('#contents').layout({
				center__paneSelector :  ".outer-layout-center",
				west__paneSelector :	".outer-layout-west",
				east__paneSelector :	".outer-layout-east",
				south__paneSelector :   ".outer-layout-south",
				north__paneSelector :   ".outer-layout-north",
				west__size:	290,
				west__minSize : 290,
				north__initClosed : true,
				south__initClosed : true,
				east__initClosed : true,
				spacing_open : 4,
				spacing_closed:	4,
				west__spacing_closed :	-1,
				west__spacing_open :	-1,
				east__spacing_closed :	0,
				south__spacing_closed :	0,
				north__spacing_open:	0,
				north__spacing_closed:	0,
				center__onresize : "Playback.ui.$innerLayout.resizeAll",
			});
			this.$innerLayout = $('div.outer-layout-center').layout({
				center__paneSelector:	".inner-layout-center",
				west__paneSelector:		".inner-layout-west",
				east__paneSelector:		".inner-layout-east",
				south__paneSelector:	".inner-layout-south",
				north__paneSelector:	".inner-layout-north",
				west__initClosed :      true,
				east__initClosed :      true,
				south__size:			200, 
				north__size: 38,
				north__minSize : 38,
				spacing_open:	4,
				spacing_closed:	4,
				west__spacing_closed:	0,
				east__spacing_closed:	0,
				north__spacing_open:	0,
				north__spacing_closed:	0,
				center__onresize_end:function () {  
					var h = $('.outer-layout-center > .inner-layout-south').height() - 20;
					Playback.log.$console.css('height', h+'px');
					$('#contents').css('height', ($(window).height() - 150)+'px');
				},
				south__onclose_end: function(){
					
				},
				south__onopen_end: function(){
					
				},
			});
			var html = '';
			html += '<div class="ui-accordion ui-widget ui-helper-reset">';
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.playback.form.plan;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;"><ol id="plans" class="plan-selectable"></ol></div>';
			html += '<div style="clear: both;"><div id="calendar"></div></div>';
			html += '<div class="ui-accordion ui-widget ui-helper-reset">';
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.playback.form.time;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;">';
			html += '   <input type="text" id="startTime" style="width:50px; text-align:center" readonly="true" /> ~ ';
			html += '   <input type="text" id="endTime" style="width:50px; text-align:center" readonly="true"/>';
			html += '   <button id="but_time">'+$.rtls.playback.form.settime+'</button>';
			html += '</div>';
			html += '<div style="clear: both;"><ol id="hours" class="menu-selectable"></ol></div>';
			html += '<div class="ui-accordion ui-widget ui-helper-reset"  style="clear: both;">';
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.playback.form.tag;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;"><ol id="tags" class="menu-selectable"></ol></div>';
			$('.outer-layout-west').html(html);
			
			$("#but_time").button({
				icons: {primary: ("ui-icon-clock")}, text : true
			}).click(function() {
				
				if($.string($('#startTime').val()).blank() || $.string($('#endTime').val()).blank()){
					Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.playback.message.settime)
				}else{
					Playback.ui.$startTime = $.trim($('#startTime').val());
					Playback.ui.$endTime = $.trim($('#endTime').val());
					if(Playback.ui.$toolbar.isPlay || Playback.ui.$toolbar.isPause){
						Playback.stop();
					}
					Playback.ui.mins();
					Playback.ui.tags();
				}
				
				return false;
				
			});
			
			$('#startTime').timepicker({
				showTime : false,
				hourGrid: 2,
				minuteGrid: 5
			});
			
			$('#endTime').timepicker({
				showTime : false,
				hourGrid: 2,
				minuteGrid: 5
			});
			
			html = '';
			html += '<table>';
			html += '<tr>';
			html += '	<td style="width:190px">';
			html += '		<div id="toolbar">';
			html += '			<button id="but_play" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" role="button" title="Play/Stop">';
			html += '				<span class="ui-button-icon-primary ui-icon ui-icon-play">'
			html += '				</span><span class="ui-button-text">播放/停止</span>'
			html += '			</button>'
			html += '			<button id="but_pause" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-button-disabled ui-state-disabled" role="button" title="Pause" >';
			html += '				<span class="ui-button-icon-primary ui-icon ui-icon-pause"></span>'
			html += '				<span class="ui-button-text">暂停</span>'
			html += '			</button>'
			html += '			<button id="but_slow"  class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-button-disabled ui-state-disabled" role="button" title="Slow" >';
			html += '				<span class="ui-button-icon-primary ui-icon ui-icon-seek-prev"></span>'
			html += '				<span class="ui-button-text">慢放</span>'
			html += '			</button>'
			html += '			<button id="but_fast"  class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-button-disabled ui-state-disabled" role="button" title="Fast" >';
			html += '				<span class="ui-button-icon-primary ui-icon ui-icon-seek-next"></span>'
			html += '				<span class="ui-button-text">快放</span>'
			html += '			</button>'
			html += '			<button id="but_movement" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-button-disabled ui-state-disabled" role="button" title="Movement">';
			html += '				<span class="ui-button-icon-primary ui-icon ui-icon-arrow-4"></span>'
			html += '				<span class="ui-button-text">轨迹</span>'
			html += '			</button>'
			html += '		</div>';
			html += '	</td>';
			html += '	<td style="width:30px;text-align: center;"><div id="speed" style="color:#ff8000;">1x</div></td>';
			html += '	<td style="width:60px;text-align: center;"><div id="time" style="color:#ff8000;">00:00</div></td>';
			html += '	<td style="padding-left:10px; padding-right:10px"><div id="progress"></div></td>';
			html += '</tr>';
			html += '</table>';
			$('.inner-layout-north').html(html);
			
	        $("#but_play").button({
				icons: {primary: "ui-icon-play"}, text : false
			}).click(function() {
				if(Playback.ui.$toolbar.isPlay){
					Playback.stop();
				}else{
					Playback.play();
				}
				return false;
				
			});
	        $("#but_pause").button({
				icons: {primary: "ui-icon-pause"}, text : false
			}).click(function() {
				Playback.pause();
				return false;
			});
	        $("#but_slow").button({
				icons: {primary: "ui-icon-seek-prev"}, text : false
			}).click(function() {
				if(Playback.ui.$toolbar.speed > 1){
					Playback.speed(Playback.ui.$toolbar.speed-1);
				}
				return false;
			});
	        $("#but_fast").button({
				icons: {primary: "ui-icon-seek-next"}, text : false
			}).click(function() {
				if(Playback.ui.$toolbar.speed < 10){
					Playback.speed(Playback.ui.$toolbar.speed+1);
				}	
				return false;
			});
	        $("#but_movement").button({
				icons: {primary: "ui-icon-arrow-4"}, text : false
			}).click(function() {
				if(Playback.ui.$toolbar.isMovement){
					Playback.ui.$toolbar.isMovement = false;
					$(this).removeClass('ui-state-highlight');
				}else{
					Playback.ui.$toolbar.isMovement = true;
					$(this).addClass('ui-state-highlight');
				}
				$(this).button("option", { 
			        icons: { primary: Playback.ui.$toolbar.isMovement ? 'ui-icon-arrow-4-diag' : 'ui-icon-arrow-4' }
			    });
				Playback.ui.$map.canvas.clearPath();
				return false;
			});

	        $("#but_pause").button("disable");
	        $("#but_slow").button("disable");
	        $("#but_fast").button("disable");
	        $("#but_movement").button("disable");

	        Playback.ui.$progress = $( "#progress" ).slider({
	            orientation: "horizontal",
	            range: "min",
	            min: 0,
	            max: 3600,
	            step : 1,
	            value: 0,
	            slide: function(event, ui){
	            	var min = ui.value;
	            	var m = Math.floor(min/60);
	        		var s = Math.floor(min%60);
	        		var h = Math.floor(m/60);
	        		if(h > 0){
	        			m  = Math.floor(m%60);
	        		}
	        		if(h < 10) h = "0"+h;
	        		if(m < 10) m = "0"+m;
	        		if(s < 10) s = "0"+s;
	                $('#time').html(h+":"+m+":"+s+"");
	                $('.ui-slider-range-min').css('background', '#ff8000');
	            },
	            change: function( event, ui ) {
	            	var min = ui.value;
	            	var m = Math.floor(min/60);
	        		var s = Math.floor(min%60);
	        		var h = Math.floor(m/60);
	        		if(h > 0){
	        			m  = Math.floor(m%60);
	        		}
	        		if(h < 10) h = "0"+h;
	        		if(m < 10) m = "0"+m;
	        		if(s < 10) s = "0"+s;
	                $('#time').html(h+":"+m+":"+s+"");
	                $('.ui-slider-range-min').css('background', '#ff8000');
	            },
	            start: function( event, ui ) {
	            	if(Playback.ui.$toolbar.isPlay){
	            		Playback.stop();	
	            	}
	            },
	            stop: function( event, ui ) {
	            	Playback.worker.clear();
	            }
	            
	        });
	        // ISSUED TAGS
	        $.ajax({
				async : true,
				type: 'GET',
				url: "/service/tag.json?action=get.issued.tags",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	for(var i=0; i < data.tags.length; i++){
						Playback.get.$issuedTags.put(data.tags[i].euid, data.tags[i]);
					}
				}
			});
			this.plans();
			Playback.status();
		},
		plans : function(){
			$('#plans').html('<li><img src="/resources/commons/images/icon/icon_load.gif"/></li>');
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/plan.json?action=get.plans",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	$('#plans').html('');
	            	Playback.get.$plans = data.plans;
	            	for(var i=0; i < Playback.get.$plans.length; i++){
	            		$('#plans').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+Playback.get.$plans[i].name+'</li>');	
	            	}
	            	$("#plans").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#plans li").index(this);
	    						Playback.get.$plan = Playback.get.$plans[ix];
	    						$('#calendar').fullCalendar('refetchEvents');
	    						if(Playback.ui.$toolbar.isPlay || Playback.ui.$toolbar.isPause){
	    							Playback.stop();
	    						}
	    						Playback.worker.clear();
	    						Playback.ui.map();
	    					});
	    				}
	    			});
	            	$('ol#plans li').eq(0).addClass('ui-selected');
	            	Playback.get.$plan = Playback.get.$plans[0];
	            	Playback.ui.calendar();
	            	Playback.ui.map();
				}
			});
			
			
		},
		calendar : function(){
			this.$calendar = $('#calendar').fullCalendar({
		        theme: false,
		        height : 300,
		        header: {
		            left: 'title',
		            center: '',
		            right: 'prev,next'
		        },
		        lang : $.rtls.lang,
		        editable: false,
		        events: function(start, end, timezone, callback) {
					var ends = end.toISOString().split('-');
					var year = parseInt(ends[0]);
					var month = parseInt(ends[1])-2;
					Playback.ui.days(year, month);
					callback(Playback.get.$days);
				},
				eventRender: function(event, element, calEvent) {
					element.find(".fc-title").html("&nbsp;");
					element.find(".fc-content").css('cursor', 'pointer');
					if(event.ix == 0){
						element.css('background-color', 'orange');
					}
				},
				eventClick: function(event, jsEvent, view) {
					var date = new Date(event.year, event.month, event.day);
					$('.fc-event').css('background-color', '#3a87ad');
					$(this).css('background-color', 'orange');
					Playback.get.$day = event;
					if(Playback.ui.$toolbar.isPlay || Playback.ui.$toolbar.isPause){
						Playback.stop();
					}
					Playback.worker.clear();
					Playback.ui.hours();
				}
		    });
			
		},
		days : function(year, month){
			Playback.get.$days = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/playback.json?action=get.position.days",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Playback.get.$plan.planId == 0 ? 1 :  Playback.get.$plan.planId,
	            	"tagEuid" : $("#tagEuid").val(),
	            	"year" : year,
	            	"month" : month,
	            	"sortType" : "DESC",
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	var day = '', obj = {}; 
	            	for(var i=0; i < data.days.length; i++){
	            		day = data.days[i].split('-');
	            		obj = {year : parseInt(day[0]), month : parseInt(day[1])-1, day : parseInt(day[2])};
	            		obj.title = obj.day;
	            		obj.ix = i;
	            		obj.start = new Date(obj.year, obj.month, obj.day),
						obj.end = new Date(obj.year, obj.month, obj.day),
						obj.allDay = true;
						Playback.get.$days.push(obj);
	            	}
	            	if(Playback.get.$days.length > 0){
	            		Playback.get.$day = Playback.get.$days[0];
	            		Playback.ui.hours();
	            	}else{
	            		$('#hours').html('');
	            		$('#tags').html('');
	            	}
	        	}
			});
			
		},
		hours : function(){
			$('#hours').html('<li><img src="/resources/commons/images/icon/icon_load.gif"/></li>');
			var date = new Date(Playback.get.$day.year, Playback.get.$day.month, Playback.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/playback.json?action=get.position.hours",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Playback.get.$plan.planId == 0 ? 1 :  Playback.get.$plan.planId,
					"day" : date.format('yyyy-MM-dd'),
					"sortType" : "DESC",
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Playback.get.$hours = data.hours;
	            	$('#hours').html('');
	            	for(var i=0; i < Playback.get.$hours.length; i++){
	            		$('#hours').append('<li><span class="ui-icon ui-icon-clock" style="float:left"></span> '+Playback.get.$hours[i]+' '+$.rtls.playback.form.oclock+'</li>');	
	            	}
	            	$("#hours").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#hours li").index(this);
	    						Playback.get.$hour = Playback.get.$hours[ix];	
	    						Playback.ui.$startTime = Playback.get.$hour+":00";
	    						Playback.ui.$endTime = Playback.get.$hour+":59";
	    						if(Playback.ui.$toolbar.isPlay || Playback.ui.$toolbar.isPause){
	    							Playback.stop();
	    						}
	    						Playback.worker.clear();
	    						Playback.ui.mins();
	    						Playback.ui.tags();
	    						$('#startTime').val('');
	    	            		$('#endTime').val('');
	    					});
	    				}
	    			});
	            	if( Playback.get.$hours.length > 0){
	            		$('ol#hours li').eq(0).addClass('ui-selected');
	                	Playback.get.$hour = Playback.get.$hours[0];	
	                	Playback.ui.$startTime = Playback.get.$hour+":00";
						Playback.ui.$endTime = Playback.get.$hour+":59";
						Playback.ui.mins();
	                	Playback.ui.tags();
	            	}else{
	            		Playback.get.$hour = null;
	            		Playback.get.$min = null;
	            		Playback.get.$mins = [];
	            		Playback.get.$tag = null;
	            		Playback.get.$tags = [];
	            		
	            	}
				}
			});
			
		},
		mins : function(){
			var date = new Date(Playback.get.$day.year, Playback.get.$day.month, Playback.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/playback.json?action=get.position.mins",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Playback.get.$plan.planId == 0 ? 1 :  Playback.get.$plan.planId,
	            	"day" : date.format('yyyy-MM-dd'),
	            	"startTime" : Playback.ui.$startTime == null ? '' : Playback.ui.$startTime,
	    			"endTime" : Playback.ui.$endTime == null ? '' : Playback.ui.$endTime,
					"sortType" : "ASC",
	                
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Playback.get.$mins = data.mins;
	            	var min = 0, max = 0;
	            	for(var i=0; i < data.mins.length; i++){
	            		var mins = data.mins[i].split(':');
	            		if(i == 0){
	            			min = (parseInt(mins[0]) * 60 * 60) + (parseInt(mins[1]) * 60);
	            		}else if(i == data.mins.length - 1){
	            			max = (parseInt(mins[0]) * 60 * 60) + (parseInt(mins[1]) * 60);
	            		}
	            	}
	            	Playback.ui.$progress.slider("option", "min", min);
	        		Playback.ui.$progress.slider("option", "max", max);
	        		Playback.ui.$progress.slider("option", "value", min);
	        		
	        		var m = Math.floor(min/60);
	        		var s = Math.floor(min%60);
	        		var h = Math.floor(m/60);
	        		if(h > 0){
	        			m  = Math.floor(m%60);
	        		}
	        		if(h < 10) h = "0"+h;
	        		if(m < 10) m = "0"+m;
	        		if(s < 10) s = "0"+s;
	        		
	                $('#time').html(h+":"+m+":"+s+"");
				}
			});
		},
		
		tags : function(){
			$('#tags').html('<li><img src="/resources/commons/images/icon/icon_load.gif"/></li>');
			var date = new Date(Playback.get.$day.year, Playback.get.$day.month, Playback.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/playback.json?action=get.position.tags",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Playback.get.$plan.planId == 0 ? 1 :  Playback.get.$plan.planId,
	            	"day" : date.format('yyyy-MM-dd'),
	            	"startTime" : Playback.ui.$startTime == null ? '' : Playback.ui.$startTime,
	    	    	"endTime" : Playback.ui.$endTime == null ? '' : Playback.ui.$endTime,
	    					
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Playback.get.$tags = data.tags;
	            	$('#tags').html('');
	            	var euid = '', tag;
	            	for(var i=0; i < Playback.get.$tags.length; i++){
	            		euid = Playback.get.$tags[i];
	    				tag = Playback.get.$issuedTags.get(euid);
	            		euid = euid.substring(euid.length-4, euid.legnth);
	            		if(tag != undefined){
	            			$('#tags').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span>'+tag.name+'['+euid+']</li>');	
	            		}else{
	            			$('#tags').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span>'+euid+'['+euid+']</li>');
	            		}
	            			
	            	}
	            	$("#tags").selectable({
	        			selected: function (event, ui) {
	                        if ($(ui.selected).hasClass('click-selected')) {
	                            $(ui.selected).removeClass('ui-selected click-selected');

	                        } else {
	                            $(ui.selected).addClass('click-selected');

	                        }
	                    },
	                    unselected: function (event, ui) {
	                        $(ui.unselected).removeClass('click-selected');
	                    },
	                    start: function (event, ui) {
	                    	event.originalEvent.ctrlKey = true;
	                    },
	                    stop: function(event, ui) {
	                    	
	        			}
	        		});
				}
			});
			
		},
		raps : function(){
			Playback.ui.$map.marker.removeAll();
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/rap.json?action=get.raps",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Playback.get.$plan.planId == 0 ? 1 :  Playback.get.$plan.planId,
	        	},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Playback.get.$raps = data.raps;
	            	var item, network, euid;
	            	for(var i=0; i < data.raps.length; i++){
	            		item = data.raps[i];
	            		euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length);
    					if(item.networkType == '1'){
    						network = 'ethernet';
    					}else if(item.networkType == '2'){
    						network = 'wifi';
    					}else if(item.networkType == '3'){
    						network = 'lte';
    					}
    					item.marker = '<p id="rap_'+item.rapId+'" name="marker" ';
    					if(item.rcmMode == 1){
    						item.marker += 'class="icon-rap-'+network+'-master" ';	
    					}else{
    						item.marker += 'class="icon-rap-'+network+'-slave" ';
    					}
    					
    					item.marker += 'title="'+euid+'" type="'+item.rcmMode+'" ';
						item.marker += 'network="'+network+'" status="alive" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"';
						item.marker += ' style="left:'+(item.localX-10)+'px; top:'+(item.localY-10)+'px"></p>';
						item.id = "rap_"+item.rapId;
						Playback.ui.$map.marker.add(item);
	            	}
				}
			});
		},
		map : function(){
			this.$map = new Map({
				plan : Playback.get.$plan, 
				target : Playback
			});
			Playback.ui.raps();
			Playback.log.init();
			//Playback.worker.notify();//1.1.4.6中修改
		},
	},
	log : {
		$isConsole : false, $isAutoScroll : false, $console : null, $items : [],
		init : function(){
			var html = '<table style="width:100%">';
			html += '<thead>';
			html += '<tr>';
			html += '	<th style="color:#fff;text-align:center;width:50px">ALG</th>';
			html += '	<th style="color:#fff;text-align:center;width:45px">STATUS</th>';
			html += '	<th style="color:#fff;text-align:center;width:85px">LOG TIME</th>';
			html += '	<th style="color:#fff;text-align:center;width:85px">DELAY TIME</th>';
			html += '	<th style="color:#fff;text-align:center;width:55px">EUID</th>';
			html += '	<th style="color:#fff;text-align:center;width:55px">SEQ</th>';
			html += '	<th style="color:#fff;text-align:center;width:80px">DIFF</th>';
			html += '	<th style="color:#fff;text-align:center;width:150px">POSITION</th>';
			html += '	<th style="color:#fff;text-align:center;width:150px">AREA</th>';
			html += '   <th align="right">';
			html += '	    <button id="but_log_trash" style="margin: 2px; padding: 4px; cursor: pointer; float: right;" ></button>';
			html += '	    <button id="but_log_scroll" style="margin: 2px; padding: 4px; cursor: pointer; float: right;"></button>';
			html += '	    <button id="but_log_play" style="margin: 2px; padding: 4px; cursor: pointer; float: right;" ></button>';
			html += '   </th>';
			html += '</tr>';
			html += '</thead>';
			html += '<table>';
			$('.outer-layout-center .inner-layout-south .console_header').html(html);
			$("#but_log_play").button({
				icons: {primary: "ui-icon-stop"}, text:false
			}).click(function() {
				if(Playback.log.$isConsole){
					Playback.log.$isConsole = false;
				}else{
					Playback.log.$isConsole = true;
				}
				$(this).button("option", { 
			        icons: { primary: Playback.log.$isConsole ? 'ui-icon-play' : 'ui-icon-stop' }
			    });
				return false; 
			});
			$("#but_log_trash").button({
				icons: {primary: "ui-icon-trash"}, text:false
			}).click(function() {
				Playback.log.clear();
				return false; 
			});
			$("#but_log_scroll").button({
				icons: {primary: "ui-icon ui-icon-arrowthick-2-n-s"}, text:false
			}).click(function() {
				Playback.log.scroll();
				$(this).button("option", { 
			        icons: { primary: Playback.log.$isAutoScroll ? 'ui-icon-arrowthickstop-1-s' : 'ui-icon ui-icon-arrowthick-2-n-s' }
			    });
				return false; 
			});
			Playback.log.clear();
			Playback.log.$isAutoScroll = false;
			this.$console = $('#console-logs');
			this.$console.css('width', '100%');
			var h = $('.outer-layout-center > .inner-layout-south').height() - 20;
			this.$console.css('height', h+'px');
			this.$console.on("DOMSubtreeModified", function() { 
				var elem = $("#console-logs");
				if(elem.children('li').size() > 1000){
					elem.children("li:first").remove();
				}
				if (elem[0].scrollHeight > elem.outerHeight() && Playback.log.$isAutoScroll) {
					Playback.log.$console.animate({scrollTop : elem[0].scrollHeight}, 5);
		        }
			});
			
		},
		clear : function(){
			if(this.$console != null) this.$console.html('');
			
		},
		scroll : function(){
			if(this.$isAutoScroll){
				this.$isAutoScroll = false;
			}else{
				this.$isAutoScroll = true;
			}
		},
		append : function(algorithm, euid, seq, x, y, distance, time, delayTime, zoneName, status, tagColor){
			var color = "", bgcolor = "";
			var html = '<li style="background-color:#FFFFFF;color:#000000;">';
			html += '<table class="console_table">';
			html += '<tr>';
			if(algorithm == 1){
				html += '	<td style="width:50px;padding:2px">TDOA</td>';
			}else if(algorithm == 2){
				html += '	<td style="width:50px;padding:2px">TWR</td>';
			}
			if(status == 1){
				color = "#000000";
				bgcolor = "#00FF00";
				html += '	<td style="width:40px;padding:2px;background-color:'+bgcolor+';color:'+color+';">I</td>';
			}else if(status == 2){
				color = "#000000";
				bgcolor = "#FF5500";
				html += '	<td style="width:40px;padding:2px;background-color:'+bgcolor+';color:'+color+';">D</td>';
			}else{
				color = "#000000";
				bgcolor = "#FFFFFF";	
				html += '	<td style="width:40px;padding:2px;background-color:'+bgcolor+';color:'+color+';">N</td>';
			}

			html += '	<td style="width:80px;padding:2px">'+Playback.log.time(time)+'</td>';
			html += '	<td style="width:80px;padding:2px">'+delayTime+'ms</td>';
			html += '	<td style="width:50px;padding:2px;color:'+tagColor+'">'+euid+'</td>';
			html += '	<td style="width:50px;padding:2px;color:'+tagColor+'">'+seq+'</td>';
			html += '	<td style="width:80px;padding:2px">'+distance.toFixed(2)+'m</td>';
			html += '	<td style="width:150px;padding:2px">'+Playback.ui.$map.carc.pxToMeter(x)+'m x '+Playback.ui.$map.carc.pxToMeter(y)+'m</td>';
			html += '	<td class="console_zonename" style="padding:2px">'+zoneName+'</td>';
			html += '</tr>';
			html += '</table>';
			html += '</li>';
			this.$console.append(html);
		},
		time : function(milliseconds){
			var d = new Date(milliseconds);
			var h = d.getHours();
			var m = d.getMinutes();
			var s = d.getSeconds();
			var ms = d.getMilliseconds();
			if(h < 10) h = "0"+h;
			if(m < 10) m = "0"+m;
			if(s < 10) s = "0"+s;
			if(ms < 100) ms = "0"+ms;
			else if(ms < 10) ms = "00"+ms;
			
			return h+":"+m+":"+s+":"+ms;
		},
	},
	worker : {
		$items : new HashMap(), $lastPoints : new HashMap(), $stopCount : 0, $endCount : 0,
		init : function(tagEuid){
			var worker = new Worker('/resources/commons/js/idolink/ido.worker.js');
			worker.onmessage = function(e){
				var data = e.data;
				var euid = data.tagEuid.substring(data.tagEuid.length-4, data.tagEuid.length);
				var seq = parseInt(data.tagSeq);
				var x = parseFloat(data.localX);
				var y = parseFloat(data.localY);
				var time = parseInt(data.addTime);
				var size = parseInt(data.tagSize);
				var delayTime = parseInt(data.delayTime);
				var distance = parseFloat(parseFloat(data.distance).toFixed(2));
				var status = parseInt(data.status);
				var lastData = Playback.worker.$lastPoints.get(data.tagEuid);
				if(status != 2){
					if(lastData == null){
						Playback.ui.$map.canvas.initNode(data.tagEuid, x, y, size, data.tagColor, data.tagAlias);
					}
					if(!Playback.ui.$map.canvas.addItem(data.tagEuid, seq, data.tagAlias, euid, x, y, time, delayTime, data.movePath, distance, status)){
						Playback.ui.$map.canvas.initNode(data.tagEuid, x, y, size, data.tagColor, data.tagAlias);
						Playback.ui.$map.canvas.addItem(data.tagEuid, seq, data.tagAlias, euid, x, y, time, delayTime, data.movePath, distance, status)
					}
				}
				Playback.worker.$lastPoints.put(data.tagEuid, data);
				var date = new Date(time);
				var sec = (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds();
				if(sec > Playback.ui.$progress.slider("option", "value")){
					Playback.ui.$progress.slider("option", "value", sec);	
				}
				
				if(Playback.log.$isConsole){
					Playback.log.append(data.algorithm, euid, seq, x, y, distance, time, delayTime, data.zoneName, status, data.tagColor);
				}
			};
			this.$items.put(tagEuid, worker);
		},
		notify : function(){
			var sock = new SockJS('/rtls/sockjs');
		  	var client = Stomp.over(sock);
		  	client.debug = null;
		    client.connect({}, function(frame) {
		    	client.subscribe("/queue/playback", function(message) {
		    		var data = $.parseJSON(message.body);
	    			if(Playback.get.$plan.planId == data.planId && data.sessionId == Playback.$sessionId){ 
			    		if(data.eventType == '21'){
							var worker = Playback.worker.$items.get(data.tagEuid);
							if(worker != undefined){
								worker.postMessage(data);
							}else{
								Playback.worker.init(data.tagEuid);
								worker = Playback.worker.$items.get(data.tagEuid);
								worker.postMessage(data);
							}		
		    			}else if(data.eventType == '100'){ //end
		    				Playback.ui.$toolbar.isPlay = false;
		            		Playback.ui.$toolbar.isPause = false;
		            		$('#but_play').button("option", { 
		    			        icons: { primary: 'ui-icon-play' }
		    			    });
		            		$('#but_play').removeClass('ui-state-highlight');
		            		$('#but_pause').removeClass('ui-state-highlight');
		            		$("#but_pause").button("disable");
		        	        $("#but_slow").button("disable");
		        	        $("#but_fast").button("disable");
		        	        $("#but_movement").button("disable");
			    		}
		    		}
		    	});
		    });
		    sock.onclose = function(event) {
		    	Log.debug("Stomp.sock.closed");
		    };
		 	$(window).bind('beforeunload',function(){
		    	Log.debug("Stomp.window.beforeunload");
		    	if(Playback.ui.$toolbar.isPlay || Playback.ui.$toolbar.isPause){
					Playback.stop();
				}
		    	if(client != null && client.connected){
		    		client.disconnect();
		    	}
		    });
		},
		clear : function(){
			Playback.ui.$map.canvas.clearPaper();
			Playback.worker.$lastPoints.clear();
			Playback.log.clear();
		}
	}
};