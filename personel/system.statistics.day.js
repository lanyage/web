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
        marginRight: 10
        
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
        type: 'datetime'
    },
    yAxis: {
    	min: 0, max: 100,
        title: {
            text:  $.rtls.system.chart.title.cpu
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
            Highcharts.dateFormat('%Y-%m-%d %H', this.x) +'<br/>'+
            Highcharts.numberFormat(this.y, 5)+'%';
		}
	},
	plotOptions: {
        series: {
            fillOpacity: 0.3,
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
var memoryChartOptions = {
	chart: {
		renderTo: 'memory-chart',
		type: 'area',
        animation: Highcharts.svg,
        marginRight: 10
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
        type: 'datetime'
    },
    yAxis: {
    	min: 0, max: 100,
        title: {
            text:  $.rtls.system.chart.title.memory
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
            Highcharts.numberFormat(this.y, 5)+'%';
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
        marginRight: 10
       
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
        type: 'datetime'
    },
    yAxis: {
    	min: 0,
        title: {
            text:  $.rtls.system.chart.title.network
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
            Highcharts.numberFormat(this.y, 2)+'kb';
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
	$day : null,
	init : function(){
		var html = '<div id="search-fields">';
		html += '<p>';
		html += '	<label>'+$.rtls.system.form.date+'</label>';
		html += '	<input type="text" id="day" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/>';
		html += '	<button id="but-search">'+$.rtls.system.button.search+'</button>';
		html += '</p>';
		html += '</div>';
		$("#search-form").html(html);
		$("#day").datepicker({
			onSelect: function(selectedDate) {
				System.$day = selectedDate;
			}
        });
		this.$day =new Date().format("yyyy-MM-dd");
		$("#day").val(this.$day);
		$("#but-search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			System.getSystemChartDay();
			return false; 
		});
		
		System.getSystemChartDay();
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
	getSystemChartDay : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/system.json?action=get.system.chart.day",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"day" : System.$day,
        				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#system-cpu').html('');
            	$('#system-memory').html('');
            	$('#system-network').html('');
        		cpuChartOptions.series = [];
        		memoryChartOptions.series = [];
        		networkChartOptions.series = [];
        		var days = System.$day.split('-');
            	var cpus = data.cpus;
            	var cpu;
            	var cpuColors = ['B0171F', '00008B', '00BFFF', '00C957', 'FF8C69', 'EEC900', '00FF00', '000FF', 'FF0000', 'E066FF'];
            	for(var i=0; i < cpus.length; i++){
					cpu = cpus[i];
					var cpuDatas = new Array();
					for(var j=0; j < 24; j++){
						var check = false;
						for(var k=0; k < cpu.items.length; k++){
							if(j == parseInt(cpu.items[k].atime)){
								check = true;
								cpuDatas.push({x : Date.UTC(days[0], days[1]-1, days[2], j-9, 0), y : parseFloat(cpu.items[k].percent)});
								break;
							}
							
						}
						if(!check){
							cpuDatas.push({x : Date.UTC(days[0], days[1]-1, days[2], j-9, 0), y : 0});
						}
							
					}
					
					cpuChartOptions.series.push({
				        name: 'CPU'+cpu.cpuNum+' History',
				        color: '#'+cpuColors[cpu.cpuNum],
				        data: cpuDatas
				    });
					$('#system-cpu').append('<label id="cpu_'+cpu.cpuNum+'">CPU'+cpu.cpuNum+'</label>');
					$('#system-cpu #cpu_'+cpu.cpuNum).css('background-color', '#'+cpuColors[cpu.cpuNum]);
				}
            	new Highcharts.Chart(cpuChartOptions);
				
            	var memorys = data.memorys;
            	var memory;
            	var memoryColors = ['008B45', '800080'];
            	var memoryTypes = ['Physical', 'Swap'];
            	for(var i=0; i < memorys.length; i++){
					memory = memorys[i];
					var memoryDatas = new Array();
					for(var j=0; j < 24; j++){
						var check = false;
						for(var k=0; k < memory.items.length; k++){
							if(j == parseInt(memory.items[k].atime)){
								check = true;
								memoryDatas.push({x : Date.UTC(days[0], days[1]-1, days[2], j-9, 0), y : parseFloat(memory.items[k].percent)});
								break;
							}
							
						}
						if(!check){
							memoryDatas.push({x : Date.UTC(days[0], days[1]-1, days[2], j-9, 0), y : 0});
						}
							
					}
					
					memoryChartOptions.series.push({
				        name: memoryTypes[memory.type-1]+' Memory History',
				        color: '#'+memoryColors[memory.type-1],
				        data: memoryDatas
				    });
					$('#system-memory').append('<label id="memory_'+memory.type+'">'+memoryTypes[memory.type-1]+'</label>');
					$('#system-memory #memory_'+memory.type).css('background-color', '#'+memoryColors[memory.type-1]);
					
				}
            	new Highcharts.Chart(memoryChartOptions);
            	
            	var networks = data.networks;
            	var network;
            	var networkColors = ['B8860B', '4F94CD'];
            	var networkTypes = ['Receiving', 'Sending'];
            	for(var i=0; i < networks.length; i++){
					network = networks[i];
					var networkDatas = new Array();
					for(var j=0; j < 24; j++){
						var check = false;
						for(var k=0; k < network.items.length; k++){
							if(j == parseInt(network.items[k].atime)){
								check = true;
								networkDatas.push({x : Date.UTC(days[0], days[1]-1, days[2], j-9, 0), y : parseFloat(network.items[k].bytesPerMin)});
								break;
							}
							
						}
						if(!check){
							networkDatas.push({x : Date.UTC(days[0], days[1]-1, days[2], j-9, 0), y : 0});
						}
							
					}
					
					networkChartOptions.series.push({
				        name: networkTypes[network.type-1]+' Network History',
				        color: '#'+networkColors[network.type-1],
				        data: networkDatas
				    });
					$('#system-network').append('<label id="network_'+network.type+'">'+networkTypes[network.type-1]+'</label>');
					$('#system-network #network_'+network.type).css('background-color', '#'+networkColors[network.type-1]);
					
				}
            	new Highcharts.Chart(networkChartOptions);
			}
		});
		
		
	}
	
};