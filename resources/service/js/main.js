var Main = {
	$plans : new HashMap(),$raps : new HashMap(), $tags : new HashMap(),
	init : function(){
		this.getPlans();
		this.getRaps();
		this.getTags();
		this.getTagPositioning();
		this.getRapSync();
		this.initNotify();
	},
	initNotify : function(){
		var sock = new SockJS('/rtls/sockjs');
	  	var client = Stomp.over(sock);
	  	client.debug = null;
		client.connect({}, function(frame) {
	    	client.subscribe("/queue/report", function(message) {
				var data  = $.parseJSON(message.body);
				if(data.eventType == '6'){
					var syncs = data.syncs, sync = {}, rate;
					for(var i=0; i < syncs.length; i++){
						sync = syncs[i];
						rate = (sync.successPacket*100)/sync.totalPacket;
						$('#rxLevel_'+sync.masterEuid+'_'+data.rapEuid).html(parseFloat(sync.rxLevel).toFixed(2));
						$('#syncClock_'+sync.masterEuid+'_'+data.rapEuid).html(sync.syncClock);
						$('#success_'+sync.masterEuid+'_'+data.rapEuid).html(rate.toFixed(2)+'%');
					}
				}
	    	});
	    	//1.1.4.6中新加入
	    	client.subscribe("/queue/position", function(message) {
				var data  = $.parseJSON(message.body);
				if(data.eventType == '1'){
					var src = $('#tag_'+data.tagEuid).find('img:first').attr('src');
					if(data.buttonEvent == 1){
						if(src.indexOf('.png') != -1){
							if(data.tagType == 1){
								$('#tag_'+data.tagEuid).find('img:first').attr('src', '/resources/commons/images/map/icon_tag_fixed_alarm.gif');
							}else if(data.tagType == 2){
								$('#tag_'+data.tagEuid).find('img:first').attr('src', '/resources/commons/images/map/icon_tag_move_alarm.gif');
							}else if(data.tagType == 3){
								$('#tag_'+data.tagEuid).find('img:first').attr('src', '/resources/commons/images/map/icon_tag_card_alarm.gif');
							}
						}
					}else{
						if(src.indexOf('.gif') != -1){
							if(data.tagType == 1){
								$('#tag_'+data.tagEuid).find('img:first').attr('src', '/resources/commons/images/map/icon_tag_fixed.png');
							}else if(data.tagType == 2){
								$('#tag_'+data.tagEuid).find('img:first').attr('src', '/resources/commons/images/map/icon_tag_move.png');
							}else if(data.tagType == 3){
								$('#tag_'+data.tagEuid).find('img:first').attr('src', '/resources/commons/images/map/icon_tag_card.png');
							}
						}
					}
				}
	    	});	
	    });
	    sock.onclose = function(event) {
	    	Log.debug("sock.closed");
	    	
	    };
	 	$(window).bind('beforeunload',function(){
	    	if(client != null && client.connected){
	    		client.disconnect();
	    	}
	    });
	},
	getPlans : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/plan.json?action=get.plans",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : 0
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
        		for(var i=0; i <data.plans.length; i++){
					Main.$plans.put(data.plans[i].planId, data.plans[i]);
				}
			}
		});
		
	},
	getRaps : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/rap.json?action=get.rap.status",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : 0
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
        		var item, aliveCount =0, deadCount=0, normalCount =0, errorCount=0, otherCount = 0;
				for(var i=0; i <data.raps.length; i++){
					Main.$raps.put(data.raps[i].euidSrc, data.raps[i]);
					item = data.raps[i];
					if(item.status == 'alive'){
						aliveCount++;
					}else{
						deadCount++;
					}
					
					if(item.status == 'alive'){
						if(item.rcmMode != '1'){
    						if(item.masterStatus == '0'){
        						errorCount++;
        					}else{
        						normalCount++;
        					}
    					}else{
    						otherCount++;
    					}	
					}else{
						otherCount++;
					}
				}
				$('#rap-alive').html('RAP (活跃 : <span style="color:#00b4fa;font-weight:bold">'+aliveCount+'</span>'+$.rtls.tag.form.number+', 不工作 : <span style="color:#ff0800;font-weight:bold">'+deadCount+'</span>'+$.rtls.tag.form.number+')');
				$('#rap-error').html('RAP (正常 : <span style="color:#00b4fa;font-weight:bold">'+normalCount+'</span>'+$.rtls.tag.form.number+', 错误 : <span style="color:#ff0800;font-weight:bold">'+errorCount+'</span>'+$.rtls.tag.form.number+')');
				$('#rap-alive-chart').highcharts({
			        chart: {
			            plotBackgroundColor: null,
			            plotBorderWidth: 0,
			            plotShadow: false
			        },
			        credits: {
			    		enable : false,
			            text: '',
			            href: 'http://www.ido-link.com'
			        }, 
			    	title: {
			            text: 'Alive',
			            align: 'center',
			            verticalAlign: 'middle',
			            y: 50
			        },
			        tooltip: {
			            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			        },
			        plotOptions: {
			            pie: {
			                dataLabels: {
			                    enabled: true,
			                    distance: -50,
			                    style: {
			                        fontWeight: 'bold',
			                        color: 'white',
			                        textShadow: '0px 1px 2px black'
			                    }
			                },
			                startAngle: -90,
			                endAngle: 90,
			                center: ['50%', '75%']
			            }
			        },
			        series: [{
			            type: 'pie',
			            name: 'Alive',
			            innerSize: '50%',
			            data: [
			                ['Alive', aliveCount],
			                ['Dead', deadCount],
			            ]
			        }]
			    });
				
				$('#rap-error-chart').highcharts({
			        chart: {
			            plotBackgroundColor: null,
			            plotBorderWidth: 0,
			            plotShadow: false,
			           
			        },
			        colors: ['#7cb5ec',  '#f45b5b', '#434348', '#f7a35c', '#8085e9', '#90ed7d', '#e4d354', '#2b908f', '#f15c80', '#91e8e1'],
			        credits: {
			    		enable : false,
			            text: '',
			            href: 'http://www.ido-link.com'
			        }, 
			    	title: {
			            text: 'UWB Status',
			            align: 'center',
			            verticalAlign: 'middle',
			            y: 50
			        },
			        tooltip: {
			            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			        },
			        plotOptions: {
			            pie: {
			                dataLabels: {
			                    enabled: true,
			                    distance: -50,
			                    style: {
			                        fontWeight: 'bold',
			                        color: 'white',
			                        textShadow: '0px 1px 2px black'
			                    }
			                },
			                startAngle: -90,
			                endAngle: 90,
			                center: ['50%', '75%']
			            }
			        },
			        series: [{
			            type: 'pie',
			            name: 'UWB Status',
			            innerSize: '50%',
			            data: [
			                ['Normal', normalCount],
			                ['Error', errorCount],
			                {
			                    name: 'Dead',
			                    y: otherCount,
			                    dataLabels: {
			                        enabled: (otherCount == 0 ? false : true)
			                    }
			                }
			            ]
			        }]
			    });
    			
			}
		});
		
	},
	getTags : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/tag.json?action=get.issued.tags",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	var totalCount = data.tags.length;
            	var lowCount = 0, midCount = 0, activeCount =0 , sleepCount =0;
				var item, html = "", euid = "";
				for(var i=0; i < data.tags.length; i++){
					Main.$tags.put(data.tags[i].euid, data.tags[i]);
					item = data.tags[i];
					if(item.batteryState == 1 || parseFloat(item.batteryLevel) < 2.7){
						lowCount++;
					}else if(parseFloat(item.batteryLevel) > 2.7 && parseFloat(item.batteryLevel) < 2.9){
						midCount++;
					}
					if(($.now() - item.aliveTime) > 10000){
						sleepCount++;
					}else{
						activeCount++;
					}
				}
				$('.top_left').html($.rtls.tag.list.top(data.tags.length));
            	
				html = "TAG(活跃 : <span style='color:#00b4fa;font-weight:bold'>"+activeCount+"</span>"+$.rtls.tag.form.number+", 休眠 : <span style='color:#ff0800;font-weight:bold'>"+sleepCount+"</span>"+$.rtls.tag.form.number+")";
				$('#tag-active').html(html);
    			html = "TAG(<img src='/resources/commons/images/map/icon_battery_full.png' style='vertical-align:middle;'/> <span style='color:#00b4fa;font-weight:bold'>"+(data.tags.length - lowCount - midCount)+"</span>"+$.rtls.tag.form.number+", ";
				html += "<img src='/resources/commons/images/map/icon_battery_medium.png' style='vertical-align:middle;'/> <span style='color:#ff9b00;font-weight:bold'>"+(midCount)+"</span>"+$.rtls.tag.form.number+", ";
				html += "<img src='/resources/commons/images/map/icon_battery_low.png' style='vertical-align:middle;'/> <span style='color:#ff0800;font-weight:bold'>"+(lowCount)+"</span>"+$.rtls.tag.form.number+")";
				$('#tag-battery').html(html);
    				
				$('#tag-battery-chart').highcharts({
			        chart: {
			            plotBackgroundColor: null,
			            plotBorderWidth: 0,
			            plotShadow: false
			        },
			        colors: ['#7cb5ec',  '#f7a35c', '#f45b5b', '#8085e9', '#90ed7d', '#e4d354', '#2b908f', '#f15c80', '#91e8e1'],
			        credits: {
			    		enable : false,
			            text: '',
			            href: 'http://www.ido-link.com'
			        }, 
			    	title: {
			            text: 'Battery',
			            align: 'center',
			            verticalAlign: 'middle',
			            y: 50
			        },
			        tooltip: {
			            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			        },
			        plotOptions: {
			            pie: {
			                dataLabels: {
			                    enabled: true,
			                    distance: -50,
			                    style: {
			                        fontWeight: 'bold',
			                        color: 'white',
			                        textShadow: '0px 1px 2px black'
			                    }
			                },
			                startAngle: -90,
			                endAngle: 90,
			                center: ['50%', '75%']
			            }
			        },
			        series: [{
			            type: 'pie',
			            name: 'Battery Status',
			            innerSize: '50%',
			            data: [
			                ['Full', (totalCount - (midCount+lowCount))],
			                ['Normal', midCount],
			                ['Low', lowCount],
			            ]
			        }]
			    });
				$('#tag-active-chart').highcharts({
			        chart: {
			            plotBackgroundColor: null,
			            plotBorderWidth: 0,
			            plotShadow: false
			        },
			        colors: ['#7cb5ec',  '#f45b5b', '#8085e9', '#8085e9', '#90ed7d', '#e4d354', '#2b908f', '#f15c80', '#91e8e1'],
			        credits: {
			    		enable : false,
			            text: '',
			            href: 'http://www.ido-link.com'
			        }, 
			    	title: {
			            text: 'Active',
			            align: 'center',
			            verticalAlign: 'middle',
			            y: 50
			        },
			        tooltip: {
			            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			        },
			        plotOptions: {
			            pie: {
			                dataLabels: {
			                    enabled: true,
			                    distance: -50,
			                    style: {
			                        fontWeight: 'bold',
			                        color: 'white',
			                        textShadow: '0px 1px 2px black'
			                    }
			                },
			                startAngle: -90,
			                endAngle: 90,
			                center: ['50%', '75%']
			            }
			        },
			        series: [{
			            type: 'pie',
			            name: 'TAG Status',
			            innerSize: '50%',
			            data: [
			                ['Active',   activeCount],
			                ['Sleep',    sleepCount],
			                
			            ]
			        }]
			    });	
    		}
		});
		
	},
	getTagPositioning : function(){
		var html ='<tr>';
		html +='<th class="first" rowspan="2">TYPE</th>';
		html +='<th rowspan="2">EUID</th>';
		html +='<th rowspan="2">ALIAS</th>';
		html +='<th rowspan="2">BATTERY</th>';
		html +='<th rowspan="2">SUCCESS RATE</th>';
		html +='<th rowspan="2">FAIL RATE</th>';
		html +='<th colspan="9">FAILED CASE</th>';
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
		$("#tag-statistics thead").html(html);
		var date = new Date();
		var startDay = date.format('yyyy-MM-dd');
		var endDay = startDay;
		$('#tag-statistics tbody').html("<tr><td colspan='15' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/service.json?action=get.service.chart.success",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : 0,
            	"startDay" : startDay,
                "endDay" : endDay,
        		"startTime" : '',
                "endTime" : ''
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#tag-statistics tbody').html('');
            	var item , itemSize = 0, tag = {};
            	var sumPercent = 0, failPercent = 0;;
            	var errorCase1 = 0, errorCase2 = 0, errorCase3 = 0, errorCase4 = 0, errorCase5 = 0, errorCase6 = 0, errorCase7 = 0, errorCase8 = 0, errorCase9 = 0;
            	var sumErrorCase1 = 0, sumErrorCase2 = 0, sumErrorCase3 = 0, sumErrorCase4 = 0, sumErrorCase5 = 0, sumErrorCase6 = 0, sumErrorCase7 = 0, sumErrorCase8 = 0, sumErrorCase9 = 0;
            	var html = '';
            	for(var i=0; i < data.items.length; i++){
					item = data.items[i];
					tag = Main.$tags.get(item.euid);
					if(tag != undefined){
						itemSize++;
						sumPercent += item.percent;
						failPercent = 100-item.percent;
						errorCase1 = (failPercent * item.errorPercent1)/100;
						errorCase2 = (failPercent * item.errorPercent2)/100;
						errorCase3 = (failPercent * item.errorPercent3)/100;
						errorCase4 = (failPercent * item.errorPercent4)/100;
						errorCase5 = (failPercent * item.errorPercent5)/100;
						errorCase6 = (failPercent * item.errorPercent6)/100;
						errorCase7 = (failPercent * item.errorPercent7)/100;
						errorCase8 = (failPercent * item.errorPercent8)/100;
						errorCase9 = (failPercent * item.errorPercent9)/100;
						sumErrorCase1 += errorCase1;
						sumErrorCase2 += errorCase2;
						sumErrorCase3 += errorCase3;
						sumErrorCase4 += errorCase4;
						sumErrorCase5 += errorCase5;
						sumErrorCase6 += errorCase6;
						sumErrorCase7 += errorCase7;
						sumErrorCase8 += errorCase8;
						sumErrorCase9 += errorCase9;
						
						
	            		html = "<tr>";
	            		/*
	            		if(tag.type == 1){
	    					html += "<td><img src='/resources/commons/images/map/icon_tag_fixed.png' /></td>";
	            		}else{
	    					html += "<td><img src='/resources/commons/images/map/icon_tag_move.png' /></td>";
	            		}
	            		*/
	            		//1.1.4.6中修改
	            		if(tag.type == 1){
	    					html += "<td id='tag_"+item.euid+"'><img src='/resources/commons/images/map/icon_tag_fixed.png' /></td>";

	            		}else if(tag.type == 2){
	    					html += "<td id='tag_"+item.euid+"'><img src='/resources/commons/images/map/icon_tag_move.png' /></td>";
	            		}else if(tag.type == 3){
	    					html += "<td id='tag_"+item.euid+"'><img src='/resources/commons/images/map/icon_tag_card.png' /></td>";
	            		}
						html += "<td style='font-weight:bold'>"+item.euid+"</td>";
						html += "<td>"+tag.name+"</td>";
						html += "<td>"+tag.batteryLevel+"V</td>";
						html += "<td>"+parseFloat(item.percent).toFixed(2)+"%</td>";
						html += "<td>"+parseFloat(failPercent).toFixed(2)+"%</td>";
						
						html += "<td>"+errorCase1.toFixed(2)+"%</td>";
						html += "<td>"+errorCase2.toFixed(2)+"%</td>";
						html += "<td>"+errorCase3.toFixed(2)+"%</td>";
						html += "<td>"+errorCase4.toFixed(2)+"%</td>";
						html += "<td>"+errorCase5.toFixed(2)+"%</td>";
						html += "<td>"+errorCase6.toFixed(2)+"%</td>";
						html += "<td>"+errorCase7.toFixed(2)+"%</td>";
						html += "<td>"+errorCase8.toFixed(2)+"%</td>";
						html += "<td>"+errorCase9.toFixed(2)+"%</td>";
						html += "</tr>";
						$('#tag-statistics tbody').append(html);
					
					}
            		
            	}
				html = "<tr>";
				html += "<th>SUM</td>";
				html += "<th></th>";
				html += "<th></th>";
				html += "<th></th>";
				if(itemSize > 0){
					html += "<th style='font-weight:bold'>"+(sumPercent/itemSize).toFixed(2)+"%</th>";
					html += "<th style='font-weight:bold'>"+(100-sumPercent/itemSize).toFixed(2)+"%</th>";
					html += "<th>"+(sumErrorCase1/itemSize).toFixed(2)+"%</th>";
					html += "<th>"+(sumErrorCase2/itemSize).toFixed(2)+"%</th>";
					html += "<th>"+(sumErrorCase3/itemSize).toFixed(2)+"%</th>";
					html += "<th>"+(sumErrorCase4/itemSize).toFixed(2)+"%</th>";
					html += "<th>"+(sumErrorCase5/itemSize).toFixed(2)+"%</th>";
					html += "<th>"+(sumErrorCase6/itemSize).toFixed(2)+"%</th>";
					html += "<th>"+(sumErrorCase7/itemSize).toFixed(2)+"%</th>";
					html += "<th>"+(sumErrorCase8/itemSize).toFixed(2)+"%</th>";
					html += "<th>"+(sumErrorCase9/itemSize).toFixed(2)+"%</th>";
				}else{
					html += "<th style='font-weight:bold'>0%</th>";
					html += "<th style='font-weight:bold'>0%</th>";
					html += "<th>0%</th>";
					html += "<th>0%</th>";
					html += "<th>0%</th>";
					html += "<th>0%</th>";
					html += "<th>0%</th>";
					html += "<th>0%</th>";
					html += "<th>0%</th>";
					html += "<th>0%</th>";
					html += "<th>0%</th>";
				}
				html += "</tr>";
				$('#tag-statistics tbody').append(html);
            }
		});
	},
	getRapSync : function(){
		var html ='<tr>';
		html +='<th>PLAN</th>';
		html +='<th>MASTER</th>';
		html +='<th>EUID</th>';
		html +='<th>STATUS</th>';
		html +='<th>RX LEVEL</th>';
		html +='<th>SYNC CLOCK</th>';
		html +='<th>Wireless Sync</th>';
		html +='</tr>';
		$("#rap-sync thead").html(html);
		
		var raps = this.$raps.values(), rap = {};
		
		for(var i=0; i < raps.length; i++){
			rap = raps[i];
			if(rap.planId > 0 && rap.planId < 100 && rap.rcmMode != 1){
				html = '<tr>';
				html += '<td>'+Main.$plans.get(rap.planId).name+'</td>';
				html += '<td>'+rap.euidMaster+'</td>';
				html += '<td>'+rap.euidSrc+'</td>';
				if(rap.status == 'alive'){
					if(rap.masterStatus == '0'){
						html += '<td style="color:#ff0000">UWB Error</td>';
					}else{
						html += "<td>Normal</td>";
					}
					
				}else{
					html += '<td style="color:#ff0000">Dead</td>';
				}				
				html += '<td><span id="rxLevel_'+rap.euidMaster+'_'+rap.euidSrc+'">'+(rap.rxLevel == 0 ? '--' : rap.rxLevel)+'</span></td>';
				html += '<td><span id="syncClock_'+rap.euidMaster+'_'+rap.euidSrc+'">'+(rap.syncClock == 0 ? '--' : rap.syncClock)+'</span></td>';
				html += '<td><span id="success_'+rap.euidMaster+'_'+rap.euidSrc+'">'+(rap.wirelessSync == 0 ? '--' : rap.wirelessSync+'%')+'</span></td>';
				html += '</tr>';
				$("#rap-sync thead").append(html);	
			}
			
		}
	}
};