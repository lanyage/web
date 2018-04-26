var Location = {
	_plan : null,	
	_plans : null,	
	_pageNum : 0,
	_sizeNum : 6,
	_planId : 0,
	init : function(){
		this.getPlans();
	},
	getPlans : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/admins/location.action?pages=get.plan.list",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Admin.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Location._plans = data;
            	var size = data.length;
            	var item, html;
            	Location._pageNum = 1;
				for(var i=0; i < size; i++){
					item = data[i];
					html = "<li id='"+i+"' class='ui-state-default ui-corner-top' onmouseover='Location.tabOver("+i+")' onmouseout='Location.tabOut("+i+")'>" +
					"<a href=\"javascript:Location.tabSelect("+i+", "+item.planId+", '"+item.planName+"', '"+item.mapName+"', "+i+")\"><img src='/admin/images/tree/dir.gif'/> "+item.planName+"</a>" +
					"</li>";
					$('#tab').find('ul').append(html);
					if(i == 0){
						Location.tabSelect(i, item.planId, item.planName, item.mapName, i);
					}else if(i == Location._sizeNum -1){
						break;
					}
				}
				if(size > Location._sizeNum){
					html = "<li id='"+Location._sizeNum+"' class='ui-state-default ui-corner-top' onmouseover='Location.tabOver("+Location._sizeNum+")' onmouseout='Location.tabOut("+Location._sizeNum+")'>" +
					"<a href=\"javascript:Location.nextPlan(2)\">다음 <img src='/admin/images/grid/next.gif'/></a>" +
					"</li>";
					$('#tab').find('ul').append(html);
            	}
    			
			}
		});
		
	},
	nextPlan : function(pageNum){
		$('#tab').find('ul').html('');
		var item, html;
		html = "<li id='0' class='ui-state-default ui-corner-top' onmouseover='Location.tabOver(0)' onmouseout='Location.tabOut(0)'>" +
		"<a href=\"javascript:Location.prevPlan("+(pageNum-1)+")\"><img src='/admin/images/grid/prev.gif'/> 이전</a>" +
		"</li>";
		$('#tab').find('ul').append(html);
		var count = 1;
		var startNum = (pageNum-1) * +Location._sizeNum;
		for(var i=startNum; i < Location._plans.length; i++){
			item = Location._plans[i];
			html = "<li id='"+count+"' class='ui-state-default ui-corner-top' onmouseover='Location.tabOver("+count+")' onmouseout='Location.tabOut("+count+")'>" +
			"<a href=\"javascript:Location.tabSelect("+count+", "+item.planId+", '"+item.planName+"', '"+item.mapName+"', "+i+")\"><img src='/admin/images/tree/dir.gif'/> "+item.planName+"</a>" +
			"</li>";
			$('#tab').find('ul').append(html);
			if(count == 1){
				Location.tabSelect(count, item.planId, item.planName, item.mapName, i);
			}else if(count == Location._sizeNum){
				break;
			}
			count++;
			
		}
		if(Location._plans.length > startNum + Location._sizeNum){
			html = "<li id='"+(count+1)+"' class='ui-state-default ui-corner-top' onmouseover='Location.tabOver("+(count+1)+")' onmouseout='Location.tabOut("+(count+1)+")'>" +
			"<a href=\"javascript:Location.nextPlan("+(pageNum+1)+")\">다음 <img src='/admin/images/grid/next.gif'/></a>" +
			"</li>";
			$('#tab').find('ul').append(html);
    	}
	},
	prevPlan : function(pageNum){
		$('#tab').find('ul').html('');
		var item, html;
		var startNum = (pageNum-1) * Location._sizeNum;
		if(startNum > 0){
			html = "<li id='0' class='ui-state-default ui-corner-top' onmouseover='Location.tabOver(0)' onmouseout='Location.tabOut(0)'>" +
			"<a href=\"javascript:Location.prevPlan("+(pageNum-1)+")\"><img src='/admin/images/grid/prev.gif'/> 이전</a>" +
			"</li>";
			$('#tab').find('ul').append(html);
		}
		var count = 0;
		if(startNum > 0){
			count = 1;	
		}
		
		for(var i=startNum; i < Location._plans.length; i++){
			item = Location._plans[i];
			html = "<li id='"+count+"' class='ui-state-default ui-corner-top' onmouseover='Location.tabOver("+count+")' onmouseout='Location.tabOut("+count+")'>" +
			"<a href=\"javascript:Location.tabSelect("+count+", "+item.planId+", '"+item.planName+"', '"+item.mapName+"', "+i+")\"><img src='/admin/images/tree/dir.gif'/> "+item.planName+"</a>" +
			"</li>";
			$('#tab').find('ul').append(html);
			if(startNum > 0){
				if(count == 1){
					Location.tabSelect(count, item.planId, item.planName, item.mapName, i);
				}else if(count == Location._sizeNum){
					break;
				}
			}else{
				if(count == 0){
					Location.tabSelect(count, item.planId, item.planName, item.mapName, i);
				}else if(count == Location._sizeNum-1){
					break;
				}
			}
			
			count++;
			
		}
		html = "<li id='"+(count+1)+"' class='ui-state-default ui-corner-top' onmouseover='Location.tabOver("+(count+1)+")' onmouseout='Location.tabOut("+(count+1)+")'>" +
		"<a href=\"javascript:Location.nextPlan("+(pageNum+1)+")\">다음 <img src='/admin/images/grid/next.gif'/></a>" +
		"</li>";
		$('#tab').find('ul').append(html);
    	
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
	tabSelect : function(ix, planId, planName, mapName, index){
		this._plan = this._plans[index];
		this._planId = planId;
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == ix){
		    	$(this).addClass('ui-tabs-selected');
		    	$(this).addClass('ui-state-active');
		    }else{
		    	$(this).removeClass('ui-state-active');
				$(this).removeClass('ui-tabs-selected');
		    }
		});
		this.makeLocation();
	},
	makeLocation : function(){
		var addr = $('#addr').val();
	    var requiredMajorVersion = 9;
		var requiredMinorVersion = 0;
		var requiredRevision = 124;
		var hasProductInstall = DetectFlashVer(6, 0, 65);
		var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);
		if ( hasProductInstall && !hasRequestedVersion ) {
			var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
			var MMredirectURL = window.location;
		    document.title = document.title.slice(0, 47) + " - Flash Player Installation";
		    var MMdoctitle = document.title;
		    AC_FL_RunContent(
				"src", "/admin/jsp/ulocation/playerProductInstall",
				"FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+MMdoctitle+'&addr='+addr+'&planId='+Location._planId+"",
				"width", "100%",
				"height", "700",
				"align", "middle",
				"id", "Main",
				"quality", "high",
				"bgcolor", "#869ca7",
				"name", "Main",
				"allowScriptAccess","sameDomain",
				"type", "application/x-shockwave-flash",
				"pluginspage", "http://www.adobe.com/go/getflashplayer"
			);
		} else if (hasRequestedVersion) {
			AC_FL_RunContent(
					"src", "/admin/jsp/ulocation/Main",
					"width", "100%",
					"height", "700",
					"align", "middle",
					"id", "Main",
					"quality", "high",
					"bgcolor", "#869ca7",
					"name", "Main",
					"FlashVars", "addr="+addr+'&planId='+Location._planId+"",
					"allowScriptAccess","sameDomain",
					"type", "application/x-shockwave-flash",
					"pluginspage", "http://www.adobe.com/go/getflashplayer"
			);
		} else {
		    var alternateContent = 'Alternate HTML content should be placed here. '
		  	+ 'This content requires the Adobe Flash Player. '
		   	+ '<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
		    $('#maps').html(alternateContent);
		}
	}
};