var Service = {
	$plan : null, $plans : null,	
	$tag : null, $tags : null,
	$day : null, 
	init : function(){
		var html = '<table width="98%" cellpadding="10px" cellspacing="10px">';
		html += '<tr>';
		html += '	<td style="height:20px">';
		html += '		<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.service.form.date+'</label>';
		html += '			<input type="text" id="day" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/>';
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
		html += '<th class="first" rowspan="2">'+$.rtls.service.list.head[8]+'</th>';
		html += '<th rowspan="2">'+$.rtls.service.list.head[2]+'</th>';
		html += '<th rowspan="2">'+$.rtls.service.list.head[3]+'</th>';
		html += '<th rowspan="2">'+$.rtls.service.list.head[4]+'</th>';
		html += '<th rowspan="2">'+$.rtls.service.list.head[5]+'</th>';
		html += '<th colspan=9>'+$.rtls.service.list.head[6]+'</th>';
		html += '</tr>';
		html += '<tr>';
		html +='<th>TOA SIZE LOW</th>';
		html +='<th>RANGE FILTER</th>';
		html +='<th>RATIO FILTER</th>';
		html +='<th>SPEED FILTER</th>';
		html +='<th>CALCUATION FAIL</th>';
		html +='<th>MAP FILTER LOSE</th>';
		html +='<th>MAP SCALE OVER</th>';
		html +='<th>MAP FILTER ERROR</th>';
		html +='<th>ETC</th>';
		html += '</tr>';
		$("#items thead").html(html);
		$("#day").datepicker({
			onSelect: function(selectedDate) {
				Service.$day = selectedDate;
			}
        });
		this.$day = new Date().format('yyyy-MM-dd');
		$("#day").val(this.$day);
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
	        				var html = "<ol id='plan-selectable' class='ui-selectable'>";
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
			Service.getTimeChart();
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
					$('#splan-selectable').append("<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_area.png' style='width:16px; height:16px'/> " +item.name+"</li>");
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
            	Service.getTimeChart();
			}
		});
		
	},
	getTimeChart : function(){
		$('#items tbody').html("<tr><td colspan='15' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/service.json?action=get.service.chart.time",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Service.$plan == null ? 0 :  Service.$plan.planId,
            	"euid" : $("#tagEuid").val(),
            	"day" : Service.$day == null ? '' : Service.$day
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#items tbody').html('');
            	var item;
            	var html = '';
            	var sumTotalCount =0, sumSuccessCount = 0, sumFailCount=0, sumPercent = 0;
            	var sumErrorCase1 = 0, sumErrorCase2 = 0, sumErrorCase3 = 0, sumErrorCase4 = 0, sumErrorCase5 = 0, sumErrorCase6 = 0, sumErrorCase7 = 0, sumErrorCase8 = 0, sumErrorCaseETC = 0;
				for(var i=0; i < data.items.length; i++){
            		item = data.items[i];
            		sumTotalCount += parseInt(item.totalCount);
            		sumSuccessCount += parseInt(item.successCount);
            		sumFailCount += parseInt(item.failCount);
            		sumPercent += parseFloat(item.percent);
            		html = "<tr>";
					html += "<td>"+item.time+""+$.rtls.service.form.time+"</td>";
					html += "<td>"+item.totalCount+"</td>";
					html += "<td>"+item.successCount+"</td>";
					html += "<td>"+item.failCount+"</td>";
					html += "<td style='font-weight:bold'>"+parseFloat(item.percent).toFixed(2)+"%</td>";
					var errorCase1 = 0, errorCase2 = 0, errorCase3 = 0, errorCase4 = 0, errorCase5 = 0, errorCase6 = 0, errorCase7 = 0, errorCase8 = 0, errorCaseETC = 0;
					var errorCase;
					for(var j=0; j < item.errorCases.length; j++){
						errorCase = item.errorCases[j];
						if(errorCase.errorCase == 1){
							errorCase1 = parseInt(errorCase.count);
							sumErrorCase1 += errorCase1;
						}else if(errorCase.errorCase == 2){
							errorCase2 = parseInt(errorCase.count);
							sumErrorCase2 += errorCase2;
						}else if(errorCase.errorCase == 3){
							errorCase3 = parseInt(errorCase.count);
							sumErrorCase3 += errorCase3;
						}else if(errorCase.errorCase == 4){
							errorCase4 = parseInt(errorCase.count);
							sumErrorCase4 += errorCase4;
						}else if(errorCase.errorCase == 5){
							errorCase5 = parseInt(errorCase.count);
							sumErrorCase5 += errorCase5;
						}else if(errorCase.errorCase == 6){
							errorCase6 = parseInt(errorCase.count);
							sumErrorCase6 += errorCase6;
						}else if(errorCase.errorCase == 7){
							errorCase7 = parseInt(errorCase.count);
							sumErrorCase7 += errorCase7;
						}else if(errorCase.errorCase == 8){
							errorCase8 += parseInt(errorCase.count);
							sumErrorCase8 += errorCase8;
						}else{
							errorCaseETC += parseInt(errorCase.count);
							sumErrorCaseETC += errorCaseETC;
						}
					}
					html += "<td>"+errorCase1+"</td>";
					html += "<td>"+errorCase2+"</td>";
					html += "<td>"+errorCase3+"</td>";
					html += "<td>"+errorCase4+"</td>";
					html += "<td>"+errorCase5+"</td>";
					html += "<td>"+errorCase6+"</td>";
					html += "<td>"+errorCase7+"</td>";
					html += "<td>"+errorCase8+"</td>";
					html += "<td>"+errorCaseETC+"</td>";
					html += "</tr>";
					$('#items tbody').append(html);
            	}
				html = "<tr>";
				html += "<th>"+$.rtls.service.list.head[7]+"</td>";
				html += "<th>"+sumTotalCount+"</th>";
				html += "<th>"+sumSuccessCount+"</th>";
				html += "<th>"+sumFailCount+"</th>";
				if(data.length > 0){
					html += "<th>"+(sumPercent/data.length).toFixed(2)+"%</th>";
				}else{
					html += "<th>0.0%</th>";
				}
				
				html += "<th>"+sumErrorCase1+"</th>";
				html += "<th>"+sumErrorCase2+"</th>";
				html += "<th>"+sumErrorCase3+"</th>";
				html += "<th>"+sumErrorCase4+"</th>";
				html += "<th>"+sumErrorCase5+"</th>";
				html += "<th>"+sumErrorCase6+"</th>";
				html += "<th>"+sumErrorCase7+"</th>";
				html += "<th>"+sumErrorCase8+"</th>";
				html += "<th>"+sumErrorCaseETC+"</th>";
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