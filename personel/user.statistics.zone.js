var historyTimeChartOptions = {
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
            text: $.rtls.user.chart.title.waitTime
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        
    },
    series: [{
        name: $.rtls.user.chart.title.waitTime,
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
var historyCountChartOptions = {
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
            text: $.rtls.user.chart.title.visit
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        
    },
    series: [{
        name: $.rtls.user.chart.title.visit,
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


var User = {
	$colors : ['B0171F', '00008B', '00BFFF', '00C957', 'FF8C69', 'EEC900', '00FF00', '000FF', 'FF0000', 'E066FF'],
	$timeChart : null, $countChart : null,
	$user : null, $users : null,
	$type : 0, $startDay : null, $endDay : null,
	init : function(){
		var html = '<table style="height: 50px">';
		html += '<tr>';
		html += '	<td  height="20">';
		html += '  		<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.user.form.date+'</label>';
		html += '			<input type="text" id="startDay" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/> ~ ';
		html += '			<input type="text" id="endDay" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/>';
		html += '          	<button id="but-search">'+$.rtls.user.button.search+'</button>';
		html += '		</p>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td  height="20">';
		html += '		<div id="search-fields">';
		html += '			<label>'+$.rtls.user.form.user+'</label>';
		html += '			<ol id="user-selectable" class="ui-selectable">';
		html += '			</ol>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '</table>';
		$("#search-form").html(html);
		
		$("#startDay").datepicker({
			onSelect: function(selectedDate) {
				User.$startDay = selectedDate;
			}
        });
		$("#endDay").datepicker({
			onSelect: function(selectedDate) {
				User.$endDay = selectedDate;
			}
        });
		var tempDate = new Date();
		this.$startDay = new Date(tempDate.setDate(tempDate.getDate() - 15)).format("yyyy-MM-dd");
		this.$endDay = new Date().format("yyyy-MM-dd");
		$("#startDay").val(this.$startDay);
		$("#endDay").val(this.$endDay);
		
		$("#but-search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			if(User.$type == 0){
				User.getUsers();
				User.getUserZoneChart();	
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
			this.getUsers();
			this.getUserZoneChart();
		}else if(ix == 1){
			
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
	getUsers : function(){
		$.ajax({
			async : false,
			type: 'get',
			url: "/service/user.json?action=get.active.users",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"startDay" : User.$startDay,
            	"endDay" : User.$endDay,
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	User.$users = data.users;
            	var item = null;
            	var euid = '';
            	var html = "<li class='ui-widget-content ui-selectee ui-selected' userId='0'><img src='/resources/commons/images/icon/icon_set.png'  style='float:left; padding-right:3px'/><b>"+$.rtls.user.form.full+"</b></li>";	
				for(var i=0; i < data.users.length ; i++){
            		item = data.users[i];
            		euid = item.euid.substring(item.euid.length-4, item.euid.length);
					if(item.gender == 1){
            			html += "<li class='ui-widget-content' userId='"+item.userId+"'><img src='/resources/commons/images/icon/icon_boy.png'  style='float:left; padding-right:3px'/><b>"+item.name+"("+euid+")</b></li>";	
            		}else{
            			html += "<li class='ui-widget-content' userId='"+item.userId+"'><img src='/resources/commons/images/icon/icon_girl.png'  style='float:left; padding-right:3px'/><b>"+item.name+"("+euid+")</b></li>";	
            		}
            		
            	}
				$('#user-selectable').html(html);
				$("#user-selectable").selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							var userId = $(this).attr('userId');
							if(userId == 0){
								User.$user = null;
							}else{
								for(var i=0; i < User.$users.length; i++){
									if(User.$users[i].userId == userId){
										User.$user = User.$users[i];
										break;
									}
								}
							}
							User.getUserZoneChart();
						});		
					}
				});
			}
		});
	},
	getUserZoneChart : function(){
		$.ajax({
			async : false,
			type: 'get',
			url: "/service/history.json?action=get.history.user.zone.chart",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"startDay" : User.$startDay,
            	"endDay" : User.$endDay,
                "userId" : User.$user == null ? 0 : User.$user.userId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	historyTimeChartOptions.xAxis.categories = [];
            	historyTimeChartOptions.series[0].data = [];
            	historyCountChartOptions.xAxis.categories = [];
            	historyCountChartOptions.series[0].data = [];
            	var html_time = "<ol id='history-time-selectable' class='ui-selectable'>";	
            	var html_count = "<ol id='history-count-selectable' class='ui-selectable'>";	
				for(var i=0; i < data.historys.length ; i++){
            		item = data.historys[i];
            		html_time += "<li class='ui-widget-content' id='time_"+item.zoneId+"'><img src='/resources/commons/images/tree/dir.gif'  style='float:left; padding-right:3px'/><b>"+item.zoneName+"</b> : "+User.getWasTime(item.wasTime)+"</li>";
            		html_count += "<li class='ui-widget-content' id='count"+item.zoneId+"'><img src='/resources/commons/images/tree/dir.gif'  style='float:left; padding-right:3px'/><b>"+item.zoneName+"</b> : "+item.count+""+$.rtls.user.form.count+"</li>";
            		historyTimeChartOptions.xAxis.categories.push(item.zoneName);
            		historyTimeChartOptions.series[0].data.push({y : parseFloat(item.percent), color:'#'+User.$colors[i]});
            		historyCountChartOptions.xAxis.categories.push(item.zoneName);
            		historyCountChartOptions.series[0].data.push({y : parseInt(item.count), color:'#'+User.$colors[i]});
            		
            	}
				html_time += "</ol>";
				html_count += "</ol>";
				$('#history-view-time').html(html_time);
				$('#history-view-count').html(html_count);
				
				User.$timeChart = new Highcharts.Chart(historyTimeChartOptions);
				User.$countChart = new Highcharts.Chart(historyCountChartOptions);
				
				$("#history-time-selectable", "#history-view").selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							var ix = $( "#history-time-selectable li" ).index( this );
							var data = User.$timeChart.series[0].data[ix];
							if(data != undefined){
								data.select();
							}
							User.$timeChart.redraw();
							
						});		
					}
				});
				
				if(parent != undefined){
					var newheight = Math.max( window.document.body.scrollHeight, window.document.body.offsetHeight, window.document.documentElement.clientHeight, window.document.documentElement.scrollHeight, window.document.documentElement.offsetHeight );
			        parent.User.resizeIframeHeight(newheight+50);
				}
			}
		});
	}
	
	
};