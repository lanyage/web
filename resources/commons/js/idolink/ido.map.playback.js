;(function($) {
    /*
     * jQuery Observer pattern 
     * inspired by @addyosmani 's code
     * see: http://addyosmani.com/resources/essentialjsdesignpatterns/book/#highlighter_506612
     */
    var topics = [];
    function getTopic(id) {
        var callbacks;
        topic = id && topics[id];
        if (!topic) {
            callbacks = $.Callbacks();
            topic = {
                publish: callbacks.fire,
                subscribe: callbacks.add,
                unsubscribe: callbacks.remove
            };
            if (id) topics[id] = topic;
        }
        return topic;
    }
    $.observer = {
        publish: function(id, item) {
        	var t = getTopic(id);
        	return t.publish.apply(t, item);
        },
        subscribe: function(id, fn) {
            return getTopic(id).subscribe(fn);
        },
        unsubscribe: function(id, fn) {
            return getTopic(id).unsubscribe(fn);
        }
    };
})(jQuery);

(function ($) {
$.map = $.map || {};
$.extend( $.map, {
	plan : {}, 
	width : 0, 
	height : 0,
	viewport : null, 
	target : null, //호출할 객체
});
$.map.ui = function(){ // MAP UI INIT
	$("#viewport").css('position', 'relative').css('width', '100%').css('height', (parseInt($.map.plan.height))+'px').css('overflow', 'hidden');
	$("#viewport").html('<div id="mapview" style="width:100%; height:'+(parseInt($.map.plan.height))+'px; overflow:auto;"></div>');
	$("#viewport #mapview").append('<div id="map-viewport"></div>');
	$.map.viewport = $('#map-viewport');
	$.map.viewport.css('background-image','url(/files/plan/map_'+$.map.plan.planId+'.'+$.map.plan.ext+'?time='+ new Date().getTime() +')').css('background-repeat', 'no-repeat').css('width', '100%').css('height', (parseInt($.map.plan.height) + 50)+'px').css('min-width', $.map.plan.width+'px');
	$.map.width = $.map.viewport.width();
	$.map.height = $.map.viewport.height();
	
}

$.map.marker = {
	item : {}, items : [],	
	add : function(item){
		$.map.viewport.append(item.marker);
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
	},
};

$.map.event = function(){ 
	$.map.viewport.mousemove(function(e) {
		
    }).mouseup(function(e) {
    	if(e.which == 1){
    	}
    }).mouseout(function(e) {
    	if(e.which == 1){
		}
    });
	$(document).on("contextmenu",function(e){
		e.preventDefault();
    });
	$(window).resize(function() {
		$.map.width = $.map.viewport.width();
		$.map.height = $.map.viewport.height();
	});
	
	
};

$.map.canvas = {
	$papers : new HashMap(), $items : new HashMap(),
	paper : function(id){ 
		var paper = this.$papers.get(id);
		if(paper == null || $("#map-viewport-" + id).length == 0){
			$("#map-viewport").append("<div id='map-viewport-"+id+"' style='position:absolute; padding:0px; margin:0px; left : 0px; top : 0px; width:"+$("#map-viewport").width()+"px; height: "+$("#map-viewport").height()+"px;'></div>")
			paper = new Raphael("map-viewport-"+id, $("#map-viewport").width(), $("#map-viewport").height());
			this.$papers.put(id, paper);
		}
		return paper;
	},
	clearPaper : function(){
		var keys = this.$items.keys();
		for(var i=0; i < keys.length; i++){
			this.paper(keys[i]).clear();	
		}
		this.$items.clear();
	},
	clearNode : function(){ // Canvas 초기화
		this.removeSvg('src_node');
		var keys = this.$items.keys();
		for(var i=0; i < keys.length; i++){
			this.removeSvg(keys[i], 'target_path_'+keys[i]);
			this.removeSvg(keys[i], 'target_node_'+keys[i]);
			this.removeSvg(keys[i], 'target_text_'+keys[i]);
			this.$items.remove(keys[i]);
		}
	},
	clearPath : function(){ // Canvas 초기화
		var keys = this.$items.keys();
		for(var i=0; i < keys.length; i++){
			this.removeSvg(keys[i], 'src_node');
			this.removeSvg(keys[i], 'target_path_'+keys[i]);	
		}
	},
	removeNode : function(id){
		this.$items.remove(id);
		this.removeSvg(id, 'target_node_'+id);
		this.removeSvg(id, 'target_text_'+id);
		this.removeSvg(id, 'target_path_'+id);
	},
	removeSvg : function(id , nodeId){
		$('#map-viewport-'+id).children('svg').children().each(function(){
			if($(this).attr('id') == nodeId){
				$(this).remove();
			}
		});
	},
	
	initNode : function(id, x, y, size, color, name){
		$.observer.unsubscribe(id, $.map.canvas.moveNode);
		var paper = this.paper(id);
		var node = paper.circle(x, y, size).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": ''+color, "fill-opacity" : 0.5 });
		node.node.id = "target_node_"+id;
		var text = paper.text(x, y+size+4, name);
		text.attr({'font-size':'11px', 'fill':'#000000', 'font-weight':'nolmal'});
		text.node.id = 'target_text_'+id;
		this.$items.put(id, {
			'euid' : id,
			'node' : node,
			'text' : text,
			'name' : name,
			'queue' : [],
			'aniData' : {},
			'size' :  size,
			'color' : color
		});
		$.observer.subscribe(id, $.map.canvas.moveNode);
	},
	addItem : function(id, seq, name, euid, x, y, time, delayTime, movePath, distance, status){
		var item = this.$items.get(id);
		if(item == null || item == undefined){
			return false;
		}
		var paper = this.paper(id);
		if($.map.target.ui.$toolbar.isMovement){
			var srcnode = paper.circle(x, y, 4).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": ''+item.color, "fill-opacity" : 0.3 });
			srcnode.node.id = 'src_node';
		}
		
//			if(status == 1){
//				Map.canvas.removeSvg(id, 'target_node_'+id);
//				Map.canvas.removeSvg(id, 'target_text_'+id);
//				item.node = paper.circle(x, y, item.size).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": ''+item.color, "fill-opacity" : 1 });
//				item.node.node.id = "target_node_"+id;
//				item.text = paper.text(x, y+(item.size + 4), name);
//				item.text.attr({'font-size':'11px', 'fill':'#000000', 'font-weight':'normal'});
//				item.text.node.id = 'target_text_'+id;
//			}
		
		item.queue.push({
				'seq' : seq, 
				'name' : name,
				'euid' : euid,
				'x' : x, 
				'y' : y,
				'time' : time, 
				'delayTime' : delayTime,
				'distance' : distance,
				'movePath' : movePath
		});
		$.observer.publish(id, [item]);
		return true;
	},
	moveNode : function(){
		var item = arguments[0];
		item.aniData = item.queue.shift();
		if($.map.target.ui.$toolbar.isMovement){
			$.map.canvas.removeSvg(item.euid, 'target_path_'+item.euid);
			var tpath = "";
			for(var i=0; i < item.aniData.movePath.length; i++){
				if(i==0){
					tpath += "M"+ item.aniData.movePath[i].x+" "+ item.aniData.movePath[i].y;
				}else{
					tpath += "L"+ item.aniData.movePath[i].x+" "+ item.aniData.movePath[i].y;
				}
			}
			var targetPath = $.map.canvas.paper(item.euid).path(tpath);
			targetPath.attr ("stroke-width", 1);
			targetPath.attr ("stroke", '#FF0000');
			targetPath.node.id = 'target_path_'+item.euid;
		}
		
		item.aniData.movePath.shift();
		$.map.canvas.animateNode(item);
	},
	animateNode : function(item){
		var point = item.aniData.movePath.shift();
		if(point != undefined){
			item.node.animate({cx : point.x, cy : point.y}, 10, function () {
				if(item.aniData.movePath.length == 0){
					//console.log(item.aniData.delayTime+"ms", ($.now()-item.aniData.time)+"ms", item.queue.length);	
				}else{
					$.map.canvas.animateNode(item);
				}
			});
			item.text.animate({x : point.x, y : (parseInt(point.y) + parseInt(item.size) + 4)}, 10, function () {
				
			});
		}
		
	}
	
};

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
Map = function(options){
	$.extend($.map, options);
	$.map.ui();
	$.map.event();
	return $.map;
};
}(jQuery));