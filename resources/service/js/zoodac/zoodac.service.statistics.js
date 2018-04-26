var Service = {
	$chartType : 0,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[2]+'</span>');
		var html = '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">';
        html +=	'	<li id="tab_0" class="tabSelect-default" onmouseover="Service.tabOver(0)" onmouseout="Service.tabOut(0)">';
        html +=	'		<a href="javascript:Service.tabSelect(0)"><img src=""/> '+$.rtls.service.tab.success+' </a>';
        html +=	'	</li>';  
        html +=	'	<li id="tab_1" class="tabSelect-default" onmouseover="Service.tabOver(1)" onmouseout="Service.tabOut(1)">';
        html +=	'		<a href="javascript:Service.tabSelect(1)"><img src=""/> '+$.rtls.service.tab.time+' </a>';
        html +=	'	</li>';
        html +=	'	<li id="tab_2" class="tabSelect-default" onmouseover="Service.tabOver(2)" onmouseout="Service.tabOut(2)">';
        html +=	'		<a href="javascript:Service.tabSelect(2)"><img src=""/> '+$.rtls.service.tab.rap+' </a>';
        html +=	'	</li>';
        html +=	'</ul>';
        $('#tab').html(html);
		this.tabSelect(0);
		var backgroundHg = $(window).height();
		$("#layout .container").animate({'height':backgroundHg-96});//96为页眉和页脚的和
	},
	tabOver : function(index){
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == index){
		    	$(this).addClass('tab-hover');
		    }else{
		    	$(this).removeClass('tab-hover');
		    }
		});
		
	},
	tabOut : function(index){
		$('#tab').find('ul').find('li').each(function(i) {
	    	$(this).removeClass('tab-hover');
		});
		
	},
	tabSelect : function(ix){
		this.$chartType = ix;
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == ix){
		    	$(this).addClass('tabSelect-active');
		    	$(this).addClass('textColor');
		    }else{
		    	$(this).removeClass('tabSelect-active');
				$(this).removeClass('textColor');
		    }
		});
		this.getChart(ix);
		
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
	getChart :function(ix){
		if(ix ==0){
			$("#iframe-container").html('<iframe id="chartIframe" width="100%" height="'+$(window).height()+'" src="/service/service.action?pages=service.service.statistics.success" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>');	
		}else if(ix == 1){
			$("#iframe-container").html('<iframe id="chartIframe" width="100%" height="'+$(window).height()+'" src="/service/service.action?pages=service.service.statistics.time" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>');	
		}else if(ix == 2){
			$("#iframe-container").html('<iframe id="chartIframe" width="100%" height="'+$(window).height()+'" src="/service/service.action?pages=service.service.statistics.rap" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>');	
		}
		
	},
	resizeIframeHeight : function(height){
		$('#chartIframe').animate({'height':height});
	}
	
};