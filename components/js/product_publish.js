var product_publish = {
    pageSize: 0,
    status : 1,
    currId: null,
    init: function () {
        product_publish.funcs.renderTable(product_publish.status)
        var out = $('#_23page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#_23page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {
        renderTable: function (status) {
            /** 获取所有的记录 */
            $.post(home.urls.productPublish.getAllByPage(), {status: status}, function (result) {
                var records = result.data.content //获取数据
                const $tbody = $("#_23table").children('tbody')
                product_publish.funcs.renderHandler($tbody, records)
                product_publish.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: '_23page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.productPublish.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var records = result.data.content //获取数据
                                const $tbody = $("#_23table").children('tbody')
                                product_publish.funcs.renderHandler($tbody, records)
                                product_publish.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })//$数据渲染完毕

            /** 追加状态下拉框事件 */
            var statusSelect = $('#model-li-hide-select-23');
            product_publish.funcs.bindSelectEventListener(statusSelect);
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-23');
            product_publish.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-23');
            product_publish.funcs.bindSearchEventListener(searchBtn);
        }
        , renderHandler: function ($tbody, records) {
            $tbody.empty() //清空表格
            records.forEach(function (e) {
                $tbody.append(
                    "<tr>" +
                    "<td>" + product_publish.funcs.getIcon(product_publish.status, e.code) + "</i></td>" +
                    "<td>" + (e.auditor ? e.auditor.name : null) + "</td>" +
                    "<td>" + (new Date(e.auditDate).Format('yyyy/MM/dd')) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +
                    "<td>" + (e.judge ? e.judge.name : null) + "</td>" +
                    "<td>" + (e.number) + "</td>" +
                    "<td>" + (e.p1) + "</td>" +
                    "<td>" + (e.p2) + "</td>" +
                    "<td>" + (e.p3) + "</td>" +
                    "<td>" + (e.p4) + "</td>" +
                    "<td>" + (e.p7) + "</td>" +
                    "<td>" + (e.p10) + "</td>" +
                    "<td>" + (e.p13) + "</td>" +
                    "<td>" + (e.p19) + "</td>" +
                    "<td>" + (e.p20) + "</td>" +
                    "<td>" + (e.p21) + "</td>" +
                    "<td>" + (e.p22) + "</td>" +
                    "<td>" + (e.p23) + "</td>" +
                    "<td>" + (e.p24) + "</td>" +
                    "<td>" + (e.p34) + "</td>" +
                    "<td>" + (e.p35) + "</td>" +
                    "<td>" + (e.p36) + "</td>" +
                    "</tr>")
            })//$数据渲染完毕

            product_publish.funcs.bindAuditClick()
            product_publish.funcs.bindDetailClick()
        }
        ,bindAuditClick : function() {
            $('.audit').off('click').on('click', function() {
                //todo 点击之后弹出弹框
                console.log($(this).attr('id'))
            })
        }
        ,bindDetailClick : function() {
            $('.detail').off('click').on('click', function() {
                //todo 点击之后弹出弹框
                console.log($(this).attr('id'))
            })
        }
        /** 监听状态下拉选框 */
        , bindSelectEventListener: function (statusSelect) {
            statusSelect.off('change')
            statusSelect.on('change', function () {
                product_publish.status = $(this).val()
                product_publish.funcs.renderTable(product_publish.status)
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
                var status = $('#model-li-hide-select-23').val()
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
        }, getIcon: function (status, code) {
            if (status == 1) {
                return "<a href=\"#\" class='audit' id='audit-" + code + "'><i class=\"layui-icon\">&#xe6b2;";
            }
            else {
                return "<a href=\"#\" class='detail' id='check-" + code + "'><i class=\"layui-icon\">&#xe60a;";
            }
        }
    }
}