
(function ($) {
$.map = $.map || {};
$.extend( $.map, {
	plan : {}, 
	width : 0, 
	height : 0,
	isEvent : false, 
	canvas : null, 
	viewport : null, 
	grid : null, 
	ruler: {top : null, left : null},
	view : {isGrid : false, isRuler : false, isTool : false},
	tool : {button : null, bar : null, isPointer : true, isDistance : true, isGrid : true, isRuler : true, isBarrier : false, action : 'pointer'}, 
	distance : {point1 : null, point2 : null},
	barrier : {points : []}, //장애물 path
	target : null, //호출할 객체
});
$.map.ui = function(){ // MAP UI INIT
	$("#viewport").css('position', 'relative').css('width', '100%').css('height', (parseInt($.map.plan.height) + 50)+'px').css('overflow', 'hidden');
	$("#viewport").html('<div id="mapview" style="width:100%; height:'+(parseInt($.map.plan.height) + 50)+'px; overflow:auto;"></div>');
	$("#viewport #mapview").append('<div id="map-viewport-barrier"></div><div id="map-viewport"></div>');
	$("#viewport #mapview").append('<div id="map-gruler-top"></div>');
	$("#viewport #mapview").append('<div id="map-gruler-left"></div>');
	$("#viewport #mapview").append('<div id="map-tool-button"></div>');
	$("#viewport #mapview").append('<div id="map-tool-bar"><ol id="map-selectable"></ol></div>');
	$("#map-tool-bar #map-selectable").append('<li id="but_pointer" title="'+$.rtls.plan.tool.pointer+'" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/map/icon_pointer.gif" style="float:left; padding-right:3px"/>');
	$("#map-tool-bar #map-selectable").append('<li id="but_distance" title="'+$.rtls.plan.tool.distance+'" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/map/icon_distance.gif" style="float:left; padding-right:3px"/>');
	$("#map-tool-bar #map-selectable").append('<li id="but_distance_point" title="'+$.rtls.plan.tool.distancePoint+'" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/map/icon_distance_point.gif" style="float:left; padding-right:3px"/>');
	if($.map.tool.isGrid)  $("#map-tool-bar #map-selectable").append('<li id="but_grid" title="'+$.rtls.plan.tool.grid+'" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/map/icon_grid.gif" style="float:left; padding-right:3px"/>');
	if($.map.tool.isRuler) $("#map-tool-bar #map-selectable").append('<li id="but_ruler" title="'+$.rtls.plan.tool.ruler+'" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/map/icon_ruler.gif" style="float:left; padding-right:3px"/>');
	if($.map.tool.isBarrier) $("#map-tool-bar #map-selectable").append('<li id="but_barrier" title="'+$.rtls.plan.tool.barrier+'" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/map/icon_wall.gif" style="float:left; padding-right:3px"/>');

	$.map.viewport = $('#map-viewport');
	$.map.viewport.css('background-image','url(/files/plan/map_'+$.map.plan.planId+'.'+$.map.plan.ext+'?time='+ new Date().getTime() +')').css('background-repeat', 'no-repeat').css('width', '100%').css('height', (parseInt($.map.plan.height) + 50)+'px').css('min-width', $.map.plan.width+'px');
	$.map.width = $.map.viewport.width();
	$.map.height = $.map.viewport.height();
	$.map.canvas = new Raphael("map-viewport", $.map.width, $.map.height);
	if($.map.view.isGrid){
		$.map.draw.grid();
	}
	if($.map.view.isRuler){
		$.map.ruler.top = new Raphael("map-gruler-top", $.map.width, 16);	
		$.map.ruler.left = new Raphael("map-gruler-left", 16, $.map.height);	
		$.map.draw.ruler();
	}
	// INIT TOOL
	$.map.tool.button = $('#map-tool-button');
	$.map.tool.button.html('<img src="/resources/commons/images/map/icon_tool_off.gif"/>');
	$.map.tool.button.click(function(e) {
		if($.map.tool.bar.is(":visible")){
			$.map.tool.bar.hide();
			$.map.tool.button.html('<img src="/resources/commons/images/map/icon_tool_off.gif"/>');
		}else{
			$.map.tool.bar.show();
			$.map.tool.button.html('<img src="/resources/commons/images/map/icon_tool_on.gif"/>');
		}
		
	});
	$.map.tool.bar = $('#map-tool-bar');
	$.map.tool.bar.css('left', ($("#viewport #mapview").width()-50)+'px');
	// 기본선택 툴
	if($.map.tool.isPointer){
		$.map.tool.bar.find('#but_pointer').click(function(e) {
			$.map.tool.bar.find('#but_pointer').addClass('ui-selected');
			$.map.tool.bar.find('#but_distance').removeClass('ui-selected');
			$.map.tool.bar.find('#but_distance_point').removeClass('ui-selected');
			$.map.tool.bar.find('#but_barrier').removeClass('ui-selected');
			$.map.clear();
			$.map.tool.action = 'pointer';
		});
		$.map.tool.bar.find('#but_pointer').addClass('ui-selected');
		
	}else{
		$.map.tool.bar.find('#but_pointer').hide();
	}
	if($.map.tool.isDistance){
		// 자유거리계산 툴
		$.map.tool.bar.find('#but_distance').click(function(e) {
			$.map.tool.bar.find('#but_pointer').removeClass('ui-selected');
			$.map.tool.bar.find('#but_distance').addClass('ui-selected');
			$.map.tool.bar.find('#but_distance_point').removeClass('ui-selected');
			$.map.tool.bar.find('#but_barrier').removeClass('ui-selected');
			$.map.clear();
			$.map.tool.action = 'distance';
			
		});
		// 두지점 거리계산 툴
		$.map.tool.bar.find('#but_distance_point').click(function(e) {
			$.map.tool.bar.find('#but_pointer').removeClass('ui-selected');
			$.map.tool.bar.find('#but_distance').removeClass('ui-selected');
			$.map.tool.bar.find('#but_distance_point').addClass('ui-selected');
			$.map.tool.bar.find('#but_barrier').removeClass('ui-selected');
			$.map.clear();
			$.map.tool.action = 'distance_point';
			
		});
	}else{
		$.map.tool.bar.find('#but_distance').hide();
		$.map.tool.bar.find('#but_distance_point').hide();
	}
	if($.map.tool.isBarrier){
		// 장애물 등록 툴
		$.map.tool.bar.find('#but_barrier').click(function(e) {
			$.map.tool.bar.find('#but_pointer').removeClass('ui-selected');
			$.map.tool.bar.find('#but_distance').removeClass('ui-selected');
			$.map.tool.bar.find('#but_distance_point').removeClass('ui-selected');
			$.map.tool.bar.find('#but_barrier').addClass('ui-selected');
			$.map.clear();
			$.map.tool.action = 'barrier';
			
		});
	}else{
		$.map.tool.bar.find('#but_barrier').hide();
	}
	if($.map.tool.isGrid){
		// 그리드 보기/숨기기
		$.map.tool.bar.find('#but_grid').click(function(e) {
			if($.map.view.isGrid){
				$.map.view.isGrid = false;
				$.map.tool.bar.find('#but_grid').removeClass('ui-selected');
				$.map.viewport.children('svg').children().each(function(){
					if($(this).attr('id') == 'gline100' || $(this).attr('id') == 'gline50'){
						$(this).remove();
					}
				});
			}else{
				$.map.view.isGrid = true;
				$.map.tool.bar.find('#but_grid').addClass('ui-selected');
				$.map.draw.grid();
			}
		});
		$.map.tool.bar.find('#but_grid').addClass('ui-selected');
	}else{
		$.map.tool.bar.find('#but_grid').hide();
	}
	if($.map.tool.isRuler){
		// 눈금자 보기/숨기기
		$.map.tool.bar.find('#but_ruler').click(function(e) {
			if($.map.view.isRuler){
				$.map.view.isRuler = false;
				$.map.tool.bar.find('#but_ruler').removeClass('ui-selected');
				$('#map-gruler-top').hide();
				$('#map-gruler-left').hide();
			}else{
				$.map.view.isRuler = true;
				$.map.tool.bar.find('#but_ruler').addClass('ui-selected');
				$('#map-gruler-top').show();
				$('#map-gruler-left').show();
			}
		});
		$.map.tool.bar.find('#but_ruler').addClass('ui-selected');
	}else{
		$.map.tool.bar.find('#but_ruler').hide();
	}
	$.map.tool.action = 'pointer';
	if(!$.map.view.isTool){
		$.map.tool.bar.hide();
	}
}

$.map.marker = {
	item : {}, items : [],	
	add : function(item, isClick, isDraggable, target){
		$.map.viewport.append(item.marker);
		var marker = $.map.viewport.find('#'+item.id);
		var left = parseInt(item.localX) - (marker.width()/2);
		var top = parseInt(item.localY) - (marker.height()/2);
		marker.css('left', left+'px').css('top', top+'px');
		
		if(isClick == null || isClick == undefined) isClick = false;
		if(isDraggable == null || isDraggable == undefined) isDraggable = true;
		if(isClick){
			$.map.viewport.find('#'+item.id).mousedown(function(e) {
				if(e.which == 1){
					if($.map.tool.action == 'distance_point'){ //두지점 사이의 거리
						if($.map.distance.point1 == null){
							$.map.distance.point1 = $(e.target);
							$.map.marker.select($(e.target));
						}else if($.map.distance.point2 == null){
							$.map.marker.select($(e.target));
							$.map.distance.point2 = $(e.target);
							var dx1 = $.map.distance.point1.attr('localX');
							var dy1 = $.map.distance.point1.attr('localY');
							var dz1 = $.map.distance.point1.attr('localZ');
							var dx2 = $.map.distance.point2.attr('localX');
							var dy2 = $.map.distance.point2.attr('localY');
							var dz2 = $.map.distance.point2.attr('localZ');
							var d = $.map.carc.distance(dx1, dx2, dy1, dy2, dz1, dz2);
							
							var rmsg = $.map.carc.pxToMeter(d)+'m = ';
							rmsg += $.map.distance.point1.attr('title')+'('+$.map.carc.pxToMeter(dx1)+'m, '+$.map.carc.pxToMeter(dy1)+'m) ~ ';
							rmsg += $.map.distance.point2.attr('title')+'('+$.map.carc.pxToMeter(dx2)+'m ,'+$.map.carc.pxToMeter(dy2)+'m)';
							$.map.tooltip.show(dx1, (parseInt(dy1)+5), 'distance', rmsg);
							$.map.distance.point1 = null;
							$.map.distance.point2 = null;
						}
					}else if($.map.tool.action == 'pointer'){
						$.map.marker.select($(e.target));
						if(target != null && target != undefined){
							if(target.$id == 'calibration'){
								if($(this).attr('id').indexOf('rap') != -1){
									target.callback.rapSelect();	
								}else if($(this).attr('id').indexOf('tag') != -1){
									target.callback.tagSelect();	
								}
									
							}
							
						}	
					}
				}
	            
	        }).mouseup(function(e) {
	        		
	        }).mouseout(function(e) {
	        	
	        });
			
		}
		if(isDraggable){
			$.map.viewport.find('#'+item.id).draggable({
				iframeFix: true,
				refreshPositions : true,
				helper: 'clone',
				cursor: 'crosshair', 
				opacity: 0.1,
				start: function(e, ui) {
					
				},
				drag: function(e, ui) {
					if($.map.tool.action == 'pointer'){
						$.map.viewport.children('svg').children().each(function(){
							if($(this).attr('id') == 'pline' || $(this).attr('id') == 'ptext'){
								$(this).remove();
							}
						});
						
						var ox = ui.position.left;
						var oy = ui.position.top;
						var oz = $(this).attr('localZ');
						$(this).css({ top:oy+"px", left:ox+"px" }).attr('localX', ox).attr('localY', oy);
						$.map.draw.line('M'+ox+' '+0+'L'+ox+' '+$.map.height+'M'+0+' '+oy+'L'+$.map.width+' '+oy+'Z', 1, '#F71414', 'dot', 'pline');
						
						if($(this).attr('type') <= 2){ // RAP 이면
							var masterId = parseInt($(this).attr('masterId'));
							var masterId2 = parseInt($(this).attr('masterId2'));
							var masterId3 = parseInt($(this).attr('masterId3'));
							var text = '', master = {}, mx=0, my=0, mz=0;
							if(masterId > 0){
								master = $.map.viewport.find('#'+masterId);
								mx = master.attr('localX');
								my = master.attr('localY');
								mz = master.attr('localZ');
								$.map.draw.line('M'+mx+' '+my+'L'+ox+' '+oy+'Z', 1, "#F71414", 'dot', 'pline');	
								text = $.map.carc.pxToMeter($.map.carc.distance(mx, ox, my, oy, mz, oz))+'m';
							}
							if(masterId2 > 0){
								master = $.map.viewport.find('#'+masterId2);
								mx = master.attr('localX');
								my = master.attr('localY');
								mz = master.attr('localZ');
								$.map.draw.line('M'+mx+' '+my+'L'+ox+' '+oy+'Z', 1, "#F71414", 'dot', 'pline');	
								text += ', '+$.map.carc.pxToMeter($.map.carc.distance(mx, ox, my, oy, mz, oz))+'m';
							}
							if(masterId3 > 0){
								master = $.map.viewport.find('#'+masterId3);
								mx = master.attr('localX');
								my = master.attr('localY');
								mz = master.attr('localZ');
								$.map.draw.line('M'+mx+' '+my+'L'+ox+' '+oy+'Z', 1, "#F71414", 'dot', 'pline');	
								text += ', '+$.map.carc.pxToMeter($.map.carc.distance(mx, ox, my, oy, mz, oz))+'m';
							}
							
							$.map.draw.text(ox+20, oy - 8, $.map.carc.pxToMeter(ox)+'m x '+$.map.carc.pxToMeter(oy)+'m ('+text+')', 'ptext');
						}else{
							if($(this).attr('id').indexOf('tag') != -1){
								// text 이동
								var ids = ($(this).attr('id')+'').split('_');
								$.map.draw.getItem('tag_text_'+ids[1]).animate({x : ox, y : (oy + 18)}, 10);	
							}
							
						}
						
					}
				},
				stop: function(e, ui) {
					if($.map.tool.action == 'pointer'){
						var localX = ui.position.left;
						var localY = ui.position.top;
						$(this).attr('localX', localX);
						$(this).attr('localY', localY);
						$(this).css({ top:(localY - ($(this).height()/2))+"px", left:(localX - ($(this).width()/2))+"px" });
						$.map.viewport.children('svg').children().each(function(){
							if($(this).attr('id') == 'pline' || $(this).attr('id') == 'ptext'){
								$(this).remove();
							}
						});
						if(target != null && target != undefined && target.$id == 'calibration'){
							if($(this).attr('id').indexOf('tag') != -1){
								target.callback.tagMod();
							}
						}
						
					}
					
					
				}
			});
		}
		
	},
	getItem : function (id){
		return $.map.viewport.find('#'+id);
	},
	getItems : function(){
		var markers = new Array();
		$.map.viewport.children().each(function(){
			if($(this).attr('id') != undefined){
				if($(this).attr('name') == 'marker'){
					markers.push($(this));	
				}
			}
			
		});
		return markers;
	},
	getSelectedItem : function (){
		return $.map.marker.item;
	},
	remove : function(id){
		$.map.viewport.children().each(function(){
			if($(this).attr('id') == id){
				$( this ).remove();
			}
		});
	},
	removeAll : function(){
		$.map.viewport.children().each(function(){
			if($( this ).attr('name') == 'marker'){
				$( this ).remove();
			}
		});
		$.map.viewport.children('svg').children().each(function(){
			var id = $(this).attr('id') +'';
			if(id.indexOf('rap_text') != -1 || id.indexOf('rap_line') != -1){
				$(this).remove();
			}
		});
	},
	select : function(marker){
		$.map.marker.item = marker;
		$.map.viewport.children().each(function(){
			var type = $(this).attr('type');
			var network = $(this).attr('network');
			var status = $(this).attr('status');
			var masterStatus = $(this).attr('masterstatus');
			if(status == null || status == undefined) status = "alive";
			if(masterStatus == null || masterStatus == undefined) masterStatus = "1";
			if(status == 'alive'){
				if(type == 1){
					$(this).attr('class', 'icon-rap-'+network+'-master');
				}else if(type == 2){
					if(masterStatus == '0'){
						$(this).attr('class', 'icon-rap-'+network+'-error');
					}else{
						$(this).attr('class', 'icon-rap-'+network+'-slave');	
					}
				}else if(type == 3){
					if(masterStatus == '0'){
						$(this).attr('class', 'icon-rap-'+network+'-error');
					}else{
						$(this).attr('class', 'icon-rap-'+network+'-slave');	
					}
				}else if(type == 4){
					if(masterStatus == '0'){
						$(this).attr('class', 'icon-rap-'+network+'-error');
					}else{
						$(this).attr('class', 'icon-rap-'+network+'-slave');	
					}
				}else if(type == 11){
					$(this).attr('class', 'icon-tag-fixed');
				}else if(type == 12){
					$(this).attr('class', 'icon-tag-portable');
				}	
			}else{
				if(type == 1){
					$(this).attr('class', 'icon-rap-'+network+'-dead');
				}else if(type == 2){
					$(this).attr('class', 'icon-rap-'+network+'-dead');
				}else if(type == 3){
					$(this).attr('class', 'icon-rap-'+network+'-dead');
				}else if(type == 4){
					$(this).attr('class', 'icon-rap-'+network+'-dead');
				}else if(type == 11){
					$(this).attr('class', 'icon-tag-fixed');
				}else if(type == 12){
					$(this).attr('class', 'icon-tag-portable');
				}	
			}
			
		});
		var type = marker.attr('type');
		var network = marker.attr('network');
		if(type == 1){
			marker.attr('class', 'icon-rap-'+network+'-selected');
		}else if(type == 2){
			marker.attr('class', 'icon-rap-'+network+'-selected');
		}else if(type == 3){
			marker.attr('class', 'icon-rap-'+network+'-selected');
		}else if(type == 4){
			marker.attr('class', 'icon-rap-'+network+'-selected');
		}else if(type == 11){
			marker.attr('class', 'icon-tag-fixed-selected');
		}else if(type == 12){
			marker.attr('class', 'icon-tag-portable-selected');
		}
	},
	move : function(id, x, y){
		$.map.viewport.find('#'+id).css({'top': y+'px', 'left' : x+'px' });
	},
	
}
$.map.event = function(){ 
	$.map.viewport.mousemove(function(e) {
		if($.map.tool.action == 'distance'){ // 거리측정
			$.map.viewport.children('svg').children().each(function(){
				if($(this).attr('id') == 'dline' || $(this).attr('id') == 'dtext'){
					$(this).remove();
				}
			});
			var px = e.offsetX == undefined ? e.originalEvent.layerX : e.offsetX;
			var py = e.offsetY == undefined ? e.originalEvent.layerY : e.offsetY;
			if(px == 0 && py == 0) return;
			var mxm = $.map.carc.pxToMeter(px);
			var mym = $.map.carc.pxToMeter(py);
			$.map.draw.line('M'+px+' '+0+'L'+px+' '+$.map.height+'M'+0+' '+py+'L'+$.map.width+' '+py+'Z', 1, '#F71414', 'dot', 'dline');
			$.map.draw.text(px+65, py - 8, mxm+'m'+' x '+mym+'m', 'dtext');
		}else if($.map.tool.action == 'barrier'){ //장애물등록
			$.map.viewport.children('svg').children().each(function(){
				if($(this).attr('id') == 'zline' || $(this).attr('id') == 'ztext'){
					$(this).remove();
				}
			});
			var px = e.offsetX == undefined ? e.originalEvent.layerX : e.offsetX;
			var py = e.offsetY == undefined ? e.originalEvent.layerY : e.offsetY;
			if(px == 0 && py == 0) return;
			var mxm = $.map.carc.pxToMeter(px);
			var mym = $.map.carc.pxToMeter(py);
			$.map.draw.line('M'+px+' '+0+'L'+px+' '+$.map.height+'M'+0+' '+py+'L'+$.map.width+' '+py+'Z', 1, '#F71414', 'dot', 'zline');
			$.map.draw.text(px+65, py - 8, mxm+'m'+' x '+mym+'m', 'ztext');
			if($.map.barrier.points.length > 0){
				var point = $.map.barrier.points[$.map.barrier.points.length-1];
				$.map.draw.line('M'+point.x+','+point.y+'L'+px+','+py, 1, '#F71414', 'line', 'zline');
			}
			
		}
		
    }).mousedown(function(e) {
    	if($.map.tool.action == 'distance' && e.button == 0){ // 거리측정(left button)
			$.map.viewport.children('svg').children().each(function(){
				if($(this).attr('id') == 'dline' || $(this).attr('id') == 'dtext'){
					$(this).remove();
				}
			});
			var px = e.offsetX == undefined ? e.originalEvent.layerX : e.offsetX;
			var py = e.offsetY == undefined ? e.originalEvent.layerY : e.offsetY;
			if(px == 0 && py == 0) return;
			if($.map.distance.point1 == null){
				$.map.distance.point1 = {x : px, y : py};
				console.log(px, py);
				$.map.draw.circle(px, py, 4, '#ff0000', 'dpoint');
			}else if($.map.distance.point2 == null){
				$.map.draw.circle(px, py, 4, '#ff0000', 'dpoint');
				var d = $.map.carc.distance($.map.distance.point1.x, px, $.map.distance.point1.y, py);

				$.map.draw.line('M'+$.map.distance.point1.x+' '+$.map.distance.point1.y+'L'+px+' '+py+'Z', 1, '#FF0000', 'line', 'dline1');
				
				var rmsg = $.map.carc.pxToMeter(d)+'m = ';
				rmsg += 'P1('+$.map.carc.pxToMeter($.map.distance.point1.x)+'m, '+$.map.carc.pxToMeter($.map.distance.point1.y)+'m) ~ ';
				rmsg += 'P2('+$.map.carc.pxToMeter(px)+'m, '+$.map.carc.pxToMeter(py)+'m)';
				$.map.tooltip.show($.map.distance.point1.x, (parseInt($.map.distance.point1.y)+5), 'distance', rmsg);
				
				$.map.distance.point1 = null;
				$.map.distance.point2 = null;
			}
		}else if($.map.tool.action == 'barrier'){ //장애물등록
			if($.map.target != null && $.map.target != undefined && $.map.target.$id == 'calibration'){
				var px = e.offsetX == undefined ? e.originalEvent.layerX : e.offsetX;
				var py = e.offsetY == undefined ? e.originalEvent.layerY : e.offsetY;
				if(px == 0 && py == 0) return;
				if(e.button == 0){ //left button
					if(px > $.map.plan.width || py > $.map.plan.height){
						Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.zone.message.planover);
					}else{
						if($.map.barrier.points.length > 0){
							var ix = $.map.barrier.points.length-1;
							var point = $.map.barrier.points[ix];
							$.map.draw.line('M'+point.x+' '+point.y+'L'+px+' '+py+'Z', 1, '#F71414', 'line', 'zline_'+ix);
						}
						$.map.barrier.points.push({x : px, y : py});
						$.map.draw.circle(px, py, 4, '#ff0000', 'zpoint');	
					}
				}else if(e.button == 2){ //right buttion
					if($.map.barrier.points.length >= 3){
						$.map.viewport.children('svg').children().each(function(){
							var id = $(this).attr('id')+'';
							if(id.indexOf('zline_') != -1 || id == 'zpoint'){
								$(this).remove();
							}
						});
						var path = 'M', point = {};
						for(var i=0; i < $.map.barrier.points.length; i++){
							point = $.map.barrier.points[i];
							path += point.x+' '+point.y+'L'
						}
						path = path.substring(0, path.length-1)+'Z';
						var p = $.map.draw.polygon(path, 1, '#F71414', 'line', '#F71414', 0.7, 'zpolygon');
						$.map.target.callback.addBarrier(p, $.map.barrier.points);
					}
				}
				
			}
		}
    }).mouseup(function(e) {
    	
    }).mouseout(function(e) {
    	
    });
	$(document).on("contextmenu",function(e){
		e.preventDefault();
    });
};
$.map.draw = {
	grid : function(){ // 그리드생성
		$.map.viewport.children('svg').children().each(function(){
			if($(this).attr('id') == 'gline100' || $(this).attr('id') == 'gline50'){
				$(this).remove();
			}
		});
		var path100 = '', path50 = '';
		var dist = 0;
		if($.map.plan.pixels >= 50){
			dist = 10;
		}else if($.map.plan.pixels >= 25){
			dist = 5;
		}else if($.map.plan.pixels >= 12.5){
			dist = 2.5;
		}else if($.map.plan.pixels >= 6.25){
			dist = 1.25;
		}else if($.map.plan.pixels >= 3.125){
			dist = 0.625;
		}else if($.map.plan.pixels >= 1.5){
			dist = 0.3125;
		}else if($.map.plan.pixels >= 0.75){
			dist = 0.15625;
		}else{
			dist = 0.078125;
		}
		
		var meter = $.map.plan.pixels/dist;
		var count = Math.round($.map.width/meter);
		for(var i=1; i <= count; i++){
			if(i % 10 == 0){
				path100 += 'M'+(i * meter)+' 0L'+(i * meter)+' '+$.map.height;
			}else if(i % 5 == 0){
				path50 += 'M'+(i * meter)+' 0L'+(i * meter)+' '+$.map.height;	
			}
		}
		path100 += 'Z';
		path50 += 'Z';
		$.map.draw.line(path100, 1, '#a4a4a4', 'line', 'gline100');
		$.map.draw.line(path50, 1, '#808080', 'dot', 'gline50');
		
		path100 = '', path50 = '';
		meter = $.map.plan.pixels/dist;
		count = Math.round($.map.height/meter);
		for(var i=1; i <= count; i++){
			if(i % 10 == 0){
				path100 += 'M0 '+(i * meter)+'L'+$.map.width+' '+(i * meter);
			}else if(i % 5 == 0){
				path50 += 'M0 '+(i * meter)+'L'+$.map.width+' '+(i * meter);	
			}
		}
		$.map.draw.line(path100, 1, '#a4a4a4', 'line', 'gline100');
		$.map.draw.line(path50, 1, '#808080', 'dot', 'gline50');
		
	},
	ruler : function(){ // ruler생성
		// TOP RULER
		var path = '', t;
		var dist = 0;
		if($.map.plan.pixels >= 50){
			dist = 10;
		}else if($.map.plan.pixels >= 25){
			dist = 5;
		}else if($.map.plan.pixels >= 12.5){
			dist = 2.5;
		}else if($.map.plan.pixels >= 6.25){
			dist = 1.25;
		}else if($.map.plan.pixels >= 3.125){
			dist = 0.625;
		}else if($.map.plan.pixels >= 1.5){
			dist = 0.3125;
		}else if($.map.plan.pixels >= 0.75){
			dist = 0.15625;
		}else{
			dist = 0.078125;
		}
		var meter = $.map.plan.pixels/dist;
		var count = Math.round($.map.width/meter);
		var text = '', offset = 13;
		if($.map.plan.pixels < 50){
			for(var i=1; i <= count; i++){
				if(i % 10 == 0){
					path += 'M'+(i * meter)+' 1L'+(i * meter)+' 16';
					text = (i/dist)+'m';
					if(text.length == 2) offset = 10;
					if(text.length == 3) offset = 14;
					if(text.length == 4) offset = 18;
					if(text.length == 5) offset = 22;
					t = $.map.ruler.top.text((i * meter)+offset, 5, text);
					t.node.id = 'gruler-text';
				}else if(i % 5 == 0){
					path += 'M'+(i * meter)+' 6L'+(i * meter)+' 16';	
				}else{
					path += 'M'+(i * meter)+' 10L'+(i * meter)+' 16';	
				}
			}
		}else{
			for(var i=1; i <= count; i++){
				if(i % 10 == 0){
					path += 'M'+(i * meter)+' 1L'+(i * meter)+' 16';
					text = (i/dist)+'m';
					if(text.length == 2) offset = 10;
					if(text.length == 3) offset = 14;
					if(text.length == 4) offset = 18;
					if(text.length == 5) offset = 22;
					t = $.map.ruler.top.text((i * meter)+offset, 5, text);
					t.node.id = 'gruler-text';
				}else if(i % 5 == 0){
					path += 'M'+(i * meter)+' 6L'+(i * meter)+' 16';	
				}else{
					path += 'M'+(i * meter)+' 10L'+(i * meter)+' 16';	
				}
			}
		}
		path += 'Z';
		var p = $.map.ruler.top.path(path);
		p.attr ("stroke-width", 1);
		p.attr ("stroke", '#000000');
		p.node.id = 'gruler';
		
		// LEFT RULER
		path = '';
		meter = $.map.plan.pixels/dist;
		count = Math.round($.map.height/meter);
		for(var i=1; i <= count; i++){
			if(i % 10 == 0){
				path += 'M1 '+(i * meter)+'L16 '+(i * meter);
				text = (i/dist)+'m';
				if(text.length == 2) offset = 10;
				if(text.length == 3) offset = 14;
				if(text.length == 4) offset = 18;
				if(text.length == 5) offset = 22;
				t = $.map.ruler.left.text(4, (i * meter)+offset, text);
				t.transform('R-90')
				t.node.id = 'gruler-text';
			}else if(i % 5 == 0){
				path += 'M6 '+(i * meter)+'L16 '+(i * meter);	
			}else{
				path += 'M10 '+(i * meter)+'L16 '+(i * meter);	
			}
			
		}
		path += 'Z';
		p = $.map.ruler.left.path(path);
		p.attr ("stroke-width", 1);
		p.attr ("stroke", '#000000');
		p.node.id = 'gruler';
	},
	line : function(path, border, color, type, id){
		var p = $.map.canvas.path(path);
		if(border == null && border == undefined) border = 1;
		if(color == null && color == undefined) color = '#FF0000';
		if(type != null && type != undefined  && type == 'dot'){
			p.attr ("stroke-dasharray", '. ');
		}
		if(id != null && id != undefined){
			p.node.id = id;
		}
		p.attr ("stroke-width", border);
		p.attr ("stroke", color);
		return p;
	},
	circle : function(x, y, r, color, id){
		if(color == null || color == undefined){
			color = "#FF8040";
		}
		x = eval(x);
		y = eval(y);
		var c = $.map.canvas.circle(x, y, r).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": color, "fill-opacity" : 0.5 });
		if(id != null && id != undefined){
			c.node.id = id;
			c.node.title = id;
		}
		return c;
	},
	rect : function(x, y, width, height, radius, color, id){
		if(radius == null || radius == undefined){
			radius = 0;
		}
		if(color == null || color == undefined){
			color = "#FF8040";
		}
		var r = $.map.canvas.rect(x, y, width, height, radius).animate({fill: color, "fill-opacity": 0.3, stroke: "#000000", "stroke-width": 1, "stroke-opacity": 0.5}, 1000);
		if(id != null && id != undefined){
			r.node.id = id;
		}
		return r;
	},
	polygon : function(path,  border, borderColor, borderType, fillColor, fillOpacity, id){
		var p = $.map.canvas.path(path);
		if(border == null && border == undefined) border = 1;
		if(borderColor == null && borderColor == undefined) color = '#FF0000';
		if(borderType != null && borderType != undefined  && borderType == 'dot'){
			p.attr ("stroke-dasharray", '. ');
		}
		if(id != null && id != undefined){
			p.node.id = id;
		}
		p.attr ("stroke-width", border);
		p.attr ("stroke", borderColor);
		p.attr ("fill", fillColor);
		p.attr ("fill-opacity", fillOpacity);
		return p;
	},
	text : function(x, y, text, id, options){
		var t = $.map.canvas.text(x, y, text);
		if(options != null && options != undefined){
			t.attr(options);
		}
		if(id != null && id != undefined){
			t.node.id = id;
		}
		return t;
	},
	getItem : function(id){
		var node = null;
		$.map.canvas.forEach(function (el){
			if (el.node.id == id){
				node = el;
				return;
		    }
		});
		return node;
	}
	
};
$.map.tooltip = {
	show : function(x, y, id, msg){
		$.map.viewport.append('<div id="'+id+'_tooltip" class="tooltip" style="top:'+y+'px;left:'+x+'px;">'+msg+'</div>');
	},
	hide : function(id){
		$.map.viewport.children().each(function(){
			if($(this).attr('id') == id){
				$(this).remove();
			}
		});
	},	
}
$.map.carc = {
	distance : function(x1, x2, y1, y2, z1, z2){
		var x = parseInt(x1) - parseInt(x2);
		if(x < 0 ) x = x * -1;
		var y = parseInt(y1) - parseInt(y2);
		if(y < 0 ) y = y * -1;
		var dist = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
		if(z1 != undefined && z2 != undefined){
			var z = parseInt(z1) - parseInt(z2);
			if(z < 0) z= z * -1;
			var fix = Math.sqrt(Math.pow(dist, 2)+Math.pow(z, 2));
			return fix.toFixed(2);
		}else{
			return dist.toFixed(2);	
		}
		
	},
	pxToMeter : function(px){
		var m = (px * $.map.plan.meter);
		return m.toFixed(2);
	},
	meterToPx : function(m){
		var p = (m * $.map.plan.pixels);
		return p.toFixed(2);
	}	
};
$.map.remove = function(id){
	$.map.viewport.children('svg').children().each(function(){
		if($(this).attr('id') == id){
			$(this).remove();
		}
	});
	$.map.viewport.children().each(function(){
		if($(this).attr('id') == id){
			$( this ).remove();
		}
	});
}
$.map.clear = function(){
	$.map.viewport.children('svg').children().each(function(){
		var id = $(this).attr('id') +'';
		if(id.indexOf('dline') != -1 || id.indexOf('dtext') != -1 || id.indexOf('dpoint') != -1 || id.indexOf('zline') != -1 || id.indexOf('ztext') != -1 || id.indexOf('zpoint') != -1){
			$(this).remove();
		}
	});
	$.map.marker.remove('distance_tooltip');
	$.map.marker.remove('dpoint1');
	$.map.marker.remove('dpoint2');
	$.map.distance.point1 = null;
	$.map.distance.point2 = null;
	$.map.barrier.points = [];
}
$.map.resize = function(){
	$.map.ruler.top.clear();
	$.map.ruler.left.clear();
	$.map.width = $.map.viewport.width();
	$.map.height = $.map.viewport.height();
	$.map.tool.bar.css('left', ($("#viewport #mapview").width()-50)+'px');
	$.map.canvas.setSize($.map.width, $.map.height);
	$.map.ruler.top.setSize($.map.width, 16);	
	$.map.ruler.left.setSize(16, $.map.height);	
	
	$.map.draw.grid();
	$.map.draw.ruler();
}

Map = function(options){
	$.extend($.map, options);
	$.map.ui();
	$.map.event();
	return $.map;
};
}(jQuery));