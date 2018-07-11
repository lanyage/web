var check_manage = {
    init: function () {
        check_manage.funcs.renderTable()
        $("#checkprocess_name_input").empty()
        $.get(servers.backup()+'check/getAll',{},function(result){
            var res = result.data
            $("#checkprocess_name_input").html("<option value='-1'>请选择审核流程u</option>")
            res.forEach(function(e){
                $("#checkprocess_name_input").append("<option value="+e.name+">"+e.name+"</option>")
            })
        })
    } //$init end$
    ,
    pageSize: 0,
    funcs: {
        renderTable: function () {
            $.post(home.urls.check.getAllByPage(), {
                page: 0
            }, function (result) {
                var checks = result.data.content //获取数据
                const $tbody = $("#checkprocess_table").children('tbody')
                check_manage.funcs.renderHandler($tbody, checks)
                check_manage.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'checkprocess_page',
                    count: 10 * page.totalPages //数据总数
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.check.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var checks = result.data.content //获取数据
                                const $tbody = $("#checkprocess_table").children('tbody')
                                check_manage.funcs.renderHandler($tbody, checks)
                                check_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#checkprocess_page').css('padding-left', '37%')
            })
            //$数据渲染完毕
            var addBtn = $("#model-li-hide-add-75")
            check_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-75')
            check_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
            var searchBtn = $('#model-li-hide-search-75')
            check_manage.funcs.bindSearchEventListener(searchBtn)
        },

        bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                $('#process_code').empty()
                $('#chp_leader1code').empty()
                $('#chp_leader2code').empty()
                $('#chp_leader3code').empty()
                $('#chp_leader4code').empty()
                //$('#process_code').append("<option value='-1'>请选择流程类型</option>")
                $.get(servers.backup()+'process/getAll',{},function(result){
                    process = result.data
                    process.forEach(function(e){
                    $("#process_code").append(
                        "<option value="+e.code+">"+e.name+"</option>"
                    )
                })
                })
                
                //获得所有用户信息
                $.get(servers.backup()+'user/getAll',{},function(result){
                   user = result.data
                   user.forEach(function(e){
                    $("#chp_leader1code").append(
                        "<option value="+e.code+">"+e.name+"</option>"
                    )
                    $('#chp_leader2code').append(
                        "<option value="+e.code+">"+e.name+"</option>"
                    )
                    $('#chp_leader3code').append(
                        "<option value="+e.code+">"+e.name+"</option>"
                    )
                    $('#chp_leader4code').append(
                        "<option value="+e.code+">"+e.name+"</option>"
                    )
                    $('#chp_leader5code').append(
                        "<option value="+e.code+">"+e.name+"</option>"
                    )
                })
                })  
                
                //首先就是弹出一个弹出框
                layer.open({
                    type: 1,
                    title: '添加',
                    content: "<div id='addModal'>" +
                    '<div style="text-align:center;padding-top:10px">' +
                    '<ul style="line-height:30px">' +
                    '<li>流程编码: &nbsp;<input type="text" id="chp_code"></li>' +
                    '<li>编码名称: &nbsp;<input type="text" id="chp_name" ></li>' +
                    '<li>流程类型: &nbsp;<select id="process_code"><option value="-1">请选择流程类型</option></select></li>' +
                    '<li>负责人1:&nbsp;&nbsp;&nbsp;<select id="chp_leader1code"><option value="-1">请选择负责人</option></select></li>' +
                    '<li>负责人2:&nbsp;&nbsp;&nbsp;<select id="chp_leader2code"><option value="-1">请选择负责人</option></select></li>' +
                    '<li>负责人3:&nbsp;&nbsp;&nbsp;<select id="chp_leader3code"><option value="-1">请选择负责人</option></select></li>' +
                    '<li>负责人4:&nbsp;&nbsp;&nbsp;<select id="chp_leader4code"><option value="-1">请选择负责人</option></select></li>' +
                    '<li>负责人5:&nbsp;&nbsp;&nbsp;<select id="chp_leader5code"><option value="-1">请选择负责人</option></select></li>' +
                    '</ul>' +
                    '</div>' +
                    "</div>",
                    area: ['400px', '380px'],
                    btn: ['确认', '取消'],
                    offset: 'auto',
                    yes: function (index) {
                        var code = $('#chp_code').val()
                        var name = $('#chp_name').val()
                        var processcode = $('#process_code').val()
                        var leader1code = $('#chp_leader1code').val()
                        var leader2code = $('#chp_leader2code').val()
                        var leader3code = $('#chp_leader3code').val()
                        var leader4code = $('#chp_leader4code').val()
                        var leader5code = $('#chp_leader5code').val()
                        // console.log('leader1code', leader1code)
                        // console.log('leader2code', leader2code)
                        // console.log('leader3code', leader3code)
                        // console.log('leader4code', leader4code)
                        // console.log('leader5code', leader5code)
                        $.post(home.urls.check.add(), {
                            code: code,
                            name: name,
                            'leader1.code': leader1code,
                            'leader2.code': leader2code,
                            'leader3.code': leader3code,
                            'leader4.code': leader4code,
                            'leader5.code': leader5code,
                            'process.code': processcode,
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    check_manage.init()
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
        } //$ bindAddEventListener——end$
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
                        var checkprocessCode = _this.attr('id').substr(3)
                        $.post(home.urls.check.deleteByCode(), {
                            code: checkprocessCode
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    check_manage.init()
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
        } //$ bindDeleteEventListener_end$
        ,


        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var checkprocess_name = $('#checkprocess_name_input').val()
                $.post(home.urls.check.getAllByLikeNameByPage(), {
                    name: checkprocess_name
                }, function (result) {
                    var page = result.data
                    var checks = result.data.content //获取数据
                    const $tbody = $("#checkprocess_table").children('tbody')
                    check_manage.funcs.renderHandler($tbody, checks)
                    layui.laypage.render({
                        elem: 'checkprocess_page',
                        count: 10 * page.totalPages //数据总数
                        ,
                        jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.check.getAllByLikeNameByPage(), {
                                    name: checkprocess_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var checks = result.data.content //获取数据
                                    const $tbody = $("#checkprocess_table").children('tbody')
                                    check_manage.funcs.renderHandler($tbody, checks)
                                    check_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$
        ,


        bindRefreshEventLisener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {
                    offset: ['40%', '58%']
                });
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    check_manage.init()
                    $("#checkprocess_name_input").val('')
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },


        bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.chp_checkbox:checked').length === 0) {
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
                            var processManages = []
                            $('.chp_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    processManages.push({
                                        code: $(this).val()
                                    })
                                }
                            })
                            console.log(processManages)
                            $.ajax({
                                url: home.urls.check.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(processManages),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            check_manage.init()
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
                var checkprocessCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.check.getByCode(), {
                    code: checkprocessCode
                }, function (result) {
                    var check = result.data
                    var user
                    $('#process_code').empty()
                    $('#chp_leader1code').empty()
                    $('#chp_leader2code').empty()
                    $('#chp_leader3code').empty()
                    $('#chp_leader4code').empty()
                   
                    //编辑时判断流程类型是否为空  为空if 非空else
                    if(check.process===null){
                        $("#process_code").append("<option value='-1'>请选择流程类型</option>")
                        $.get(servers.backup()+'process/getAll',{},function(result){
                            process = result.data
                            process.forEach(function(e){
                                $('#process_code').append(
                                    "<option value="+e.code+">"+e.name+"</option>"
                                )
                            })
                        })
                    }else{
                        $("#process_code").append("<option value="+check.process.code+">"+check.process.name+"</option>")
                        
                        $.get(servers.backup()+'process/getAll',{},function(result){
                            process = result.data
                            process.forEach(function(e){
                                if(e.code!=check.process.code){
                                    $('#process_code').append(
                                    "<option value="+e.code+">"+e.name+"</option>"
                            )
                            }
                        })
                    })
                    }
                     //编辑时判断用户是否为空  为空if 非空else
                     //负责人1
                     $.get(servers.backup()+'user/getAll',{},function(result){
                         user = result.data
                         if(check.leader1 ===null){
                            $("#chp_leader1code").append("<option value='-1'>请选择负责人</option>")
                            user.forEach(function(e){
                                $('#chp_leader1code').append(
                                    "<option value="+e.code+">"+e.name+"</option>"
                          )
                         })
                         }else{
                           $("#chp_leader1code").append("<option value="+check.leader1.code+">"+check.leader1.name+"</option>")
                           $("#chp_leader1code").append("<option value='-1'>请选择负责人</option>")
                           user.forEach(function(e){
                               if(e.code!=check.leader1.code){
                                  $('#chp_leader1code').append(
                                      "<option value="+e.code+">"+e.name+"</option>"
                                  )
                                } 
                            })
                          }    
                         //负责人2
                         if(check.leader2 ===null){
                            $("#chp_leader2code").append("<option value='-1'>请选择负责人</option>")
                            user.forEach(function(e){
                                $('#chp_leader2code').append(
                                    "<option value="+e.code+">"+e.name+"</option>"
                          )
                         })
                         }else{
                           $("#chp_leader2code").append("<option value="+check.leader2.code+">"+check.leader2.name+"</option>")
                           $("#chp_leader2code").append("<option value='-1'>请选择负责人</option>")
                           user.forEach(function(e){
                               if(e.code!=check.leader2.code){
                                  $('#chp_leader2code').append(
                                      "<option value="+e.code+">"+e.name+"</option>"
                                  )
                                } 
                             })
                            }     
                          //负责人3
                          if(check.leader3 ===null){
                            $("#chp_leader3code").append("<option value='-1'>请选择负责人</option>")
                            user.forEach(function(e){
                                $('#chp_leader3code').append(
                                    "<option value="+e.code+">"+e.name+"</option>"
                          )
                         })
                         }else{
                           $("#chp_leader3code").append("<option value="+check.leader3.code+">"+check.leader3.name+"</option>")
                           $("#chp_leader3code").append("<option value='-1'>请选择负责人</option>")
                           user.forEach(function(e){
                               if(e.code!=check.leader3.code){
                                  $('#chp_leader3code').append(
                                      "<option value="+e.code+">"+e.name+"</option>"
                                  )
                                } 
                             })
                            } 
                         //负责人4
                         if(check.leader4 ===null){
                            $("#chp_leader4code").append("<option value='-1'>请选择负责人</option>")
                            user.forEach(function(e){
                                $('#chp_leader4code').append(
                                    "<option value="+e.code+">"+e.name+"</option>"
                          )
                         })
                         }else{
                           $("#chp_leader4code").append("<option value="+check.leader4.code+">"+check.leader4.name+"</option>")
                           $("#chp_leader4code").append("<option value='-1'>请选择负责人</option>")
                           user.forEach(function(e){
                               if(e.code!=check.leader4.code){
                                  $('#chp_leader4code').append(
                                      "<option value="+e.code+">"+e.name+"</option>"
                                  )
                                } 
                             })
                            }    
                          //负责人5
                          if(check.leader5 ===null){
                            $("#chp_leader5code").append("<option value='-1'>请选择负责人</option>")
                            user.forEach(function(e){
                                $('#chp_leader5code').append(
                                    "<option value="+e.code+">"+e.name+"</option>"
                          )
                         })
                         }else{
                           $("#chp_leader5code").append("<option value="+check.leader5.code+">"+check.leader5.name+"</option>")
                           $("#chp_leader5code").append("<option value='-1'>请选择负责人</option>")
                           user.forEach(function(e){
                               if(e.code!=check.leader5.code){
                                  $('#chp_leader5code').append(
                                      "<option value="+e.code+">"+e.name+"</option>"
                                  )
                                } 
                             })
                            } 
                    })      
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: "<div id='addModal'>" +
                        '<div style="text-align:center;padding-top:10px">' +
                        '<ul style="line-height:30px" >' +
                        '<li>流程编码: &nbsp;<input type="text" disabled="true" id="chp_code" value="' + (check.code) + '"></li>' +
                        '<li>编码名称: &nbsp;<input type="text"id="chp_name" value="' + (check.name) + '"></li>' +
                        '<li>流程类型: &nbsp;<select id="process_code"></select></li>' +
                        '<li>负责人1:&nbsp;&nbsp;&nbsp;<select id="chp_leader1code"></select></li>' +
                        '<li>负责人2:&nbsp;&nbsp;&nbsp;<select id="chp_leader2code"></select></li>' +
                        '<li>负责人3:&nbsp;&nbsp;&nbsp;<select id="chp_leader3code"></select></li>' +
                        '<li>负责人4:&nbsp;&nbsp;&nbsp;<select id="chp_leader4code"></select></li>' +
                        '<li>负责人5:&nbsp;&nbsp;&nbsp;<select id="chp_leader5code"></select></li>' +
                        '</ul>' +
                        '</div>' +
                        "</div>",
                        area: ['400px', '380px'],
                        btn: ['确认', '取消'],
                        offset: 'auto',
                        yes: function (index) {
                            var code = $('#chp_code').val()
                            var name = $('#process_code').val()
                            var processcode = $('#process_code').val()
                            var leader1code = $('#chp_leader1code').val()
                            var leader2code = $('#chp_leader2code').val()
                            var leader3code = $('#chp_leader3code').val()
                            var leader4code = $('#chp_leader4code').val()
                            var leader5code = $('#chp_leader5code').val()

                            $.post(home.urls.check.update(), {
                                code: code,
                                name: name,
                                'leader1.code': leader1code,
                                'leader2.code': leader2code,
                                'leader3.code': leader3code,
                                'leader4.code': leader4code,
                                'leader5.code': leader5code,
                                'process.code': processcode
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        check_manage.init()
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
        }, //$ bindEditEventListener——end$

        renderHandler: function ($tbody, checks) {
            $tbody.empty() //清空表格
            //console.log(checks)
            checks.forEach(function (e) {
                $('#check_checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='chp_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.process != null ? e.process.name : '') + "</td>" +
                    "<td>" + (e.leader1 != null ? e.leader1.name : '') + "</td>" +
                    "<td>" + (e.leader2 != null ? e.leader2.name : '') + "</td>" +
                    "<td>" + (e.leader3 != null ? e.leader3.name : '') + "</td>" +
                    "<td>" + (e.leader4 != null ? e.leader4.name : '') + "</td>" +
                    "<td>" + (e.leader5 != null ? e.leader5.name : '') + "</td>" +
                    "<td><a href='#' class='editcheckprocess' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deletecheckprocess' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            }) //$数据渲染完毕
            var editBtns = $('.editcheckprocess')
            var deleteBtns = $('.deletecheckprocess')
            check_manage.funcs.bindDeleteEventListener(deleteBtns)
            check_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#check_checkAll')
            check_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-75')
            check_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var checkboxes = $('.chp_checkbox')
            check_manage.funcs.disselectAll(checkboxes, selectAllBox)
        },


        bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.chp_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        },


        disselectAll: function (checkboxes, selectAllBox) {
            checkboxes.off('change')
            checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.chp_checkbox:checked').length === check_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }


    }
}