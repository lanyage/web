var check_report = {
    pagesize:0,
    init:function(){
        
        $("#button").off('click').on('click',function(){
            var batchNumber = $("#input_batchNumber").val()
            $.post(home.urls.productPublish.getByLikeBatchNumberByPage(), {
                batchNumber: product_batch_number,
                statusCode: 1
            }, function (result) {
                var product = result.data //获取数据
                layer.open({
                    type: 1,
                    content: check_report.funcs.getData(product),
                    area: ['700px', '650px'],
                    btn: ['关闭'],
                    offset: 'auto',   // ['10%', '40%'],
                    btnAlign: 'c',
                    yes: function (index) {
                        layer.close(index);
                    }
                })

           })
    })
    }
}