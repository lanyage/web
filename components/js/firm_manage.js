var firm_manage = {
    init: function () {
        /** 获取公司管理分页显示并展示s */
        firm_manage.funcs.renderTable()
    }//$init end$

    /** 当前总记录数,用户控制全选逻辑 */
, pageSize: 0

        /** 逻辑方法 */
        , funcs: {
        /** 渲染页面 */
        renderTable: function () {
            /** 获取所有的记录 */
            $.post(home.urls.firmman.getAllByPage(), {page: 0}, function (result) {
                var e = result.data.content //获取数据
                const $tbody = $("#firmman_table").children('tbody')
                firm_manage.funcs.renderHandler($tbody, e)
                firm_manage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'firmman_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if(!first){
                            $.post(home.urls.firmman.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var e = result.data.content //获取数据
                                const $tbody = $("#firmman_table").children('tbody')
                                firm_manage.funcs.renderHandler($tbody, e)
                                firm_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#firmman_page').css('padding-left', '37%')
            })//$数据渲染完毕
        }
        /** 公司信息编辑事件 */
    , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var firmmanCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.firmman.getByCode(), {code: firmmanCode}, function (result) {
                    var firmman = result.data
                    $.get(home.urls.companyman.getAllsupplierType(), function (result) {
                        var companies = result.data
                        $("#firm_type").empty()
                        $("#firm_type").append("<option value='" + firmman.supplierType.code + "'>" + firmman.supplierType.type + "</option>")
                        companies.forEach(function (e) {
                            if(e.type!=firmman.supplierType.type)
                            $('#firm_type').append(
                                "<option value='" + (e.code) + "'>" + (e.type) + "</option>"
                            )
                        })
                    })
                    layer.open({
                        type: 1,
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>公司编号: &nbsp;<input type='text' id='firm_code' value='" + (firmman.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>公司名称: &nbsp;<input type='text' id='firm_name' value='" + (firmman.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>信用代码: &nbsp;<input type='text' id='firm_creditCode' value='" + (firmman.creditCode) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>地址:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' id='firm_address' value='" + (firmman.address) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>联系人:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' id='firm_person' value='" + (firmman.contactPerson) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>联系电话: &nbsp;<input type='text' id='firm_contact' value='" + (firmman.contact) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>公司类型:&nbsp;<select style='width:170px;' id='firm_type'></select></p>" +
                        "</div>" +
                        "</div>",
                        area: ['400px', '350px'],
                        btn: ['确认', '取消'],
                        offset: ['38%', '45%'],
                        yes: function (index) {
                            var code = $('#firm_code').val()
                            var name = $('#firm_name').val()
                            var creditCode = $('#firm_creditCode').val()
                            var address = $('#firm_address').val()
                            var contactPerson = $('#firm_person').val()
                            var contact = $('#firm_contact').val()
                            var supplierType = $('#firm_type').val()
                            $.post(home.urls.firmman.update(), {
                                codeBefore: firmmanCode,
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
                                        firm_manage.init()
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
            var alltype = []    //保存所有的公司类型
            e.forEach(function (e){
                if(alltype.indexOf(e.supplierType.type) < 0){
                    alltype.push(e.supplierType.type)
                }
            })
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
                    "<td ><a href='#' class='editfirmman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕
            var editBtns = $('.editfirmman')
            firm_manage.funcs.bindEditEventListener(editBtns)
        }
    }
}