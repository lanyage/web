var process_tracking = {
    users : [],
    goods : [],
    init: function () {
        process_tracking.funcs.renderTable();
        $.get(servers.backup()+"user/getAll",{ },function(result){
            process_tracking.users = result.data;
        })
        $.get(servers.backup() + "goods/getAll", {}, function (result){
            process_tracking.goods = result.data;
        })
        var out = $('#process_tracking_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#process_tracking_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.processTracking.getAllByPage(), {page:0}, function (res) {
                var $tbody = $("#process_tracking_table").children('tbody')
                var items = res.data.content
                process_tracking.funcs.renderHandler($tbody, items,0)
                /** 渲染表格结束之后 */
                process_tracking.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'process_tracking_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.processTracking.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                var page = obj.curr - 1
                                const $tbody = $("#process_tracking_table").children('tbody')
                                process_tracking.funcs.renderHandler($tbody, items,page)
                                process_tracking.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            process_tracking.funcs.bindAddEvent($('#model_li_hide_add_34'))
            process_tracking.funcs.bindDeleteEvent($('#model_li_hide_delete_34'))

            var refreshBtn = $('#model_li_hide_refresh_34');
            process_tracking.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_34')
            process_tracking.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.process_tracking_checkbox:checked').length
            home.funcs.bindSelectAll($("#process_tracking_checkAll"),$(".process_tracking_checkbox"),checkedBoxLen,$("#process_tracking_table"))


        }
    , renderHandler: function ($tbody, items,page) {
        $tbody.empty() //清空表格
        var i = 1 + page * 10
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='process_tracking_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.premixedCode) + "</td>" +
                    "<td>" + (e.presinteringCode ? e.presinteringCode : '')+ "</td>" +
                    "<td>" + (e.crushingCode ? e.crushingCode : '') + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
            )
            $tbody.append(content)
            if(e.state === true){
                $("#editor-"+(code)+"").removeClass("editor").addClass("disableHref")
                $("#delete-"+(code)+"").removeClass("delete").addClass("disableHref")
            }  
        })
        process_tracking.funcs.bindDetailEventListener($('.detail'))
        process_tracking.funcs.bindEditorEventListener($('.editor'))
        process_tracking.funcs.bindDeleteEventListener($('.delete'))

        var checkedBoxLen = $('.process_tracking_checkbox:checked').length
        home.funcs.bindSelectAll($("#process_tracking_checkAll"),$(".process_tracking_checkbox"),checkedBoxLen,$("process_tracking_table"))
    }
    

    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.processTracking.getById(),{
                    code:code
                },function(result){
                    var items = result.data
                    var premixedOperator = items.premixedOperator;
                    var presinteringInoperator = items.presinteringInoperator;
                    var presinteringOutoperator = items.presinteringOutoperator;
                    var crushingOperator = items.crushingOperator;
                    var data1 = [] ,data2 = [] ,data3 = [] ,data4 = [] ;
                    premixedOperator.forEach(function(e) {
                        data1 += (e.name + '  ');
                    })
                    presinteringInoperator.forEach(function(e) {
                        data2 += (e.name + '  ');
                    })
                    presinteringOutoperator.forEach(function(e) {
                        data3 += (e.name + '  ');
                    })
                    crushingOperator.forEach(function(e) {
                        data4 += (e.name + '  ');
                    })
                    $("#goodsCode").append("<option value="+items.goodsCode.code+">"+items.goodsCode.name+"</option>")
                    $("#premixedCode").text(items.premixedCode?items.premixedCode:'')
                    $("#premixedDate").text(items.premixedDate)
                    $("#mixerNumber").text(items.mixerNumber)
                    $("#premixedOperator").text(data1)
                    $("#presinteringCode").text(items.presinteringCode)
                    $("#presinteringDate").text(items.presinteringDate?items.presinteringDate:'')
                    $("#sinteringFurnace").text(items.sinteringFurnace)
                    $("#presinteringInoperator").text(data2)
                    $("#presinteringOutoperator").text(data3)  
                    $("#crushingCode").text(items.crushingCode?items.crushingCode:'')
                    $("#crushingDate").text(items.crushingDate)
                    $("#millNumber").text(items.millNumber)
                    $("#crushingOperator").text(data4)
                    $("#note").text(items.note)
                layer.open({
                    type: 1,
                    title: '流程追踪详情',
                    content: $("#process_tracking_detail_modal"),
                    area: ['1100px', '450px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#process_tracking_detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });        
             }) 
        })    
        },
        
         bindEditorEventListener:function(editBtns) {
             editBtns.off('click').on('click',function() {
                 var code = $(this).attr('id').substr(7) 
                 $.post(home.urls.processTracking.getById(),{
                     code:code
                 },function(result){
                     items = result.data
                     $("#goodsCode1").append("<option value="+items.goodsCode.code+">"+items.goodsCode.name+"</option>")
                     $("#premixedCode1").val(items.premixedCode?items.premixedCode:'')
                     $("#premixedDate1").val(items.premixedDate)
                     $("#mixerNumber1").val(items.mixerNumber)
                     //$("#premixedOperator1").append("<option value="+items.premixedOperator.code+">"+items.premixedOperator.name+"</option>")
                     $("#presinteringCode1").val(items.presinteringCode)
                     $("#presinteringDate1").val(items.presinteringDate?items.presinteringDate:'')
                     $("#sinteringFurnace1").val(items.sinteringFurnace)
                     //$("#presinteringInoperator1").append("<option value="+items.presinteringInoperator.code+">"+items.presinteringInoperator.name+"</option>")
                     //$("#presinteringOutoperator1").append("<option value="+items.presinteringOutoperator.code+">"+items.presinteringOutoperator.name+"</option>")
                     $("#crushingCode1").val(items.crushingCode?items.crushingCode:'')
                     $("#crushingDate1").val(items.crushingDate)
                     $("#millNumber1").val(items.millNumber)
                     //$("#crushingOperator1").append("<option value="+items.crushingOperator.code+">"+items.crushingOperator.name+"</option>")
                     $("#note1").val(items.note)

                         process_tracking.goods.forEach(function(e){
                             if(items.goodsCode.code!=e.code){
                            $("#goodsCode1").append("<option value="+e.code+">"+e.name+"</option>")
                         }
                         })

                     $("#premixedOperator1").empty()
                     $("#presinteringInoperator1").empty()
                     $("#presinteringOutoperator1").empty()
                     $("#crushingOperator1").empty()
                     var premixedOperator = items.premixedOperator;
                     var presinteringInoperator = items.presinteringInoperator;
                     var presinteringOutoperator = items.presinteringOutoperator;
                     var crushingOperator = items.crushingOperator;
                     process_tracking.users.forEach(function(e){
                        if(premixedOperator != ''){
                            var flag = 0;
                            premixedOperator.forEach(function(ele) {
                                if(ele.code === e.code){
                                    $("#premixedOperator1").append("<option value="+(e.code)+" selected>"+e.name+"</option>");
                                    flag = 1;
                                }
                            })
                            if(flag === 0){
                                $("#premixedOperator1").append("<option value="+(e.code)+">"+e.name+"</option>");
                            }
                        }
                        else {
                            $("#premixedOperator1").append("<option value="+(e.code)+">"+e.name+"</option>");
                        }
                        
                        if(presinteringInoperator != '') {
                            var flag = 0;
                            presinteringInoperator.forEach(function(ele) {
                                if(ele.code === e.code){
                                    $("#presinteringInoperator1").append("<option value="+(e.code)+" selected>"+e.name+"</option>");
                                    flag = 1;
                                }
                            })
                            if(flag === 0){
                                $("#presinteringInoperator1").append("<option value="+(e.code)+">"+e.name+"</option>");
                            }
                        }
                        else {
                            $("#presinteringInoperator1").append("<option value="+(e.code)+">"+e.name+"</option>");
                        }
                        
                        if(presinteringOutoperator != '') {
                            var flag = 0;
                            presinteringOutoperator.forEach(function(ele) {
                                if(ele.code === e.code){
                                    $("#presinteringOutoperator1").append("<option value="+(e.code)+" selected>"+e.name+"</option>");
                                    flag = 1;
                                }
                            })
                            if(flag === 0){
                                $("#presinteringOutoperator1").append("<option value="+(e.code)+">"+e.name+"</option>");
                            }
                        }
                        else {
                            $("#presinteringOutoperator1").append("<option value="+(e.code)+">"+e.name+"</option>");
                        }

                        if(crushingOperator != '') {
                            var flag = 0;
                            crushingOperator.forEach(function(ele) {
                                if(ele.code === e.code){
                                    $("#crushingOperator1").append("<option value="+(e.code)+" selected>"+e.name+"</option>");
                                    flag = 1;
                                }
                            })
                            if(flag === 0){
                                $("#crushingOperator1").append("<option value="+(e.code)+">"+e.name+"</option>");
                            }
                        }
                        else {
                            $("#crushingOperator1").append("<option value="+(e.code)+">"+e.name+"</option>");
                        }
                }) 
                layer.open({
                    type: 1,
                    title: '编辑流程追踪',
                    content: $("#process_tracking_editor_modal"),
                    area: ['1150px', '530px'],
                    btn: ['确定','提交','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#process_tracking_editor_modal").css('display', 'none')
                         var goodsCode = $("#goodsCode1").val()
                         var premixedCode = $("#premixedCode1").val()
                         var premixedDate = $("#premixedDate1").val()
                         var mixerNumber =  $("#mixerNumber1").val()
                         //var premixedOperator =  $("#premixedOperator1").val()
                         var presinteringCode =  $("#presinteringCode1").val()
                         var presinteringDate =  $("#presinteringDate1").val()
                         var sinteringFurnace =  $("#sinteringFurnace1").val()
                         //var presinteringInoperator =  $("#presinteringInoperator1").val()
                         //var presinteringOutoperator =  $("#presinteringOutoperator1").val()
                         var crushingCode = $("#crushingCode1").val()
                         var crushingDate = $("#crushingDate1").val()
                         var millNumber =  $("#millNumber1").val()
                         //var crushingOperator =  $("#crushingOperator1").val()
                         var note =  $("#note1").val()
                         var premixedOperator = [],presinteringInoperator = [],presinteringOutoperator = [] , crushingOperator = [] ;
                        if($("#premixedOperator option:selected")) {
                            premixedOperator.push($("#premixedOperator1").val());
                        }
                        if($("#presinteringInoperator option:selected")) {
                            presinteringInoperator.push($("#presinteringInoperator1").val());
                        }
                        if($("#presinteringOutoperator option:selected")) {
                            presinteringOutoperator.push($("#presinteringOutoperator1").val());
                        }
                        if($("#crushingOperator option:selected")) {
                            crushingOperator.push($("#crushingOperator1").val());
                        }
                         $.post(home.urls.processTracking.update(),{
                             code:code,
                             'goodsCode.code':goodsCode,
                             premixedCode:premixedCode,
                             premixedDate:premixedDate,
                             mixerNumber:mixerNumber,
                             premixedOperator:premixedOperator.toString(),
                             presinteringCode:presinteringCode,
                             presinteringDate:presinteringDate,
                             sinteringFurnace:sinteringFurnace,
                             presinteringInoperator:presinteringInoperator.toString(),
                             presinteringOutoperator:presinteringOutoperator.toString(),
                             crushingCode:crushingCode,
                             crushingDate:crushingDate,
                             millNumber:millNumber,
                             crushingOperator:crushingOperator.toString(),
                             note:note,
                             state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     process_tracking.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                    }
                    ,btn2: function(index) {
                        $("#process_tracking_editor_modal").css('display', 'none')
                         var goodsCode = $("#goodsCode1").val()
                         var premixedCode = $("#premixedCode1").val()
                         var premixedDate = $("#premixedDate1").val()
                         var mixerNumber =  $("#mixerNumber1").val()
                         //var premixedOperator =  $("#premixedOperator1").val()
                         var presinteringCode =  $("#presinteringCode1").val()
                         var presinteringDate =  $("#presinteringDate1").val()
                         var sinteringFurnace =  $("#sinteringFurnace1").val()
                         //var presinteringInoperator =  $("#presinteringInoperator1").val()
                         //var presinteringOutoperator =  $("#presinteringOutoperator1").val()
                         var crushingCode = $("#crushingCode1").val()
                         var crushingDate = $("#crushingDate1").val()
                         var millNumber =  $("#millNumber1").val()
                         //var crushingOperator =  $("#crushingOperator1").val()
                         var note =  $("#note1").val()
                         var premixedOperator = [] ,presinteringInoperator = [],presinteringOutoperator = [] , crushingOperator = [] ;
                        if($("#premixedOperator option:selected")) {
                            premixedOperator.push($("#premixedOperator1").val());
                        }
                        if($("#presinteringInoperator option:selected")) {
                            presinteringInoperator.push($("#presinteringInoperator1").val());
                        }
                        if($("#presinteringOutoperator option:selected")) {
                            presinteringOutoperator.push($("#presinteringOutoperator1").val());
                        }
                        if($("#crushingOperator option:selected")) {
                            crushingOperator.push($("#crushingOperator1").val());
                        }
                         $.post(home.urls.processTracking.update(),{
                             code:code,
                             'goodsCode.code':goodsCode,
                             premixedCode:premixedCode,
                             premixedDate:premixedDate,
                             mixerNumber:mixerNumber,
                             premixedOperator:premixedOperator.toString(),
                             presinteringCode:presinteringCode,
                             presinteringDate:presinteringDate,
                             sinteringFurnace:sinteringFurnace,
                             presinteringInoperator:presinteringInoperator.toString(),
                             presinteringOutoperator:presinteringOutoperator.toString(),
                             crushingCode:crushingCode,
                             crushingDate:crushingDate,
                             millNumber:millNumber,
                             crushingOperator:crushingOperator.toString(),
                             note:note,
                             state:1
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     process_tracking.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                     }
                     ,btn3: function(index) {
                        $("#process_tracking_editor_modal").css('display', 'none')
                        layer.close(index)
                     }
                }); 
             })
            })
         }
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
                         $.post(home.urls.processTracking.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    process_tracking.init()
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
         ,bindAddEvent:function(addBtn){
             addBtn.off('click').on('click',function(){
                $("#premixedCode1").val('')
                $("#premixedDate1").val('')
                $("#mixerNumber1").val('')
                $("#presinteringCode1").val('')
                $("#presinteringDate1").val('')
                $("#sinteringFurnace1").val('')
                $("#crushingCode1").val('')
                $("#crushingDate1").val('')
                $("#millNumber1").val('')
                $("#note1").val('')
                $("#goodsCode1").empty()
                $("#premixedOperator1").empty()
                $("#presinteringInoperator1").empty()
                $("#presinteringOutoperator1").empty()
                $("#crushingOperator1").empty()
                process_tracking.goods.forEach(function(e){
                       $("#goodsCode1").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                process_tracking.users.forEach(function(e){
                       $("#premixedOperator1").append(
                       "<option value="+(e.code)+">"+e.name+"</option>"
                   )
                       $("#presinteringInoperator1").append(
                       "<option value="+(e.code)+">"+e.name+"</option>"
                   )
                       $("#presinteringOutoperator1").append(
                       "<option value="+(e.code)+">"+e.name+"</option>"
                   )
                       $("#crushingOperator1").append(
                       "<option value="+(e.code)+">"+e.name+"</option>"
                   )
               })  
                $("#process_tracking_editor_modal").removeClass("hide")            
                layer.open({
                    type: 1,
                    title: '新增流程追踪',
                    content: $("#process_tracking_editor_modal"),
                    area: ['1150px', '550px'],
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#process_tracking_editor_modal").css('display', 'none')
                        var goodsCode = $("#goodsCode1").val()
                        var premixedCode = $("#premixedCode1").val()
                        var premixedDate = $("#premixedDate1").val()
                        var mixerNumber =  $("#mixerNumber1").val()
                        //var premixedOperator =  $("#premixedOperator1").val()
                        var presinteringCode =  $("#presinteringCode1").val()
                        var presinteringDate =  $("#presinteringDate1").val()
                        var sinteringFurnace =  $("#sinteringFurnace1").val()
                        //var presinteringInoperator =  $("#presinteringInoperator1").val()
                        //var presinteringOutoperator =  $("#presinteringOutoperator1").val()
                        var crushingCode = $("#crushingCode1").val()
                        var crushingDate = $("#crushingDate1").val()
                        var millNumber =  $("#millNumber1").val()
                        //var crushingOperator =  $("#crushingOperator1").val()
                        var note =  $("#note1").val()
                        var premixedOperator = [],presinteringInoperator = [],presinteringOutoperator = [] , crushingOperator = [] ;
                        if($("#premixedOperator1 option:selected")) {
                            premixedOperator.push($("#premixedOperator1").val());
                        }
                        if($("#presinteringInoperator1 option:selected")) {
                            presinteringInoperator.push($("#presinteringInoperator1").val());
                        }
                        if($("#presinteringOutoperator1 option:selected")) {
                            presinteringOutoperator.push($("#presinteringOutoperator1").val());
                        }
                        if($("#crushingOperator1 option:selected")) {
                            crushingOperator.push($("#crushingOperator1").val());
                        }
                        //console.log('premixedOperator='+premixedOperator)
                        //console.log('presinteringInoperator='+presinteringInoperator)
                        //console.log(presinteringOutoperator)
                        //console.log(crushingOperator)
                        $.post(home.urls.processTracking.add(),{
                           'goodsCode.code':goodsCode,
                            premixedCode:premixedCode,
                            premixedDate:premixedDate,
                            mixerNumber:mixerNumber,
                            premixedOperator:premixedOperator.toString(),
                            presinteringCode:presinteringCode,
                            presinteringDate:presinteringDate,
                            sinteringFurnace:sinteringFurnace,
                            presinteringInoperator:presinteringInoperator.toString(),
                            presinteringOutoperator:presinteringOutoperator.toString(),
                            crushingCode:crushingCode,
                            crushingDate:crushingDate,
                            millNumber:millNumber,
                            crushingOperator:crushingOperator.toString(),
                            note:note,
                            state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     process_tracking.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                         $("#process_tracking_editor_modal").addClass("hide")
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#process_tracking_editor_modal").addClass("hide")
                        layer.close(index)
                    }
                }); 
             })
         }
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.process_tracking_checkbox:checked').length === 0) {
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
                             var process_tracking_codes=[]
                             $('.process_tracking_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                    process_tracking_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.processTracking.deleteByIdBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(process_tracking_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            process_tracking.init()
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
                     process_tracking.init()
                     $('#input_batch_num').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
         bindSearchEventListener: function (searchBtn) {
             searchBtn.off('click')
             searchBtn.on('click', function () {
                 var premixedCode = $('#input_batch_num').val()
                 //var createDate = new Date(order_date.replace(new RegExp("-","gm"),"/")).getTime()
                 //var createDate =order_date.getTime;//毫秒级; // date类型转成long类型
                 $.post(home.urls.processTracking.getByPremixedCodeLikeByPage(), {
                    premixedCode: premixedCode
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#process_tracking_table").children('tbody')
                     process_tracking.funcs.renderHandler($tbody, items,0)
                     layui.laypage.render({
                         elem: 'process_tracking_page'
                         , count: 10 * page.totalPages//数据总数
                         , jump: function (obj, first) {
                             if (!first) {
                                 $.post(home.urls.processTracking.getByPremixedCodeLikeByPage(), {
                                    premixedCode: premixedCode,
                                     page: obj.curr - 1,
                                     size: obj.limit
                                 }, function (result) {
                                     var items = result.data.content //获取数据
                                     // var code = $('#model-li-select-48').val()
                                     var page = obj.curr - 1
                                     const $tbody = $("#process_tracking_table").children('tbody')
                                     process_tracking.funcs.renderHandler($tbody, items,page)
                                     process_tracking.pageSize = result.data.content.length
                                 })
                             }
                         }
                     })
                 })
             })
         }

    }
}