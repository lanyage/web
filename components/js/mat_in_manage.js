var mat_in_manage = {
    pageSize: null,
    init: function () {
        /** 渲染表格 */
        mat_in_manage.funcs.renderTable()
        /** 需要给刷新按钮和搜索按钮绑定点击事件 */

        /** 将分页居中 */
        var out = $('#material_in_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#material_in_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {
        renderTable: function () {
            $.post(home.urls.materialIn.getAllByPage(), {}, function (res) {
                var $tbody = $("#material_in_table").children('tbody')
                var items = res.data.content
                mat_in_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                mat_in_manage.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'material_in_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行')
                            $.post(home.urls.department.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#material_in_table").children('tbody')
                                mat_in_manage.funcs.renderHandler($tbody, items)
                                mat_in_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
        }
        , renderHandler: function ($tbody, items) {
            // $tbody.empty() //清空表格
            console.log(items)
            items.forEach(function (e) {
                // $('#dep_checkAll').prop('checked', false)
                console.log(e.code)
                var content = (
                    "<tr>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.batchNumber) + "</td>" +
                    "<td>" + (e.supplier ? e.supplier.name : null) + "</td>" +
                    "<td>" + (e.date) + "</td>" +
                    "<td>" + (e.creatTime) + "</td>" +
                    "<td>" + (e.createUser ? e.createUser.name : null) + "</td>" +
                    "<td><a href='#' class='detail' id='detail-" + (e.code) + "'><i class='layui-icon'>&#xe60a;</i></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
            })
            // /** 绑定全选事件 */
            // mat_in_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".detail")
            mat_in_manage.funcs.bindDetailClick(detailBtns)
        }
        , bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                console.log($(this).attr('id'))
                //点击的时候需要弹出一个模态框
                layer.open({
                    type: 1,
                    title: '原料入库单',
                    content: $("#detail_modal"),
                    area: ['800px', '430px'],
                    btn: ['打印', '返回'],
                    offset: "auto",
                    yes: function (index) {
                        //点击确定之后必须打印当前表单,推荐第三方插件 printthis.js todo
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    },
                    btn2: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        , getData: function () {

        }
        /** 全选逻辑 */
        , checkboxEventBinding: function () {
            var selectAllBox = $('#mat_in_checkAll')
            mat_in_manage.funcs.bindSelectAll(selectAllBox)
            var dep_checkboxes = $('.mat_in_checkbox')
            mat_in_manage.funcs.disselectAll(dep_checkboxes, selectAllBox)
        }
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change').on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.mat_in_checkbox').each(function () {
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
                } else if (statusNow === true && $('.mat_in_checkbox:checked').length === $("#material_in_table").children('tbody').children('tr').length) {

                    selectAllBox.prop('checked', true)
                }
            })
        }
        /** $全选逻辑结束$ */
    }
}