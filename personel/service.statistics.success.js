var Service = {
	$plan : null, $plans : null,	
	$startDay : null, $endDay : null,
	init : function(){
		var html ='<table width="98%" cellpadding="10px" cellspacing="10px">';
		html +='<tr>';
		html +='	<td  height="20">';
		html +='		<div id="search-fields">';
		html +='		<p>';
		html +='			<label>'+$.rtls.service.form.date+'</label>';
		html +='			<input type="text" id="startDay" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/>';
		html +='			<input type="text" id="startTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
		html +='			~';
		html +='			<input type="text" id="endDay" value="" class="input-readonly" style="width: 80px; text-align: center;"  readonly="readonly"/>';
		html +='			<input type="text" id="endTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
		html +='           	<button id="but-search">'+$.rtls.service.button.search+'</button>';
		html +='		</p>';
		html +='		</div>';
		html +='	</td>';
		html +='</tr>';
		html +='<tr>';
		html +='   	<td height="20">';
		html +='   		<div id="search-fields">';
		html +='   			<label>'+$.rtls.service.form.plan+'</label>';
		html +='			<ol id="splan-selectable" class="ui-selectable">';
		html +='    		</ol>';
		html +='    	</div>';
		html +='	</td>';
		html +='</tr>';
		html +='</table>';
		$("#search-form").html(html);
		
		html ='<tr>';
		html +='<th class="first" rowspan="2">'+$.rtls.service.list.head[0]+'</th>';
		html +='<th rowspan="2">'+$.rtls.service.list.head[1]+'</th>';
		html +='<th rowspan="2">'+$.rtls.service.list.head[2]+'</th>';
		html +='<th rowspan="2">'+$.rtls.service.list.head[3]+'</th>';
		html +='<th rowspan="2">'+$.rtls.service.list.head[4]+'</th>';
		html +='<th rowspan="2">'+$.rtls.service.list.head[5]+'</th>';
		html +='<th colspan=9>'+$.rtls.service.list.head[6]+'</th>';
		html +='</tr>';
		html +='<tr>';
		html +='<th>TOA SIZE LOW</th>';
		html +='<th>RANGE FILTER</th>';
		html +='<th>RATIO FILTER</th>';
		html +='<th>SPEED FILTER</th>';
		html +='<th>CALCUATION FAIL</th>';
		html +='<th>MAP FILTER LOSE</th>';
		html +='<th>MAP SCALE OVER</th>';
		html +='<th>MAP FILTER ERROR</th>';
		html +='<th>ETC</th>';
		html +='</tr>';
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
		$("#but-search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			Service.getSuccessChart();
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
				$('#splan-selectable').append("<li class='ui-widget-content ui-selectee ui-selected'><img src='/resources/commons/images/map/icon_area.png' style='width:16px; height:16px'/> "+$.rtls.service.form.full+"</li>");
            	for(var i=0; i < Service.$plans.length; i++){
					item = Service.$plans[i];
					$('#splan-selectable').append("<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_area.png'  style='width:16px; height:16px'/> " +item.name+"</li>");
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
            	Service.getSuccessChart();
			}
		});
		
	},
	getSuccessChart : function(){
		$('#items tbody').html("<tr><td colspan='15' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
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
			url: "/service/service.json?action=get.service.chart.success",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Service.$plan == null ? 0 :  Service.$plan.planId,
            	"startDay" : Service.$startDay == null ? '' : Service.$startDay,
                "endDay" : Service.$endDay == null ? '' : Service.$endDay,
        		"startTime" : startTime,
                "endTime" : endTime
                
        				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#items tbody').html('');
            	var item;
            	var itemSize = data.items.length;
            	var html = '';
            	var sumTotalCount =0, sumSuccessCount = 0, sumFailCount=0, sumPercent = 0;
            	var sumErrorCase1 = 0, sumErrorCase2 = 0, sumErrorCase3 = 0, sumErrorCase4 = 0, sumErrorCase5 = 0, sumErrorCase6 = 0, sumErrorCase7 = 0, sumErrorCase8 = 0, sumErrorCase9 = 0;
				for(var i=0; i < itemSize; i++){
            		item = data.items[i];
            		sumTotalCount += parseInt(item.totalCount);
            		sumSuccessCount += parseInt(item.successCount);
            		sumFailCount += parseInt(item.failCount);
            		sumPercent += parseFloat(item.percent);
            		sumErrorCase1 += item.errorCase1;
					sumErrorCase2 += item.errorCase2;
					sumErrorCase3 += item.errorCase3;
					sumErrorCase4 += item.errorCase4;
					sumErrorCase5 += item.errorCase5;
					sumErrorCase6 += item.errorCase6;
					sumErrorCase7 += item.errorCase7;
					sumErrorCase8 += item.errorCase8;
					sumErrorCase9 += item.errorCase9;
					
            		html = "<tr>";
					html += "<td>"+(i + 1)+"</td>";
					html += "<td style='font-weight:bold'>"+item.euid+"</td>";
					html += "<td>"+item.totalCount+"</td>";
					html += "<td>"+item.successCount+"</td>";
					html += "<td>"+item.failCount+"</td>";
					html += "<td style='font-weight:bold'>"+parseFloat(item.percent).toFixed(2)+"%</td>";
					html += "<td>"+item.errorCase1+"</td>";
					html += "<td>"+item.errorCase2+"</td>";
					html += "<td>"+item.errorCase3+"</td>";
					html += "<td>"+item.errorCase4+"</td>";
					html += "<td>"+item.errorCase5+"</td>";
					html += "<td>"+item.errorCase6+"</td>";
					html += "<td>"+item.errorCase7+"</td>";
					html += "<td>"+item.errorCase8+"</td>";
					html += "<td>"+item.errorCase9+"</td>";
					html += "</tr>";
					$('#items tbody').append(html);
            	}
				html = "<tr>";
				html += "<th>"+$.rtls.service.list.head[7]+"</td>";
				html += "<th></th>";
				html += "<th>"+sumTotalCount+"</th>";
				html += "<th>"+sumSuccessCount+"</th>";
				html += "<th>"+sumFailCount+"</th>";
				if(itemSize > 0){
					html += "<th style='font-weight:bold'>"+(sumPercent/itemSize).toFixed(2)+"%</th>";
				}else{
					html += "<th style='font-weight:bold'>0%</th>";
				}
				html += "<th>"+sumErrorCase1+"</th>";
				html += "<th>"+sumErrorCase2+"</th>";
				html += "<th>"+sumErrorCase3+"</th>";
				html += "<th>"+sumErrorCase4+"</th>";
				html += "<th>"+sumErrorCase5+"</th>";
				html += "<th>"+sumErrorCase6+"</th>";
				html += "<th>"+sumErrorCase7+"</th>";
				html += "<th>"+sumErrorCase8+"</th>";
				html += "<th>"+sumErrorCase9+"</th>";
				html += "</tr>";
				$('#items tbody').append(html);
				if(parent != undefined){
					var newheight = Math.max( window.document.body.scrollHeight, window.document.body.offsetHeight, window.document.documentElement.clientHeight, window.document.documentElement.scrollHeight, window.document.documentElement.offsetHeight );
			        parent.Service.resizeIframeHeight(newheight+50);
				}
			}
		});
		
		
	}
	
};