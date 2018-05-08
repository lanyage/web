var mat_out_manage = {
    pageSize: null,
    init: function () {
        /** 渲染表格 */
        mat_out_manage.funcs.renderTable()
        // mat_out_manage.funcs.checkboxEventBinding()
        /** 将分页居中 */ 
        var out = $('#material_out_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#material_out_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {

        renderTable: function () {
            $.post(home.urls.materialOut.getAllByPage(), {}, function (res) {
                console.log(res.data.content)
                var $tbody = $("#material_out_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                mat_out_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                mat_out_manage.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'material_out_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.department.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#material_out_page").children('tbody')
                                mat_in_manage.funcs.renderHandler($tbody, items)
                                mat_in_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td>" + 1 + "</td>" +
                    "<td>" + 2 + "</td>" +
                    "<td>" + 3 + "</td>" +
                    "<td>" + 4 + "</td>" +
                    "<td>" + 5 + "</td>" +
                    "<td>" + 6 + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
            })
            // /** 绑定全选事件 */
            // mat_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".detail")
            mat_out_manage.funcs.bindDetailClick(detailBtns)
        }
        , bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                layer.open({
                    type: 1,
                    title: '原料出库单',
                    content: $("#detail_modal"),
                    area: ['800px', '400px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change').on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.mat_out_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }
        , disselectAll: function (dep_checkboxes, selectAllBox) {
            dep_checkboxes.off('change')
            dep_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.mat_out_checkbox:checked').length === $("#material_out_table").children('tbody').children('tr').length) {

                    selectAllBox.prop('checked', true)
                }
            })
        }
        /** $全选逻辑结束$ */
    }
}