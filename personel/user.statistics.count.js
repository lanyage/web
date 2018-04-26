var User = {
	$zones : [],
	$startDay : null, $endDay : null,
	init : function(){
		var html = '<table width="98%" cellpadding="10px" cellspacing="10px">';
		html += '<tr>';
		html += '	<td  height="20">';
		html += '		<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.user.form.date+'</label>';
		html += '			<input type="text" id="startDay" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/>';
		html += '			~';
		html += '			<input type="text" id="endDay" value="" class="input-readonly" style="width: 80px; text-align: center;"  readonly="readonly"/>';
		html += '			<button id="but-search">'+$.rtls.user.button.search+'</button>';
		html += '		</p>';
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
		$("#but-search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			User.getZoneCountChart();
			return false; 
		});
		User.getZones();
		
	},
	getWasTime : function(milliseconds){
		var d = parseInt(milliseconds);
		var ss = Math.round(d / 1000);
		var m = Math.round(ss/60);
		var s = Math.round(ss%60);
		var h = Math.round(m/60);
		var d = 0; 
		if(h > 0){
			m  = Math.round(m%60);
			if(h > 24){
				d = Math.round(h/24);
				h = Math.round(h%24);
			}
			
		}
		if(h < 10) h = "0"+h;
		if(m < 10) m = "0"+m;
		if(s < 10) s = "0"+s;
		if(d > 0){
			return d+""+$.rtls.user.form.day+""+h+":"+m+":"+s+"";
		}else if(h > 0){
			return h+":"+m+":"+s+"";
		}else if(m > 0){
			return m+":"+s+"";
		}else{
			return s+"";	
		}
		
	},
	getZones : function(){
		$.ajax({
			async : false,
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
            	User.$zones = data.zones;
            	var html = '<tr>';
        		html += '<th class="first" rowspan="2">'+$.rtls.user.statistics.head[0]+'</th>';
        		html += '<th rowspan="2">'+$.rtls.user.statistics.head[1]+'</th>';
        		html += '<th rowspan="2">'+$.rtls.user.statistics.head[2]+'</th>';
        		html += '<th rowspan="2">'+$.rtls.user.statistics.head[3]+'</th>';
        		html += '<th colspan="'+User.$zones.length+'">'+$.rtls.user.statistics.head[4]+'</th>';
        		html += '</tr>';
        		html += '<tr>';
        		for(var i=0; i < User.$zones.length; i++){
        			html += '<th>'+User.$zones[i].name+'</th>';
        		}
        		html += '</tr>';
        		$('#items thead').html(html);
        		
        		User.getZoneCountChart();
			}
		});
	},
	getZoneCountChart : function(){
		$('#items tbody').html("<tr><td colspan='21' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/history.json?action=get.history.user.chart",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"startDay" : User.$startDay == null ? '' : User.$startDay,
                "endDay" : User.$endDay == null ? '' : User.$endDay
        		
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#items tbody').html('');
            	var sumTotalCount = 0, sumTotalWasTime = 0;
            	var sumCounts = [];
            	var sumWasTimes = [];
            	for(var j=0; j < User.$zones.length; j++){
            		sumCounts[j] = 0;
            		sumWasTimes[j] = 0;
            	}
            	var item;
            	var html = '';
            	for(var i=0; i < data.users.length; i++){
            		item = data.users[i];
            		html = "<tr>";
					html += "<td>"+(i + 1)+"</td>";
					html += "<td style='font-weight:bold'>"+item.name+"</td>";
					html += "<td style='font-weight:bold'><span id='sumCount_"+item.userId+"'>0</span></td>";
					html += "<td style='font-weight:bold'><span id='sumWasTime_"+item.userId+"'>0</span></td>";
					for(var j=0; j < User.$zones.length; j++){
						html += "<td><span id='zone_"+item.userId+"_"+User.$zones[j].zoneId+"'>0</span></td>";
					}
					html += "</tr>";
					$('#items tbody').append(html);
					
					var count = 0 , sumCount = 0, wasTime = 0, sumWasTime = 0;
					for(var j=0; j < item.historys.length; j++){
						count = parseInt(item.historys[j].count);
						wasTime = parseInt(item.historys[j].wasTime);
						sumCount += count;
						sumWasTime += wasTime;
						$("#zone_"+item.userId+"_"+item.historys[j].zoneId).html(count+''+$.rtls.user.form.count+' : '+User.getWasTime(wasTime)+'');
						for(var k=0; k < User.$zones.length; k++){
							if(item.historys[j].zoneId == User.$zones[k].zoneId){
								sumCounts[k] = sumCounts[k] + count; 
								sumWasTimes[k] = sumWasTimes[k] + wasTime;
								break;
							}
						}
	            	}
					sumTotalCount += sumCount;
					sumTotalWasTime += sumWasTime;
					$('#sumCount_'+item.userId).html(sumCount );
					$('#sumWasTime_'+item.userId).html(User.getWasTime(sumWasTime));
            	}
				html = "<tr>";
				html += "<th>"+$.rtls.user.statistics.head[5]+"</td>";
				html += "<th></th>";
				html += "<th>"+sumTotalCount+"</th>";
				html += "<th>"+User.getWasTime(sumTotalWasTime)+"</th>";
				for(var j=0; j < sumCounts.length; j++){
					html += "<th>"+sumCounts[j]+""+$.rtls.user.form.count+" : "+User.getWasTime(sumWasTimes[j])+"</th>";
				}
				html += "</tr>";
				$('#items tbody').append(html);
				
				if(parent != undefined){
					var newheight = Math.max( window.document.body.scrollHeight, window.document.body.offsetHeight, window.document.documentElement.clientHeight, window.document.documentElement.scrollHeight, window.document.documentElement.offsetHeight );
			        parent.User.resizeIframeHeight(newheight+50);
				}
			}
		});
		
		
	}
	
};