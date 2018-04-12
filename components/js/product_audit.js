var product_audit = {
    init: function () {
        // display
        product_audit.funcs.renderTable()

        var out = $('#product_audit_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#product_audit_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    }
    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0
    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面*/
        renderTable: function () {
            /** 获取所有记录 */
            var status = $('#status').val()
            $.post(home.urls.product.getAllByStatusCodeByPage(), {
                page: 0,
                statusCode: status
            }, function (result) {
                var products = result.data.content
                const $tbody = $("#product_table").children('tbody')
                product_audit.funcs.renderHandler($tbody, products)
                product_audit.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'product_audit_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行')
                            var status = $('#status').val()
                            $.post(home.urls.product.getAllByStatusCodeByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                statusCode: status
                            }, function (result) {
                                var products = result.data.content //获取数据
                                const $tbody = $("#product_table").children('tbody')
                                product_audit.funcs.renderHandler($tbody, products)
                                product_audit.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            /** 追加状态下拉框事件 */
            var statusSelect = $('#model-li-hide-select-20')
            product_audit.funcs.bindSelectEventListener(statusSelect)
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-20')
            product_audit.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-20')
            product_audit.funcs.bindSearchEventListener(searchBtn)
        },

        renderHandler: function ($tbody, products) {
            $tbody.empty()
            products.forEach(function (e) {
                var status = $('#status').val()
                $tbody.append(
                    "<tr>" +
                    "<td><a href=\"#\"><i class=\"layui-icon\">"+product_audit.funcs.getIcon(status)+"</i></td>" +
                    "<td>" + (product_audit.funcs.getAuditor(e.auditor)) + "</td>" +
                    "<td>" + (product_audit.funcs.formatDate(e.testDate)) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +
                    "<td>" + (e.judge.name) + "</td>" +
                    "<td>" + (e.number) + "</td>" +
                    "<td>" + (e.p1) + "</td>" +
                    "<td>" + (e.p2) + "</td>" +
                    "<td>" + (e.p3) + "</td>" +
                    "<td>" + (e.p4) + "</td>" +
                    "<td>" + (e.p5) + "</td>" +
                    "<td>" + (e.p6) + "</td>" +
                    "<td>" + (e.p7) + "</td>" +
                    "<td>" + (e.p8) + "</td>" +
                    "<td>" + (e.p9) + "</td>" +
                    "<td>" + (e.p10) + "</td>" +
                    "<td>" + (e.p11) + "</td>" +
                    "<td>" + (e.p12) + "</td>" +
                    "<td>" + (e.p13) + "</td>" +
                    "<td>" + (e.p14) + "</td>" +
                    "<td>" + (e.p15) + "</td>" +
                    "<td>" + (e.p16) + "</td>" +
                    "<td>" + (e.p17) + "</td>" +
                    "</tr>"
                )
            })
        },

        /** 刷新事件 */
        bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    product_audit.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },

        /** 搜索事件 */
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                console.log('search')
                var product_batch_number = $('#product_batch_number_input').val()
                var status = $('#status').val()
                $.post(home.urls.product.getByLikeBatchNumberByPage(), {
                    batchNumber: product_batch_number,
                    statusCode: status
                }, function (result) {
                    var page = result.data
                    var products = result.data.content //获取数据
                    var status = $('#status').val()
                    const $tbody = $("#product_table").children('tbody')
                    product_audit.funcs.renderHandler($tbody, products)
                    layui.laypage.render({
                        elem: 'product_audit_page'
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
                                    const $tbody = $("#product_table").children('tbody')
                                    product_audit.funcs.renderHandler($tbody, products)
                                    product_audit.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },

        /** 监听状态下拉选框 */
        bindSelectEventListener: function (statusSelect) {
            statusSelect.change(function () {
                product_audit.funcs.renderTable()
            })
        },

        /** 日期格式化 */
        formatDate: function (strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },

        /** 获得审核人*/
        getAuditor: function (e) {
            if (e == null){
                return "无";
            }
            else{
                return e.name;
            }
        },

        /** 操作图标 */
        getIcon: function (status) {
            if (status == 1){
                return "&#x1005";
            }
            else{
                return "&#xe60a";
            }
        }
    }
}