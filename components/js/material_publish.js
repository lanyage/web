var material_publish = {
    init : function() {
        material_publish.funcs.bindClickForSpanInBlockQuote($('.block-quote span'))


        /** 显示逻辑.根据档案的表格去渲染数据 */
        //todo
    },
    funcs : {
        bindClickForSpanInBlockQuote : function(clickSpans){
            clickSpans.off('click')
            clickSpans.on('click', function(){
                $('.select_span').removeClass('select_span')
                $('#model-li-hide-24 table').addClass('hide')
                console.log( $('.'+$(this).attr('id')+'_table'))
                $('.'+$(this).attr('id')+'_table').removeClass('hide')
                $(this).addClass('select_span')
            })
        }
    }
}