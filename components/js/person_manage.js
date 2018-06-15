var person_manage = {
    init: function () {
        /** 获取人员管理分页显示并展示 */
        person_manage.funcs.renderTable()
        var out = $('#personman_page').width()
        var time = setTimeout(function(){
            var inside = $('.layui-laypage').width()

            clearTimeout(time)
        },30)
    }//$init end$

    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0

    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面 */
        renderTable: function () {
            /** 获取所有的记录 */
            $.post(home.urls.personman.getAllByPage(), {page: 0}, function (result) {
                var e = result.data.content //获取数据
                const $tbody = $("#personman_table").children('tbody')
                person_manage.funcs.renderHandler($tbody, e)
                person_manage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'personman_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                       if(!first) {
                           $.post(home.urls.personman.getAllByPage(), {
                               page: obj.curr - 1,
                               size: obj.limit
                           }, function (result) {
                               var e = result.data.content //获取数据
                               const $tbody = $("#personman_table").children('tbody')
                               person_manage.funcs.renderHandler($tbody, e)
                               person_manage.pageSize = result.data.content.length
                           })
                       }
                    }
                })
                $('#personman_page').css('padding-left','37%')
            })//$数据渲染完毕
        }
        /** 人员信息编辑事件 */
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var personmanCode = _selfBtn.attr('id').substr(5)
                $.get(home.urls.personman.getByCode(), {code: personmanCode}, function (result) {
                    var personman = result.data
                    $.get(home.urls.personman.getAllSupplier(), function (result) {
                        var companies = result.data
                        $("#company_type").empty()
                        $("#company_type").append("<option value='" + personman.supplier.code + "'>" + personman.supplier.name + "</option>")
                        companies.forEach(function (e) {
                            if(e.code!=personman.supplier.code)
                            $('#company_type').append(
                                "<option value='" + (e.code) + "'>" + (e.name) + "</option>"
                            )
                        })
                    })
                    layer.open({
                        type: 1,
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>登录名: &nbsp;&nbsp;&nbsp;<input type='text' id='person_code' value='" + (personman.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>用户名称:&nbsp;<input type='text' id='person_name' value='" + (personman.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>描述说明:&nbsp;<input type='text' id='person_description' value='" + (personman.description) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>手机号码:&nbsp;<input type='text' id='person_contact' value='" + (personman.contact) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>所属公司:&nbsp;<select style='width:170px;' id='company_type'></select></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '300px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#person_code').val()
                            var name = $('#person_name').val()
                            var description = $('#person_description').val()
                            var contact = $('#person_contact').val()
                            var supplierCode = result.data.supplier.code
                            $.post(home.urls.personman.update(), {
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
                                        person_manage.init()
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
                    "<td ><a href='#' class='editpersonman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕
            var editBtns = $('.editpersonman')
            person_manage.funcs.bindEditEventListener(editBtns)
        }
    }
}