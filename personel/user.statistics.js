var User = {
	_chartType : 0,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[3].title+'</span><span class="bg">'+$.rtls.menu[3].sub[3]+'</span>');
		var html = '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">';
        html +=	'	<li id="tab_0" class="ui-state-default ui-corner-top" onmouseover="User.tabOver(0)" onmouseout="User.tabOut(0)">';
        html +=	'		<a href="javascript:User.tabSelect(0)"><img src="/resources/commons/images/tree/dir.gif"/> '+$.rtls.user.tab.user+' </a>';
        html +=	'	</li>';  
        html +=	'	<li id="tab_1" class="ui-state-default ui-corner-top" onmouseover="User.tabOver(1)" onmouseout="User.tabOut(1)">';
        html +=	'		<a href="javascript:User.tabSelect(1)"><img src="/resources/commons/images/tree/dir.gif"/> '+$.rtls.user.tab.visit+' </a>';
        html +=	'	</li>';
        html +=	'</ul>';
        $('#tab').html(html);
		this.tabSelect(0);
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
		this._chartType = ix;
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == ix){
		    	$(this).addClass('ui-tabs-selected');
		    	$(this).addClass('ui-state-active');
		    }else{
		    	$(this).removeClass('ui-state-active');
				$(this).removeClass('ui-tabs-selected');
		    }
		});
		this.getChart(ix);
		
	},
	getChart :function(ix){
		if(ix ==0){
			$("#user-chart").html('<iframe id="chartIframe" width="100%" height="'+$(window).height()+'" src="/service/user.action?pages=service.user.statistics.zone" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>');	
		}else if(ix == 1){
			$("#user-chart").html('<iframe id="chartIframe" width="100%" height="'+$(window).height()+'" src="/service/user.action?pages=service.user.statistics.count" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>');	
		}
		
		$("#chart").load(function() {
			
		});
	},
	resizeIframeHeight : function(height){
		$('#chartIframe').animate({'height':height});
	}
	
};