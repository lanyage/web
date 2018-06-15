var staff_manage = {
    init: function () {
        /** 获取人员管理分页显示并展示 */
        staff_manage.funcs.renderTable()
    }//$init end$

    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0

    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面 */
        renderTable: function () {
            /** 获取所有的记录 */
            $.post(home.urls.staffman.getAllByPage(), {page: 0}, function (result) {
                var e = result.data.content //获取数据
                const $tbody = $("#staffman_table").children('tbody')
                staff_manage.funcs.renderHandler($tbody, e)
                staff_manage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'staffman_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.staffman.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var e = result.data.content //获取数据
                                const $tbody = $("#staffman_table").children('tbody')
                                staff_manage.funcs.renderHandler($tbody, e)
                                staff_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#staffman_page').css('padding-left','37%')
            })//$数据渲染完毕
        }
        /** 人员信息编辑事件 */
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var staffmanCode = _selfBtn.attr('id').substr(5)
                $.get(home.urls.staffman.getByCode(), {code: staffmanCode}, function (result) {
                    var staffman = result.data
                    $.get(home.urls.personman.getAllSupplier(), function (result) {
                        var companies = result.data
                        $("#company_type").empty()
                        $("#company_type").append("<option value='" + staffman.supplier.code + "'>" + staffman.supplier.name + "</option>")
                        companies.forEach(function (e) {
                            if(e.code!=staffman.supplier.code)
                            $('#company_type').append(
                                "<option value='" + (e.code) + "'>" + (e.name) + "</option>"
                            )
                        })
                    })
                    layer.open({
                        type: 1,
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>登录名:&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' id='staff_code' value='" + (staffman.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>用户名称:&nbsp;<input type='text' id='staff_name' value='" + (staffman.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>描述说明:&nbsp;<input type='text' id='staff_description' value='" + (staffman.description) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>手机号码:&nbsp;<input type='text' id='staff_contact' value='" + (staffman.contact) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>所属公司:&nbsp;<select style='width:170px;' id='company_type'></select></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '300px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#staff_code').val()
                            var name = $('#staff_name').val()
                            var description = $('#staff_description').val()
                            var contact = $('#staff_contact').val()
                            var supplierCode = $('#company_type').val()
                            $.post(home.urls.staffman.update(), {
                                codeBefore: code,
                                code: code,
                                name: name,
                                description: description,
                                contact: contact,
                                'supplier.code': supplierCode
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        staff_manage.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.close(index)
                            })
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                })
            })
        }//$ bindEditEventListener——end$
        /** 渲染 */
        , renderHandler: function ($tbody, e) {
            $tbody.empty() //清空表格
            e.forEach(function (e) {
                $tbody.append(
                    "<tr>" +
                    "<td class='edit'>" + (e.code) + "</td>" +
                    "<td class='edit'>" + (e.name) + "</td>" +
                    "<td class='edit'>" + (e.description) + "</td>" +
                    "<td class='edit'>" + (e.contact) + "</td>" +
                    "<td class='edit'>" + (e.supplier.name) + "</td>" +
                    "<td ><a href='#' class='editstaffman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕
            var editBtns = $('.editstaffman')
            staff_manage.funcs.bindEditEventListener(editBtns)
        }
    }
}