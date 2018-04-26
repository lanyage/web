var TAG = {
	$item : null, $items : null, 
	$startNum : 0, $searchType : 0, $keyword : null, $status : 0, $type : 0,  $active : 0,
	_tag : null, _tags : [],
	$tagstatus : new HashMap(),
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[2].title+'</span><span class="bg">'+$.rtls.menu[2].sub[1]+'</span>');
		
		var html = '<table>';
		html += '<tr>';
		html += '	<td  height="20">';
		html += '		<div id="search-fields">';
		html += '		<p>';
		html += '			<label>'+$.rtls.tag.form.search+'</label>';
		html += '			<select id="searchType" name="searchType">';
		html += '				<option value="0">'+$.rtls.tag.form.select+'</option>';
		html += '				<option value="1">编号</option>';
		html += '				<option value="2">连续</option>';
		html += '			</select>';
		html += '			<input type="text" id="keyword" value="" />';
		html += '			<button id="but-search">'+$.rtls.tag.button.search+'</button>';
		html += '		</p>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td  height="20">';
		html += '		<div id="search-fields">';
		html += '			<label>'+$.rtls.tag.form.tagType+'</label>';
		html += '			<ol id="type-selectable" class="ui-selectable">';
		html += '			<li class="ui-widget-content ui-selectee ui-selected"><img src="/resources/commons/images/icon/icon_set.png" style="float:left; padding-right:3px"/>'+$.rtls.tag.form.full+'</li>';
		html += '			<li class="ui-widget-content"><img src="/resources/commons/images/icon/icon_set.png" style="float:left; padding-right:3px"/>'+$.rtls.tag.type[0]+'</li>';
		html += '			<li class="ui-widget-content"><img src="/resources/commons/images/icon/icon_set.png" style="float:left; padding-right:3px"/>'+$.rtls.tag.type[1]+'</li>';
		html += '			</ol>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td  height="20">';
		html += '		<div id="search-fields">';
		html += '			<label>'+$.rtls.tag.form.activeStatus+'</label>';
		html += '			<ol id="active-selectable" class="ui-selectable">';
		html += '			<li class="ui-widget-content ui-selectee ui-selected"><img src="/resources/commons/images/icon/icon_set.png" style="float:left; padding-right:3px"/>'+$.rtls.tag.form.full+'</li>';
		html += '			<li class="ui-widget-content"><img src="/resources/commons/images/icon/icon_set.png" style="float:left; padding-right:3px"/>活 跃</li>';
		html += '			<li class="ui-widget-content"><img src="/resources/commons/images/icon/icon_set.png"style="float:left; padding-right:3px"/>休 眠</li>';
		html += '			</ol>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td  height="20">';
		html += '		<div id="search-fields">';
		html += '			<label>'+$.rtls.tag.form.tagStatus+'</label>';
		html += '			<ol id="status-selectable" class="ui-selectable">';
		html += '			<li class="ui-widget-content"><img src="/resources/commons/images/icon/icon_set.png" style="float:left; padding-right:3px"/>'+$.rtls.tag.form.full+'</li>';
		html += '			<li class="ui-widget-content"><img src="/resources/commons/images/icon/icon_set.png" style="float:left; padding-right:3px"/>'+$.rtls.tag.status[0]+'</li>';
		html += '			<li class="ui-widget-content"><img src="/resources/commons/images/icon/icon_set.png" style="float:left; padding-right:3px"/>'+$.rtls.tag.status[1]+'</li>';
		html += '			</ol>';
		html += '		</div>';
		html += '	</td>';
		html += '</tr>';
		html += '</table>';
		$("#search-form").html(html);
		
		$("#but-search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			TAG.$startNum = 0;
			TAG.$searchType = $('#searchType').val();
			TAG.$keyword = $('#keyword').val();
			TAG.getTags();
			return false; 
		});
		$("#type-selectable").selectable({
			stop: function() {
				$( ".ui-selected", this ).each(function() {
					TAG.$startNum = 0;
					TAG.$type = $( "#type-selectable li" ).index( this );
					TAG.getTags();
				});		
			}
		});
		$("#status-selectable").selectable({
			stop: function() {
				$( ".ui-selected", this ).each(function() {
					TAG.$startNum = 0;
					TAG.$status = $( "#status-selectable li" ).index( this );
					TAG.getTags();
				});		
			}
		
		});
		$("#active-selectable").selectable({
			stop: function() {
				$( ".ui-selected", this ).each(function() {
					TAG.$startNum = 0;
					TAG.$active = $( "#active-selectable li" ).index( this );
					TAG.getTags();
				});		
			}
		});
		this.$tagstatus.put('1', $.rtls.tag.status[0]);
		this.$tagstatus.put('2', $.rtls.tag.status[1]);
		this.$tagstatus.put('3', $.rtls.tag.status[2]);
		this.$tagstatus.put('4', $.rtls.tag.status[3]);
		this.$tagstatus.put('5', $.rtls.tag.status[4]);
		this.$tagstatus.put('6', $.rtls.tag.status[5]);
		$("#status-selectable li").eq(2).addClass('ui-selected');
		TAG.$status = 2;
		this.getTags();
	},
	paging : function(startNum){
		this.$startNum = startNum;
		this.getTags();
	},
	getTags : function(){
		$('#device-status').html('');
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/tag.json?action=get.tags",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"startNum" : TAG.$startNum,
            	"scaleNum" : 100,
            	"type" : TAG.$type,
				"status" : TAG.$status,
				"active" : TAG.$active,
				"searchType" : TAG.$searchType,
				"keyword" : (TAG.$keyword == null ? '' : TAG.$keyword)
            	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	TAG.$items = data.tags;
            	var totalNum = data.paging.totalNum;
            	$('.top_left').html($.rtls.tag.list.top(totalNum));
            	if(TAG.$items.length == 0){
            		$('#tag-status').html("<center>"+$.rtls.tag.list.empty+"<center>");
            		var html = ""+$.rtls.tag.form.status+" (活跃 = <span style='color:#00b4fa;font-weight:bold'>0</span>"+$.rtls.tag.form.number+", 休眠 = <span style='color:#ff0800;font-weight:bold'>0</span>"+$.rtls.tag.form.number+") ";
    				html += ""+$.rtls.tag.form.battery+" ( <img src='/resources/service/images/zoodac/battery_100.png' border='0'/> <span style='color:#00b4fa;font-weight:bold'>0</span>"+$.rtls.tag.form.number+", ";
    				html += "<img src='/resources/service/images/zoodac/battery_50.png' border='0'/> <span style='color:#ff9b00;font-weight:bold'>0</span>"+$.rtls.tag.form.number+", ";
    				html += "<img src='/resources/service/images/zoodac/battery_20.png' border='0'/> <span style='color:#ff0800;font-weight:bold'>0</span>"+$.rtls.tag.form.number+")";
    				$('.top_right').html(html);
					
    			}else{
    				var item;
    				var html = "", euid = "";
    				var lowCount = 0, midCount = 0, activeCount =0 , sleepCount =0;
    				for(var i=0; i < TAG.$items.length; i++){
    					item = TAG.$items[i];
    					//euid = item.euid.substring(item.euid.length-4, item.euid.length);
    					euid = item.euid;
    					if(item.batteryState == 1 || parseFloat(item.batteryLevel) < 2.7){
    						lowCount++;
    						html += "<div id='tag_"+item.tagId+"' class='tag-box-alive'>";
    						if(item.type == 1){
    							html += "<img src='/resources/service/images/zoodac/tag_status.png' border='0' align='absmiddle'/> <b>"+euid+"</b> <img src='/resources/service/images/zoodac/battery_20.png' border='0' align='absmiddle'/><br>";
    						}else{
    							html += "<img src='/resources/service/images/zoodac/tag_status.png' border='0' align='absmiddle'/> <b>"+euid+"</b> <img src='/resources/service/images/zoodac/battery_20.png' border='0' align='absmiddle'/><br>";	
    						}
    							
    					}else if(parseFloat(item.batteryLevel) > 2.7 && parseFloat(item.batteryLevel) < 2.9){
    						midCount++;
    						html += "<div id='tag_"+item.tagId+"' class='tag-box-alive'>";
    						if(item.type == 1){
    							html += "<img src='/resources/service/images/zoodac/tag_status.png' border='0' align='absmiddle'/> <b>"+euid+"</b> <img src='/resources/service/images/zoodac/battery_50.png' border='0' align='absmiddle'/><br>";
    						}else{
    							html += "<img src='/resources/service/images/zoodac/tag_status.png' border='0' align='absmiddle'/> <b>"+euid+"</b> <img src='/resources/service/images/zoodac/battery_50.png' border='0' align='absmiddle'/><br>";	
    						}	
    					}else{
    						html += "<div id='tag_"+item.tagId+"' class='tag-box-alive'>";
    						if(item.type == 1){
    							html += "<img src='/resources/service/images/zoodac/tag_status.png' border='0' align='absmiddle'/> <b>"+euid+"</b> <img src='/resources/service/images/zoodac/battery_100.png' border='0' align='absmiddle'/><br>";
    						}else{
    							html += "<img src='/resources/service/images/zoodac/tag_status.png' border='0' align='absmiddle'/> <b>"+euid+"</b> <img src='/resources/service/images/zoodac/battery_100.png' border='0' align='absmiddle'/><br>";	
    						}
    					}
    					var tiltStatus = "";
    					if(item.tilt == 0 || ($.now() - item.aliveTime) > 10000){
    						sleepCount++;
    						tiltStatus = "Sleep";
    					}else{
    						activeCount++;
							tiltStatus = "<span style='color:blue'>Active</span>";
    					}
    					html += "<img src='' border='0'/><a>"+$.rtls.tag.form.version+"</a> : "+item.version+"<br>";
    					html += "<img src='' border='0'/><a>"+$.rtls.tag.form.blink+"</a> : "+(item.blinkTerm == 0 ? '--' : item.blinkTerm)+"<br>";
						if(item.batteryState == '1' || parseFloat(item.batteryLevel) < 2.6){
	    					html += "<img src='' border='0'/><a>"+$.rtls.tag.form.battery+"</a> :  <span class='font_color2 bold'>"+item.batteryLevel+"</span>v <br>";
						}else{
							html += "<img src='' border='0'/><a>"+$.rtls.tag.form.battery+"</a> : "+item.batteryLevel+"v <br>";
						}
    					if(item.status == 1){
    						html += "<img src='' border='0'/><a>"+$.rtls.tag.form.status+"</a> : "+$.rtls.tag.status[0]+", Tilt : "+tiltStatus+"<br>";
    					}else if(item.status == 2){
    						html += "<img src='' border='0'/><a>"+$.rtls.tag.form.status+"</a> : <span style='color:blue'>"+$.rtls.tag.status[1]+"</span>, Tilt : "+tiltStatus+"<br>";
    					}else if(item.status == 3){
    						html += "<img src='' border='0'/><a>"+$.rtls.tag.form.status+"</a> : <span style='color:red'>"+$.rtls.tag.status[2]+"</span>, Tilt : "+tiltStatus+"<br>";
    					}else if(item.status == 4){
    						html += "<img src='' border='0'/><a>"+$.rtls.tag.form.status+"</a> : <span style='color:red'>"+$.rtls.tag.status[3]+"</span>, Tilt : "+tiltStatus+"<br>";
    					}else if(item.status == 5){
    						html += "<img src='' border='0'/><a>"+$.rtls.tag.form.status+"</a> : <span style='color:red'>"+$.rtls.tag.status[4]+"</span>, Tilt : "+tiltStatus+"<br>";
    					}else if(item.status == 6){
    						html += "<img src='' border='0'/><a>"+$.rtls.tag.form.status+"</a> : <span style='color:red'>"+$.rtls.tag.status[5]+"</span>, Tilt : "+tiltStatus+"<br>";
    					}
    					if(($.now() - item.aliveTime) <= 10000){
    						html += "<img src='' border='0'/><a>"+$.rtls.tag.form.active+"</a> : <span style='color:blue'>"+$.rtls.tag.active.normal+"</span><br>";
    					}else{
    						html += "<img src='' border='0'/><a>"+$.rtls.tag.form.active+"</a> : <span style='color:red'>"+$.rtls.tag.active.stop+"</span><br>";
    					}
    					html += "<img src='' border='0'/><a>"+$.rtls.tag.form.aliveTime+"</a> : "+item.aliveTime.msdate()+"<br><div id='tag-status-line'></div>";
    					html += "</div>";
    					
    				}
    				$('#tag-status').html(html);
    				html = ""+$.rtls.tag.form.status+" (Active = <span style='color:#00b4fa;font-weight:bold'>"+activeCount+"</span>"+$.rtls.tag.form.number+", Sleep = <span style='color:#ff0800;font-weight:bold'>"+sleepCount+"</span>"+$.rtls.tag.form.number+") ";
    				html += ""+$.rtls.tag.form.battery+" ( <img src='/resources/service/images/zoodac/battery_100.png' border='0'/> <span style='color:#00b4fa;font-weight:bold'>"+(totalNum - lowCount - midCount)+"</span>"+$.rtls.tag.form.number+", ";
    				html += "<img src='/resources/service/images/zoodac/battery_50.png' border='0'/> <span style='color:#ff9b00;font-weight:bold'>"+(midCount)+"</span>"+$.rtls.tag.form.number+", ";
    				html += "<img src='/resources/service/images/zoodac/battery_20.png' border='0'/> <span style='color:#ff0800;font-weight:bold'>"+(lowCount)+"</span>"+$.rtls.tag.form.number+")";
    				$('.top_right').html(html);
					
    				var pages = data.paging.pages;
        			if(pages.length > 2){
        				html = "<a href=\"javascript:TAG.paging(0)\"><img src='/resources/commons/images/icon/icon_paging_first.gif' /></a>";
            			if(data.isPrevPage == 'true'){
            				html += "<a href=\"javascript:TAG.paging('"+data.prevNum+"')\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
            			}else{
            				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
            			}
            			var currentPageNum = parseInt(data.paging.currentPageNum);
            			for(var i=0; i < pages.length; i++){
            				var page = pages[i];
            				html += "<a href=\"javascript:TAG.paging('"+page.startNum+"')\">";
            				if(currentPageNum == page.pageNum){
            					html += "<span class='num_on'>"+page.pageNum+"</span>";
            				}else{
            					html += "<span class='num'>"+page.pageNum+"</span>";
            				}
            				html += "</a>";
            			}
            			if(data.isNextPage == 'true'){
            				html += "<a href=\"javascript:TAG.paging('"+data.nextNum+"')\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
            			}else{
            				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
            			}
            			html += "<a href=\"javascript:TAG.paging('"+data.lastNum+"')\"><img src='/resources/commons/images/icon/icon_paging_last.gif' /></a>";
            			$('.paginate').html(html);
    				}
    				
    				
    			}
            	
			}
		});
		
	}
};