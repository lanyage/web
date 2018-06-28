// 副产品信息
var handoverState_type = {
    init: function () {
        /** 获取部门信息分页显示并展示 */
        handoverState_type.funcs.renderTable()
    } //$init end$
    , pageSize: 0
    , funcs: {
        renderTable: function () {
            $.post(home.urls.handoverStateType.getAllByPage(), {
                page: 0
            }, function (result) {
                var res = result.data.content //获取数据
                const $tbody = $("#handoverState_type_table").children('tbody')
                handoverState_type.funcs.renderHandler($tbody, res)
                handoverState_type.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'handoverState_type_page',
                    count: 10 * page.totalPages //数据总数
                    , jump: function (obj, first) {
                        if(!first) {
                            $.post(home.urls.handoverStateType.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var res = result.data.content //获取数据
                                const $tbody = $("#handoverState_type_table").children('tbody')
                                handoverState_type.funcs.renderHandler($tbody, res)
                                handoverState_type.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#handoverState_type_page').css('padding-left','37%')
            })
            
            var addBtn = $("#model-li-hide-add-143")
            handoverState_type.funcs.bindAddEventListener(addBtn) 
            //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-143')
           
        }

        ,
        bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                $.get(servers.backup()+'handoverState/getAll',{ },function(result){
                    var res = result.data
                    $("#name1").empty()
                    $("#name2").empty()
                    $("#name3").empty()
                    $("#name4").empty()
                    $("#name5").empty()
                    res.forEach(function(e){
                        $("#name1").append("<option value="+e.code+">"+e.name+"</option>")
                        $("#name2").append("<option value="+e.code+">"+e.name+"</option>")
                        $("#name3").append("<option value="+e.code+">"+e.name+"</option>")
                        $("#name4").append("<option value="+e.code+">"+e.name+"</option>")
                        $("#name5").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                })
                layer.open({
                    type: 1,
                    title: '添加',
                    content: "<div id='addModal'>" +
                    "<div style='text-align: center;padding-top: 10px;'>" +
                    "<p style='padding: 5px 0px 5px 0px;'>交接状态类型1名称:<select id='name1'></select></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>交接状态类型2名称:<select id='name2'></select></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>交接状态类型3名称:<select id='name3'></select></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>交接状态类型4名称:<select id='name4'></select></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>交接状态类型5名称:<select id='name5'></select></p>" +
                    "</div>" +
                    "</div>",
                    area: ['370px', '340px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var code = $('#code').val()
                        var name1 = $('#name1').val()
                        var name2 = $('#name2').val()
                        var name3 = $('#name3').val()
                        var name4 = $('#name4').val()
                        var name5 = $('#name5').val()
                        $.post(home.urls.handoverStateType.add(), {
                            'handoverState1.code':name1,
                            'handoverState2.code':name2,
                            'handoverState3.code':name3,
                            'handoverState4.code':name4,
                            'handoverState5.code':name5,
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    handoverState_type.init()
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

        ,
        bindDeleteEventListener: function (deleteBtns) {
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
                        var handoverState_typeCode = _this.attr('id').substr(3)
                        $.post(home.urls.handoverStateType.deleteByCode(), {
                            code: handoverState_typeCode
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    handoverState_type.init()
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
        }

        ,
        bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        },
        bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '批量删除',
                        content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除选中记录吗?</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var handoverState_typeCodes = []
                            $('.checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    handoverState_typeCodes.push({
                                        code: $(this).val()
                                    })
                                }
                            })
                            $.ajax({
                                url: home.urls.handoverStateType.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(handoverState_typeCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            handoverState_type.init()
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
        },
        bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var handoverState_typeCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.handoverStateType.getByCode(), {
                    code: handoverState_typeCode
                }, function (result) {
                    var res = result.data
                   
                    $.get(servers.backup()+'handoverState/getAll',{ },function(result){
                        var res1 = result.data
                        res1.forEach(function(e){
                            if(e.code!=res.handoverState1.code){
                                 $("#name1").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(e.code!=res.handoverState2.code){
                                $("#name2").append("<option value="+e.code+">"+e.name+"</option>")
                           }
                            if(e.code!=res.handoverState3.code){
                                 $("#name3").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(e.code!=res.handoverState4.name){
                                $("#name4").append("<option value="+e.code+">"+e.name+"</option>")
                           }
                           if(e.code!=res.handoverState5.code){
                            $("#name5").append("<option value="+e.code+">"+e.name+"</option>")
                           }
                        })
                    })
                   
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content:  "<div id='addModal1'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>交接状态类型1名称:<select id='name1'><option value="+(res.handoverState1?res.handoverState1.code:'')+">"+(res.handoverState1?res.handoverState1.name:'')+"</option></select></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>交接状态类型2名称:<select id='name2'><option value="+(res.handoverState2?res.handoverState2.code:'')+">"+(res.handoverState2?res.handoverState2.name:'')+"</option></select></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>交接状态类型3名称:<select id='name3'><option value="+(res.handoverState3?res.handoverState3.code:'')+">"+(res.handoverState2?res.handoverState3.name:'')+"</option></select></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>交接状态类型4名称:<select id='name4'><option value="+(res.handoverState4?res.handoverState4.code:'')+">"+(res.handoverState2?res.handoverState4.name:'')+"</option></select></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>交接状态类型5名称:<select id='name5'><option value="+(res.handoverState5?res.handoverState5.code:'')+">"+(res.handoverState2?res.handoverState5.name:'')+"</option></select></p>" +
                        "</div>" +
                        "</div>",
                        btn: ['确认', '取消'],
                        area: ['370px', '340px'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var name1 = $('#name1').val()
                            var name2 = $('#name2').val()
                            var name3 = $('#name3').val()
                            var name4 = $('#name4').val()
                            var name5 = $('#name5').val()
                            $.post(home.urls.handoverStateType.update(), { 
                                 code:handoverState_typeCode,
                                'handoverState1.code':name1,
                                'handoverState2.code':name2,
                                'handoverState3.code':name3,
                                'handoverState4.code':name4,
                                'handoverState5.code':name5,
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        handoverState_type.init()
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
        } 
        ,
        renderHandler: function ($tbody, res) {
            $tbody.empty() //清空表格
            res.forEach(function (e) {
                $('#checkAll').prop('checked', false)
                console.log(res)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.handoverState1?e.handoverState1.name:'') + "</td>" +
                    "<td>" + (e.handoverState2?e.handoverState2.name:'') + "</td>" +
                    "<td>" + (e.handoverState3?e.handoverState3.name:'') + "</td>" +
                    "<td>" + (e.handoverState4?e.handoverState4.name:'') + "</td>" +
                    "<td>" + (e.handoverState5?e.handoverState5.name:'') + "</td>" +
                    "<td><a href='#' class='edithandoverState_type' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deletehandoverState_type' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            }) //$数据渲染完毕
            var editBtns = $('.edithandoverState_type')
            var deleteBtns = $('.deletehandoverState_type')
            handoverState_type.funcs.bindDeleteEventListener(deleteBtns)
            handoverState_type.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#checkAll')
            handoverState_type.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-143')
            handoverState_type.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var checkboxes = $('.checkbox')
            handoverState_type.funcs.disselectAll(checkboxes, selectAllBox)
        },
        disselectAll: function (checkboxes, selectAllBox) {
            checkboxes.off('change')
            checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.checkbox:checked').length === handoverState_type.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}