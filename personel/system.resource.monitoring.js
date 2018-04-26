Highcharts.setOptions({
    global: {
        useUTC: false
    }
});
var cpuChartOptions = {
	chart: {
		renderTo: 'cpu-chart',
		type: 'area',
        animation: Highcharts.svg,
        marginRight: 10,
        events: {
            load: function() {
            	setInterval(function() {
            		for(var i=0; i < System._cpuChart.series.length; i++){
                   		var series = System._cpuChart.series[i];
                   		if(series != null && series != undefined){
                   			series.setData(System._cpuDatas[i]);	
                   		}
            		}    	
                }, 1000);	
            	
                
            }
        }
	},
	credits: {
		enable : false,
        text: '',
        href: 'http://www.ido-link.com '
    }, 
	title: {
		text: null
	},
	xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
    	min: 0, max: 100,
        title: {
            text: $.rtls.system.chart.title.cpu
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
	tooltip: {
		formatter: function() {
            return '<b>'+ this.series.name +'</b><br/>'+
            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
            Highcharts.numberFormat(this.y, 2);
		}
	},
	plotOptions: {
        series: {
            fillOpacity: 0.3,
            marker: {
                enabled: false
            }
        },
    },
	legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: []
};
var memoryChartOptions = {
	chart: {
		renderTo: 'memory-chart',
		type: 'area',
        animation: Highcharts.svg,
        marginRight: 10,
        events: {
            load: function() {
            	setInterval(function() {
            		for(var i=0; i < System._memoryChart.series.length; i++){
                   		var series = System._memoryChart.series[i];
                   		if(series != null && series != undefined){
                   			series.setData(System._memoryDatas[i]);	
                   		}
            		}    	
                }, 1000);	
            }
        }
	},
	credits: {
		enable : false,
        text: '',
        href: 'http://www.ido-link.com '
    }, 
	title: {
		text: null
	},
	xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
    	min: 0, max: 100,
        title: {
            text: $.rtls.system.chart.title.memory
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
	tooltip: {
		formatter: function() {
            return '<b>'+ this.series.name +'</b><br/>'+
            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
            Highcharts.numberFormat(this.y, 2);
		}
	},
	plotOptions: {
        series: {
            fillOpacity: 0.5,
            marker: {
                enabled: false
            }
        }
    },
	legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: []
};
var networkChartOptions = {
	chart: {
		renderTo: 'network-chart',
		type: 'area',
        animation: Highcharts.svg,
        marginRight: 10,
        events: {
            load: function() {
            	setInterval(function() {
            		for(var i=0; i < System._networkChart.series.length; i++){
                   		var series = System._networkChart.series[i];
                   		if(series != null && series != undefined){
                   			series.setData(System._networkDatas[i]);	
                   		}
                   		
            		}    	
                       
                }, 1000);	
            	
                
            }
        }
	},
	credits: {
		enable : false,
        text: '',
        href: 'http://www.ido-link.com'
    }, 
	title: {
		text: null
	},
	xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
    	min: 0,
        title: {
            text: $.rtls.system.chart.title.network
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
	tooltip: {
		formatter: function() {
            return '<b>'+ this.series.name +'</b><br/>'+
            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
            Highcharts.numberFormat(this.y, 2);
		}
	},
	plotOptions: {
        series: {
            fillOpacity: 0.5,
            marker: {
                enabled: false
            }
        }
    },
	legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: []
};
var System = {
	_worker : null,
	_cpuChart : null, _cpuDatas : [],
	_memoryChart : null, _memoryDatas : [],
	_networkChart : null, _networkDatas : [],
	init : function(){
		this._cpuChart = new Highcharts.Chart(cpuChartOptions);
		this._memoryChart = new Highcharts.Chart(memoryChartOptions);
		this._networkChart = new Highcharts.Chart(networkChartOptions);
		this.initNotify();
		this.initWorker();
		this.startMonitoring();
	},
	initNotify : function(){
		var sock = new SockJS('/rtls/sockjs');
		var client = Stomp.over(sock);
		client.debug = null;
		client.connect({}, function(frame) {
			client.subscribe("/queue/system", function(message) {
				System.addAlarm(message.body);	
			});
		});
		sock.onclose = function(event) {
			
		};
		
		$(window).bind('beforeunload',function(){
			if(client != null){
				client.disconnect();
			}
		});
	},
	initWorker : function(){
		
		this._worker = new Worker('/resources/commons/js/idolink/ido.worker.js');
		this._worker.onmessage = function(e){
			var data = $.parseJSON(e.data);
			var cpu, memory;
			var time = (new Date()).getTime();
			for(var i=0; i < data.cpus.length; i++){
				cpu = data.cpus[i];
				var check = false;
				$('#system-cpu').children().each(function(){
					if($(this).attr('id') == 'cpu_'+i){
						check = true;
					}
				});
				if(check){
					$('#system-cpu #cpu_'+i).html(cpu.text);	
				}else{
					System._cpuChart.addSeries({
				        name: 'CPU'+i+' History',
				        color: '#'+cpu.color,
				        data: []
				    });
					System._cpuDatas[i] = new Array();
					$('#system-cpu').append('<label id="cpu_'+i+'">'+cpu.text+'</label>');
					$('#system-cpu #cpu_'+i).css('background-color', '#'+cpu.color);
				}
				System._cpuDatas[i].push({x : time, y : parseFloat(cpu.percent)});
				if(System._cpuDatas[i].length > 60){
					System._cpuDatas[i].shift();
				}
			
			}
			
			for(var i=0; i < data.memorys.length; i++){
				memory = data.memorys[i];
				var check = false;
				$('#system-memory').children().each(function(){
					if($(this).attr('id') == 'memory_'+i){
						check = true;
					}
				});
				if(check){
					$('#system-memory #memory_'+i).html(memory.text);	
				}else{
					System._memoryChart.addSeries({
				        name: memory.unit+' Memory History',
				        color: '#'+memory.color,
				        data: []
				    });
					System._memoryDatas[i] = new Array();
					$('#system-memory').append('<label id="memory_'+i+'">'+memory.text+'</label>');
					$('#system-memory #memory_'+i).css('background-color', '#'+memory.color);
				}
				System._memoryDatas[i].push({x : time, y : parseFloat(memory.percent)});
				if(System._memoryDatas[i].length > 60){
					System._memoryDatas[i].shift();
				}
			
			}
			
			for(var i=0; i < data.networks.length; i++){
				network = data.networks[i];
				var check = false;
				$('#system-network').children().each(function(){
					if($(this).attr('id') == 'network_'+i){
						check = true;
					}
				});
				if(check){
					$('#system-network #network_'+i).html(network.text);	
				}else{
					System._networkChart.addSeries({
				        name: (network.type == '0' ? 'Receiving' : 'Sending')+' History',
				        color: '#'+network.color,
				        data: []
				    });
					System._networkDatas[i] = new Array();
					$('#system-network').append('<label id="network_'+i+'">'+network.text+'</label>');
					$('#system-network #network_'+i).css('background-color', '#'+network.color);
				}
				System._networkDatas[i].push({x : time, y : parseFloat(network.bytesPerSecond)});
				if(System._networkDatas[i].length > 60){
					System._networkDatas[i].shift();
				}
			
			}
		};
		this._worker.addEventListener('message', function(e){
			
		});
		
	},
	startMonitoring : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/system.json?action=start.system.monitoring",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		
            	}
            	
			}
		});
		
	},
	stopMonitoring : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/system.json?action=stop.system.monitoring",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		      
            	}
			}
		});
		
	},
	addAlarm : function(data){
		var alarm  = $.parseJSON(data);
		if(alarm.eventType == '10'){
			System._worker.postMessage(data);
		}
	},
	hexToRgbColor : function(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},
};