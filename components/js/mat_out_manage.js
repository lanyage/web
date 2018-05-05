var mat_out_manage = {
    pageSize : null,
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
            // result {
            //     code : 0/-1,
            //         data : user,
            //         message : '登录成功/登录失败'
            // }
            // $.get("http://localhost:8080/mes/user/login",{username:'lanyage', password : '123'},function(res) {
            //     if()
            // })

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
                    elem: 'material_out_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
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
                var contact = e.contact
                var date = e.sendDate
                var status = e.status

                var content = (
                    "<tr>"+
                   " <td>"+(code)+"</td>"+
                        "<td>"+(contact)+"</td>"+
                      "  <td>"+(date)+"</td>"+
                       " <td>"+(status)+"</td>"+
                        "<td>"+(status)+"</td>"+
                        "<td>"+(status)+"</td>"+
                        "<td><a href=\"#\" class='detail' id='detail-"+(code)+"'><i class=\"layui-icon\">&#xe60a;</i></a></td>"+
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
        , bindDetailClick: function(detailBtns) {
            detailBtns.off('click').on('click',function() {
                //点击的时候需要弹出一个模态框
                layer.open({
                    type: 1,
                    title: '原料出库单',
                    content: "<div><h1>Hello World!</h1></div>",
                    area: ['350px', '200px'],
                    btn: ['打印', '返回'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var code = $('#dep_code').val()
                        var name = $('#dep_name').val()
                        var info = $('#dep_info').val()
                        $.post(home.urls.department.add(), {
                            code: code,
                            name: name,
                            info: info
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    department_manage.init()
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.close(index)
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                });
            })
        }
        /** 全选逻辑 */
        , checkboxEventBinding: function () {
            var selectAllBox = $('#mat_out_checkAll')
            mat_out_manage.funcs.bindSelectAll(selectAllBox)
            var dep_checkboxes = $('.mat_out_checkbox')
            mat_out_manage.funcs.disselectAll(dep_checkboxes, selectAllBox)
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