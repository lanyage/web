var company_manage = {
    init: function () {
        /** 获取公司管理分页显示并展示 */
        company_manage.funcs.renderTable()
        var out = $('#companyman_page').width()
        var time = setTimeout(function(){
            var inside = $('.layui-laypage').width()
            console.log('inside', inside)
            $('#companyman_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 30 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
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
            $.post(home.urls.companyman.getAllByPage(), {page: 0}, function (result) {
                var e = result.data.content //获取数据
                const $tbody = $("#company_table").children('tbody')
                company_manage.funcs.renderHandler($tbody, e)
                company_manage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'companyman_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if(!first){
                            $.post(home.urls.companyman.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var e = result.data.content //获取数据
                                const $tbody = $("#company_table").children('tbody')
                                company_manage.funcs.renderHandler($tbody, e)
                                company_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })//$数据渲染完毕
        }
        /** 公司信息编辑事件 */
    , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var conpanymanCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.companyman.getByCode(), {code: conpanymanCode}, function (result) {
                    var companyman = result.data
                    layer.open({
                        type: 1,
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>公司编号:&nbsp;<input type='text' id='company_code' value='" + (companyman.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>公司名称:&nbsp;<input type='text' id='company_name' value='" + (companyman.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>信用代码:&nbsp;<input type='text' id='company_creditCode' value='" + (companyman.creditCode) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>地址:&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' id='company_address' value='" + (companyman.address) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>联系人:&nbsp;&nbsp;&nbsp;<input type='text' id='company_person' value='" + (companyman.contactPerson) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>联系电话:&nbsp;<input type='text' id='company_contact' value='" + (companyman.contact) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>公司类型:&nbsp;<select disabled='disabled' style='width: 150px' id='company_type' value='" + (companyman.supplierType.code) + "'><option value='companyman.supplierType.code'>"+(companyman.supplierType.type)+"</option> </select></p>" +
                        "</div>" +
                        "</div>",
                        area: ['400px', '350px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#company_code').val()
                            var name = $('#company_name').val()
                            var creditCode = $('#company_creditCode').val()
                            var address = $('#company_address').val()
                            var contactPerson = $('#company_person').val()
                            var contact = $('#company_contact').val()
                            var supplierType = result.data.supplierType.code
                            $.post(home.urls.companyman.update(), {
                                codeBefore: code,
                                code: code,
                                name: name,
                                creditCode: creditCode,
                                address: address,
                                contactPerson: contactPerson,
                                contact: contact,
                                'supplierType.code': supplierType
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        company_manage.init()
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
                    "<td class='edit'>" + (e.creditCode) + "</td>" +
                    "<td class='edit'>" + (e.address) + "</td>" +
                    "<td class='edit'>" + (e.contactPerson) + "</td>" +
                    "<td class='edit'>" + (e.contact) + "</td>" +
                    "<td class='edit'>" + (e.supplierType.type) + "</td>" +
                    "<td ><a href='#' class='editcompanyman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕
            var editBtns = $('.editcompanyman')
            company_manage.funcs.bindEditEventListener(editBtns)
        }
    }
}