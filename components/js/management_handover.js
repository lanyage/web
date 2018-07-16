var management_handover = {
    init: function () {
        management_handover.funcs.renderTable()
        var out = $('#management_handover_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#management_handover').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '143.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.jobs.getAllByPage(), {page:0}, function (res) {
                var $tbody = $("#management_handover_table").children('tbody')
                var items = res.data.content
                management_handover.funcs.renderHandler($tbody, items,0)
                management_handover.pageSize = res.data.content.length 
                var page = res.data 
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'management_handover_page',
                    count: 10 * page.totalPages,
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.jobs.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content 
                                var page = obj.curr - 1
                                const $tbody = $("#management_handover_table").children('tbody')
                                management_handover.funcs.renderHandler($tbody, items,page)
                                management_handover.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            management_handover.funcs.bindAddEvent($('#model_li_hide_add_143'))
            management_handover.funcs.bindDeleteEvent($('#model_li_hide_delete_143'))

            var refreshBtn = $('#model_li_hide_refresh_143');
            management_handover.funcs.bindRefreshEventListener(refreshBtn);


            var checkedBoxLen = $('.management_handover_checkbox:checked').length
            home.funcs.bindSelectAll($("#management_handover_checkAll"),$(".management_handover_checkbox"),checkedBoxLen,$("#management_handover_table"))


        }
    , renderHandler: function ($tbody, items,page) {
        $tbody.empty() //清空表格
        var i= 1 + page * 10
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='management_handover_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.compilerCode ? e.compilerCode.name: '')+ "</td>" +
                    "<td>" + (e.compileTime ? new Date(e.compileTime).Format('yyyy-MM-dd hh:mm:ss'): '')+ "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
            )
            $tbody.append(content)
        })
        management_handover.funcs.bindDetailEventListener($('.detail'))
        management_handover.funcs.bindEditorEventListener($('.editor'))
        management_handover.funcs.bindDeleteEventListener($('.delete'))

        var checkedBoxLen = $('.management_handover_checkbox:checked').length
        home.funcs.bindSelectAll($("#management_handover_checkAll"),$(".management_handover_checkbox"),checkedBoxLen,$("management_handover_table"))
    }
    
  
    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.jobs.getByCode(),{
                    code:code
                },function(result){
                    var items = result.data
                    $("#name").text(items.name)
                    $("#code").text("1")
                    $("#compilerCode").text(items.compilerCode?items.compilerCode.name:'')
                    $("#compileTime").text(new Date(items.compileTime).Format('yyyy-MM-dd hh:mm:ss'))
                    var jobsHandover = items.jobsHandover
                    $tbody = $("#jobsHandover_detail_table").children('tbody')
                    $tbody.empty()
                    var i = 1
                    jobsHandover.forEach(function(e){
                        $tbody.append(
                            "<tr class='newLine'>"+
                            "<td>"+(i++)+"</td>"+
                            "<td>"+e.handoverType.name+"</td>"+
                            "<td>"+e.handoverContent.name+"</td>"+
                            "<td>"+(e.handoverStateType.handoverState1?e.handoverStateType.handoverState1.name:'')+' '+(e.handoverStateType.handoverState2?e.handoverStateType.handoverState2.name:'')+' '+(e.handoverStateType.handoverState3?e.handoverStateType.handoverState3.name:'')+' '+(e.handoverStateType.handoverState4?e.handoverStateType.handoverState4.name:'')+' '+(e.handoverStateType.handoverState5?e.handoverStateType.handoverState5.name:'')+' '+"</td>"+
                            "</tr>"
                        )
                     }) 
                layer.open({
                    type: 1,
                    title: '新增岗位内容交接',
                    content: $("#jobsHandover_detail"),
                    area: ['1100px', '500px'],
                    btn: ['确定'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#jobsHandover_detail").css('display', 'none')
                        layer.close(index)
                    }
                });        
            })   
        })   
        }
    ,fillData:function(items){
            $("#name1").val(items.name)
            $("#code1").val(items.code)
            $("#compilerCode1").empty()
            $("#compilerCode1").append("<option value="+items.compilerCode.code+">"+items.compilerCode.name+"</option>")
            $.get(servers.backup()+'user/getAll',{},function(result){
                var res1 = result.data
                res1.forEach(function(ele){
                    if(ele.code!=items.compilerCode.code){
                        $("#compilerCode1").append("<option value="+ele.code+">"+ele.name+"</option>")
                    }
                })
            })
            //$("#compilerCode").val(items.compilerCode?items.compilerCode.name:'')
            $("#compileTime1").val(new Date(items.compileTime).Format('yyyy-MM-dd hh:mm:ss'))
            var jobsHandover = items.jobsHandover
            $tbody = $("#jobsHandover_table").children('tbody')
            $tbody.empty()
            var i = 0
            var length = 1 
            //var length = jobsHandover.length
            jobsHandover.forEach(function(e){
                i = i + 1
                $tbody.append(
                    "<tr class='newLine' id='row"+(i)+"'>"+
                    "<td>"+(i)+"</td>"+
                    "<td><select class='handover_type"+i+"'><option value="+e.handoverType.code+">"+e.handoverType.name+"</option></select></td>"+
                    "<td><select class='handover_content"+i+"'><option value="+e.handoverContent.code+">"+e.handoverContent.name+"</option></select></td>"+
                    "<td><select class='handover_statetype"+i+"'><option value="+e.handoverStateType.code+">"+(e.handoverStateType.handoverState1?e.handoverStateType.handoverState1.name:'')+' '+(e.handoverStateType.handoverState2?e.handoverStateType.handoverState2.name:'')+' '+(e.handoverStateType.handoverState3?e.handoverStateType.handoverState3.name:'')+' '+(e.handoverStateType.handoverState4?e.handoverStateType.handoverState4.name:'')+' '+(e.handoverStateType.handoverState5?e.handoverStateType.handoverState5.name:'')+' '+"</option></select></td>"+
                    "<td><button class='delete' onclick='management_handover.funcs.delTab("+(i)+")' type='button'style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;' > &times;</button></td>" +
                    "</tr>"
                ) 
                $.get(servers.backup()+'handoverType/getAll',{},function(result){
                    var res2 = result.data
                    res2.forEach(function(ele){
                        if(ele.code!=e.handoverType.code){
                            $(".handover_type"+(i)+"").append("<option value="+ele.code+">"+ele.name+"</option>")
                        }    
                    })    
                })  
                $.get(servers.backup()+'handoverContent/getAll',{},function(result){
                    var res3 = result.data
                    res3.forEach(function(ele){
                        if(ele.code!=e.handoverContent.code){
                            $(".handover_content"+(i)+"").append("<option value="+ele.code+">"+ele.name+"</option>")
                        }
                    }) 
                })  
                $.get(servers.backup()+'handoverStateType/getAll',{},function(result){
                    var res4 = result.data
                    res4.forEach(function(ele){
                        if(ele.code!=e.handoverStateType.code)
                        $(".handover_statetype"+(i)+"").append(
                            "<option value="+ele.code+">"+(ele.handoverState1?ele.handoverState1.name:'')+' '+(ele.handoverState2?ele.handoverState2.name:'')+' '+(ele.handoverState3?ele.handoverState3.name:'')+' '+(ele.handoverState4?ele.handoverState4.name:'')+' '+(ele.handoverState5?ele.handoverState5.name:'')+' '+"</option>")
                    }) 
                })  
             
            })
        }
    , bindEditorEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.jobs.getByCode(),{
                    code:code
                },function(result){
                    var items = result.data
                    management_handover.funcs.fillData(items)
                layer.open({
                    type: 1,
                    title: '编辑岗位内容交接',
                    content: $("#jobsHandover"),
                    area: ['1100px', '500px'],
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#jobsHandover").css('display', 'none')
                        var compileTime = new Date($("#compileTime1").val()).getTime()
                        var compilerCode = $("#compilerCode1").val()
                        var name = $("#name1").val()
                        var jobsHandover = []
                        $(".newLine").each(function(){
                            var e = $(this).children('td')
                            jobsHandover.push(
                                {
                                    code:e.eq(0).children('input').val(),
                                    jobsCode:{code:code},
                                    handoverType:{code:e.eq(1).children('select').val()},
                                    handoverContent:{code:e.eq(2).children('select').val()},
                                    handoverStateType:{code:e.eq(3).children('select').val()}
                                }
                            )
                        })
                        var data = {
                            code:code,
                            compileTime:items.compileTime,
                            compilerCode:{code:compilerCode},
                            name:name,
                            jobsHandover:jobsHandover
                        }
                        $.ajax({
                            url:home.urls.jobs.update(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result){
                                if(result.code === 0){
                                    var time = setTimeout(function(){
                                        management_handover.init()
                                        clearTimeout(time)
                                    },500)
                                }
                                layer.msg(result.message,{
                                    offset:['40%','55%'],
                                    time:700
                                })
                            }
                        })
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#jobsHandover").css('display', 'none')
                        layer.close(index)
                    }
                });        
              management_handover.funcs.add_line($("#button")) 
             }) 
        })   
       
        },
        add_line:function(buttons){
            buttons.off('click').on('click',function(){
                $tbody = $("#jobsHandover_table").children('tbody')
                var length = $("#jobsHandover_table tbody tr").length + 1
               /* $(".jobs_code").empty()
                $(".handover_type").empty()
                $(".handover_content").empty()
                $(".handover_statetype").empty()*/
                $tbody.append(
                    "<tr class='newLine' id='row"+length+"'>"+
                    "<td>"+length+"</td>"+
                    "<td><select class='handover_type"+length+"'></select></td>"+
                    "<td><select class='handover_content"+length+"'></select></td>"+
                    "<td><select class='handover_statetype"+length+"'></select></td>"+
                    "<td><button class='delete' onclick='management_handover.funcs.delTab("+(length)+")' type='button'style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;' > &times;</button></td>" +
                    "</tr>"
                )
               /* $.get(servers.backup()+'jobs/getAllByPage',{},function(result){
                    var res1 = result.data.content
                    res1.forEach(function(e){
                        $(".jobs_code").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                    
                })  */
                $.get(servers.backup()+'handoverType/getAll',{},function(result){
                    var res2 = result.data
                    res2.forEach(function(e){
                        $(".handover_type"+length+"").append("<option value="+e.code+">"+e.name+"</option>")
                    })    
                })  
                $.get(servers.backup()+'handoverContent/getAll',{},function(result){
                    var res3 = result.data
                    res3.forEach(function(e){
                        $(".handover_content"+length+"").append("<option value="+e.code+">"+e.name+"</option>")
                    }) 
                })  
                $.get(servers.backup()+'handoverStateType/getAll',{},function(result){
                    var res4 = result.data
                    res4.forEach(function(e){
                        $(".handover_statetype"+length+"").append(
                            "<option value="+e.code+">"+(e.handoverState1?e.handoverState1.name:'')+' '+(e.handoverState2?e.handoverState2.name:'')+' '+(e.handoverState3?e.handoverState3.name:'')+' '+(e.handoverState4?e.handoverState4.name:'')+' '+(e.handoverState5?e.handoverState5.name:'')+' '+"</option>")
                    }) 
                })  
            })
        }
        ,delTab:function(x){
            $("#row" +(x) + "").remove();
            //var count = $("#jobsHandover_table tr").length  
            var i = 1
            $(".newLine").each(function(){
                $(this).children('td').eq(0).text(i++)
            })
        }
       /*  ,bindEditorEventListener:function(editBtns) {
             editBtns.off('click').on('click',function() {
                 var code = $(this).attr('id').substr(7) 
                 $.post(home.urls.jobs.getByCode(),{
                     code:code
                 },function(result){
                    items = result.data
                    $.get(servers.backup()+'user/getAll',{},function(result){
                        var user=result.data
                        user.forEach(function(e){
                           if(e.code!=items.compilerCode.code){
                                $("#compilerCode1").append("<option value="+e.code+">"+e.name+"</option>")
                           }
                        })
                    })
                layer.open({
                    type: 1,
                    title: '编辑岗位名称',
                    content: "<div id='addmodal'>"+
                    "<div style='text-align: center;padding-top: 10px;'>"+
                    "<p style='padding: 5px 0px 5px 0px;'>岗位名称:<input type='text' id='name1' value="+items.name+" /></p>"+
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;编制人:<select id='compilerCode1'><option value="+items.compilerCode.code+">"+items.compilerCode.name+"</option></select></p>"+
                    "</div>"+
                    "</div>",
                    area: ['300px', '200px'],
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#management_handover_editor_modal").css('display', 'none')
                        var name = $("#name1").val()
                        var compilerCode = $("#compilerCode1").val()
                        $.post(home.urls.jobs.update(),{
                            code:code,
                            name:name,
                            'compilerCode.code':compilerCode
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     management_handover.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                    }
                     ,btn2: function(index) {
                        $("#management_handover_editor_modal").css('display', 'none')
                        layer.close(index)
                     }
                }); 
             })
            })
         }*/
         ,bindDeleteEventListener:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 var _this = $(this)
                 layer.open({
                     type:1,
                     title:'删除',
                     content:"<h5 style='text-align:center;padding-top:8px'>确认要删除该记录吗?</h5>",
                     area:['180px','130px'],
                     btn:['确认','取消'],
                     offset:['40%','55%'],
                     yes:function(index) {
                         var Code = _this.attr('id').substr(7)
                         $.post(home.urls.jobs.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    management_handover.init()
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
         , bindAddEvent: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $("#name1").val('')
                $("#code1").val('')
                $("#compileTime1").val('')
                $("#compilerCode1").empty()
                $.get(servers.backup()+'user/getAll',{},function(result){
                    var res1 = result.data
                    res1.forEach(function(ele){
                            $("#compilerCode1").append("<option value="+ele.code+">"+ele.name+"</option>")
                    })
                })
                $tbody = $("#jobsHandover_table").children('tbody')
                $tbody.empty()
                layer.open({
                    type: 1,
                    title: '新增岗位内容交接',
                    content: $("#jobsHandover"),
                    area: ['1100px', '500px'],
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#jobsHandover").css('display', 'none')
                        var compileTime = new Date($("#compileTime1").val()).getTime()
                        var compilerCode = $("#compilerCode1").val()
                        var name = $("#name1").val()
                        var jobsHandover = []
                        $(".newLine").each(function(){
                            var e = $(this).children('td')
                            jobsHandover.push(
                                {
                                    //code:e.eq(0).children('input').val(),
                                    //jobsCode:{code:code},
                                    handoverType:{code:e.eq(1).children('select').val()},
                                    handoverContent:{code:e.eq(2).children('select').val()},
                                    handoverStateType:{code:e.eq(3).children('select').val()}
                                }
                            )
                        })
                        var data = {
                           // code:code,
                            compileTime:compileTime,
                            compilerCode:{code:compilerCode},
                            name:name,
                            jobsHandover:jobsHandover
                        }
                        $.ajax({
                            url:home.urls.jobs.add(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result){
                                if(result.code === 0){
                                    var time = setTimeout(function(){
                                        management_handover.init()
                                        clearTimeout(time)
                                    },500)
                                }
                                layer.msg(result.message,{
                                    offset:['40%','55%'],
                                    time:700
                                })
                            }
                        })
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#jobsHandover").css('display', 'none')
                        layer.close(index)
                    }
                });        
              management_handover.funcs.add_line($("#button")) 
             })  
       
        }
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.management_handover_checkbox:checked').length === 0) {
                     layer.msg('您还没有选中任何数据!',{
                         offset:['40%','55%'],
                         time:700
                     })
                 }
                 else {
                     layer.open({
                         type:1,
                         title:'批量删除',
                         content:"<h5 style='text-align: center;padding-top: 8px'>您确认要删除所有记录吗?</h5>",
                         area:['190px','130px'],
                         btn:['确认','取消'],
                         offset:['40%','55%'],
                         yes:function(index){
                             var management_handover_codes=[]
                             $('.management_handover_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                    management_handover_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.jobs.deleteByIdBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(management_handover_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            management_handover.init()
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
                         } ,
                         btn2: function (index) {
                            layer.close(index)
                        }           
                     })
                 }
             })
         }
         ,bindRefreshEventListener: function (refreshBtn) {
             refreshBtn.off('click')
             refreshBtn.on('click', function () {
                 var index = layer.load(2, {offset: ['40%', '58%']});
                 var time = setTimeout(function () {
                     layer.msg('刷新成功', {
                         offset: ['40%', '55%'],
                         time: 700
                     })
                     management_handover.init()
                     $('#input_batch_num').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
    }
}