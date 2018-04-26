
var Error = {
	get : {$day : null, $days : [], $hour : null, $hours : [], $plan : null, $plans : [], $zones : new HashMap(), $tag : null, $tags : []},
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[7]+'</span>');
		Error.ui.layout();
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
				center__onresize : "Error.ui.$innerLayout.resizeAll",
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
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.error.form.type;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;">';
			html += '	<ol id="errtype-selectable" class="ui-selectable">';
			html += '		<li class="ui-widget-content ui-selectee ui-selected">'+$.rtls.error.form.full+'</li>';
			html += '		<li class="ui-widget-content">'+$.rtls.error.type[0]+'</li>';
			html += '		<li class="ui-widget-content">'+$.rtls.error.type[1]+'</li>';
			html += '		<li class="ui-widget-content">'+$.rtls.error.type[2]+'</li>';
			html += '	</ol>';
			html += '</div>';
			html += '<div class="ui-accordion ui-widget ui-helper-reset"  style="clear: both;">';
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.error.form.level;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;">';
			html += '	<ol id="errlevel-selectable" class="ui-selectable">';
			html += '		<li class="ui-widget-content ui-selectee ui-selected">'+$.rtls.error.form.full+'</li>';
			html += '		<li class="ui-widget-content">'+$.rtls.error.level[0]+'</li>';
			html += '		<li class="ui-widget-content">'+$.rtls.error.level[1]+'</li>';
			html += '		<li class="ui-widget-content">'+$.rtls.error.level[2]+'</li>';
			html += '	</ol>';
			html += '</div>';
			html += '<div class="ui-accordion ui-widget ui-helper-reset"  style="clear: both;">';
			html += '	<h3 class="ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons">';
			html += '		<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>'+$.rtls.position.form.scale;
			html += '	</h3>';
			html += '</div>';
			html += '<div style="clear: both;">';
			html += '		<ol id="scale-selectable" class="ui-selectable">';
			html += '		<li class="ui-widget-content ui-selectee ui-selected">20'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">30'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">40'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">50'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">60'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">70'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">80'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">90'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">100'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">150'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">200'+$.rtls.error.form.number+'</li>';
			html += '		<li class="ui-widget-content">300'+$.rtls.error.form.number+'</li>';
			html += '		</ol>';
			html += '</div>';
			$('.outer-layout-west').html(html);
			$("#errtype-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						var ix = $( "#errtype-selectable li" ).index( this );
						Error.log.$errorType = ix;
						Error.log.getItems();
					});		
				}
			});
			$("#errlevel-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						var ix = $( "#errlevel-selectable li" ).index( this );
						if(ix == 0){
							Error.log.$errorLevel = '';
						}else if(ix == 1){
							Error.log.$errorLevel = 'critical';
						}else if(ix == 2){
							Error.log.$errorLevel = 'major';
						}else if(ix == 3){
							Error.log.$errorLevel = 'minor';
						}
						Error.log.getItems();
					});		
				}
			});
			$("#scale-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						var ix = $( "#scale-selectable li" ).index( this );
						if(ix ==0){
							Error.log.$scaleNum = 20;
						}else if(ix ==1){
							Error.log.$scaleNum = 30;
						}else if(ix ==2){
							Error.log.$scaleNum = 40;
						}else if(ix ==3){
							Error.log.$scaleNum = 50;
						}else if(ix ==4){
							Error.log.$scaleNum = 60;
						}else if(ix ==5){
							Error.log.$scaleNum = 70;
						}else if(ix ==6){
							Error.log.$scaleNum = 80;
						}else if(ix ==7){
							Error.log.$scaleNum = 90;
						}else if(ix ==8){
							Error.log.$scaleNum = 100;
						}else if(ix ==9){
							Error.log.$scaleNum = 150;
						}else if(ix ==10){
							Error.log.$scaleNum = 200;
						}else if(ix ==12){
							Error.log.$scaleNum = 300;
						}else if(ix ==13){
							Error.log.$scaleNum = 400;
						}else if(ix ==14){
							Error.log.$scaleNum = 500;
						}
						Error.log.getItems();
					});		
				}
			});
			Error.ui.log();
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
	            	Error.get.$plans = data.plans;
	            	for(var i=0; i < Error.get.$plans.length; i++){
	            		$('#plans').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+Error.get.$plans[i].name+'</li>');	
	            	}
	            	$("#plans").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#plans li").index(this);
	    						Error.get.$plan = Error.get.$plans[ix];
	    						$('#calendar').fullCalendar('refetchEvents');
	    					});
	    				}
	    			});
	            	$('ol#plans li').eq(0).addClass('ui-selected');
	            	Error.get.$plan = Error.get.$plans[0];
	            	Error.ui.calendar();
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
					Error.ui.days(year, month);
					callback(Error.get.$days);
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
					Error.get.$day = event;
					Error.ui.hours();
				}
		    });
			
		},
		days : function(year, month){
			Error.get.$days = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/error.json?action=get.error.days",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Error.get.$plan.planId == 0 ? 1 :  Error.get.$plan.planId,
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
						Error.get.$days.push(obj);
	            	}
	            	if(Error.get.$days.length > 0){
	            		Error.get.$day = Error.get.$days[0];
	            		Error.ui.hours();
	            	}else{
	            		$('#hours').html('');
	            		$('#tags').html('');
	            		$('.con_top .top_left').html($.rtls.error.log.top(0));
	            		$('#items tbody').html("<tr><td colspan='10' style='height:50px'><center>"+$.rtls.error.log.empty+"<center></td></tr>");
	            		$('.paginate').html('');
	            	}
	        	}
			});
			
		},
		hours : function(){
			$('#hours').html('<li><img src="/resources/commons/images/icon/icon_load.gif"/></li>');
			var date = new Date(Error.get.$day.year, Error.get.$day.month, Error.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/error.json?action=get.error.hours",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Error.get.$plan.planId == 0 ? 1 :  Error.get.$plan.planId,
	            	"euid" : Error.get.$tag,
					"day" : date.format('yyyy-MM-dd'),
	                
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Error.get.$hours = data.hours;
	            	$('#hours').html('');
	            	for(var i=0; i < Error.get.$hours.length; i++){
	            		$('#hours').append('<li class="ui-widget-content"><span class="ui-icon ui-icon-clock" style="float:left"></span> '+Error.get.$hours[i]+' '+$.rtls.playback.form.oclock+'</li>');	
	            	}
	            	$("#hours").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#hours li").index(this);
	    						Error.get.$hour = Error.get.$hours[ix];	
	    						Error.ui.tags();
	    					});
	    				}
	    			});
	            	if( Error.get.$hours.length > 0){
	            		$('ol#hours li').eq(0).addClass('ui-selected');
	                	Error.get.$hour = Error.get.$hours[0];	
	                	Error.ui.tags();
	            	}else{
	            		Error.get.$hour = null;
	            		Error.get.$tag = null;
	            		Error.get.$tags = [];
	            		
	            	}
				}
			});
			
		},
		tags : function(){
			$('#tags').html('<li><img src="/resources/commons/images/icon/icon_load.gif"/></li>');
			var date = new Date(Error.get.$day.year, Error.get.$day.month, Error.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/error.json?action=get.error.tags",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Error.get.$plan.planId == 0 ? 1 :  Error.get.$plan.planId,
	            	"day" : date.format('yyyy-MM-dd'),
	            	"hour" : Error.get.$hour == null ? '' : Error.get.$hour,
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Error.get.$tags = data.tags;
	    			$('#tags').html('');
	            	$('#tags').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+$.rtls.playback.form.full+'</li>');
	            	var euid = '';
	            	for(var i=0; i < Error.get.$tags.length; i++){
	            		euid = Error.get.$tags[i];
	            		euid = euid.substring(euid.length-4, euid.legnth);
	            		$('#tags').append('<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+euid+'</li>');	
	            	}
	            	$("#tags").selectable({
	    				stop : function () {
	    					$( ".ui-selected", this ).each(function() {
	    						var ix = $("#tags li").index(this);
	    						if(ix == 0){
	    							Error.get.$tag = '';
	    						}else{
	    							Error.get.$tag = Error.get.$tags[ix-1];
	    						}
	    						Error.log.getItems();
	    					});
	    				}
	    			});
	            	if(Error.get.$tags.length > 0){
	            		$('ol#tags li').eq(0).addClass('ui-selected');
	            		Error.get.$tag = '';
	            	}else{
	            		Error.get.$tag = null;
	            	}
	            	Error.log.getItems();
				}
			});
			
		},
		log : function(){
			var html = '<tr>';
			html += '<th class="first">'+$.rtls.error.log.head[0]+'</th>';
			html += '<th>'+$.rtls.error.log.head[1]+'</th>';
			html += '<th>'+$.rtls.error.log.head[2]+'</th>';
			html += '<th>'+$.rtls.error.log.head[3]+'</th>';
			html += '<th>'+$.rtls.error.log.head[4]+'</th>';
			html += '<th class="end">'+$.rtls.position.log.head[5]+'</th>';
			html += '</tr>';
			$("#items thead").html(html);
		}
	},
	log : {
		$startNum : 0, $scaleNum : 20,
		$errorType : 0, $errorLevel : '',
		paging : function(startNum){
			this.$startNum = startNum;
			this.getItems();	
		},
		
		getTime : function(milliseconds){
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
			return h+":"+m+":"+s;
		},
		getItems : function(){
			$('#items tbody').html("<tr><td colspan='9' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
			
			var date = new Date(Error.get.$day.year, Error.get.$day.month, Error.get.$day.day);
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/error.json?action=get.error.logs",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Error.get.$plan.planId == 0 ? 1 :  Error.get.$plan.planId,
	    			"errorType" : Error.log.$errorType,
	            	"errorLevel" : Error.log.$errorLevel == null ? '' : Error.log.$errorLevel,
					"startNum" : Error.log.$startNum,
					"scaleNum" : Error.log.$scaleNum,
					"day" : date.format('yyyy-MM-dd'),
	            	"hour" : Error.get.$hour == null ? '' : Error.get.$hour,
	                "euid" : Error.get.$tag
	                
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	var currentPageNum = parseInt(data.paging.currentPageNum);
	    			var totalPageNum = parseInt(data.paging.totalPageNum);
	    			var totalNum = parseInt(data.paging.totalNum);
	    			var startNum = parseInt(data.paging.startNum);
	            	$('#items tbody').html('');
	            	$('.con_top .top_left').html($.rtls.error.log.top(totalNum));
	            	if(totalNum == 0){
	            		$('#items tbody').append("<tr><td colspan='10' style='height:50px'><center>"+$.rtls.error.log.empty+"<center></td></tr>");
	            		$('.paginate').html('');
	    			}else{
	    				var item = null;
	    				var html = '';
	    				for(var i=0; i < data.errors.length; i++){
	    					item = data.errors[i];
	    					html = "<tr>";
	    					html += "<td>"+(totalNum - (i + startNum))+"</td>";
	    					if(item.errorType == '1'){
	    						html += "<td>"+$.rtls.error.type[0]+"</td>";
	    					}else if(item.errorType == '2'){
	    						html += "<td>"+$.rtls.error.type[1]+" low level</td>";
	    					}else if(item.errorType == '3'){
	    						html += "<td>"+$.rtls.error.type[2]+"</td>";
	    					}
	    					if(item.errorLevel == 'critical'){
	    						html += "<td style='color:#FF0000'>"+$.rtls.error.level[0]+"</td>";
	    					}else if(item.errorLevel == 'major'){
	    						html += "<td style='color:#eb7d1b'>"+$.rtls.error.level[1]+"</td>";
	    					}else if(item.errorLevel == 'minor'){
	    						html += "<td>"+$.rtls.error.level[2]+"</td>";
	    					}
	    					if(item.errorType == '1'){
	    						html += "<td>RAP("+item.euid+")</td>";
	    					}else if(item.errorType == '2'){
	    						html += "<td>TAG("+item.euid+")</td>";
	    					}else if(item.errorType == '3'){
	    						html += "<td>TAG("+item.euid+")</td>";
	    					}
	    					if(item.errorType == '1'){
	    						html += "<td>RAP("+item.euid+") Alive data lose</td>";
	    					}else if(item.errorType == '2'){
	    						html += "<td>TAG("+item.euid+") Battery low level.</td>";
	    					}else if(item.errorType == '3'){
	    						if(item.errorCase == '1'){
	    							html += "<td>"+$.rtls.error.ecase[0]+"</td>";
	    						}else if(item.errorCase == '2'){
	    							html += "<td>"+$.rtls.error.ecase[1]+"</td>";
	    						}else if(item.errorCase == '3'){
	    							html += "<td>"+$.rtls.error.ecase[2]+"</td>";
	    						}else if(item.errorCase == '4'){
	    							html += "<td>"+$.rtls.error.ecase[3]+"</td>";
	    						}else if(item.errorCase == '5'){
	    							html += "<td>"+$.rtls.error.ecase[4]+"</td>";
	    						}else if(item.errorCase == '6'){
	    							html += "<td>"+$.rtls.error.ecase[5]+"</td>";
	    						}else if(item.errorCase == '7'){
	    							html += "<td>"+$.rtls.error.ecase[6]+"</td>";
	    						}else if(item.errorCase == '8'){
	    							html += "<td>"+$.rtls.error.ecase[7]+"</td>";
	    						}else if(item.errorCase == '9'){
	    							html += "<td>"+$.rtls.error.ecase[8]+"</td>";
	    						}else{
	    							html += "<td>ETC ERROR</td>";
	    						}
	    						
	    					}	
	    					html += "<td>"+item.addTime.msdate()+"</td>";
	    					$('#items tbody').append(html);
	    				
	    				}
	    				html = "<a href=\"javascript:Error.log.paging(0)\"><img src='/resources/commons/images/icon/icon_paging_first.gif' /></a>";
	        			if(data.paging.isPrevPage == 'true'){
	        				html += "<a href=\"javascript:Error.log.paging('"+data.paging.prevNum+"')\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
	        			}else{
	        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
	        			}
	        			var pages = data.paging.pages;
	        			for(var i=0; i < pages.length; i++){
	        				var page = pages[i];
	        				html += "<a href=\"javascript:Error.log.paging('"+page.startNum+"')\">";
	        				if(currentPageNum == page.pageNum){
	        					html += "<span class='num_on'>"+page.pageNum+"</span>";
	        				}else{
	        					html += "<span class='num'>"+page.pageNum+"</span>";
	        				}
	        				html += "</a>";
	        			}
	        			if(data.paging.isNextPage == 'true'){
	        				html += "<a href=\"javascript:Error.log.paging('"+data.paging.nextNum+"')\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
	        			}else{
	        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
	        			}
	        			html += "<a href=\"javascript:Error.log.paging('"+data.paging.lastNum+"')\"><img src='/resources/commons/images/icon/icon_paging_last.gif' /></a>";
	        			$('.paginate').html(html);
	    			}
	            	
	            	
				}
			});
			
		}
	}
	
	
};