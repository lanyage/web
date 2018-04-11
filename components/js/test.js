var processStatus_manage = {
    init:function(){
        /** 获取流程信息分页并展示 */
        processStatus_manage.funcs.renderTable()

        var out = $('#processStatus_page').width()//???????
        var time = setTimeout(function(){
            var inside = $('.layui-laypage').width()
            $('#processStatus_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        },30)
    }//$init end$
    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0
    /** 逻辑方法 */
    ,funcs:{
         /** 渲染页面 */
         renderTable:function(){
             /** 获取所有记录 */
             $.post(home.urls.processStatus.getAllByStatusByPage(),{page:0},function(result){
                var processStatuses = result.data.content//获取全部数据
                const $tbody = $('#ProcessStatus_table').children('tbody')

                processStatus_manage.funcs.renderHandler($tbody, processStatuses)//????????????/
                processStatus_manage.pageSize = result.data.content.length//??????????????
                var page = result.data//？？？？？？？？？？
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    ele:'processStatus_manage',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump:function(obj,firsr){
                        if(!first){
                            console.log('不是首次，可以执行')
                            $.post(home.urls.processStatus.getAllPage(),{
                                page: obj.curr - 1,
                                size: obj.limit
                            },function(result){
                                var processStatuses = result.data.content//获取数据
                                const $tbody = $('#ProcessStatus_table').children('tbody')

                                processStatus_manage.funcs.renderHandler($tbody, processStatuses)//????????????/
                                processStatus_manage.pageSize = result.data.content.length//??????????????
                            })
                        }
                    }
                })

             })//数据渲染完毕
             /** 追加添加事件 */
            var addBtn = $("#model-li-hide-add-75")
            processStatus_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-75')
            processStatus_manage.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-75')
            processStatus_manage.funcs.bindSearchEventListener(searchBtn)
         }

         /** 添加事件 */
         ,bindAddEventListener:function(addBtn){
            addBtn.off('click')
            addBtn.on('click',function(){
                /** 弹出一个询问框 */
                layer.open({
                    type:1,
                    title:'添加',
                    content:"<div id='addModal'>" +
                    "<div style='text-align: center;padding-top: 10px;'>" +
                    "<p style='padding: 5px 0px 5px 0px;'>流程编码:<input type='text' id='pros_code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>流程名称:<input type='text' id='pros_name'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>职责1:<input type='text' id='pros_leader1code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>负责人1:<input type='text' id='pros_resp1code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>职责2:<input type='text' id='pros_leader2code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>负责人2:<input type='text' id='pros_resp2code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>职责3:<input type='text' id='pro_leader3code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>负责人3:<input type='text' id='pros_resp3code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>职责4:<input type='text' id='pros_leader4code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>负责人4:<input type='text' id='pros_resp4code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>职责5:<input type='text' id='pros_leader5code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>负责人5:<input type='text' id='pros_resp5code'/></p>" +
                    "</div>" +
                    "</div>",
                    area:['450px','310px'],
                    btn:['确认','取消'],
                    offset:['40%','55%'],
                    yes:function(){
                        var code = $('#pros_code')
                        var name = $('#pros_name')
                       
                        var leader1code = $('#pros_leader1code').val()
                        var resp1code = $('#pros_resp1code').val()
                        var leader2code = $('#pros_leader2code').val()
                        var resp2code = $('#pros_resp2code').val()
                        var leader3code = $('#pros_leader3code').val()
                        var resp3code = $('#pros_resp3code').val()
                        var leader4code = $('#pros_leader4code').val()
                        var resp4code = $('#pros_resp4code').val()
                        var leader5code = $('#pros_leader5code').val()
                        var resp5code = $('#pros_resp5code').val()

                        $.post(home.urls.processStatus.add(),{
                            code:code,
                            name:name,
                            leader1code:leader1code,
                            leader2code:leader2code,
                            leader3code:leader3code,
                            leader4code:leader4code,
                            leader5code:leader5code,
                            resp1code:resp1code,
                            resp2code:resp2code,
                            resp3code:resp3code,
                            resp4code:resp4code,
                            resp5code:resp5code
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code===0){//??????????????
                                var time = setTimeout(function(){
                                    processStatus_manage.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                        })
                    }
                    ,btn2:function(index){
                        layer.close(index)
                    }
                });
            })
         }//添加事件完毕

         ,bindRefreshEventListener:function(refreshBtn){
             refreshBtn.off('click')
             refreshBtn.on('click',function(){
                 var index = layer.load(2,{offset:['40%','55%']});
                 var time = setTimeout(function(){
                     layer.msg('刷新成功',{
                        offset:['40%', '55%'],
                        time:700
                     })
                     processStatus_manage.init()
                     layer.close(index)
                     clearTimeout(time)
                 },200)
             })
         }//刷新事件结束

         ,bindSearchEventListener:function(searchBtn){
             searchBtn.off('click')
             searchBtn.on('click',function(){
                 console.log('search')
                var processStatus_name = $('#processStatus_name_input').val()//返回input里面的value值
                $.post(home.urls.processStatus.getExamByNameByPage(),{
                    name = processStatus_name
                },function(result){
                    var page = result.data
                    var processStatuses = result.data.content //获取数据
                    const $tbody = $("#processStatus_table").children('tbody')
                    processStatus_manage.funcs.renderHandler($tbody, processStatuses)
                    layui.laypage.render({
                        ele:'processStatus_page',
                        count:10*page.totalPages,//数据总数
                        
                        jump:function(obj,first){
                            if(!first){
                                $.post(home.urls.processStatus.getExamByNameByPage(),{
                                    name: processStatus_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                },function(result){
                                    var processStatuses = result.data.content //获取数据
                                    const $tbody = $("#processStatus_table").children('tbody')
                                    processStatus_manage.funcs.renderHandler($tbody, processStatuses)
                                    processStatus_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
             })
         }//搜索结束

         ,bindDeleteEventlistener:function(deleteBtns){
             deleteBtns.off('click')
             deleteBtns.on('click',function(){
                 var _this = $(this)
                 layer.open({
                     type:1,
                     title:'删除',
                     content:"<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                     area: ['180px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes:function(index){
                        console.log('yes')
                        var processStatusCode = _this.attr('id').substr(3)

                        $.post(home.urls.processStatus.deleteExamByCode(),{code:processStatusCode},function(result){
                            console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if(result.code===0){
                                var time = setTimeout(function(){
                                    processStatus_manage.init()
                                    clearTimeout(time)
                                },500)
                               
                            }
                            layer.close(index)
                        })
                    }
                    ,btn2:function(index){
                        layer.close(index)
                    }
                 })
             })
         }//删除事件结束

        ,bindEditEventListener:function(){
            editBtns.off('click')
            editBtns.on('click',function(editBtns){
                var _selfBtn = $(this)
                var processStatusCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.processStatus.getExamByCode(),{code:processStatusCode},function(index){
                    var processStatus = result.data
                    layer.open({
                        type:1,
                        title:'编辑',
                        content:"<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>流程编码:<input type='text' id='pros_code' value='" + (processStatus.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>部门名称:<input type='text' id='pros_name' value='" + (processStatus.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责1:<input type='text' id='pros_leader1code' value='"+(processStatus.leader1code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人1:<input type='text' id='pros_resp1code' value='"+(processStatus.resp1code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责2:<input type='text' id='pros_leader2code' value='"+(processStatus.leader2code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人2:<input type='text' id='pros_resp2code' value='"+(processStatus.resp2code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责3:<input type='text' id='pro_leader3code' value='"+(processStatus.leader3code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人3:<input type='text' id='pros_resp3code' value='"+(processStatus.resp3code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责4:<input type='text' id='pros_leader4code' value='"+(processStatus.leader4code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人4:<input type='text' id='pros_resp4code' value='"+(processStatus.resp4code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责5:<input type='text' id='pros_leader5code' value='"+(processStatus.leader5code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人5:<input type='text' id='pros_resp5code' value='"+(processStatus.resp5code)+"'/></p>" +
                        "</div>" +
                        "</div>",
                        area:['460px','310px'],
                        btn:['确认','取消'],
                        offset: ['40%', '45%'],
                        yes:function(index){
                            var code = $('#pros_code')
                            var name = $('#pros_name')
                       
                            var leader1code = $('#pros_leader1code').val()
                            var resp1code = $('#pros_resp1code').val()
                            var leader2code = $('#pros_leader2code').val()
                            var resp2code = $('#pros_resp2code').val()
                            var leader3code = $('#pros_leader3code').val()
                            var resp3code = $('#pros_resp3code').val()
                            var leader4code = $('#pros_leader4code').val()
                            var resp4code = $('#pros_resp4code').val()
                            var leader5code = $('#pros_leader5code').val()
                            var resp5code = $('#pros_resp5code').val()
                        }
                    })
                })
            })
        }

         ,renderHandler:function($tbody,processStatuses){
            $tbody.empty()//清空列表
            processStatuses.forEach(function(e){
                $('#proc_checkAll').prop('checked',false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.leader1code) + "</td>" +
                    "<td>" + (e.resp1code) + "</td>" +
                    "<td>" + (e.leader2code) + "</td>" +
                    "<td>" + (e.resp2code) + "</td>" +
                    "<td>" + (e.leader3code) + "</td>" +
                    "<td>" + (e.resp3code) + "</td>" +
                    "<td>" + (e.leader4code) + "</td>" +
                    "<td>" + (e.resp4code) + "</td>" +
                    "<td>" + (e.leader5code) + "</td>" +
                    "<td>" + (e.resp5code) + "</td>" +
                    "<td><a href='#' class='editprocessStatus' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteprocessStatus' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })//数据渲染完毕

            var editBtns = $('.editprocessStatus')
            var deleteBtns = $('deleteprocessStatus')
            processStatus_manage.funcs.bindDeleteEventlistener(deleteBtns)
            processStatus_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#proc_checkAll')
            processStatus_manage.funcs.bindSelectAll(selectAllBox)
            var proc_checkboxes = $('.checkbox')
            processStatus_manage.funcs.bindisselectAll(pro_checkboxes, selectAllBox)
         }

         /** 全选逻辑 */
         ,disSelectAll:function(pro_checkboxes, selectAllBox){
            pro_checkboxes.off('change')
            pro_checkboxes.on('change',function(){
                var statusNow = $(this).prop('checked')
                if(statusNow===false){
                    selectAllBox.prop('checked',false)
                }else if(statusNow===true&&$('.checkbox:checked').length===processStatus_manage.pageSize){
                    selectAllBox.prop('checked',true)
                }
            })
         }
    }
}