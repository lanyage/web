var workerOrder = {
	$plan : null, $plans : null,
	$user : null, $users : null,
	$zone : null, $zones : null,
	$planId : 1,
	$startDay : null, $endDay : null,
	init : function(){
		
		$("#startDay").datepicker({
			onSelect: function(selectedDate) {
				workerOrder.$startDay = selectedDate;
			}
        });
		$('#startTime').timepicker({
			showTime : false,
			hourGrid: 2,
			minuteGrid: 5
		});
		$("#endDay").datepicker({
			onSelect: function(selectedDate) {
				workerOrder.$endDay = selectedDate;
			}
        });
		$('#endTime').timepicker({
			showTime : false,
			hourGrid: 2,
			minuteGrid: 5
		});
		
		workerOrder.getAllowPersions();
		
		workerOrder.getWorkPlaces();
		
		workerOrder.getWorkGroup();
		
		$("#but-save").click(function() {
			workerOrder.save();
			return false; 
		});
		
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
	getAllowPersions :  function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/worker.order.json?action=get.allowPersions",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	workerOrder.$users = data.users;
            	var html = "";
            	for(var i=0; i<workerOrder.$users.length; i++){
            		html += "<option value="+workerOrder.$users[i].userId+">"+workerOrder.$users[i].name+"</option>";
            	}
            	$("#allowPersion").append(html);
            	$("#principal").append(html);
			}
		});
	},
	getWorkPlaces : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/worker.order.json?action=get.workPlaces",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : workerOrder.$planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	workerOrder.$zones = data.zones;
            	var html = "";
            	for(var i=0; i<workerOrder.$zones.length; i++){
            		html += "<p><input name='zone' type='checkbox' value ="+workerOrder.$zones[i].zoneId+" >"+workerOrder.$zones[i].name+"</p>";
            	}
            	$(".workPlace").append(html);
            	
			}
		});
	},
	getWorkGroup :  function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/worker.order.json?action=get.allowPersions",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	workerOrder.$users = data.users;
            	var html = "";
            	for(var i=0; i<workerOrder.$users.length; i++){
            		html += "<p><input name='user' type='checkbox' value ="+workerOrder.$users[i].userId+"  />"+workerOrder.$users[i].name+"</p>";
            	}
            	$(".workGroup").append(html);
			}
		});
	},
	save :  function(){
		var workerOrderNum = $(".order-num input").val();
		var planId = workerOrder.$planId;
		var principal = $("#principal").find("option:selected").val();
		var allowPersion = $("#allowPersion").find("option:selected").val();
		var workPlace =　"";
		for(var i=0; i<$(".workPlace p").length; i++){
			if ($(".workPlace p").eq(i).find("input").prop('checked')) {
				workPlace += $(".workPlace p").eq(i).find("input").val();
				if(i!=$(".workPlace p").length-1){
					workPlace += "|";
				}
			}
		}
		var workGroup = "";
		for(var i=0; i<$(".workGroup p").length; i++){
			if ($(".workGroup p").eq(i).find("input").prop('checked')) {
				workGroup += $(".workGroup p").eq(i).find("input").val();
				if(i!=$(".workGroup p").length-1){
					workGroup += "|";
				}
			}
		}
		var jobContent = $(".jobContent textarea").val();
		var status = "已创建";
		var inTime = new Date($("#startDay").val()+" "+$("#startTime").val()).getTime();
		var outTime = new Date($("#endDay").val()+" "+$("#endTime").val()).getTime();
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/worker.order.json?action=save",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"workerOrderNum" : workerOrderNum,
            	"planId" : planId,
            	"principal" : principal,
            	"allowPersion" : allowPersion,
            	"workPlace" : workPlace,
            	"workGroup" : workGroup,
            	"jobContent" : jobContent,
            	"status" : status,
            	"inTime" : inTime,
            	"outTime" : outTime
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result=="success"){
            		alert("添加成功");
            	}
			}
		});
	}
};