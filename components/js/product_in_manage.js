var product_in_manage = {
    pageSize: null,
    init: function () {
        /** 渲染表格 */
        product_in_manage.funcs.renderTable()

        /** 需要给刷新按钮和搜索按钮绑定点击事件 */
        /** 将分页居中 */
        var out = $('#product_in_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#product_in_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)

    },

    funcs: {
        renderTable: function () {
            $.post(home.urls.productIn.getAllByPage(), {}, function (res) {
                var $tbody = $("#product_in_table").children('tbody')
                var items = res.data.content
                product_in_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                product_in_manage.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'product_in_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            //console.log('不是首次,可以执行')
                            $.post(home.urls.productIn.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#product_in_table").children('tbody')
                                product_in_manage.funcs.renderHandler($tbody, items)
                                product_in_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#product_in_page').css('padding-left', '37%')
            })

            // 追加刷新事件

            var refreshBtn = $('#model-li-hide-refresh-49');
            product_in_manage.funcs.bindRefreshEventListener(refreshBtn);

            /**   追加搜索事件*/
            var searchBtn = $('#model-li-hide-search-49');
            product_in_manage.funcs.bindSearchEventListener(searchBtn);

        },

        renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            var i = 1
            items.forEach(function (e) {
                var status 
                if(e.status===0){
                    status = '未入库'
                }else{
                    status = '已入库'
                }
                var content = (
                    "<tr>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +
                    "<td>" + (e.department ? e.department.name : '') + "</td>" +
                    "<td>" + (e.payTime?new Date(e.payTime).Format('yyyy-MM-dd'):'') + "</td>" +
                    "<td>" + (status) + "</td>" +
                    "<td><a href='#' class='detail' id='detail-" + (e.code) + "'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
            })
            // /** 绑定全选事件 */
            // mat_in_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".detail")
            product_in_manage.funcs.bindDetailClick(detailBtns)
        },

        bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productIn.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data  //获取数  /** */
                    // console.log(items)
                    //点击的时候需要弹出一个模态框
                    product_in_manage.funcs.fillData($("#detail_modal"), items)  //将获取的数据传到#detail_modal中
                    layer.open({
                        type: 1,
                        title: '成品入库详情',
                        content: $("#detail_modal"),
                        area: ['800px', '430px'],
                        btn: [' 返回'],
                        offset: "auto",
                        closeBtn: 0,
                        yes: function (index) {
                            //点击确定之后必须打印当前表单,推荐第三方插件 printthis.js todo
                            $("#detail_modal").css('display', 'none')
                            layer.close(index)
                        },
                        btn2: function (index) {
                            $("#detail_modal").css('display', 'none')
                            layer.close(index)
                        }
                    })
                })
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
                    product_in_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },

        fillData: function (table, items) {
            //  console.log(items)
            $("#batchNumber").text(items.batchNumber ? items.batchNumber : '')
            $("#model").text(items.model ? items.model : '')
            $("#department").text(items.department ? items.department.name : '')
            $("#detail_weight").text(items.weight ? items.weight : 'kg')
            $("#payer").text(items.payer ? items.payer.name : '')
            $("#godowner").text(items.godowner ? items.godowner.name : '')
            $("#payTime").text(items.payTime ? new Date(items.payTime).Format('yyyy-MM-dd') : '')
            $("#godownTime").text(items.godownTime ? new Date(items.godownTime).Format('yyyy-MM-dd') : '')
            var productGodowns = items.productGodowns
            var $tbody = $('#down_table').children('tbody')
            $tbody.empty() //清空表格
            var i = 1
            productGodowns.forEach(function (ele) {
                $tbody.append(
                    "<tr>" +
                    " <td>" + (i++) + "</td>" +
                    "<td>" + (ele.batchNumber) + "</td>" +
                    "<td>" + (!ele.unit ? 'kg' : ele.unit) + "</td>" +
                    "<td>" + (!ele.weight ? 0 : ele.weight) + "</td>" +
                    " <td>" + (ele.status) + "</td>"
                )
            })
        },

        /** 搜索事件 */
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var statusVal = $('#model-li-hide-select-49').val()
                $.post(home.urls.productIn.getByStatusByPage(), {
                    status: statusVal,
                }, function (result) {
                    var page = result.data
                    var items = result.data.content //获取数据
                    //   console.log(items)
                    var code = $('#model-li-hide-select-49').val()
                    const $tbody = $("#product_in_table").children('tbody')
                    product_in_manage.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'product_in_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productIn.getByStatusByPage(), {
                                    status: statusVal,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#product_in_table").children('tbody')
                                    product_in_manage.funcs.renderHandler($tbody, items)
                                    product_in_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}