
var Position = {
	$windows : [],
	$item : null, $items : null,
	$tag : null, $tags : null,
	$startNum : 0, $scaleNum : 20, $algorithm : 0,
	$startDay : null, $endDay : null,
	windowClose : function(planId){
		if(Position.$windows[planId] != null){
			Position.$windows[planId].close();
		}
		
	},
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[8]+'</span>');
		$('.top_right').html(
				'<button id="but-simulator">'+$.rtls.position.button.simulator+'</button>'+
				'<button id="but-clear">'+$.rtls.position.button.clear+'</button>'
			);
		$("#but-simulator").button({
			icons: {primary: "ui-icon-play"}
		}).click(function() {
			Position.simulator();
			return false;
		});
		$("#but-clear").button({
			icons: {primary: "ui-icon-trash"}
		}).click(function() {
			Position.clearLog();
			return false;
		});
		var html = '<table width="98%" cellpadding="10px" cellspacing="10px">';
		html += '<tr>';
		html += '	<td style="height:20px">';
		html += '		<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.position.form.time+'</label>';
		html += '			<input type="text" id="startDay" value="" class="input-readonly" style="width: 80px; text-align: center;" readonly="readonly"/>';
		html += '			<input type="text" id="startTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
		html += '			~';
		html += '			<input type="text" id="endDay" value="" class="input-readonly" style="width: 80px; text-align: center;"  readonly="readonly"/>';
		html += '           <input type="text" id="endTime" value="" class="input-readonly" style="width: 50px; text-align: center" readonly="readonly"/>';
		html += '			<button id="but-search">'+$.rtls.position.button.search+'</button>';
		html += '		</p>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td style="height:20px">';
		html += '   	<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.position.form.tag+'</label>';
		html += '			<input type="text" id="tagEuid" value="" class="input-readonly" style="text-align: center;"/>';
		html += '			<button id="but-tag">'+$.rtls.history.button.select+'</button>';
		html += '		</p>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<td  height="20">';
		html += '	<div id="search-fields">';
		html += '		<label>'+$.rtls.position.form.scale+'</label>';
		html += '		<ol id="scale-selectable" class="ui-selectable">';
		html += '		<li class="ui-widget-content ui-selectee ui-selected">20'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">30'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">40'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">50'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">60'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">70'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">80'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">90'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">100'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">150'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">200'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">300'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">400'+$.rtls.position.form.number+'</li>';
		html += '		<li class="ui-widget-content">500'+$.rtls.position.form.number+'</li>';
		html += '		</ol>';
		html += '	</div>';
		html += '</td>';
		html += '</tr>';
		html += '</table>';
		$("#search-form").html(html);
		html = '<tr>';
		html += '<th class="first">'+$.rtls.position.out.head[0]+'</th>';
		html += '<th>'+$.rtls.position.out.head[1]+'</th>';
		html += '<th>'+$.rtls.position.out.head[2]+'</th>';
		html += '<th>'+$.rtls.position.out.head[3]+'</th>';
		html += '<th>'+$.rtls.position.out.head[4]+'</th>';
		html += '<th>'+$.rtls.position.out.head[5]+'</th>';
		html += '<th class="end">'+$.rtls.position.out.head[6]+'</th>';
		html += '</tr>';
		$("#items thead").html(html);
		
		
		$("#startDay").datepicker({
			onSelect: function(selectedDate) {
				Position.$startDay = selectedDate;
			}
        });
		$('#startTime').timepicker({
			showTime : false,
			hourGrid: 2,
			minuteGrid: 5
		});
		$("#endDay").datepicker({
			onSelect: function(selectedDate) {
				Position.$endDay = selectedDate;
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
	            	Position.$tag = null;
	            	Position.$tags = data.tags;
	            	$("#dialog-tag").dialog({
	        			title:$.rtls.position.dialog.title[0],
	        			autoOpen: false,
	        			height: 400,
	        			width: 600,
	        			modal: true,
	        			buttons:  [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					if(Position.$tag != null){
	        						$("#tagEuid").val(Position.$tag.euid);
	        						$("#dialog-tag").dialog( "close" );
	        					}else{
	        						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.position.message.tagselect);
	        						
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
										Position.$tag = Position.$tags[$( "#plan-selectable li" ).index( this )];
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
		$("#scale-selectable").selectable({
			stop: function() {
				$( ".ui-selected", this ).each(function() {
					var ix = $( "#scale-selectable li" ).index( this );
					if(ix ==0){
						Position.$scaleNum = 20;
					}else if(ix ==1){
						Position.$scaleNum = 30;
					}else if(ix ==2){
						Position.$scaleNum = 40;
					}else if(ix ==3){
						Position.$scaleNum = 50;
					}else if(ix ==4){
						Position.$scaleNum = 60;
					}else if(ix ==5){
						Position.$scaleNum = 70;
					}else if(ix ==6){
						Position.$scaleNum = 80;
					}else if(ix ==7){
						Position.$scaleNum = 90;
					}else if(ix ==8){
						Position.$scaleNum = 100;
					}else if(ix ==9){
						Position.$scaleNum = 150;
					}else if(ix ==10){
						Position.$scaleNum = 200;
					}else if(ix ==12){
						Position.$scaleNum = 300;
					}else if(ix ==13){
						Position.$scaleNum = 400;
					}else if(ix ==14){
						Position.$scaleNum = 500;
					}
					
				});		
			}
		});
		$("#but-search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			Position.$startNum = 0;
			Position.getLogs();
			return false; 
		});
		this.getLogs();	
	},
	paging : function(startNum){
		this.$startNum = startNum;
		this.getLogs();	
	},
	
	getLogs : function(){
		$('#items tbody').html("<tr><td colspan='9' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
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
			url: "/service/position.json?action=get.position.outs",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"startNum" : Position.$startNum,
				"scaleNum" : Position.$scaleNum,
                "startDay" : Position.$startDay == null ? '' : $.trim(Position.$startDay),
                "endDay" : Position.$endDay == null ? '' : $.trim(Position.$endDay),
        		"startTime" : startTime,
                "endTime" : endTime,
                "tagEuid" : $("#tagEuid").val()
                
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Position.$items = data.positions;
            	var currentPageNum = parseInt(data.paging.currentPageNum);
    			var totalNum = parseInt(data.paging.totalNum);
    			var startNum = parseInt(data.paging.startNum);
            	$('#items tbody').html('');
            	$('.con_top .top_left').html($.rtls.position.out.top(totalNum));
            	if(totalNum == 0){
            		$('#items tbody').append("<tr><td colspan='10' style='height:50px'><center>"+$.rtls.position.out.empty+"<center></td></tr>");
            		$('.paginate').html('');
    			}else{
    				var item = null;
    				var html = '';
    				for(var i=0; i < Position.$items.length; i++){
    					item = Position.$items[i];
    					html = "<tr>";
    					html += "<td>"+(totalNum - (i + startNum))+"</td>";
    					html += "<td>D-GPS</td>";
        				html += "<td>"+item.userName+"("+item.euid.substring(item.euid.length-4, item.euid.length)+")</td>";	
						html += "<td style='text-align:left;padding-left:5px'>";
						html += "<span style='font-weight:bold;'>"+$.rtls.position.form.latitude+"</span> : "+(parseFloat(item.latitude).toFixed(5))+", ";
						html += "<span style='font-weight:bold;'>"+$.rtls.position.form.longitude+"</span> : "+(parseFloat(item.longitude).toFixed(5))+", ";
						html += "<span style='font-weight:bold;'>"+$.rtls.position.form.address+"</span> : "+item.address;
						html += "</td>";
						if(item.calibration == 1){
							html += "<td>"+$.rtls.position.form.calibration+"</td>";	
						}else{
							html += "<td>"+$.rtls.position.form.uncalibration+"</td>";
						}
						html += "<td>"+item.timestamp.msdate()+"</td>";
    					html += "<td>"+item.addTime.msdate()+"</td>";
    					$('#items tbody').append(html);
    				
    				}
    				html = "<a href=\"javascript:Position.paging(0)\"><img src='/resources/commons/images/icon/icon_paging_first.gif' /></a>";
        			if(data.paging.isPrevPage == 'true'){
        				html += "<a href=\"javascript:Position.paging('"+data.paging.prevNum+"')\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
        			}else{
        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
        			}
        			var pages = data.paging.pages;
        			for(var i=0; i < pages.length; i++){
        				var page = pages[i];
        				html += "<a href=\"javascript:Position.paging('"+page.startNum+"')\">";
        				if(currentPageNum == page.pageNum){
        					html += "<span class='num_on'>"+page.pageNum+"</span>";
        				}else{
        					html += "<span class='num'>"+page.pageNum+"</span>";
        				}
        				html += "</a>";
        			}
        			if(data.isNextPage == 'true'){
        				html += "<a href=\"javascript:Position.paging('"+data.paging.nextNum+"')\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
        			}else{
        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
        			}
        			html += "<a href=\"javascript:Position.paging('"+data.paging.lastNum+"')\"><img src='/resources/commons/images/icon/icon_paging_last.gif' /></a>";
        			$('.paginate').html(html);
    			}
            	
            	
			}
		});
		
	},
	simulator : function(){
		if(!$.string($('#tagEuid').val()).blank() && !$.string($("#startDay").val()).blank() && !$.string($("#endDay").val()).blank()){
			var startTime =  $.trim($("#startTime").val());
			var endTime =  $.trim($("#endTime").val());
			if(!$.string(startTime).blank()){
				if(startTime.length == 4) startTime = '0'+startTime;
			}
			if(!$.string(endTime).blank()){
				if(endTime.length == 4) endTime = '0'+endTime;
			}
			var url = "/service/simulator.action?pages=service.simulator.out";
			url += "&startDay="+(Position.$startDay == null ? '' : Position.$startDay);
			url += "&endDay="+(Position.$endDay == null ? '' : Position.$endDay);
			url += "&startTime="+startTime;
			url += "&endTime="+endTime;
			url += "&euid="+$("#tagEuid").val();
			console.log(url);
			Position.$windows[100] = $.window({
				showModal: false,
				modalOpacity: 0.5,
				icon : '/resources/commons/images/icon/icon_monitoring.gif',
				title: "Simulator["+$("#tagEuid").val()+"]",
				width: $(window).width()-20,
				height: $(window).height()-20,
				url: url,
				footerContent: Panel.$planName,
				bookmarkable : false,
				onClose: function (wnd) { 
					Position.$windows[100] = null;
				}
			});
			Position.$windows[100].maximize();	
		}else{
			Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.position.message.simulator);
		}
		
	},
	clearLog : function(){
		$("#dialog-confirm").dialog({
			title : $.rtls.commons.dialog.title.waring,
	        width: "300",
	        bgiframe: true,
	        autoOpen: false,
	        modal: true,
	        resizable: false,
	        buttons: [{
	        	text : $.rtls.commons.button.cancel,
				click: function() {
					$.ajax({
						async : true,
						type: 'get',
						url: "/service/position.json?action=clear.position.out",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
								Position.getLogs();
								$("#dialog-confirm").dialog( "close" );
							}else{
								Log.dialog($.rtls.commons.dialog.title.error, $.rtls.position.message.clearfail);
							}
			            }
			        });
				},
	        },{
	        	text : $.rtls.commons.button.cancel,
				click: function() {
					$( this ).dialog( "close" );
				}
			}],
			close: function() {
				$("#dialog-confirm").empty();
	        }
	        
	    });
		$("#dialog-confirm").append($.rtls.position.message.logdelconfirm);
		$('#dialog-confirm').dialog('open');
	}
	
	
};