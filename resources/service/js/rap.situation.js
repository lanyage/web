var totalStatusChartOptions = {
	chart: {
		renderTo: 'total-chart',
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false
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
var masterStatusChartOptions = {
	chart: {
		renderTo: 'master-chart',
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false
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


var slaveStatusChartOptions = {
	chart: {
		renderTo: 'slave-chart',
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false
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


var Device = {
	_deviceType : 0,
	_plan : null, _plans : null,	
	init : function(){
		this.getPlans();
	},
	getPlans : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/plan.action?pages=get.plans",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Device._plans = data.plans;
            	var item, html;
            	for(var i=0; i < Device._plans.length; i++){
					item = Device._plans[i];
					html = "<li id='"+i+"' class='ui-state-default ui-corner-top' onmouseover='Device.tabOver("+i+")' onmouseout='Device.tabOut("+i+")'>" +
					"<a href=\"javascript:Device.tabSelect("+i+")\"><img src='/commons/images/tree/dir.gif'/> "+item.name+"</a>" +
					"</li>";
					$('#tab').find('ul').append(html);
				}
				Device.tabSelect(0);
			}
		});
		
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
		this._plan = this._plans[ix];
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == ix){
		    	$(this).addClass('ui-tabs-selected');
		    	$(this).addClass('ui-state-active');
		    }else{
		    	$(this).removeClass('ui-state-active');
				$(this).removeClass('ui-tabs-selected');
		    }
		});
		this.situation();
	},
	situation : function(){
		$.ajax({
			async : false,
			type: 'get',
			url: "/service/rap.action?pages=get.rap.status",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Device._plan.planId == 0 ? 1 :  Device._plan.planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	totalStatusChartOptions.series = [];
            	totalStatusChartOptions.series.push({
					type: 'pie',
					name: '기기 상태',
					data: [
						['기기 온라인', parseFloat(data.total.olinePer)],
						{
							name: '기기 오프라인',    
							y: parseFloat(data.total.offlinePer),
							sliced: true,
							selected: true
						}
					]
				});
            	new Highcharts.Chart(totalStatusChartOptions);
            	$('#total').html('<img src="/commons/images/grid/set.png" style="float:left; padding-right:3px"/> <b>机器</b> [全部 : '+data.total.total+"个, 在线 : "+data.total.online+"个, 离线 : "+data.total.offline+"个]");
            	masterStatusChartOptions.series = [];
            	masterStatusChartOptions.series.push({
					type: 'pie',
					name: 'MASTER RAP 状态',
					data: [
						['MASTER RAP 网络', parseFloat(data.master.olinePer)],
						{
							name: 'MASTER RAP 离线',    
							y: parseFloat(data.master.offlinePer),
							sliced: true,
							selected: true
						}
					]
				});
            	new Highcharts.Chart(masterStatusChartOptions);
            	$('#master').html('<img src="/commons/map/icon_gateway21_on.png" style="float:left; padding-right:3px"/> <b>MASTER RAP</b> [全部 : '+data.master.total+"个, 在线 : "+data.master.online+"个, 离线 : "+data.master.offline+"个]");
            	slaveStatusChartOptions.series = [];
            	slaveStatusChartOptions.series.push({
					type: 'pie',
					name: 'SLAVE RAP 状态',
					data: [
						['SLAVE RAP 网络', parseFloat(data.slave.olinePer)],
						{
							name: 'SLAVE RAP 离线',    
							y: parseFloat(data.slave.offlinePer),
							sliced: true,
							selected: true
						}
					]
				});
            	new Highcharts.Chart(slaveStatusChartOptions);
            	$('#slave').html('<img src="/commons/map/icon_receiver21_on.png" style="float:left; padding-right:3px"/> <b>SLAVE RAP</b> [全部 : '+data.slave.total+"个, 在线 : "+data.slave.online+"个, 离线 : "+data.slave.offline+"个]");
            	
			}
		});
	}
	
	
};