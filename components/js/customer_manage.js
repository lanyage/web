var customer_manage = {

    init: function () {
        /** 获取部门信息分页显示并展示 */
        customer_manage.funcs.renderTable()
        var out = $('#customer_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#customer_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    }//$init end$

    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0

    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面 */
        renderTable: function () {
            /** 获取所有的记录 */
            $.post(home.urls.customer.listCustomer(), { page: 0 }, function (result) {
                var customers = result.data.content //获取数据
                const $tbody = $("#customer_table").children('tbody')
                customer_manage.funcs.renderHandler($tbody, customers)
                customer_manage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'customer_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.customer.listCustomer(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var customers = result.data.content //获取数据
                                const $tbody = $("#customer_table").children('tbody')
                                customer_manage.funcs.renderHandler($tbody, customers)
                                customer_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })//$数据渲染完毕

            /** 追加添加事件 */
            var addBtn = $("#model-li-hide-add-79")
            customer_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-79')
            customer_manage.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-79')
            customer_manage.funcs.bindSearchEventListener(searchBtn)
            /** 追加重置密码事件 */
            var resetBtn = $('#model-li-hide-reset-79')
            customer_manage.funcs.bindResetEventListener(resetBtn)
            /** 追加修改密码事件 */
            var modifyBtn = $('#model-li-hide-modify-79')
            customer_manage.funcs.bindModifyEventListener(modifyBtn)
        }

        /** 添加事件 */
        , bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                /** 弹出一个询问框 */
                layer.open({
                    type: 1,
                    title: '新增',
                    content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>用户名称:<input type='text' id='cus_name'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;登录名:<input type='text' id='cus_code'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>描述说明:<input type='text' id='cus_description'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>手机号码:<input type='text' id='cus_contact'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>所属公司:<select id='add_supplier_name' style='padding: 3px 33px;'></select></p>" +
                        "</div>" +
                        "</div>",
                    area: ['350px', '300px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var code = $('#cus_code').val()
                        var name = $('#cus_name').val()
                        var description = $('#cus_description').val()
                        var contact = $('#cus_contact').val()
                        var supplier_name = $('#add_supplier_name').val()
                        $.post(home.urls.customer.addCustomer(), {
                            code: code,
                            name: name,
                            description: description,
                            contact: contact,
                            'supplier.code': supplier_name
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    customer_manage.init()
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
                $.get(home.urls.customer.getAllSuppliers(), function (result) {
                    var companies = result.data
                    companies.forEach(function (e) {
                        $('#add_supplier_name').append(
                            "<option value='" + (e.code) + "'>" + (e.name) + "</option>"
                        )
                    })
                })
            })
        }//$ bindAddEventListener——end$

        /** 删除事件 */
        , bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                //首先弹出一个询问框
                var _this = $(this)
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                    area: ['180px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        console.log('yes')
                        var customerCode = _this.attr('id').substr(3)
                        $.post(home.urls.customer.deleteCustomer(), { code: customerCode }, function (result) {
                            console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    customer_manage.init()
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
        }//$ bindDeleteEventListener_end$

        /** 搜索事件绑定 */
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var customer_name = $('#customer_name_input').val()
                $.post(home.urls.customer.listCustomer(), { name: customer_name }, function (result) {
                    var page = result.data
                    var customers = result.data.content //获取数据
                    const $tbody = $("#customer_table").children('tbody')
                    customer_manage.funcs.renderHandler($tbody, customers)
                    layui.laypage.render({
                        elem: 'customer_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            $.post(home.urls.customer.listCustomer(), {
                                name: customer_name,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var customers = result.data.content //获取数据
                                const $tbody = $("#customer_table").children('tbody')
                                customer_manage.funcs.renderHandler($tbody, customers)
                                customer_manage.pageSize = result.data.content.length
                            })
                            if (!first) {
                                console.log('not first')
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$

        /** 绑定刷新事件 */
        , bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, { offset: ['40%', '58%'] });
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    customer_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        }
        /** 全选*/
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.cus_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }
        /** 批量删除*/
        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.cus_checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '批量删除',
                        content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除所有记录吗?</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var customerCodes = []
                            $('.cus_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    customerCodes.push({ code: $(this).val() })
                                }
                            })
                            $.ajax({
                                url: home.urls.customer.deleteCustomerInBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(customerCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            customer_manage.init()
                                            clearTimeout(time)
                                        }, 500)
                                    }
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                }
                            })
                            layer.close(index)
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                }
            })
        }
        /** 编辑事件 */
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var customerCode = _selfBtn.attr('id').substr(5)
                $.get(home.urls.customer.customerDetail(), { code: customerCode }, function (result) {
                    var customers = result.data
                    layer.open({
                        type: 1,
                        content: "<div id='addModal'>" +
                            "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'>用户名称:<input type='text' id='cus_name' value='" + (customers.name) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;登录名:<input type='text' id='cus_code' value='" + (customers.code) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>描述说明:<input type='text' id='cus_description' value='" + (customers.description) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>手机号码:<input type='text' id='cus_contact' value='" + (customers.contact) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>所属公司:<select id='cus_supplier_name'  style='padding: 3px 33px ;' value='" + (customers.supplier.code) + "'></select></p>" +
                            "</div>" +
                            "</div>",
                        area: ['350px', '200px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#cus_code').val()
                            var name = $('#cus_name').val()
                            var description = $('#cus_description').val()
                            var contact = $('#cus_contact').val()
                            var supplier_name = $('#cus_supplier_name').val()
                            $.post(home.urls.customer.updateCustomer(), {
                                code: code,
                                name: name,
                                description: description,
                                contact: contact,
                                'supplier.code': supplier_name
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        customer_manage.init()
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
                    $.get(home.urls.customer.getAllSuppliers(), function (result) {
                        var companies = result.data
                        companies.forEach(function (e) {
                            $('#cus_supplier_name').append(
                                "<option value='" + (e.code) + "'>" + (e.name) + "</option>"
                            )
                        })
                    })
                })
            })
        }//$ bindEditEventListener——end$

        /** 重置密码 */
        , bindResetEventListener: function (resetBtns) {
            resetBtns.off('click')
            resetBtns.on('click', function () {
                layer.open({
                    type: 1,
                    title: '重置密码',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要重置密码吗?</h5>",
                    area: ['190px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        var cusCodes = []
                        $('.cus_checkbox').each(function () {
                            cusCodes.push({ code: $(this).val() })
                        })
                        console.log(cusCodes)
                        $.ajax({
                            url: home.urls.customer.resetPassword(),
                            contentType: 'application/json',
                            data: JSON.stringify(cusCodes),
                            dataType: 'json',
                            type: 'post',
                            success: function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        customer_manage.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                            }
                        })
                        layer.close(index)
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
            })
        }
        /** 修改初始密码 */
        , bindModifyEventListener: function (modifyBtns) {
            modifyBtns.off('click')
            modifyBtns.on('click', function () {
                if ($('.cus_checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '修改初始密码',
                        content: "<div id='changeModal'>" +
                            "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'>原密码:<input type='text' id='old_password' /></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>新密码:<input type='text' id='new_password' placeholder='至少6位'/></p>" +
                            "</div>" +
                            "</div>",
                        area: ['350px', '200px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var cusCode
                            $('.cus_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    cusCode = $(this).val()
                                }
                            })
                            var oldPassword = $('#old_password').val()
                            var newPassword = $('#new_password').val()
                            $.post(home.urls.customer.changePassword(), {
                                code: cusCode,
                                oldPassword: oldPassword,
                                newPassword: newPassword,
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        customer_manage.init()
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
                }
            })
        }


        /** 渲染 */
        , renderHandler: function ($tbody, customers) {
            $tbody.empty() //清空表格
            customers.forEach(function (e) {
                $('#cus_checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='cus_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.description) + "</td>" +
                    "<td>" + (e.contact) + "</td>" +
                    "<td>" + (e.supplier.name) + "</td>" +
                    "<td><a href='#' class='editcustomer' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deletecustomer' id='de-" + (e.code) + "'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕
            var editBtns = $('.editcustomer')
            var deleteBtns = $('.deletecustomer')
            customer_manage.funcs.bindDeleteEventListener(deleteBtns)
            customer_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#cus_checkAll')
            customer_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-60')
            customer_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var cus_checkboxes = $('.cus_checkbox')
            customer_manage.funcs.disselectAll(cus_checkboxes, selectAllBox)
        }
        /** 全选逻辑 */
        , disselectAll: function (cus_checkboxes, selectAllBox) {
            cus_checkboxes.off('change')
            cus_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.cus_checkbox:checked').length === customer_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }

}