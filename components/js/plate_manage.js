var plate_manage={
    init: function () {

        //////////////////////////////////
        //bind SelectAll for editModal checkBoxes
        //////////////////////////////////
        //////////////////////////////////
        //render table
        //////////////////////////////////
        plate_manage.funcs.renderTable()

        var out = $('#plate_manage_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#plate_manage_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    }
    , funcs: {
        renderTable: function () {
            //post here to getAll     $todo


            $.post(home.urls.plateAlarm.getAllByPage(), {}, function (res) {

                var $tbody = $("#lib_manage_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                plate_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                plate_managepageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'plate_manage_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.plateAlarm.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#lib_manage_table").children('tbody')
                                plate_manage.funcs.renderHandler($tbody, items)
                                plate_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            var refreshBtn = $('#model-li-hide-refresh-52');
            plate_manage.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model-li-hide-search-52')
            plate_manage.funcs.bindSearchEventListener(searchBtn)
            //////////////////////////////////
            //bind editModal's addBtn click
            //////////////////////////////////

        },
        renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                "<td>" + e.code + "</td>" +
                "<td>" + (e.rawType.material.name) + "</td>" +
                "<td>" + (e.rawType.name) + "</td>" +
                "<td>" + (e.weight) + "</td>" +
                "<td>" + e.status + "</td>" +
                "<td><a href=\"#\" class='lib_detail' id='detail_" + (code) + "'><i class=\"layui-icon\">&#xe6b2;</i></a></td>" +
                "</tr>"
            )
            $tbody.append(content)
        })
        // /** 绑定全选事件 */
        // mat_out_manage.funcs.checkboxEventBinding()
        /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
        var detailBtns = $(".lib_detail")
        plate_manage.funcs.bindDetailEventListener(detailBtns)

    },
        bindDetailEventListener: function (editBtns) {
            editBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '报损单申请',
                    content: $("#detail_modal"),
                    area: ['800px', '500px'],
                    btn: ['提交', '取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn1: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        },
        bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {

                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    plate_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var auditStatus = $('#lib_manage_name option:selected').val();
                //var createDate = new Date(order_date.replace(new RegExp("-","gm"),"/")).getTime()
                //var createDate =order_date.getTime;//毫秒级; // date类型转成long类型
                $.post(home.urls.plateAlarm.getByStatusByPage(), {
                    status: auditStatus
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#lib_manage_table").children('tbody')
                    plate_manage.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'plate_manage_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.plateAlarm.getByStatusByPage(), {
                                    status: auditStatus,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#lib_manage_table").children('tbody')
                                    plate_manage.funcs.renderHandler($tbody, items)
                                    plate_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
    }
}
