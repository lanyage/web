var Service = {
	$plan : null, $plans : null,	
	$tag : null, $tags : null,
	$rap : null, $raps : new HashMap(),
	$startDay : null, $endDay : null,
	init : function(){
		var html = '<table width="98%" cellpadding="10px" cellspacing="10px">';
		html += '<tr>';
		html += '	<td style="height:20px">';
		html += '		<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.service.form.date+'</label>';
		html += '			<input type="text" id="startDay" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/>';
		html += '			<input type="text" id="startTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
		html += '			~';
		html += '			<input type="text" id="endDay" value="" class="input-readonly" style="width: 80px; text-align: center;"  readonly="readonly"/>';
		html += '           <input type="text" id="endTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
		html += '			<button id="but-search">'+$.rtls.service.button.search+'</button>';
		html += '		</p>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td style="height:20px">';
		html += '   		<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.service.form.tag+'</label>';
		html += '			<input type="text" id="tagEuid" value="" class="input-readonly" style="text-align: center;"/>';
		html += '			<button id="but-tag">'+$.rtls.service.button.select+'</button>';
		html += '		</p>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '   	<td style="height:20px">';
		html += '  		<div id="search-fields">';
		html += '   			<label>'+$.rtls.service.form.plan+'</label>';
		html += '			<ol id="splan-selectable" class="ui-selectable">';
		html += '    		</ol>';
		html += '    	</div>';
		html += '	</td>';
		html += '</tr>';
		html += '</table>';
		$("#search-form").html(html);
		html = '<tr>';
		html += '<th colspan=3>RAP</th>';
		html += '<th rowspan="2">'+$.rtls.service.list.head[2]+'</th>';
		html += '<th rowspan="2">'+$.rtls.service.list.head[3]+'</th>';
		html += '<th rowspan="2">'+$.rtls.service.list.head[4]+'</th>';
		html += '<th rowspan="2">'+$.rtls.service.list.head[5]+'</th>';
		html += '</tr>';
		html += '<tr>';
		html += '<th>EUID</th>';
		html += '<th>IP</th>';
		html += '<th>RCM MODE</th>';
		html += '</tr>';
		$("#items thead").html(html);
		
		$("#startDay").datepicker({
			onSelect: function(selectedDate) {
				Service.$startDay = selectedDate;
			}
        });
		$('#startTime').timepicker({
			showTime : false,
			hourGrid: 2,
			minuteGrid: 5
		});
		$("#endDay").datepicker({
			onSelect: function(selectedDate) {
				Service.$endDay = selectedDate;
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
	            	Service.$tag = null;
	            	Service.$tags = data.tags;
	            	$("#dialog-tag").dialog({
	        			title:$.rtls.service.dialog.title[0],
	        			autoOpen: false,
	        			height: 450,
	        			width: 630,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					if(Service.$tag != null){
	        						$("#tagEuid").val(Service.$tag.euid);
	        						$("#dialog-tag").dialog( "close" );
	        					}else{
	        						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.service.message.tagselect);
	        						
	        					}
	        					
	        				},
	        			},{
	        				text : $.rtls.commons.button.cancel,
	        				click: function() {
	        					$( this ).dialog( "close" );
	        				}
	        			}],
	        			open: function() {
	        				var html = "<ol id='plan-selectable'>";
							for(var i=0; i < data.tags.length; i++){
								html += "<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_tag.gif' style='float:left; padding-right:3px'/>"+data.tags[i].euid+"</li>";
							}	
							html += "</ol>";
							$(this).html(html);
							$("#plan-selectable", this).selectable({
								stop: function() {
									$( ".ui-selected", this ).each(function() {
										Service.$tag = Service.$tags[$( "#plan-selectable li" ).index( this )];
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
			Service.getRAPChart();
			return false; 
		});
		
		Service.getPlans();
	},
	getTime : function(milliseconds){
		var d = new Date(milliseconds);
		var yy = d.getFullYear();
		var mm = d.getMonth();
		var dd = d.getDate();
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		var ms = d.getMilliseconds();
		if(h < 10) h = "0"+h;
		if(m < 10) m = "0"+m;
		if(s < 10) s = "0"+s;
		if(ms < 100) ms = "0"+ms;
		return yy+"-"+mm+"-"+dd+" "+h+":"+m+":"+s;
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
            	Service.$plans = data.plans;
            	var item;
				$('#splan-selectable').append("<li class='ui-widget-content ui-selectee ui-selected'><i id='all' class='icon-list-ul'></i> 全部</li>");
            	for(var i=0; i < Service.$plans.length; i++){
					item = Service.$plans[i];
					$('#splan-selectable').append("<li class='ui-widget-content'><i id='all' class='icon-list-ul'></i> " +item.name+"</li>");
				}
            	$("#splan-selectable").selectable({
        			stop: function() {
        				$( ".ui-selected", this ).each(function() {
        					var ix = $( "#splan-selectable li" ).index( this );
        					if(ix == 0){
        						Service.$plan = null;	
        					}else{
        						Service.$plan = Service.$plans[ix-1];	
        					}
        					
        					
        				});		
        			}
        		});
            	Service.getRaps();
			}
		});
		
	},
	getRaps : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/rap.json?action=get.raps",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	for(var i=0; i < data.raps.length; i++){
            		Service.$raps.put(data.raps[i].euidSrc, data.raps[i]);
            	}
            	Service.getRAPChart();
			}
		});
		
	},
	getRAPChart : function(){
		$('#items tbody').html("<tr><td colspan='7' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
		var startTime =  $.trim($("#startTime").val());
		var endTime =  $.trim($("#endTime").val());
		if(!$.string(startTime).blank()){
			if(startTime.length == 4) startTime = '0'+startTime;
		}
		if(!$.string(endTime).blank()){
			if(endTime.length == 4) endTime = '0'+endTime;
		}
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/service.json?action=get.service.chart.rap",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Service.$plan == null ? 0 :  Service.$plan.planId,
    	        "startDay" : Service.$startDay == null ? '' : Service.$startDay,
    	        "endDay" : Service.$endDay == null ? '' : Service.$endDay,
    	        "startTime" : startTime,
    	        "endTime" : endTime,
            	"euid" : $("#tagEuid").val()
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#items tbody').html('');
            	var item , rap;
            	var html = '';
            	var sumTotalCount =0, sumSuccessCount = 0, sumFailCount=0, sumPercent = 0;
            	for(var i=0; i < data.items.length; i++){
            		item = data.items[i];
            		
            		rap = Service.$raps.get(item.rapEuid);
            		if(rap != null){
            			sumTotalCount += parseInt(item.totalCount);
                		sumSuccessCount += parseInt(item.successCount);
                		sumFailCount += parseInt(item.failCount);
                		sumPercent += parseFloat(item.percent);
                		
                		html = "<tr>";
    					html += "<td>"+item.rapEuid+"</td>";
    					html += "<td>"+rap.ip+"</td>";
    					if(rap.rcmMode == 1){
    						html += "<td>Master</td>";
    					}else{
    						html += "<td>Slave</td>";
    					}
    					html += "<td>"+item.totalCount+"</td>";
    					html += "<td>"+item.successCount+"</td>";
    					html += "<td>"+item.failCount+"</td>";
    					html += "<td style='font-weight:bold'>"+parseFloat(item.percent).toFixed(2)+"%</td>";
    					html += "</tr>";
    					$('#items tbody').append(html);
            		}
            		
            	}
				html = "<tr>";
				html += "<th colspan=3>"+$.rtls.service.list.head[7]+"</th>";
				html += "<th>"+sumTotalCount+"</th>";
				html += "<th>"+sumSuccessCount+"</th>";
				html += "<th>"+sumFailCount+"</th>";
				if(data.length > 0){
					html += "<th>"+(sumPercent/data.length).toFixed(2)+"%</th>";
				}else{
					html += "<th>0.0%</th>";
				}
				html += "</tr>";
				$('#items tfoot').html(html);
				
				if(parent != undefined){
//					var newheight = Math.max( window.document.body.scrollHeight, window.document.body.offsetHeight, window.document.documentElement.clientHeight, window.document.documentElement.scrollHeight, window.document.documentElement.offsetHeight );
//			        parent.Service.resizeIframeHeight(newheight+50);
					var newheight = $(".tb_sec").height();
					parent.Service.resizeIframeHeight(newheight+137); //黑色透明背景的高度是table的高度加上search-form的高度
				}
			}
		});
		
		
	}
	
};