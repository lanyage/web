var reviewprocess_manage = {
    init:function(){
        /** 获取流程信息分页并展示 */
        reviewprocess_manage.funcs.renderTable()

        var out = $('#reviewprocess_page').width()//???????
        var time = setTimeout(function(){
            var inside = $('.layui-laypage').width()
            $('#reviewprocess_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
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
             $.get(home.urls.reviewprocess.getExamByNameByPage(),{page:0},function(result){
                var reviewprocesses = result.data.content//获取全部数据
                const $tbody = $('#reviewprocess_table').children('tbody')

                reviewprocess_manage.funcs.renderHandler($tbody, reviewprocesses)//????????????/
                reviewprocess_manage.pageSize = result.data.content.length//??????????????
                var page = result.data//？？？？？？？？？？
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    ele:'reviewprocess',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump:function(obj,first){
                        if(!first){
                            console.log('不是首次，可以执行')
                            $.post(home.urls.reviewprocess.getExamByNameByPage(),{
                                page: obj.curr - 1,
                                size: obj.limit
                            },function(result){
                                var reviewprocesses = result.data.content//获取数据
                                const $tbody = $('#reviewprocess_table').children('tbody')

                                reviewprocess_manage.funcs.renderHandler($tbody, reviewprocesses)//????????????/
                                reviewprocess_manage.pageSize = result.data.content.length//??????????????
                            })
                        }
                    }
                })

             })//数据渲染完毕
             /** 追加添加事件 */
            var addBtn = $("#model-li-hide-add-75")
            reviewprocess_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-75')
            reviewprocess_manage.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-75')
            reviewprocess_manage.funcs.bindSearchEventListener(searchBtn)

            var deleteBatchBtn = $('#model-li-hide-delete-75')
            reviewprocess_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)

            var selectAllBox = $('#revpro_checkAll')
            reviewprocess_manage.funcs.bindSelectAll(selectAllBox)
            var revpro_checkboxes = $('.checkbox')
            reviewprocess_manage.funcs.disSelectAll(revpro_checkboxes, selectAllBox)
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
                    '<div style="width:550px;text-align:center;padding-top:10px">'+
                    '<ul id="fl" style="float:left;line-height:30px;padding-left:50px;">'+
                        '<li>流程编码: <input type="text"id="revpro_code"></li>'+
                       '<li>职责1:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_leader1code"></li>'+
                        '<li>职责2:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_leader2code"></li>'+
                        '<li>职责3:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_leader3code"></li>'+
                        '<li>职责4:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_leader4code"></li>'+
                        '<li>职责5:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_leader5code"></li>'+
                    '</ul>'+
                    '<ul id="fr" style="float:right;line-height:30px">'+
                        '<li>流程名称: &nbsp;<input type="text"id="revpro_name"></li>'+
                        '<li>负责人1:&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_resp1code"></li>'+
                        '<li>负责人2:&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_resp2code"></li>'+
                        '<li>负责人3:&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_resp3code"></li>'+
                        '<li>负责人4:&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_resp4code"></li>'+
                        '<li>负责人5:&nbsp;&nbsp;&nbsp;<input type="text"id="revpro_resp5code"></li>'+
                    '</ul>'+
                '</div>'+
                    "</div>",
                    area:['600px','310px'],
                    btn:['确认','取消'],
                    offset:['30%','25%'],
                    yes:function(){
                        var code = $('#revpro_code')
                        var name = $('#revpro_name')
                       
                        var leader1code = $('#revpro_leader1code').val()
                        var resp1code = $('#revpro_resp1code').val()
                        var leader2code = $('#revpro_leader2code').val()
                        var resp2code = $('#revpro_resp2code').val()
                        var leader3code = $('#revpro_leader3code').val()
                        var resp3code = $('#revpro_resp3code').val()
                        var leader4code = $('#revpro_leader4code').val()
                        var resp4code = $('#revpro_resp4code').val()
                        var leader5code = $('#revpro_leader5code').val()
                        var resp5code = $('#revpro_resp5code').val()

                        $.get(home.urls.reviewprocess.addExam(),{
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
                                    reviewprocess_manage.init()
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
                     reviewprocess_manage.init()
                     layer.close(index)
                     clearTimeout(time)
                 },200)
             })
         }//刷新事件结束

         ,bindSearchEventListener:function(searchBtn){
             searchBtn.off('click')
             searchBtn.on('click',function(){
                 console.log('search')
                var reviewprocess_name = $('#reviewprocess_name_input').val()//返回input里面的value值
                $.post(home.urls.reviewprocess.getExamByCode(),{
                    code : reviewprocess_name
                },function(result){
                    var page = result.data
                    var reviewprocesses = result.data.content //获取数据
                    const $tbody = $("#reviewprocess_table").children('tbody')
                    reviewprocess_manage.funcs.renderHandler($tbody, reviewprocesses)
                    layui.laypage.render({
                        ele:'reviewprocess_page',
                        count:10*page.totalPages,//数据总数
                        
                        jump:function(obj,first){
                            if(!first){
                                $.post(home.urls.reviewprocess.getExamByCode(),{
                                    code: reviewprocess_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                },function(result){
                                    var reviewprocesses = result.data.content //获取数据
                                    const $tbody = $("#reviewprocess_table").children('tbody')
                                    reviewprocess_manage.funcs.renderHandler($tbody, reviewprocesses)
                                    reviewprocess_manage.pageSize = result.data.content.length
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
                        var reviewprocessCode = _this.attr('id').substr(3)

                        $.post(home.urls.reviewprocess.deleteExamByCode(),{code:reviewprocessCode},function(result){
                            console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if(result.code===0){
                                var time = setTimeout(function(){
                                    reviewprocess_manage.init()
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

         ,bindDeleteBatchEventListener:function(deleteBatchBtn){//批量删除开始处
            console.log(deleteBatchBtn)
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.rev_checkbox:checked').length === 0) {
                    console.log('haha')
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%','55%'],
                        time: 700
                    });
                } else{
                    layer.open({
                        type:1,
                        title:"批量删除",
                        content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除所有记录吗?</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes:function(index){
                            var processesCodes = []
                            $('.checkbox').each(function(){
                                if ($(this).prop('checked')) {
                                    processesCodes.push({code: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.reviewprocess.deleteExamByCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(processesCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            reviewprocess_manage.init()
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
                        }
                        ,btn2:function(index){
                            layer.close(index)
                        }
                    })
                }
            })
         }//批量删除

         /** 全选按钮 */
         ,bindSelectAll:function(selectAllBox){
            selectAllBox.off('change')
            selectAllBox.on('change',function(){
                var status = selectAllBox.prop('checked')
                $('.checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
         }//全选按钮结束


        ,bindEditEventListener:function(){
            editBtns.off('click')
            editBtns.on('click',function(editBtns){
                var _selfBtn = $(this)
                var procrssCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.reviewprocess.getExamByCode(),{code:procrssCode},function(index){
                    var reviewprocess = result.data
                    layer.open({
                        type:1,
                        title:'编辑',
                        content:"<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>流程编码:<input type='text' id='revpro_code' value='" + (reviewprocess.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>部门名称:<input type='text' id='revpro_name' value='" + (reviewprocess.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责1:<input type='text' id='revpro_leader1code' value='"+(reviewprocess.leader1code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人1:<input type='text' id='revpro_resp1code' value='"+(reviewprocess.resp1code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责2:<input type='text' id='revpro_leader2code' value='"+(reviewprocess.leader2code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人2:<input type='text' id='revpro_resp2code' value='"+(reviewprocess.resp2code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责3:<input type='text' id='revpro_leader3code' value='"+(reviewprocess.leader3code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人3:<input type='text' id='revpro_resp3code' value='"+(reviewprocess.resp3code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责4:<input type='text' id='revpro_leader4code' value='"+(reviewprocess.leader4code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人4:<input type='text' id='revpro_resp4code' value='"+(reviewprocess.resp4code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>职责5:<input type='text' id='revpro_leader5code' value='"+(reviewprocess.leader5code)+"'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>负责人5:<input type='text' id='revpro_resp5code' value='"+(reviewprocess.resp5code)+"'/></p>" +
                        "</div>" +
                        "</div>",
                        area:['460px','310px'],
                        btn:['确认','取消'],
                        offset: ['40%', '45%'],
                        yes:function(index){
                            var code = $('#revpro_code')
                            var name = $('#revpro_name')
                       
                            var leader1code = $('#revpro_leader1code').val()
                            var resp1code = $('#revpro_resp1code').val()
                            var leader2code = $('#revpro_leader2code').val()
                            var resp2code = $('#revpro_resp2code').val()
                            var leader3code = $('#revpro_leader3code').val()
                            var resp3code = $('#revpro_resp3code').val()
                            var leader4code = $('#revpro_leader4code').val()
                            var resp4code = $('#revpro_resp4code').val()
                            var leader5code = $('#revpro_leader5code').val()
                            var resp5code = $('#revpro_resp5code').val()

                            $.post(home.urls.reviewprocess.updateExam(),{
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
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        reviewprocess_manage.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.close(index)
                            })
                        }
                        ,btn2:function(index){
                            layer.close(index)
                        }
                    })
                })
            })
        }//编辑结束

         ,renderHandler:function($tbody,reviewprocesses){
            $tbody.empty()//清空列表
            reviewprocesses.forEach(function(e){
                $('#revpro_checkAll').prop('checked',false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='rev_checkbox' value='" + (e.code) + "'></td>" +
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
                    "<td><a href='#' class='editrevireprocess' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleterevireprocess' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })//数据渲染完毕

            var editBtns = $('.editrevireprocess')
            var deleteBtns = $('deleterevireprocess')
            reviewprocess_manage.funcs.bindDeleteEventlistener(deleteBtns)
            reviewprocess_manage.funcs.bindEditEventListener(editBtns)

         }

         /** 全选逻辑 */
         ,disSelectAll:function(revpro_checkboxes, selectAllBox){
            revpro_checkboxes.off('change')
            revpro_checkboxes.on('change',function(){
                var statusNow = $(this).prop('checked')
                if(statusNow===false){
                    selectAllBox.prop('checked',false)
                }else if(statusNow===true&&$('.checkbox:checked').length===reviewprocess_manage.pageSize){
                    selectAllBox.prop('checked',true)
                }
            })
         }
    }
}