var Production_process = {
    init:function(){
        
       
        Production_process.funcs.renderTable(1)
        Production_process.funcs.bindClickForSpanInBlockQuote($('.block-quote span'))
        //console.log('LLLL')
        //console.log($('.block-quote span'))
        /** 使表格居中显示 */
        var out = $('#_25page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#_25page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },

    funcs : {

            renderTable:function(statusCode){
            //     /** 追加预混表格的添加 */
            //     var yuhun = $('#_25table1')
            //     //console.log('aaaaaaaaaaaaaaaaaa')
            //     //console.log(yuhun)
            //     Production_process.funcs.bindZhichengYunhun(yuhun,statusCode)
                /** 追加粉碎粒度表格的添加 */
                // var lidu = $('#fensuild')
                // Production_process.funcs.bindZhichengLidu(lidu,statusCode)
                /** 追加粉碎总锂表格的添加 */
                // var zongli = $('#fensuizl')
                // Production_process.funcs.bindZhichengZongli(zongli,statusCode)
                /** 追加粉碎SSA表格的添加 */
                // var SSA = $('#fensuiSSA')
                // Production_process.funcs.bindZhichengSSA(SSA,statusCode)
                /** 追加状态下拉框事件 */
                var statusSelect = $('#model-li-hide-select-25');
                Production_process.funcs.bindSelectEventListener(statusSelect);
                /** 追加刷新事件 */
                // var refreshBtn = $('#model-li-hide-refresh-25');
                // Production_process.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件
                /** 追加搜索事件 */
                // var searchBtn = $('#model-li-hide-search-25');
                // Production_process.funcs.b       indSearchEventListener(searchBtn);

            },

            /** 具体添加粉碎SSA的表格 */
            renderHandler4:function($tbody,records){
                $tbody.empty()
                records.forEach(function(e){
                    $tbody.append("<tr>"+
                        "<td style='color:black'>"+ e.operation +"</td>"+
                        "<td style='color:black'>"+ e.publisher +"</td>"+
                        "<td style='color:black'>"+ e.testDate +"</td>"+
                        "<td style='color:black'>"+ e.batchNumber +"</td>"+
                        "<td style='color:black'>"+ e.furnaceNum +"</td>"+
                        "<td style='color:black'>"+ e.pc1 +"</td>"+
                        "<td style='color:black'>"+ e.pc2 +"</td>"+
                        "<td style='color:black'>"+ e.pc3 +"</td>"+
                        "<td></td>"+
                        "</tr>"
                    )
                })
            },

            /** 具体添加粉碎总锂的表格 */
            renderHandler3:function($tbody,records){
                $tbody.empty()
                records.forEach(function(e){
                    $tbody.append( "<tr>"+
                       "<td style='color:black'>"+ e.operation +"</td>"+
                       "<td style='color:black'>"+ e.publisher +"</td>"+
                       "<td style='color:black'>"+ e.testDate +"</td>"+
                       "<td style='color:black'>"+ e.batchNumber +"</td>"+
                       "<td style='color:black'>"+ e.pc1 +"</td>"+
                       "<td style='color:black'>"+ e.pc2 +"</td>"+
                       "<td style='color:black'>"+ e.pc3 +"</td>"+
                       "<td style='color:black'>"+ e.testDate +"</td>"+
                       "<td style='color:black'>"+ e.batchNumber +"</td>"+
                       "<td style='color:black'>"+ e.pc1 +"</td>"+
                       "<td style='color:black'>"+ e.pc2 +"</td>"+
                       "<td style='color:black'>"+ e.pc3 +"</td>"+
                       "</tr>"
                    )
                })
            },

            /** 具体添加粉碎粒度的表格 */
            renderHandler2:function($tbody,records){
                $tbody.empty()
                records.forEach(function(e){
                    $tbody.append("<tr>"+
                        "<td style='color:black'>"+ e.operation +"</td>"+
                        "<td style='color:black'>"+ e.publisher +"</td>"+
                        "<td style='color:black'>"+ e.testDate +"</td>"+
                        "<td style='color:black'>"+ e.batchNumber +"</td>"+
                        "<td style='color:black'>"+ e.furnaceNum +"</td>"+
                        "<td style='color:black'>"+ e.pc1 +"</td>"+
                        "<td style='color:black'>"+ e.pc2 +"</td>"+
                        "<td style='color:black'>"+ e.pc3 +"</td>"+
                        "<td style='color:black'>"+ e.pc4 +"</td>"+
                        "<td style='color:black'>"+ e.pc5 +"</td>"+
                        "<td style='color:black'>"+ e.pc6 +"</td>"+
                        "<td style='color:black'>"+ e.pc7 +"</td>"+
                        "<td style='color:black'>"+ e.pc8 +"</td>"+
                        "<td style='color:black'>"+ e.pc9 +"</td>"+
                        "<td style='color:black'>"+ e.pc10 +"</td>"+
                        "<td style='color:black'>"+ e.pc10 +"</td>"+
                        "</tr>"
                    )
                })
            },


            /** 具体添加预混的表格 */
            renderHandler1:function($tbody,records){
                $tbody.empty()
                records.forEach(function(e){
                    $tbody.append("<tr>"+
                        "<td style='color:black'>"+ e.operation +"</td>"+
                        "<td style='color:black'>"+ e.publisher +"</td>"+
                        "<td style='color:black'>"+e.testDate +"</td>"+
                        "<td style='color:black'>"+ e.batchNumber +"</td>"+
                        "<td style='color:black'>"+ +"</td>"+
                        "<td style='color:black'>"+e.lithiumSoluble +"</td>"+
                        "<td style='color:black'>"+ e.supplier +"</td>"+
                        "<td style='color:black'>"+ e.pc1 +"</td>"+
                        "<td style='color:black'>"+ e.pc2 +"</td>"+
                        "<td style='color:black'>"+ e.pc3 +"</td>"+
                        "<td style='color:black'>"+ e.pc4 +"</td>"+
                        "<td style='color:black'>"+ e.pc5 +"</td>"+
                        "<td style='color:black'>"+ e.pc6 +"</td>"+
                        "<td style='color:black'>"+ e.pc7 +"</td>"+
                        "<td style='color:black'>"+ +"</td>"+
                        "</tr>"

                    )
                })
            },


            bindClickForSpanInBlockQuote:function(clickSpans){
                clickSpans.off('click')
                clickSpans.on('click',function(){
                    $('.select_span').removeClass('select_span')
                    $('#model-li-hide-25 table').addClass('hide')
                    $('.'+$(this).attr('id')+'_table').removeClass('hide')
                    $(this).addClass('select_span')
                    if($(this).attr('id') === "fensuild"){
                        var lidu = $('#fensuild')
                        //console.log('HHHHHHH')
                        var statusCode = $("#model-li-hide-select-25 option:selected").val()
                        //console.log(statusCode)
                        Production_process.funcs.bindZhichengLidu(lidu,statusCode)
                    }else if($(this).attr('id') === "fensuizl"){
                        var zongli = $('#fensuizl')
                        var statusCode = $("#model-li-hide-select-25 option:selected").val()
                        Production_process.funcs.bindZhichengZongli(zongli,statusCode)
                    }else if($(this).attr('id') ==="fensuiSSA"){
                        var SSA = $('#fensuiSSA')
                        var statusCode = $("#model-li-hide-select-25 option:selected").val()
                        Production_process.funcs.bindZhichengSSA(SSA,statusCode)
                    }else if($(this).attr('id') === "yuhun")
                    var yuhun = $('#yuhun')
                    var statusCode = $("#model-li-hide-select-25 option:selected").val()
                    Production_process.funcs.bindZhichengYunhun(yuhun,statusCode)

                })
            },
            /** 制程SSA的窗体的添加 */
            bindZhichengSSA:function(SSA,statusCode){
                    $.post(home.urls.processBuckle.getAllByStatusCodeByPage(), {statusCode: statusCode}, function (result) {
                        var records = result.data.content //获取数据
                        const $tbody = $("#_25table4").children('tbody')
                        Production_process.funcs.renderHandler4($tbody, records)
                        Production_process.pageSize = result.data.content.length
                        var page = result.data
                        /** @namespace page.totalPages 这是返回数据的总页码数 */
                        /** 分页信息 */
                        layui.laypage.render({
                            elem: '_25page'
                            , count: 10 * page.totalPages//数据总数
                            /** 页面变化后的逻辑 */
                            , jump: function (obj, first) {
                                if (!first) {
                                    console.log('不是首次,可以执行')
                                    $.post(home.urls.processBuckle.getAll(), {
                                        page: obj.curr - 1,
                                        size: obj.limit
                                    }, function (result) {
                                        var records = result.data.content //获取数据
                                        const $tbody = $("#_25table4").children('tbody')
                                        Production_process.funcs.renderHandler3($tbody, records)
                                        Production_process.pageSize = result.data.content.length
                                    })
                                }
                            }
                        })
                    })//$数据渲染完毕
            
            },
            /** 制程总锂的窗体添加 */
            bindZhichengZongli:function(zongli,statusCode){
                    $.post(home.urls.processLithium.getAllByStatusCodeByPage(), {statusCode: statusCode}, function (result) {
                        var records = result.data.content //获取数据
                        const $tbody = $("#_25table3").children('tbody')
                        Production_process.funcs.renderHandler3($tbody, records)
                        Production_process.pageSize = result.data.content.length
                        var page = result.data
                        /** @namespace page.totalPages 这是返回数据的总页码数 */
                        /** 分页信息 */
                        layui.laypage.render({
                            elem: '_25page'
                            , count: 10 * page.totalPages//数据总数
                            /** 页面变化后的逻辑 */
                            , jump: function (obj, first) {
                                if (!first) {
                                    console.log('不是首次,可以执行')
                                    $.post(home.urls.processLithium.getAll(), {
                                        page: obj.curr - 1,
                                        size: obj.limit
                                    }, function (result) {
                                        var records = result.data.content //获取数据
                                        const $tbody = $("#_25table3").children('tbody')
                                        Production_process.funcs.renderHandler3($tbody, records)
                                        Production_process.pageSize = result.data.content.length
                                    })
                                }
                            }
                        })
                    })//$数据渲染完毕
            },
            /** 制程粒度窗体的添加 */
            bindZhichengLidu:function(lidu,statusCode){
                    $.post(home.urls.processSize.getAllByStatusCodeByPage(), {statusCode: statusCode}, function (result) {
                        var records = result.data.content //获取数据
                        const $tbody = $("#_25table2").children('tbody')
                        Production_process.funcs.renderHandler2($tbody, records)
                        Production_process.pageSize = result.data.content.length
                        var page = result.data
                        /** @namespace page.totalPages 这是返回数据的总页码数 */
                        /** 分页信息 */
                        layui.laypage.render({
                            elem: '_25page'
                            , count: 10 * page.totalPages//数据总数
                            /** 页面变化后的逻辑 */
                            , jump: function (obj, first) {
                                if (!first) {
                                    console.log('不是首次,可以执行')
                                    $.post(home.urls.processSize.getAll(), {
                                        page: obj.curr - 1,
                                        size: obj.limit
                                    }, function (result) {
                                        var records = result.data.content //获取数据
                                        const $tbody = $("#_25table2").children('tbody')
                                        Production_process.funcs.renderHandler2($tbody, records)
                                        Production_process.pageSize = result.data.content.length
                                    })
                                }
                            }
                        })
                    })//$数据渲染完毕
            },

            /** 制程预混窗体的添加 */
            bindZhichengYunhun:function(yuhun,statusCode){
                //console.log('bbbbbbbbbbbbb')
                 /** 获取所有的记录 */
            $.post(home.urls.processPremix.getAllByStatusCodeByPage(), {statusCode: statusCode}, function (result) {
                var records = result.data.content //获取数据
                const $tbody = $("#_25table1").children('tbody')
                Production_process.funcs.renderHandler1($tbody, records)
                Production_process.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: '_25page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行')
                            $.post(home.urls.processPremix.getAll(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var records = result.data.content //获取数据
                                const $tbody = $("#_25table1").children('tbody')
                                Production_process.funcs.renderHandler1($tbody, records)
                                Production_process.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })//$数据渲染完毕
            },

             /** 监听状态下拉选框 */
        bindSelectEventListener: function (statusSelect) {
            statusSelect.off('change')
            statusSelect.on('change', function () {
                var status = $(this).val()
                Production_process.funcs.renderTable(status)
            })
        },
         /** 刷新事件 */
         bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                $('#product_batch_number_input').val('')
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    product_publish.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },
        /** 搜索事件 */
        bindSearchEventListener: function (searchBtn) {
            console.log('search')
            searchBtn.off('click')
            searchBtn.on('click', function () {

                var product_batch_number = $('#product_batch_number_input').val()
                var status = $('#model-li-hide-select-25').val()
                console.log('status', status)
                $.post(home.urls.productPublish.getByLikeBatchNumberByPage(), {
                    batchNumber: product_batch_number,
                    statusCode: status
                }, function (result) {
                    console.log(result)
                    var page = result.data
                    var products = result.data.content //获取数据
                    var status = $('#model-li-hide-select-23').val()
                    const $tbody = $("#_23table").children('tbody')
                    product_publish.funcs.renderHandler($tbody, products)
                    layui.laypage.render({
                        elem: '_23page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.product.getByLikeBatchNumberByPage(), {
                                    batchNumber: product_batch_number,
                                    statusCode: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var products = result.data.content //获取数据
                                    const $tbody = $("#_23table").children('tbody')
                                    product_publish.funcs.renderHandler($tbody, products)
                                    product_publish.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },
    }
}