var historTimeChartOptions = {
	chart: {
		renderTo: 'history-time-chart',
		type: 'column'
    },
    credits: {
		enable : false,
        text: '',
        href: 'http://www.ido-link.com'
    }, 
	title: {
        text: ''
    },
    xAxis: {
        categories: [],
        labels: {
            rotation: -45,
            align: 'right',
            style: {
            	color: '#222',
                fontSize: '13px',
                fontFamily:'Dotum, Gulim, AppleGothic, Sans-serif, Arial',
                fontWeight : 'bold'
            }
        }
    },
    yAxis: {
        min: 0, max : 100,
        title: {
            text: $.rtls.history.chart.title.waitTime
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        
    },
    series: [{
        name: $.rtls.history.chart.title.waitTime,
        data: [],
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            x: -20,
            y: 10,
            style: {
                fontSize: '12px',
                textShadow: '0 0 3px black'
            }
        }
    }]
 
};
var historCountChartOptions = {
	chart: {
		renderTo: 'history-count-chart',
		type: 'column'
    },
    credits: {
		enable : false,
        text: '',
        href: 'http://www.ido-link.com'
    }, 
	title: {
        text: ''
    },
    xAxis: {
        categories: [],
        labels: {
            rotation: -45,
            align: 'right',
            style: {
            	color: '#222',
                fontSize: '13px',
                fontFamily:'Dotum, Gulim, AppleGothic, Sans-serif, Arial',
                fontWeight : 'bold'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: $.rtls.history.chart.title.visitCount
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        
    },
    series: [{
        name: $.rtls.history.chart.title.visitCount,
        data: [],
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            x: -20,
            y: 10,
            style: {
                fontSize: '12px',
                textShadow: '0 0 3px black'
            }
        }
    }]
 
};


var History = {
	$colors : ['B0171F', '00008B', '00BFFF', '00C957', 'FF8C69', 'EEC900', '00FF00', '000FF', 'FF0000', 'E066FF'],
	$timeChart : null, $countChart : null,
	$tag : null, $tags : null,
	$type : 0, $startDay : null, $endDay : null,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[1]+'</span>');
		var html = '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">';
        html +=	'	<li id="tab_0" class="ui-state-default ui-corner-top" onmouseover="History.tabOver(0)" onmouseout="History.tabOut(0)">';
        html +=	'		<a href="javascript:History.tabSelect(0)"><img src="/resources/commons/images/tree/dir.gif"/> '+$.rtls.history.tab.zone+' </a>';
        html +=	'	</li>';  
        html +=	'	<li id="tab_1" class="ui-state-default ui-corner-top" onmouseover="History.tabOver(1)" onmouseout="History.tabOut(1)">';
        html +=	'		<a href="javascript:History.tabSelect(1)"><img src="/resources/commons/images/tree/dir.gif"/> '+$.rtls.history.tab.plan+' </a>';
        html +=	'	</li>';
        html +=	'</ul>';
        $('#tab').html(html);
        
        html = '<table style="height: 50px">';
        html += '<tr>';
        html += '	<td  height="20">';
		html += '	<div id="search-fields">';
        html +=	'	<p>';
        html +=	'		<label>'+$.rtls.history.form.time+'</label>';
        html +=	'		<input type="text" id="startDay" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/>';
        html +=	'		<input type="text" id="startTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
        html +=	'		~';
        html +=	'		<input type="text" id="endDay" value="" class="input-readonly" style="width: 80px; text-align: center;"  readonly="readonly"/>';
        html +=	'		<input type="text" id="endTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
        html +=	'    	<button id="but-search">'+$.rtls.history.button.search+'</button>';
        html +=	'	</p>';
        html +=	'	</div>';
        html +=	'	</td>';
        html +=	'</tr>';
        html +=	'<tr>';
        html +=	'	<td  height="20">';
        html +=	'		<div id="search-fields">';
        html +=	'		<p>';
        html +=	'			<label>'+$.rtls.history.form.tag+'</label>';
        html +=	'			<input type="text" id="tagEuid" value="" class="input-readonly" style="text-align: center;"/>';
        html +=	'			<button id="but-tag">'+$.rtls.history.button.select+'</button>';
        html +=	'		</p>';
        html +=	'		</div>';
        html +=	'	</td>';
        html +=	'</tr>';
        html +=	'</table>';
        $("#search-form").html(html);
        
		$("#startDay").datepicker({
			onSelect: function(selectedDate) {
				History.$startDay = selectedDate;
			}
        });
		$('#startTime').timepicker({
			showTime : false,
			hourGrid: 2,
			minuteGrid: 5
		});
		$("#endDay").datepicker({
			onSelect: function(selectedDate) {
				History.$endDay = selectedDate;
			}
        });
		$('#endTime').timepicker({
			showTime : false,
			hourGrid: 2,
			minuteGrid: 5
		});
		
		// TAG 선택
		$("#but-tag").button({
			icons: {primary: "ui-icon-tag"}
		}).click(function() {
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/tag.json?action=get.been.issued.tags",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
					
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	History.$tag = null;
	            	History.$tags = data.tags;
	            	$("#dialog-tag").dialog({
	        			title:$.rtls.history.dialog.title[0],
	        			autoOpen: false,
	        			height: 600,
	        			width: 600,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					if(History.$tag != null){
	        						$("#tagEuid").val(History.$tag.euid);
	        						$("#dialog-tag").dialog( "close" );
	        					}else{
	        						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.history.message.tagselect);
	        						
	        					}
	        					
	        				},
	        			},{
	        				text : $.rtls.commons.button.cancel,
	        				click: function() {
	        					$( this ).dialog( "close" );
	        				}
	        			}],
	        			open: function() {
	        				var html = "<ol id='plan-selectable' class='ui-selectable'>";
							for(var i=0; i < data.tags.length; i++){
								html += "<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_tag.gif' style='float:left; padding-right:3px'/>"+data.tags[i].euid+"</li>";
							}	
							html += "</ol>";
							$(this).html(html);
							$("#plan-selectable", this).selectable({
								stop: function() {
									$( ".ui-selected", this ).each(function() {
										History.$tag = History.$tags[$( "#plan-selectable li" ).index( this )];
									});		
								}
							});
	        			},
	        			close: function() {
	        				$("#dialog-tag").empty();
	        			}
	        		});
	        		$( "#dialog-tag" ).dialog( "open" );
				}
			});
			return false; 
		});
		$("#but-search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			if(History.$type == 0){
				History.getZoneChart();	
			}
			
			return false; 
		});
		
		this.tabSelect(0);
	},
	tabOver : function(index){
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == index){
		    	$(this).addClass('ui-state-hover');
		    }else{
		    	$(this).removeClass('ui-state-hover');
		    }
		});
		
	},
	tabOut : function(index){
		$('#tab').find('ul').find('li').each(function(i) {
	    	$(this).removeClass('ui-state-hover');
		});
		
	},
	tabSelect : function(ix){
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == ix){
		    	$(this).addClass('ui-tabs-selected');
		    	$(this).addClass('ui-state-active');
		    }else{
		    	$(this).removeClass('ui-state-active');
				$(this).removeClass('ui-tabs-selected');
		    }
		});
		if(ix == 0){
			this.getZoneChart();
		}else if(ix == 1){
			this.getPlanChart();
		}
		
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
		return h+":"+m+":"+s+"";
	},
	getZoneChart : function(){
		var startTime =  $.trim($("#startTime").val());
		var endTime =  $.trim($("#endTime").val());
		if(!$.string(startTime).blank()){
			if(startTime.length == 4) startTime = '0'+startTime;
		}
		if(!$.string(endTime).blank()){
			if(endTime.length == 4) endTime = '0'+endTime;
		}
		$.ajax({
			async : false,
			type: 'get',
			url: "/service/history.json?action=get.history.zone.chart",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"startNum" : History.$startNum,
				"scaleNum" : History.$scaleNum,
                "startDay" : History.$startDay == null ? '' : History.$startDay,
                "endDay" : History.$endDay == null ? '' : History.$endDay,
        		"startTime" : startTime,
                "endTime" : endTime,
                "euid" : $("#tagEuid").val()
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	historTimeChartOptions.xAxis.categories = [];
            	historTimeChartOptions.series[0].data = [];
            	historCountChartOptions.xAxis.categories = [];
            	historCountChartOptions.series[0].data = [];
            	var html_time = "<ol id='history-time-selectable' class='ui-selectable'>";	
            	var html_count = "<ol id='history-count-selectable' class='ui-selectable'>";
            	var item = {};
				for(var i=0; i < data.historys.length ; i++){
            		item = data.historys[i];
            		html_time += "<li class='ui-widget-content' id='time_"+item.zoneId+"'><img src='/resources/commons/images/tree/dir.gif'  style='float:left; padding-right:3px'/><b>"+item.zoneName+"</b> : "+History.getWasTime(item.wasTime)+"</li>";
            		html_count += "<li class='ui-widget-content' id='count"+item.zoneId+"'><img src='/resources/commons/images/tree/dir.gif'  style='float:left; padding-right:3px'/><b>"+item.zoneName+"</b> : "+item.count+" "+$.rtls.history.form.visit+"</li>";
            		historTimeChartOptions.xAxis.categories.push(item.zoneName);
            		historTimeChartOptions.series[0].data.push({y : parseFloat(item.percent), color:'#'+History.$colors[i]});
            		historCountChartOptions.xAxis.categories.push(item.zoneName);
            		historCountChartOptions.series[0].data.push({y : parseInt(item.count), color:'#'+History.$colors[i]});
            		
            	}
				html_time += "</ol>";
				html_count += "</ol>";
				$('#history-view-time').html(html_time);
				$('#history-view-count').html(html_count);
				
				History.$timeChart = new Highcharts.Chart(historTimeChartOptions);
				History.$countChart = new Highcharts.Chart(historCountChartOptions);
				
				$("#history-time-selectable", "#history-view").selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							var ix = $( "#history-time-selectable li" ).index( this );
							var data = History.$timeChart.series[0].data[ix];
							if(data != undefined){
								data.select();
							}
							History.$timeChart.redraw();
							
						});		
					}
				});
			}
		});
	},
	getPlanChart : function(){
		var startTime =  $.trim($("#startTime").val());
		var endTime =  $.trim($("#endTime").val());
		if(!$.string(startTime).blank()){
			if(startTime.length == 4) startTime = '0'+startTime;
		}
		if(!$.string(endTime).blank()){
			if(endTime.length == 4) endTime = '0'+endTime;
		}
		$.ajax({
			async : false,
			type: 'get',
			url: "/service/history.json?action=get.history.plan.chart",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"startNum" : History.$startNum,
				"scaleNum" : History.$scaleNum,
                "startDay" : History.$startDay == null ? '' : History.$startDay,
                "endDay" : History.$endDay == null ? '' : History.$endDay,
        		"startTime" : startTime,
                "endTime" : endTime,
                "euid" : $("#tagEuid").val()
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	
            	historTimeChartOptions.xAxis.categories = [];
            	historTimeChartOptions.series[0].data = [];
            	historCountChartOptions.xAxis.categories = [];
            	historCountChartOptions.series[0].data = [];
            	var html_time = "<ol id='history-time-selectable' class='ui-selectable'>";	
            	var html_count = "<ol id='history-count-selectable' class='ui-selectable'>";	
            	var item = {};
				for(var i=0; i < data.historys.length ; i++){
            		item = data.historys[i];
            		html_time += "<li class='ui-widget-content' id='time_"+item.planId+"'><img src='/resources/commons/images/tree/dir.gif'  style='float:left; padding-right:3px'/><b>"+item.planName+"</b> : "+History.getWasTime(item.wasTime)+"</li>";
            		html_count += "<li class='ui-widget-content' id='count"+item.planId+"'><img src='/resources/commons/images/tree/dir.gif'  style='float:left; padding-right:3px'/><b>"+item.planName+"</b> : "+item.count+"회</li>";
            		historTimeChartOptions.xAxis.categories.push(item.planName);
            		historTimeChartOptions.series[0].data.push({y : parseFloat(item.percent), color:'#'+History.$colors[i]});
            		historCountChartOptions.xAxis.categories.push(item.planName);
            		historCountChartOptions.series[0].data.push({y : parseInt(item.count), color:'#'+History.$colors[i]});
            	}
				html_time += "</ol>";
				html_count += "</ol>";
				$('#history-view-time').html(html_time);
				$('#history-view-count').html(html_count);
				
				History.$timeChart = new Highcharts.Chart(historTimeChartOptions);
				History.$countChart = new Highcharts.Chart(historCountChartOptions);
				
				$("#history-selectable", "#history-view").selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							var ix = $( "#history-selectable li" ).index( this );
							var data = History.$timeChart.series[0].data[ix];
							if(data != undefined){
								data.select();
							}
							History.$timeChart.redraw();
							
						});		
					}
				});
			}
		});
	}
	
	
};