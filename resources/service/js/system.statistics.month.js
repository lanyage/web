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
        type: 'datetime',
        labels : {
            formatter: function() {
               var date = new Date(this.value);
               var newDate = Date.UTC(date.getUTCFullYear(),date.getUTCMonth()-1,date.getUTCDate());   
               return Highcharts.dateFormat('%Y-%m-%d',newDate);  

            }
        }   
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
            Highcharts.dateFormat('%Y-%m-%d', this.x) +'<br/>'+
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
        type: 'datetime',
        labels : {
            formatter: function() {
               var date = new Date(this.value);
               var newDate = Date.UTC(date.getUTCFullYear(),date.getUTCMonth()-1,date.getUTCDate());   
               return Highcharts.dateFormat('%Y-%m-%d',newDate);  

            }
        }   
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
            Highcharts.dateFormat('%Y-%m-%d', this.x) +'<br/>'+
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
        type: 'datetime',
        labels : {
            formatter: function() {
               var date = new Date(this.value);
               var newDate = Date.UTC(date.getUTCFullYear(),date.getUTCMonth()-1,date.getUTCDate());   
               return Highcharts.dateFormat('%Y-%m-%d',newDate);  

            }
        }   
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
            Highcharts.dateFormat('%Y-%m-%d', this.x) +'<br/>'+
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
	init : function(){
		var html = '<div id="search-fields">';
		html += '<p>';
		html += '	<label>'+$.rtls.system.form.date+'</label>';
		html += '	<select id="year"></select>'+$.rtls.system.form.year;
		html += '	<select id="month"></select>'+$.rtls.system.form.month;
		html += '   <button id="but-search">'+$.rtls.system.button.search+'</button>';
		html += '</p>';
		html += '</div>';
		$("#search-form").html(html);
		
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth() + 1;
		for(var i = year; i > year-10; i--){
			if( i == year){
				$('#year').append('<option value="'+i+'" selected>'+i+'</option>');	
			}else{
				$('#year').append('<option value="'+i+'">'+i+'</option>');
			}
		}
		for(var i = 1; i < 13; i++){
			if(i == month){
				$('#month').append('<option value="'+i+'" selected>'+i+'</option>');	
			}else{
				$('#month').append('<option value="'+i+'">'+i+'</option>');	
			}
		}
		
		$("#but-search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			System.getSystemChartMonth();
			return false; 
		});
		
		System.getSystemChartMonth();
	},
	getSystemChartMonth : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/system.json?action=get.system.chart.month",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"year" : $('#year').val(),
            	"month" : $('#month').val()
        				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	var year = new Number($('#year').val());
            	var month = new Number($('#month').val());
            	var lastDay  = new Date(year, month, 0).getDate();
            	
            	$('#system-cpu').html('');
            	$('#system-memory').html('');
            	$('#system-network').html('');
        		cpuChartOptions.series = [];
        		memoryChartOptions.series = [];
        		networkChartOptions.series = [];
        		var cpus = data.cpus;
            	var cpu;
            	var cpuColors = ['B0171F', '00008B', '00BFFF', '00C957', 'FF8C69', 'EEC900', '00FF00', '000FF', 'FF0000', 'E066FF'];
            	for(var i=0; i < cpus.length; i++){
					cpu = cpus[i];
					var cpuDatas = new Array();
					for(var j=1; j <= lastDay; j++){
						var check = false;
						for(var k=0; k < cpu.items.length; k++){
							if(j == parseInt(cpu.items[k].atime)){
								check = true;
								cpuDatas.push({x : Date.UTC(year, month, j, 0, 0), y : parseFloat(cpu.items[k].percent)});
								break;
							}
							
						}
						if(!check){
							cpuDatas.push({x : Date.UTC(year, month, j, 0, 0), y : 0});
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
					for(var j=1; j <= lastDay; j++){
						var check = false;
						for(var k=0; k < memory.items.length; k++){
							if(j == parseInt(memory.items[k].atime)){
								check = true;
								memoryDatas.push({x : Date.UTC(year, month, j, 0, 0), y : parseFloat(memory.items[k].percent)});
								break;
							}
							
						}
						if(!check){
							memoryDatas.push({x : Date.UTC(year, month, j, 0, 0), y : 0});
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
					for(var j=1; j <= lastDay; j++){
						var check = false;
						for(var k=0; k < network.items.length; k++){
							if(j == parseInt(network.items[k].atime)){
								check = true;
								networkDatas.push({x : Date.UTC(year, month, j, 0, 0), y : parseFloat(network.items[k].bytesPerMin)});
								break;
							}
							
						}
						if(!check){
							networkDatas.push({x : Date.UTC(year, month, j, 0, 0), y : 0});
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