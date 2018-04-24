var Production_process = {
    init:function(){
        
        Production_process.funcs.bindClickForSpanInBlockQuote($('.block-quote span'))
        console.log($('.block-quote span'))
    },

    funcs : {
            bindClickForSpanInBlockQuote:function(clickSpans){
                clickSpans.off('click')
                clickSpans.on('click',function(){
                    $('.select_span').removeClass('select_span')
                    $('#model-li-hide-25 table').addClass('hide')
                    $('.'+$(this).attr('id')+'_table').removeClass('hide')
                    $(this).addClass('select_span')
                })
            }
    }
}