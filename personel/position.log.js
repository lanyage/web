
var Position = {
	get : {$day : null, $days : [], $hour : null, $hours : [], $plan : null, $plans : [], $zones : new HashMap(), $tag : null, $tags : []},
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[6]+'</span>');
		
		Position.ui.layout();
	},
	
	ui : {
		$layout : null, $innerLayout : null, $calendar : null, 
		layout : function(){
			$('#contents').css('height', ($(window).height() - 150)+'px');
			this.$layout = $('#contents').layout({
				center__paneSelector :  ".outer-layout-center",
				west__paneSelector :	".outer-layout-west",
				east__paneSelector :	".outer-layout-east",
				south__paneSelector :   ".outer-layout-south",
				north__paneSelector :   ".outer-layout-north",
				west__size:	300,
				west__minSize : 300,
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
				center__onresize : "Position.ui.$innerLayout.resizeAll",
			});
			this.$innerLayout = $('div.outer-layout-center').layout({
				center__paneSelector:	".inner-layout-center",
				west__paneSelector:		".inner-layout-west",
				east__paneSelector:		".inner-layout-east",
				south__paneSelector:	".inner-layout-south",
				north__paneSelector:	".inner-layout-north",
				north__initClosed : true,
				west__initClosed :      true,
				east__initClosed :      true,
				south__initClosed : true,
				spacing_open:	4,
				spacing_closed:	4,
				west__spacing_closed:	0,
				east__spacing_closed:	0,
				north__spacing_open:	0,
				north__spacing_closed:	0,
				south__spacing_closed :	0,
				center__onresize_end:function () {  
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
			html += '<div style="clear: both;"><ol id="hours" class="ui-selectable"></ol></div>';
			html += '<div class="ui-accordion ui-widget ui-helper-reset"  style="clear: both;">';
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.playback.form.tag;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;"><ol id="tags" class="menu-selectable"></ol></div>';
			html += '<div class="ui-accordion ui-widget ui-helper-reset"  style="clear: both;">';
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.position.form.algorithm;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;">';
			html += '	<ol id="algorithm-selectable" class="ui-selectable">';
			html += '		<li class="ui-widget-content ui-selectee ui-selected">'+$.rtls.position.form.all+'</li>';
			html += '		<li class="ui-widget-content">'+$.rtls.position.form.tdoa+'</li>';
			html += '		<li class="ui-widget-content">'+$.rtls.position.form.twr+'</li>';
			html += '	</ol>';
			html += '</div>';
			html += '<div class="ui-accordion ui-widget ui-helper-reset"  style="clear: both;">';
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.position.form.scale;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;">';
			html += '		<ol id="scale-selectable" class="ui-selectable">';
			html += '		<li class="ui-widget-content ui-selectee ui-selected">20'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">30'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">40'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">50'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">60'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">70'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">80'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">90'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">100'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">150'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">200'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">300'+$.rtls.position.form.number+'</li>';
			html += '		</ol>';
			html += '</div>';
			$('.outer-layout-west').html(html);
			$("#algorithm-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						Position.log.$algorithm = $( "#algorithm-selectable li" ).index( this );
						Position.log.getItems();
					});		
				}
			});
			$("#scale-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						var ix = $( "#scale-selectable li" ).index( this );
						if(ix ==0){
							Position.log.$scaleNum = 20;
						}else if(ix ==1){
							Position.log.$scaleNum = 30;
						}else if(ix ==2){
							Position.log.$scaleNum = 40;
						}else if(ix ==3){
							Position.log.$scaleNum = 50;
						}else if(ix ==4){
							Position.log.$scaleNum = 60;
						}else if(ix ==5){
							Position.log.$scaleNum = 70;
						}else if(ix ==6){
							Position.log.$scaleNum = 80;
						}else if(ix ==7){
							Position.log.$scaleNum = 90;
						}else if(ix ==8){
							Position.log.$scaleNum = 100;
						}else if(ix ==9){
							Position.log.$scaleNum = 150;
						}else if(ix ==10){
							Position.log.$scaleNum = 200;
						}else if(ix ==12){
							Position.log.$scaleNum = 300;
						}else if(ix ==13){
							Position.log.$scaleNum = 400;
						}else if(ix ==14){
							Position.log.$scaleNum = 500;
						}
						Position.log.getItems();
					});		
				}
			});
			Position.ui.log();
			this.plans();
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
	            	Position.get.$plans = data.plans;
	            	for(var i=0; i < Position.get.$plans.length; i++){
	            		$('#plans').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+Position.get.$plans[i].name+'</li>');	
	            	}
	            	$("#plans").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#plans li").index(this);
	    						Position.get.$plan = Position.get.$plans[ix];
	    						$('#calendar').fullCalendar('refetchEvents');
	    						Position.ui.zones();
	    						
	    					});
	    				}
	    			});
	            	$('ol#plans li').eq(0).addClass('ui-selected');
	            	Position.get.$plan = Position.get.$plans[0];
	            	Position.ui.zones();
	            	Position.ui.calendar();
				}
			});
			
			
		},
		zones : function(){
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/zone.json?action=get.zones",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Position.get.$plan.planId == 0 ? 1 :  Position.get.$plan.planId,
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Position.get.$zones.clear();
	            	for(var i=0; i < data.zones.length; i++){
	            		Position.get.$zones.put(data.zones[i].zoneId, data.zones[i]);
	            	}
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
					Position.ui.days(year, month);
					callback(Position.get.$days);
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
					Position.get.$day = event;
					Position.ui.hours();
				}
		    });
			
		},
		days : function(year, month){
			Position.get.$days = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/playback.json?action=get.position.days",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Position.get.$plan.planId == 0 ? 1 :  Position.get.$plan.planId,
	            	"tagEuid" :Position.get.$tag,
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
						Position.get.$days.push(obj);
	            	}
	            	if(Position.get.$days.length > 0){
	            		Position.get.$day = Position.get.$days[0];
	            		Position.ui.hours();
	            	}else{
	            		$('#hours').html('');
	            		$('#tags').html('');
	            		$('.con_top .top_left').html($.rtls.position.log.top(0));
		            	$('#items tbody').html("<tr><td colspan='10' style='height:50px'><center>"+$.rtls.position.log.empty+"<center></td></tr>");
	            		$('.paginate').html('');
	            	}
	        	}
			});
			
		},
		hours : function(){
			$('#hours').html('<li><img src="/resources/commons/images/icon/icon_load.gif"/></li>');
			var date = new Date(Position.get.$day.year, Position.get.$day.month, Position.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/playback.json?action=get.position.hours",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Position.get.$plan.planId == 0 ? 1 :  Position.get.$plan.planId,
					"day" : date.format('yyyy-MM-dd'),
					"sortType" : "DESC",
	                
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Position.get.$hours = data.hours;
	            	$('#hours').html('');
	            	for(var i=0; i < Position.get.$hours.length; i++){
	            		$('#hours').append('<li class="ui-widget-content"><span class="ui-icon ui-icon-clock" style="float:left"></span> '+Position.get.$hours[i]+' '+$.rtls.playback.form.oclock+'</li>');	
	            	}
	            	$("#hours").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#hours li").index(this);
	    						Position.get.$hour = Position.get.$hours[ix];	
	    						Position.ui.tags();
	    					});
	    				}
	    			});
	            	if( Position.get.$hours.length > 0){
	            		$('ol#hours li').eq(0).addClass('ui-selected');
	                	Position.get.$hour = Position.get.$hours[0];	
	                	Position.ui.tags();
	            	}else{
	            		Position.get.$hour = null;
	            		Position.get.$tag = null;
	            		Position.get.$tags = [];
	            		
	            	}
				}
			});
			
		},
		tags : function(){
			$('#tags').html('<li><img src="/resources/commons/images/icon/icon_load.gif"/></li>');
			var date = new Date(Position.get.$day.year, Position.get.$day.month, Position.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/playback.json?action=get.position.tags",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Position.get.$plan.planId == 0 ? 1 :  Position.get.$plan.planId,
	            	"day" : date.format('yyyy-MM-dd'),
	            	"startTime" : Position.get.$hour == null ? '' : Position.get.$hour+":00",
   	            	"endTime" : Position.get.$hour == null ? '' : Position.get.$hour+":59",
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Position.get.$tags = data.tags;
	    			$('#tags').html('');
	            	$('#tags').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+$.rtls.playback.form.full+'</li>');
	            	var euid = '';
	            	for(var i=0; i < Position.get.$tags.length; i++){
	            		euid = Position.get.$tags[i];
	            		euid = euid.substring(euid.length-4, euid.legnth);
	            		$('#tags').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+euid+'</li>');	
	            	}
	            	$("#tags").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#tags li").index(this);
	    						if(ix == 0){
	    							Position.get.$tag = '';
	    						}else{
	    							Position.get.$tag = Position.get.$tags[ix-1];
	    						}
	    						Position.log.getItems();
	    					});
	    				}
	    			});
	            	if(Position.get.$tags.length > 0){
	            		$('ol#tags li').eq(0).addClass('ui-selected');
	            		Position.get.$tag = '';
	            	}else{
	            		Position.get.$tag = null;
	            	}
	            	Position.log.getItems();
				}
			});
			
		},
		log : function(){
			$('.top_right').html('<button id="but-clear">'+$.rtls.position.button.clear+'</button>');
			$("#but-clear").button({
				icons: {primary: "ui-icon-trash"}
			}).click(function() {
				Position.log.clear();
				return false;
			});
			var html = '';
			html = '<tr>';
			html += '<th class="first">'+$.rtls.position.log.head[0]+'</th>';
			html += '<th>'+$.rtls.position.log.head[1]+'</th>';
			html += '<th>'+$.rtls.position.log.head[2]+'</th>';
			html += '<th>'+$.rtls.position.log.head[3]+'</th>';
			html += '<th>'+$.rtls.position.log.head[4]+'</th>';
			html += '<th class="end">'+$.rtls.position.log.head[5]+'</th>';
			html += '</tr>';
			$("#items thead").html(html);
			
		}
	},
	log : {
		$item : null, $items : null, $startNum : 0, $scaleNum : 20, $algorithm : 0,
		paging : function(startNum){
			this.$startNum = startNum;
			this.getItems();	
		},
		getItems : function(){
			$('#items tbody').html("<tr><td colspan='9' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
			var date = new Date(Position.get.$day.year, Position.get.$day.month, Position.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/position.json?action=get.position.logs",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Position.get.$plan.planId == 0 ? 1 :  Position.get.$plan.planId,
	                "algorithm" : Position.log.$algorithm,
					"startNum" : Position.log.$startNum,
					"scaleNum" : Position.log.$scaleNum,
					"day" : date.format('yyyy-MM-dd'),
	            	"hour" : Position.get.$hour == null ? '' : Position.get.$hour,
	            	"tagEuid" : Position.get.$tag
	                
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	var currentPageNum = parseInt(data.paging.currentPageNum);
	    			var totalNum = parseInt(data.paging.totalNum);
	    			var startNum = parseInt(data.paging.startNum);
	            	$('#items tbody').html('');
	            	$('.con_top .top_left').html($.rtls.position.log.top(totalNum));
	            	if(totalNum == 0){
	            		$('#items tbody').append("<tr><td colspan='10' style='height:50px'><center>"+$.rtls.position.log.empty+"<center></td></tr>");
	            		$('.paginate').html('');
	    			}else{
	    				var item = null;
	    				var html = '', x = 0 , y = 0, px = 0, py = 0;
	    				for(var i=0; i < data.positions.length; i++){
	    					item = data.positions[i];
	    					x = Math.round(item.localX);
	    					y = Math.round(item.localY);
	    					px = Math.round(item.localX);
	    					py = Math.round(item.localY);
	    					x = (x * Position.get.$plan.meter).toFixed(2);
	    					y = (y * Position.get.$plan.meter).toFixed(2);
	    					px = (px * Position.get.$plan.meter).toFixed(2);
	    					py = (py * Position.get.$plan.meter).toFixed(2);
	    					html = "<tr>";
	    					html += "<td>"+(totalNum - (i + startNum))+"</td>";
	    					if(item.algorithm == 2){
	    						html += "<td>TWR</td>";
	        				}else{
	        					html += "<td>TDOA</td>";
	        				}
	    					html += "<td>"+item.userName+"("+item.euid.substring(item.euid.length-4, item.euid.length)+")</td>";
	    					if(item.errorCase == 0){
	    						html += "<td>"+Position.get.$zones.get(item.zoneId).name+"</td>";	
	    					}else if(item.errorCase == 1){
	    						html += "<td>ERROR = "+(item.algorithm == 1 ? "TWR" : "TOA")+" SIZE LOW</td>";
	    					}else if(item.errorCase == 2){
	    						html += "<td>ERROR = RANGE FILTER</td>";
	    					}else if(item.errorCase == 3){
	    						html += "<td>ERROR = RATIO FILTER</td>";
	    					}else if(item.errorCase == 4){
	    						html += "<td>ERROR = SPEED FILTER</td>";
	    					}else if(item.errorCase == 5){
	    						html += "<td>ERROR = CALCUATION FAIL</td>";
	    					}else if(item.errorCase == 6){
	    						html += "<td>ERROR = MAP FILTER LOSE</td>";
	    					}else if(item.errorCase == 7){
	    						html += "<td>ERROR = MAP SCALE OVER</td>";
	    					}else if(item.errorCase == 8){
	    						html += "<td>ERROR = MAP FILTER ERROR</td>";
	    					}else if(item.errorCase == 9){
	    						html += "<td>ERROR = SYSTEM ERROR</td>";
	    					}
							
							html += "<td>"+x+"m x "+y+"m</td>";
	    					html += "<td>"+item.addTime.msdate()+"</td>";
	    					html + "</tr>"
	    					$('#items tbody').append(html);
	    				
	    				}
	    				var paging = data.paging;
	    				html = "<a href=\"javascript:Position.log.paging(0)\"><img src='/resources/commons/images/icon/icon_paging_first.gif' /></a>";
	        			if(paging.isPrevPage == 'true'){
	        				html += "<a href=\"javascript:Position.log.paging('"+paging.prevNum+"')\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
	        			}else{
	        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
	        			}
	        			var pages = paging.pages;
	        			for(var i=0; i < pages.length; i++){
	        				var page = pages[i];
	        				html += "<a href=\"javascript:Position.log.paging('"+page.startNum+"')\">";
	        				if(currentPageNum == page.pageNum){
	        					html += "<span class='num_on'>"+page.pageNum+"</span>";
	        				}else{
	        					html += "<span class='num'>"+page.pageNum+"</span>";
	        				}
	        				html += "</a>";
	        			}
	        			if(paging.isNextPage == 'true'){
	        				html += "<a href=\"javascript:Position.log.paging('"+paging.nextNum+"')\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
	        			}else{
	        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
	        			}
	        			html += "<a href=\"javascript:Position.log.paging('"+paging.lastNum+"')\"><img src='/resources/commons/images/icon/icon_paging_last.gif' /></a>";
	        			$('.paginate').html(html);
	    			}
	            	
	            	
				}
			});
			
		},
		
		clear : function(){
			$("#dialog-confirm").dialog({
				title : $.rtls.commons.dialog.title.waring,
		        width: "300",
		        bgiframe: true,
		        autoOpen: false,
		        modal: true,
		        resizable: false,
		        buttons: [{
		        	text : $.rtls.commons.button.cancel,
					click: function() {
						$.ajax({
							async : true,
							type: 'get',
							url: "/service/position.json?action=clear.position.logs",
							contentType: "application/json; charset=utf-8",
				            dataType: 'json',
				            data : { 
								planId : Position.get.$plan.planId == 0 ? 1 :  Position.get.$plan.planId,
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
				            },
				            success : function (data) {
				            	if(data.result == 'success'){
									Position.getLogs();
									$("#dialog-confirm").dialog( "close" );
								}else{
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.position.message.clearfail);
								}
				            }
				        });
					},
		        },{
		        	text : $.rtls.commons.button.cancel,
					click: function() {
						$( this ).dialog( "close" );
					}
				}],
				close: function() {
					$("#dialog-confirm").empty();
		        }
		        
		    });
			$("#dialog-confirm").append($.rtls.position.message.logdelconfirm);
			$('#dialog-confirm').dialog('open');
		}
	},
	
	
	
};