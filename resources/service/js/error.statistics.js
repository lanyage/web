var successChartOptions = {
	chart: {
		renderTo: 'success-chart',
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false
	},
	credits: {
		enable : false,
        text: '',
        href: 'http://www.ido-link.com'
    }, 
	title: {
		text: null
	},
	tooltip: {
		formatter: function() {
			return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 1) +' %';
		}
	},
	plotOptions: {
		pie: {
			allowPointSelect: true,
			cursor: 'pointer',
			dataLabels: {
				enabled: true,
				color: '#000000',
				connectorColor: '#000000',
				formatter: function() {
					return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 1) +' %';
				}
			}
		}
	},
	series: []
};
var errorChartOptions = {
	chart: {
		renderTo: 'error-chart',
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
            text: $.rtls.error.chart.error
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        
    },
    series: [{
        name: $.rtls.error.chart.error,
        data: [],
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            x: -20,
            y: 5,
            style: {
                fontSize: '12px',
                textShadow: '0 0 3px black'
            }
        }
    }]
 
};

var Error = {
	$colors : ['B0171F', '00008B', '00BFFF', '00C957', 'FF8C69', 'EEC900', '00FF00', '000FF', 'FF0000', 'E066FF'],
	$item : null, $items : null,
	$plan : null, $plans : null,	
	$zone : null, $zones : null,	
	$tag : null, $tags : null,
	$startDay : null, $endDay : null,
	init : function(){
		$('.con_box .lnb').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[3]+'</span>');
		var html = '<table width="98%" cellpadding="10px" cellspacing="10px">';
		html += '<tr>';
		html += '	<td style="height:20px">';
		html += '		<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.error.form.time+'</label>';
		html += '			<input type="text" id="startDay" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/>';
		html += '			<input type="text" id="startTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
		html += '			~';
		html += '			<input type="text" id="endDay" value="" class="input-readonly" style="width: 80px; text-align: center;"  readonly="readonly"/>';
		html += '           <input type="text" id="endTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
		html += '			<button id="but-search">'+$.rtls.error.button.search+'</button>';
		html += '		</p>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td style="height:20px">';
		html += '   		<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.error.form.tag+'</label>';
		html += '			<input type="text" id="tagEuid" value="" class="input-readonly" style="text-align: center;"/>';
		html += '			<button id="but-tag">'+$.rtls.error.button.select+'</button>';
		html += '		</p>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '   	<td style="height:20px">';
		html += '  		<div id="search-fields">';
		html += '   			<label>'+$.rtls.error.form.plan+'</label>';
		html += '			<ol id="splan-selectable">';
		html += '    		</ol>';
		html += '    	</div>';
		html += '	</td>';
		html += '</tr>';
		html += '</table>';
		$("#search-form").html(html);
		$("#startDay").datepicker({
			onSelect: function(selectedDate) {
				Error.$startDay = selectedDate;
			}
        });
		$('#startTime').timepicker({
			showTime : false,
			hourGrid: 2,
			minuteGrid: 5
		});
		$("#endDay").datepicker({
			onSelect: function(selectedDate) {
				Error.$endDay = selectedDate;
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
	            	Error.$tag = null;
	            	Error.$tags = data.tags;
	            	$("#dialog-tag").dialog({
	        			title:$.rtls.error.dialog.title[1],
	        			autoOpen: false,
	        			height: 400,
	        			width: 600,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					if(Error.$tag != null){
	        						$("#tagEuid").val(Error.$tag.euid);
	        						$("#dialog-tag").dialog( "close" );
	        					}else{
	        						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.error.message.tagselect);
	        						
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
										Error.$tag = Error.$tags[$( "#plan-selectable li" ).index( this )];
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
			Error._startNum = 0;
			Error.getChart();
			return false; 
		});
		this.getPlans();
		
	},
	getPlans : function(){
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
            	Error.$plans = data.plans;
            	var item;
				$('#splan-selectable').append("<li class='ui-widget-content ui-selectee ui-selected'><img src='/resources/commons/images/map/icon_area.png' style='width:16px; height:16px'/> "+$.rtls.service.form.full+"</li>");
            	for(var i=0; i < Error.$plans.length; i++){
					item = Error.$plans[i];
					$('#splan-selectable').append("<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_area.png' style='width:16px; height:16px'/> " +item.name+"</li>");
				}
            	$("#splan-selectable").selectable({
        			stop: function() {
        				$( ".ui-selected", this ).each(function() {
        					var ix = $( "#splan-selectable li" ).index( this );
        					if(ix == 0){
        						Error.$plan = null;	
        					}else{
        						Error.$plan = Error.$plans[ix-1];	
        					}
        					
        					
        				});		
        			}
        		});
            	Error.getChart();
			}
		});
		
	},
	getZones : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/zone.json?action=get.zones",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Error.$zones = data.zones;
            	var item;
				$('#szone-selectable').append("<li class='ui-widget-content ui-selectee ui-selected'><img src='/commons/images/grid/icon$plan20.png'/> "+$.rtls.service.form.full+"</li>");
            	for(var i=0; i < Error.$zones.length; i++){
					item = Error.$zones[i];
					$('#szone-selectable').append("<li class='ui-widget-content'><img src='/commons/images/grid/icon$plan20.png'/> " +item.name+"</li>");
				}
            	$("#szone-selectable").selectable({
        			stop: function() {
        				$( ".ui-selected", this ).each(function() {
        					var ix = $( "#szone-selectable li" ).index( this );
        					if(ix == 0){
        						Error.$zone = null;	
        					}else{
        						Error.$zone = Error.$zones[ix-1];	
        					}
        					
        					
        				});		
        			}
        		});
            	Error.getChart();
			}
		});
		
	},
	
	getChart : function(){
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
			url: "/service/error.json?action=get.error.chart",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Error.$plan == null ? 0 :  Error.$plan.planId,
            	"startNum" : Error._startNum,
				"scaleNum" : Error._scaleNum,
                "startDay" : Error.$startDay == null ? '' : Error.$startDay,
                "endDay" : Error.$endDay == null ? '' : Error.$endDay,
        		"startTime" : startTime,
                "endTime" : endTime,
                "euid" : $("#tagEuid").val()
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	successChartOptions.series = [];
            	successChartOptions.series.push({
					type: 'pie',
					name: $.rtls.error.chart.title.success,
					data: [
						[$.rtls.error.form.success, parseFloat(data.successPercent)],
						{
							name: $.rtls.error.form.fail,    
							y: parseFloat(data.failPercent),
							sliced: true,
							selected: true
						}
					]
				});
            	new Highcharts.Chart(successChartOptions);
            	var html = "<ol id='success-selectable' class='ui-selectable'>";	
            	html += "<li class='ui-widget-content'><b>"+$.rtls.error.form.total+"</b> : "+data.totalCount+"<b> "+$.rtls.error.form.count+"</b></li>";
            	html += "<li class='ui-widget-content'><b>"+$.rtls.error.form.success+"</b> : "+data.successCount+"<b> "+$.rtls.error.form.count+"</b></li>";
            	html += "<li class='ui-widget-content'><b>"+$.rtls.error.form.fail+"</b> : "+data.failCount+"<b> "+$.rtls.error.form.count+"</b></li>";
            	html += "</ol>";
            	$('#success-view').html(html);
            	
            	errorChartOptions.xAxis.categories = [];
            	errorChartOptions.series[0].data = [];
            	var error;
            	html = "<ol id='error-selectable' class='ui-selectable'>";	
            	for(var i=0; i < data.errorCases.length ; i++){
            		error = data.errorCases[i];
            		if(error.errorCase == 0){
            			html += "<li class='ui-widget-content'><b>ETC</b> : "+error.count+" <b>"+$.rtls.error.form.count+"</b></li>";
                		errorChartOptions.xAxis.categories.push('ETC');
                		errorChartOptions.series[0].data.push({y : parseFloat(error.percent), color:'#'+Error.$colors[i]});	
            		}else{
            			html += "<li class='ui-widget-content'><b>"+error.errorMessage+"</b> : "+error.count+" <b>"+$.rtls.error.form.count+"</b></li>";
                		errorChartOptions.xAxis.categories.push(error.errorMessage);
                		errorChartOptions.series[0].data.push({y : parseFloat(error.percent), color:'#'+Error.$colors[i]});
            		}
            		
            		
            	}
            	html += "</ol>";
            	new Highcharts.Chart(errorChartOptions);
            	$('#error-view').html(html);
			}
		});
	}
	
	
};