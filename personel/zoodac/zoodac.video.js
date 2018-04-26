/*动态设置展示窗口的高度，为屏幕宽度的一半高度*/
var VideoDisplay = {
		init : function(){
			var wd = $("#video_display table").width();
			var hg = wd/2;
			$("#view div").height(hg);
			$("#videoDiv").height(hg);
			
			$("#view").width("50%");
			$("#video").width("50%");
			
			var divWidth = $("#view").width();
			divWidth = divWidth-divWidth/3;
			$("#view div").height(divWidth);
			$("#videoDiv").height(divWidth);
			
		},
}
function alarm_List(){
	if($("#alarm_List").css('display')=="none"){
		$("#alarm_List").css('display','block');

	}else{
		$("#alarm_List").css('display','none');

	};
}