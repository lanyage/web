
var History = {
	get : {$day : null, $days : [], $hour : null, $hours : [], $plan : null, $plans : [], $zones : new HashMap(), $tag : null, $tags : []},
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[5]+'</span>');
		History.ui.layout();
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
				center__onresize : "History.ui.$innerLayout.resizeAll",
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
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.history.form.scale;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;">';
			html += '		<ol id="scale-selectable" class="ui-selectable">';
			html += '		<li class="ui-widget-content ui-selectee ui-selected">20'+$.rtls.position.form.number+'</li>';
			html += '		<li class="ui-widget-content">30'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">40'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">50'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">60'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">70'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">80'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">90'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">100'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">150'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">200'+$.rtls.history.form.number+'</li>';
			html += '		<li class="ui-widget-content">300'+$.rtls.history.form.number+'</li>';
			html += '		</ol>';
			html += '</div>';
			$('.outer-layout-west').html(html);
			$("#scale-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						var ix = $( "#scale-selectable li" ).index( this );
						if(ix ==0){
							History.log.$scaleNum = 20;
						}else if(ix ==1){
							History.log.$scaleNum = 30;
						}else if(ix ==2){
							History.log.$scaleNum = 40;
						}else if(ix ==3){
							History.log.$scaleNum = 50;
						}else if(ix ==4){
							History.log.$scaleNum = 60;
						}else if(ix ==5){
							History.log.$scaleNum = 70;
						}else if(ix ==6){
							History.log.$scaleNum = 80;
						}else if(ix ==7){
							History.log.$scaleNum = 90;
						}else if(ix ==8){
							History.log.$scaleNum = 100;
						}else if(ix ==9){
							History.log.$scaleNum = 150;
						}else if(ix ==10){
							History.log.$scaleNum = 200;
						}else if(ix ==12){
							History.log.$scaleNum = 300;
						}else if(ix ==13){
							History.log.$scaleNum = 400;
						}else if(ix ==14){
							History.log.$scaleNum = 500;
						}
						History.log.getItems();
					});		
				}
			});
			History.ui.log();
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
	            	History.get.$plans = data.plans;
	            	for(var i=0; i < History.get.$plans.length; i++){
	            		$('#plans').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+History.get.$plans[i].name+'</li>');	
	            	}
	            	$("#plans").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#plans li").index(this);
	    						History.get.$plan = History.get.$plans[ix];
	    						$('#calendar').fullCalendar('refetchEvents');
	    					});
	    				}
	    			});
	            	$('ol#plans li').eq(0).addClass('ui-selected');
	            	History.get.$plan = History.get.$plans[0];
	            	History.ui.calendar();
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
					History.ui.days(year, month);
					callback(History.get.$days);
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
					History.get.$day = event;
					History.ui.hours();
				}
		    });
			
		},
		days : function(year, month){
			History.get.$days = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/history.json?action=get.history.days",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : History.get.$plan.planId == 0 ? 1 :  History.get.$plan.planId,
	            	"year" : year,
	            	"month" : month
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
						History.get.$days.push(obj);
	            	}
	            	if(History.get.$days.length > 0){
	            		History.get.$day = History.get.$days[0];
	            		History.ui.hours();
	            	}else{
	            		$('#hours').html('');
	            		$('#tags').html('');
	            		$('.top_left').html($.rtls.history.list.top(0));
	            		$('#items tbody').html("<tr><td colspan='10' style='height:50px'><center>"+$.rtls.history.list.empty+"<center></td></tr>");
	            		$('.paginate').html('');
	            	}
	        	}
			});
			
		},
		hours : function(){
			$('#hours').html('<li><img src="/resources/commons/images/icon/icon_load.gif"/></li>');
			var date = new Date(History.get.$day.year, History.get.$day.month, History.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/history.json?action=get.history.hours",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : History.get.$plan.planId == 0 ? 1 :  History.get.$plan.planId,
	            	"euid" : History.get.$tag,
					"day" : date.format('yyyy-MM-dd'),
	                
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	History.get.$hours = data.hours;
	            	$('#hours').html('');
	            	for(var i=0; i < History.get.$hours.length; i++){
	            		$('#hours').append('<li class="ui-widget-content"><span class="ui-icon ui-icon-clock" style="float:left"></span> '+History.get.$hours[i]+' '+$.rtls.playback.form.oclock+'</li>');	
	            	}
	            	$("#hours").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#hours li").index(this);
	    						History.get.$hour = History.get.$hours[ix];	
	    						History.ui.tags();
	    					});
	    				}
	    			});
	            	if( History.get.$hours.length > 0){
	            		$('ol#hours li').eq(0).addClass('ui-selected');
	                	History.get.$hour = History.get.$hours[0];	
	                	History.ui.tags();
	            	}else{
	            		History.get.$hour = null;
	            		History.get.$tag = null;
	            		History.get.$tags = [];
	            		
	            	}
				}
			});
			
		},
		tags : function(){
			$('#tags').html('<li><img src="/resources/commons/images/icon/icon_load.gif"/></li>');
			var date = new Date(History.get.$day.year, History.get.$day.month, History.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/history.json?action=get.history.tags",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : History.get.$plan.planId == 0 ? 1 :  History.get.$plan.planId,
	            	"day" : date.format('yyyy-MM-dd'),
	            	"hour" : History.get.$hour == null ? '' : History.get.$hour,
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	History.get.$tags = data.tags;
	    			$('#tags').html('');
	            	$('#tags').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+$.rtls.playback.form.full+'</li>');
	            	var euid = '';
	            	for(var i=0; i < History.get.$tags.length; i++){
	            		euid = History.get.$tags[i];
	            		euid = euid.substring(euid.length-4, euid.legnth);
	            		$('#tags').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+euid+'</li>');	
	            	}
	            	$("#tags").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#tags li").index(this);
	    						if(ix == 0){
	    							History.get.$tag = '';
	    						}else{
	    							History.get.$tag = History.get.$tags[ix-1];
	    						}
	    						History.log.getItems();
	    					});
	    				}
	    			});
	            	if(History.get.$tags.length > 0){
	            		$('ol#tags li').eq(0).addClass('ui-selected');
	            		History.get.$tag = '';
	            	}else{
	            		History.get.$tag = null;
	            	}
	            	History.log.getItems();
				}
			});
			
		},
		log : function(){
			var html = '<tr>';
			html += '<th class="first">'+$.rtls.history.list.head[0]+'</th>';
			html += '<th>'+$.rtls.history.list.head[1]+'</th>';
			html += '<th>'+$.rtls.history.list.head[2]+'</th>';
			html += '<th>'+$.rtls.history.list.head[3]+'</th>';
			html += '<th>'+$.rtls.history.list.head[4]+'</th>';
			html += '<th class="end">'+$.rtls.history.list.head[5]+'</th>';
			html += '</tr>';
			$("#items thead").html(html);
		}
	},
	log : {
		$startNum : 0, $scaleNum : 20,
		paging : function(startNum){
			this.$startNum = startNum;
			this.getLogs();	
		},
		getWasTime : function(milliseconds){
			var d = parseInt(milliseconds);
			var ss = Math.round(d / 1000);
			var m = Math.round(ss/60);
			var s = Math.round(ss%60);
			var h = Math.round(m/60);
			if(h > 0){
				m  = Math.round(m%60);
			}
			if(h < 10) h = "0"+h;
			if(m < 10) m = "0"+m;
			if(s < 10) s = "0"+s;
			return h+' '+$.rtls.history.form.hour+' '+m+' '+$.rtls.history.form.min+' '+s+' '+$.rtls.history.form.sec;
		},
		getItems : function(){
			$('#items tbody').html("<tr><td colspan='9' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
			
			var date = new Date(History.get.$day.year, History.get.$day.month, History.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/history.json?action=get.history.logs",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : History.get.$plan.planId == 0 ? 1 :  History.get.$plan.planId,
					"startNum" : History.log.$startNum,
					"scaleNum" : History.log.$scaleNum,
					"day" : date.format('yyyy-MM-dd'),
	            	"hour" : History.get.$hour == null ? '' : History.get.$hour,
	                "euid" : History.get.$tag
	                
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	var currentPageNum = parseInt(data.paging.currentPageNum);
	    			var totalNum = parseInt(data.paging.totalNum);
	    			var startNum = parseInt(data.paging.startNum);
	            	$('#items tbody').html('');
	            	$('.top_left').html($.rtls.history.list.top(totalNum));
	            	if(totalNum == 0){
	            		$('#items tbody').append("<tr><td colspan='10' style='height:50px'><center>"+$.rtls.history.list.empty+"<center></td></tr>");
	            		$('.paginate').html('');
	    			}else{
	    				var item = null;
	    				var html = '';
	    				for(var i=0; i < data.historys.length; i++){
	    					item = data.historys[i];
	    					html = "<tr>";
	    					html += "<td>"+(totalNum - (i + startNum))+"</td>";
	    					for(var j=0; j < History.get.$plans.length; j++){
	    						if(History.get.$plans[j].planId == item.planId){
	    							html += "<td>"+History.get.$plans[j].name+"</td>";
	    							break;
	    						}
	    					}
	    					html += "<td>"+item.userName+"("+item.euid.substring(item.euid.length-4, item.euid.length)+")</td>";	
	    					html += "<td>"+item.zoneName+"</td>";	
	    					html += "<td>"+History.log.getWasTime(item.wasTime)+"</td>";
	    					html += "<td>"+item.addTime.msdate()+"</td>";
	    					$('#items tbody').append(html);
	    				
	    				}
	    				html = "<a href=\"javascript:History.log.paging(0)\"><img src='/resources/commons/images/icon/icon_paging_first.gif' /></a>";
	        			if(data.paging.isPrevPage == 'true'){
	        				html += "<a href=\"javascript:History.log.paging('"+data.paging.prevNum+"')\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
	        			}else{
	        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
	        			}
	        			var pages = data.paging.pages;
	        			for(var i=0; i < pages.length; i++){
	        				var page = pages[i];
	        				html += "<a href=\"javascript:History.log.paging('"+page.startNum+"')\">";
	        				if(currentPageNum == page.pageNum){
	        					html += "<span class='num_on'>"+page.pageNum+"</span>";
	        				}else{
	        					html += "<span class='num'>"+page.pageNum+"</span>";
	        				}
	        				html += "</a>";
	        			}
	        			if(data.paging.isNextPage == 'true'){
	        				html += "<a href=\"javascript:History.log.paging('"+data.paging.nextNum+"')\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
	        			}else{
	        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
	        			}
	        			html += "<a href=\"javascript:History.log.paging('"+data.paging.lastNum+"')\"><img src='/resources/commons/images/icon/icon_paging_last.gif' /></a>";
	        			$('.paginate').html(html);
	    			}
	            	
	            	
				}
			});
			
		}
	}
	
	
};