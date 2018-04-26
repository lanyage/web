var videoSee = {
	$chartType : 0,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[2]+'</span>');
		var html = '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">';
        html +=	'	<li id="tab_0" class="tabSelect-default" onmouseover="videoSee.tabOver(0)" onmouseout="videoSee.tabOut(0)">';
        html +=	'		<a href="javascript:videoSee.tabSelect(0)"><img src=""/> '+$.rtls.video.see.tab.tag+' </a>';
        html +=	'	</li>';  
        html +=	'	<li id="tab_1" class="tabSelect-default" onmouseover="videoSee.tabOver(1)" onmouseout="videoSee.tabOut(1)">';
        html +=	'		<a href="javascript:videoSee.tabSelect(1)"><img src=""/> '+$.rtls.video.see.tab.device+' </a>';
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
			$("#iframe-container").html('<iframe id="chartIframe" width="100%" height="'+$(window).height()+'" src="/service/video.see.action?pages=service.video.see.tag" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>');	
		}else if(ix == 1){
			$("#iframe-container").html('<iframe id="chartIframe" width="100%" height="'+$(window).height()+'" src="/service/video.see.action?pages=service.video.see.device" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>');	
		}else if(ix == 2){
			$("#iframe-container").html('<iframe id="chartIframe" width="100%" height="'+$(window).height()+'" src="" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>');	
		}

	},
	resizeIframeHeight : function(height){
		$('#chartIframe').animate({'height':height});
	}

	
};