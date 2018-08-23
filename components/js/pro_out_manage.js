var pro_out_manage = {
    pageSize: null,
    conpany:[],
    init: function () {

        /** 渲染下拉菜单 */
        pro_out_manage.funcs.renderTable()
        pro_out_manage.funcs.bindCreatoption()

        $.get(servers.backup()+'supplier/getAll',{},function(result){
            pro_out_manage.supplier = result.data
        })
    
        //将分页居中
        var out = $('#product_out_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#product_out_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },

    funcs: {
        bindCreatoption: function () {
            $("#audit_status").empty()
            $("#audit_status").append("<option selected value='-1'>选择审核状态</option><option value='0'>未提交</option>"+
            "<option value='1'>在审</option><option value='2'>通过</option><option value='3'>不通过</option>")
           
            $.post(home.urls.lingLiao.getRawTypeByMaterialCode(), {
                materialCode:2
            }, function (result){
                var items = result.data
                $("#rawType_Code").html("<option value='-1'>请选择物料名称</option>")
                items.forEach(function(e){
                    $("#rawType_Code").append(
                        "<option value="+e.code+">"+e.name+"</option>"
                    )
                })  
            })
        },
        renderTable: function () {
            $.post(home.urls.productOut.getAllByPage(), {}, function (res) {
                
                var $tbody = $("#product_out_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                //console.log(items)
                pro_out_manage.funcs.renderHandler($tbody, items,0)
                /** 渲染表格结束之后 */
                pro_out_manage.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'product_out_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.productOut.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                var page = obj.curr - 1
                                const $tbody = $("#product_out_table").children('tbody')
                                pro_out_manage.funcs.renderHandler($tbody, items,page)
                                pro_out_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            // /** 绑定全选事件 */
            // pro_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var addBtns = $('#model-li-hide-add-51')
            pro_out_manage.funcs.bindAddClick(addBtns)


            //增加按钮里面 实现全选
            var checkedBoxLen = $('.add1_checkbox:checked').length
            home.funcs.bindSelectAll($("#add1_checkAll"), $('.add1_checkbox'), checkedBoxLen, $("#add_modal1_table"))

            //批量删除
            var deleteBtns = $("#model-li-hide-delete-51")
            pro_out_manage.funcs.bindDeleteBatchEventListener(deleteBtns)

            //增加按钮全选
            var checkedBoxLen = $(".add_checkbox:checked").length
            home.funcs.bindSelectAll($("#add_checkAll"), $(".add_checkbox"), checkedBoxLen, $("#add_modal_table"))
            
            // 追加刷新事件
            var refreshBtn = $('#model-li-hide-refresh-51');
            pro_out_manage.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model-li-hide-search-51')
            pro_out_manage.funcs.bindSearchEventListener(searchBtn) 

            //追加审核状态搜索事件
            var status_searchBtn = $('#audit_status')
            pro_out_manage.funcs.bindStatusSearchEventListener(status_searchBtn)

            //根据时间搜索
            //var date_searchBtn = $('#date')
            //pro_out_manage.funcs.bindDateSearchEventListener(date_searchBtn)

            //根据物料名称搜索
            var rawType_searchBtn = $('#rawType_Code')
            pro_out_manage.funcs.bindRawTypeSearchEventListener(rawType_searchBtn)

            //新增里面以及编辑里面的删除按钮
            pro_out_manage.funcs.bindInDeleteClick($(".delete_roundBtn"))

        }

        /**渲染表格 */
        , renderHandler: function ($tbody, items,page) {
            $tbody.empty() //清空表格
            var length = 1 + page * 10
            items.forEach(function (e) {
                var code = e.code
                switch(e.auditStatus){
                    case 0:
                        auditStatus = '未提交';
                        break;
                    case 1:
                        auditStatus = '待审核';
                        break;  
                    case 2:
                        auditStatus = '通过';
                        break;
                    case 3:
                        auditStatus = '未通过';
                        break;    
                }
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='product_out_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (length++) + "</td>" +
                    "<td>" + (e.rawType ? e.rawType.name : '') + "</td>" +
                    "<td>" + (new Date(e.applyTime).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.supplier ? e.supplier.name : '') + "</td>" +
                    "<td>" + auditStatus + "</td>" +
                    "<td><a href=\"#\" class='verify' id='verify-" + (code) + "'><i class=\"layui-icon\">&#xe6b2;</i></a></td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
                if(e.auditStatus!=0){
                    $("#editor-"+code+"").removeClass('editor').addClass('disableHref')
                    $("#delete-"+code+"").removeClass('delete').addClass('disableHref')
                }
                if(e.auditStatus===2||e.auditStatus===3){
                    $("#verify-"+code+"").removeClass('verify').addClass('disableHref')
                }
            })
            // /** 绑定全选事件 */
            // mat_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var verifyBtns = $(".verify")
            pro_out_manage.funcs.bindVerifyClick(verifyBtns)
            var detailBtns = $(".detail")
            pro_out_manage.funcs.bindDetailClick(detailBtns)
            var editorBtns = $(".editor")
            pro_out_manage.funcs.bindEditorClick(editorBtns)
            var deleteBtns = $(".delete")
            pro_out_manage.funcs.In(deleteBtns)
           
            //产品出库全选
            var checkBoxLen = $(".product_out_checkbox:checked").length
            home.funcs.bindSelectAll($("#product_out_checkAll"), $(".product_out_checkbox"), checkBoxLen, $("#product_out_table"))
     
            //新增内容全选
            var checkedBoxLen = $('.delete_checkbox:checked').length
            home.funcs.bindSelectAll($("#add_checkAll"), $('.delete_checkbox'), checkedBoxLen, $("#add_modal_table"))
        }


        /**新增 */
        , bindAddClick: function (addBtns) {
            addBtns.off('click')
            addBtns.on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo   
             pro_out_manage.funcs.fill_add_data("#add_modal")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#add_modal"),
                    area: ['800px', '400px'],
                    btn: ['保存','提交', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        var productSends = [];
                        var total_amount = 0
                        $('.delete_checkbox').each(function() {
                            var e = $(this).parent('td').parent('tr').children('td')
                            total_amount += parseFloat(e.eq(4).text()) 
                            productSends.push({
                            //code : e.eq(1).text(),
                            batchNumber : e.eq(2).text(),
                            unit : e.eq(3).text(),
                            weight : e.eq(4).text(),
                        })
                    })  
                        var time = new Date($("#add_applyTime").text()).getTime()
                        var nowTime = new Date().Format("yyyy-MM-dd")
                        var transportMode = $('#add_transportWays').val()
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)
                        var data = {
                            rawType : {code : $('#add_select_rawType').val()},
                            transportMode : transportMode,
                            createDate: nowTime,
                            processManage :{code : $('#add_select_processCode').val()},
                            auditStatus : 0,
                            outStatus: 0,
                            sender:{code : userJson.code},
                            sendTime:new Date().getTime(),
                            applicant:{code : userJson.code},
                            applyTime:time,
                            weight : total_amount,
                            supplier:{code:$("#add_company").val()},
                            productSends : []
                        }
                        data.productSends = productSends
                        console.log(data)
                        $.ajax({
                            url:home.urls.productOut.add(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result) {
                                if(result.code === 0) {
                                    var time = setTimeout(function(){
                                        pro_out_manage.init()
                                        clearTimeout(time)
                                    },500)
                                }
                                layer.msg(result.message,{
                                    offset:['40%','55%'],
                                    time:700          
                              })  
                            }                       
                         })

                        $("#add_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        var productSends = [];
                        var total_amount = 0
                        $('.delete_checkbox').each(function() {
                            var e = $(this).parent('td').parent('tr').children('td')
                            total_amount += parseFloat(e.eq(4).text()) 
                            productSends.push({
                            //code : e.eq(1).text(),
                            batchNumber : e.eq(2).text(),
                            unit : e.eq(3).text(),
                            weight : e.eq(4).text(),
                        })
                    })  
                        var time = new Date($("#add_applyTime").text()).getTime()
                        var nowTime = new Date().Format("yyyy-MM-dd")
                        var transportMode = $('#add_transportWays').val()
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)
                        var data = {
                            rawType : {code : $('#add_select_rawType').val()},
                            transportMode : transportMode,
                            createDate: nowTime,
                            processManage :{code : $('#add_select_processCode').val()},
                            auditStatus : 1,
                            outStatus: 0,
                            sender:{code : userJson.code},
                            sendTime:new Date().getTime(),
                            applicant:{code : userJson.code},
                            applyTime:time,
                            weight : total_amount,
                            supplier:{code:$("#add_company").val()},
                            productSends : []
                        }
                        data.productSends = productSends
                        console.log(data)
                        $.ajax({
                            url:home.urls.productOut.add(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result) {
                                if(result.code === 0) {
                                    var time = setTimeout(function(){
                                        pro_out_manage.init()
                                        clearTimeout(time)
                                    },500)
                                }
                                layer.msg(result.message,{
                                    offset:['40%','55%'],
                                    time:700          
                              })  
                            }                       
                         })

                        $("#add_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn3: function (index) {
                        $("#add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })

            var add_addBtn = $('#add_addBtn')
            pro_out_manage.funcs.bindAddClick1(add_addBtn)
         
           
        }

        ,fill_add_data:function(div){
            $tbody = $("#add_modal_table").children("tbody")
            $tbody.empty()
            $("#add_transportWays").val('')
            $("#add_select_rawType").empty()
            $("#add_company").empty()
            $('#add_total_amount').text('0')
            $("#add_select_rawType").html("<option value='-1'>请选择公司类型</option>")
           
            pro_out_manage.supplier.forEach(function(e){
                $("#add_company").append('<option value='+e.code+'>'+e.name+'</option>')
            })    
            $.post(home.urls.lingLiao.getRawTypeByMaterialCode(), {
                materialCode:2
            }, function (result){
                var items = result.data
                $("#add_select_rawType").html("<option value='-1'>请选择物料名称</option>")
                items.forEach(function(e){
                    $("#add_select_rawType").append(
                        "<option value="+e.code+">"+e.name+"</option>"
                    )
                })  
            })
            $("#add_select_processCode").empty()
            $.get(home.urls.check.getAll(), {}, function (result) {
                var value = result.data
                var length = value.length
                $("#add_select_processCode").html("<option value='-1'>请选择流程类型</option>")
                for (var i = 0; i < length; i++) {
                    var text = value[i].name
                    $("#add_select_processCode").append("<option id='" + value[i].code + "' value='" + value[i].code + "'>" + text + "</option>");
                }
            })
            var time = new Date().Format('yyyy-MM-dd hh:mm:ss')
            $("#add_applyTime").text(time) 
           // $("#add_inTime").text(time) 
        }
        /**新增里面的新增 */
        , bindAddClick1: function (add_addBtn) {
            add_addBtn.off('click')
            add_addBtn.on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo  
                pro_out_manage.funcs.fillData_to_edit_add("#edit_add_modal")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                layer.open({
                    type: 1,
                    title: '查询',
                    content: $("#edit_add_modal"),
                    area: ['800px', '400px'],
                    btn: ['确定', '取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {                
                        var total_amount = 0
                        if($('.edit_add_checkbox:checked').length === 0) {
                            $("#edit_add_modal").css('display', 'none')
                            layer.close(index)
                        }
                        else {
                         //将选中的数据appen到上一个界面中去
                         var length = 1
                         //console.log(length)
                         const $tbody = $("#add_modal_table").children('tbody')
                         $('.edit_add_checkbox').each(function(){
                             if($(this).prop('checked')) {
                                 var e = $(this).parent('td').parent('tr').children('td')
                                 total_amount += parseInt(e.eq(2).text())
                                 $tbody.append(
                                    "<tr>"+
                                    "<td><input type='checkbox' class='delete_checkbox' /></td>" +
                                    "<td>"+ (length) +"</td><td>"+ (e.eq(1).text()) + "</td>"+
                                    "<td>"+(e.eq(3).text()) + "</td>"+ "<td>"+ (e.eq(2).text()) + "</td>"+
                                    "</tr>"
                                 )
                                 length += 1
                             }
                         })
                         $('#add_total_amount').text(total_amount)
                        }
                        $("#edit_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#edit_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
             //搜索按钮
             var edit_add_searchBtn = $("#edit_add_search")
             pro_out_manage.funcs.edit_add_search(edit_add_searchBtn)
             //详情
            // console.log('edit-add')
             var edit_add_search_detailBtn = $(".edit_add_detail")
             pro_out_manage.funcs.edit_add_search_detail(edit_add_search_detailBtn)
             //实现全选
             var checkBoxLen = $(".edit_add_checkbox:checked").length
             home.funcs.bindSelectAll($("#edit_add_checkAll"),$(".edit_add_checkbox"),checkBoxLen,$("#edit_add_modal_table"))

        }
        /**审核 */
        , bindVerifyClick: function (verifyBtns) {
            verifyBtns.off('click')
            verifyBtns.on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOut.getByCode(),{
                    code:codeNumber
                }, function(result) {
                    var items = result.data
                    pro_out_manage.funcs.fill_verify_data($("#verify_modal"),items,codeNumber)
                
                layer.open({
                    type: 1,
                    title: '审核',
                    content: $("#verify_modal"),
                    area: ['800px', '400px'],
                    btn: ['通过', '不通过','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        /**更新产品出库审批 */ 
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)

                        var note = $("#verify_note").val()
                        var code = codeNumber
                        var audit_Code = userJson.code
                        console.log(note)
                        $.post(home.urls.productOut.updateAuditStatusByCode(),{
                            note : note,
                            code : codeNumber,
                            auditCode:audit_Code,
                            auditStatus:2

                        }, function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    pro_out_manage.init()
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        $("#verify_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn2: function (index) {
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)

                        var note = $("#verify_note").val()
                        var code = codeNumber
                        var audit_Code = userJson.code
                        $.post(home.urls.productOut.updateAuditStatusByCode(),{
                            auditStatus : 3,
                            note : note,
                            code : code,
                            auditCode : audit_Code
                        }, function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    pro_out_manage.init()
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        $("#verify_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn3 : function(index) {
                        $("#verify_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
            })
        }
        /**审核界面读取数据 */
        ,fill_verify_data:function(div,items,codeNumber){
            var total_amount = 0
            productSends = items.productSends
            var $tbody = $("#verify_table").children('tbody')
            $tbody.empty() //清空表格
            productSends.forEach(function(e){
                total_amount += e.weight
                $tbody.append(
                    "<tr>"+
                    "<td>"+ (e.code?e.code:' ') +"</td><td>"+ (e.batchNumber?e.batchNumber:' ') + "</td>"+
                    "<td>"+ (e.unit?e.unit:' ') + "</td>"+ "<td>"+ (e.weight?e.weight:' ') + "</td>"+
                    "</tr>"
            );
            })

            $("#code1").text(items.code)
            $("#rawType1").text(items.rawType?items.rawType.name:' ')
            $("#verify_company").text(items.supplier?items.supplier.name:' ')
            $("#weight1").text(total_amount)
            $("#sender1").text(items.sender?items.sender.name:' ')
            $("#applicant1").text(items.applicant?items.applicant.name:' ')
            $("#sendTime1").text(items.sendTime?new Date(items.sendTime).Format('yyyy-MM-dd'):' ')
            $("#applyTime1").text(items.applyTime?new Date(items.applyTime).Format('yyyy-MM-dd'):' ')

            $.post(home.urls.productOut.getByProductSendHeader(),{
                productSendHeaderCode: codeNumber
            }, function(result) {
                res = result.data
                if(res ==null || res==''){
                
                }
                else{
                $("#audit_Name").text(res[0].auditor?res[0].auditor.name:'')
                $("#audit_result").text(res[0].auditResult?res[0].auditResult:'')
                $("#audit_time").text(res[0].auditTime?new Date(res[0].auditTime).Format('yyyy-MM-dd'):' ')
                $("#audit_note").text((res[0].note?res[0].note:' '))
                }
                  
            })

            
        }

        /**详情 */
        , bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOut.getByCode(),{
                    code:codeNumber
                }, function(result) {
                    var items = result.data //获取数据
                    //console.log(items)
                    pro_out_manage.funcs.fill_detail_data($("#detail_modal"),items,codeNumber)
                layer.open({
                    type: 1,
                    title: '出库单申请审批',
                    content: $("#detail_modal"),
                    area: ['800px', '500px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        })
        },
        //填充详情表格的弹出表格
        fill_detail_data:function(div,items,codeNumber){
            var total_amount = 0
            productSends = items.productSends
            var $tbody = $("#detail_modal2").children('tbody')
            $tbody.empty() //清空表格
            var i = 1
            productSends.forEach(function(e){
                total_amount =+ e.weight
                $tbody.append(
                    "<tr>"+
                    "<td>"+ (i++) +"</td><td>"+ (e.batchNumber?e.batchNumber:' ') + "</td>"+
                    "<td>"+ (e.unit?e.unit:' ') + "</td>"+ "<td>"+ (e.weight?e.weight:' ') + "</td>"+
                    "</tr>"
            );
            })

            $("#code").text(items.code)
            $("#rawType").text(items.rawType?items.rawType.name:' ')
            $("#detail_company").text(items.supplier?items.supplier.name:' ')
            $("#weight").text(total_amount)
            $("#sender").text(items.sender?items.sender.name:' ')
            $("#applicant").text(items.applicant?items.applicant.name:' ')
            $("#sendTime").text(new Date(items.sendTime).Format('yyyy-MM-dd'))
            $("#applyTime").text(new Date(items.applyTime).Format('yyyy-MM-dd'))
           
            $.post(home.urls.productOut.getByProductSendHeader(),{
                productSendHeaderCode: codeNumber
            }, function(result) {
                var res = result.data
               // console.log(res)
               if(res ==null || res==''){
                
               }
               else{
                   $("#Detail_audit_Name").text(res[0].auditor?res[0].auditor.name:' ')
                   $("#Detail_audit_result").text(res[0].auditResult?res[0].auditResult:' ')
                   $("#Detail_audit_time").text(res[0].auditTime?new Date(res[0].auditTime).Format('yyyy-MM-dd'):' ')
                   $("#Detail_audit_note").text((res[0].note?res[0].note:' '))
               }
                
                
            })
        }


        /**编辑 */
        , bindEditorClick: function (editBtns) {
            editBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOut.getByCode(),{
                    code:codeNumber
                },function(result){
                    var items = result.data //获取数据                    
                    pro_out_manage.funcs.fill_edit_data($("#editor_modal"),items)
               
                layer.open({
                    type: 1,
                    title: '编辑',
                    content: $("#editor_modal"),
                    area: ['820px', '400px'],
                    btn: ['保存', '提交', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        var total_amount = 0
                        var productSends = [];
                        $('.delete_checkbox').each(function() {
                            var e = $(this).parent('td').parent('tr').children('td')
                            total_amount += parseFloat(e.eq(4).text()) 
                            productSends.push({
                            //code : e.eq(1).text(),
                            //productSendHeader:{code:codeNumber},
                            batchNumber : e.eq(2).text(),
                            unit : e.eq(3).text(),
                            weight : e.eq(4).text(),
                        })
                    })
                       // console.log($('#editor_select_processCode').val())
                        //console.log(total_amount)
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)
                        var data = {
                            code : codeNumber,
                            number:items.number,
                            rawType : {code : $('#editor_select_rawType').val()},
                            transportMode : $('#transportWays').val(),
                            createDate: items.createDate,
                            supplier : {code : items.supplier?items.supplier.code:''},
                            processManage :{code : $('#editor_select_processCode').val()},
                            auditStatus : 0,
                            outStatus: 0,
                            sender:{code : userJson.code},
                            sendTime:new Date().getTime(),
                            applicant:{code : items.applicant.code},
                            applyTime:new Date().getTime(),
                            weight : total_amount,
                            productSends : []
                        }
                        data.productSends = productSends
                        console.log(data)
                        $.ajax({
                            url:home.urls.productOut.update(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result) {
                                if(result.code === 0) {
                                    var time = setTimeout(function(){
                                        pro_out_manage.init()
                                        clearTimeout(time)
                                    },500)
                                }
                                layer.msg(result.message,{
                                    offset:['40%','55%'],
                                    time:700          
                              })  
                            }                       
                         })

                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                }
                    , btn2: function (index) {
                        var total_amount = 0
                        var productSends = [];
                        $('.delete_checkbox').each(function() {
                            var e = $(this).parent('td').parent('tr').children('td')
                            total_amount += parseFloat(e.eq(4).text()) 
                            productSends.push({
                            //code : e.eq(1).text(),
                            //productSendHeader:{code:codeNumber},
                            batchNumber : e.eq(2).text(),
                            unit : e.eq(3).text(),
                            weight : e.eq(4).text(),
                        })
                    })
                       // console.log($('#editor_select_processCode').val())
                        //console.log(total_amount)
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)
                        var data = {
                            code : codeNumber,
                            number:items.number,
                            rawType : {code : $('#editor_select_rawType').val()},
                            transportMode : $('#transportWays').val(),
                            createDate: items.createDate,
                            supplier : {code : items.supplier?items.supplier.code:''},
                            processManage :{code : $('#editor_select_processCode').val()},
                            auditStatus : 2,
                            outStatus: 0,
                            sender:{code : userJson.code},
                            sendTime:new Date().getTime(),
                            applicant:{code : items.applicant.code},
                            applyTime:new Date().getTime(),
                            weight : total_amount,
                            productSends : []
                        }
                        data.productSends = productSends
                        console.log(data)
                        $.ajax({
                            url:home.urls.productOut.update(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result) {
                                if(result.code === 0) {
                                    var time = setTimeout(function(){
                                        pro_out_manage.init()
                                        clearTimeout(time)
                                    },500)
                                }
                                layer.msg(result.message,{
                                    offset:['40%','55%'],
                                    time:700          
                              })  
                            }                       
                         })

                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn3: function (index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        })
            var edit_addBtn = $("#edit_addBtn")
            const $tbody = $("#editor_table2").children('tbody')
            pro_out_manage.funcs.bindEditAddClick(edit_addBtn,$tbody)

            var edit_deleteBtn = $("#delete_addBtn")
           // pro_out_manage.funcs.bindEditDeleteClick(edit_deleteBtn)

           
        },
        /**编辑里面的增加按钮 */
        bindEditAddClick: function (detailBtns,$tbody) {
            detailBtns.off('click').on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                $tbody1 = $("#edit_add_modal_table").children('tbody')
                $tbody1.empty()
                pro_out_manage.funcs.fillData_to_edit_add("#edit_add_modal")
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#edit_add_modal"),
                    area: ['800px', '400px'],
                    btn: ['确认','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        rawType_Code = $('#edit_add_select option:selected').val()
                        var total_amount = parseInt($('#total_amount').text())
                        if($('.edit_add_checkbox:checked').length === 0) {
                            $("#edit_add_modal").css('display', 'none')
                            layer.close(index)
                        }
                        else {
                         //将选中的数据appen到上一个界面中去
                         var length = $tbody.find("tr").length +1
                         $('.edit_add_checkbox').each(function(){
                             if($(this).prop('checked')) {
                                 var e = $(this).parent('td').parent('tr').children('td')
                                 total_amount += parseInt(e.eq(2).text())
                                 $tbody.append(
                                    "<tr>"+
                                    "<td><input type='checkbox' class='delete_checkbox' /></td>" +
                                    "<td>"+ (length) +"</td><td>"+ (e.eq(1).text()) + "</td>"+
                                    "<td>"+(e.eq(3).text()) + "</td>"+ "<td>"+ (e.eq(2).text()) + "</td>"+
                                    "</tr>"
                                 )
                             }
                         })
                         $('#total_amount').text(total_amount)
                        }
                        $("#edit_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#edit_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                })
            })
            //搜索按钮
            var edit_add_searchBtn = $("#edit_add_search")
            pro_out_manage.funcs.edit_add_search(edit_add_searchBtn)
        }

        ,fill_edit_data:function(div,items){
            $("#editor_company").empty()
            if(items.supplier!=null){
                $("#editor_company").append("<option value="+items.supplier.code+">"+items.supplier.name+"</option>")
                pro_out_manage.supplier.forEach(function(e){
                    if(items.supplier.code!=e.code){
                        $("#editor_company").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                })
            }
            else{
                pro_out_manage.supplier.forEach(function(e){
                    $("#editor_company").append("<option value="+e.code+">"+e.name+"</option>")
                })
            }
            var total_amount = 0
            var productSends = items.productSends
            //console.log(productSends)
            var $tbody = $("#editor_table2").children('tbody')
            $tbody.empty() //清空表格
            var i = 1
            productSends.forEach(function(e){
                total_amount += e.weight
                $tbody.append(
                    "<tr>"+
                    "<td><input type='checkbox' class='delete_checkbox' id='e.code'/></td>" +
                    "<td>"+ (i++) +"</td><td>"+ (e.batchNumber?e.batchNumber:' ') + "</td>"+
                    "<td>"+ (e.unit?e.unit:' ') + "</td>"+ "<td>"+ (e.weight?e.weight:' ') + "</td>"+
                    "</tr>"
            );
            })
            $("#transportWays").val(items.transportMode?items.transportMode:'' )
            $("#out_code").text(items.code?items.code:' ')
            $("#apply_time").text(items.applyTime?new Date(items.applyTime).Format('yyyy-MM-dd'):' ')
            $("#in_time").text(items.sendTime?new Date(items.sendTime).Format('yyyy-MM-dd'):' ')
            $('#total_amount').text(total_amount)

            $("#editor_select_rawType").html("<option value="+items.rawType.code+">"+items.rawType.name+"</option>")
            $.post(home.urls.lingLiao.getRawTypeByMaterialCode(), {
                materialCode:2
            }, function (result){
                var rawType = result.data
                rawType.forEach(function(e){
                    if(items.rawType.code!=e.code){
                        $("#editor_select_rawType").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                })  
            })
            $("#editor_select_processCode").html("<option value="+items.processManage.code+">"+items.processManage.name+"</option>")
            $.get(home.urls.check.getAll(), {}, function (result) {
                var value = result.data
                var length = value.length
                for (var i = 0; i < length; i++) {
                    if(items.processManage.code!=value[i].code){
                        var text = value[i].name
                    $("#editor_select_processCode").append("<option id='" + value[i].code + "' value='" + value[i].code + "'>" + text + "</option>");
                    }
                }
            })

             //编辑按钮全选
             var checkedBoxLen = $('.delete_checkbox:checked').length
             home.funcs.bindSelectAll($("#edit_checkAll"), $('.delete_checkbox'), checkedBoxLen, $("#editor_table2"))
            
        }
        //编辑里面的新增按钮对于的界面
        ,fillData_to_edit_add:function(div){
            $.post(home.urls.lingLiao.getRawTypeByMaterialCode(), {
                materialCode:2
            }, function (result){
                var items = result.data
                $("#edit_add_select").html("<option value='-1'>请选择物料名称</option>")
                items.forEach(function(e){
                    $("#edit_add_select").append(
                        "<option value="+ e.code +">"+ e.name +"</option>"
                    )
                })
            })
        }
        ,edit_add_search_detail:function(detailBtns){
            detailBtns.off('click')
            detailBtns.on('click', function () {
                var _selfBtn = $(this)
                var batchNumber = _selfBtn.attr('id').substr(7)
                var currId =$('#edit_add_select option:selected').val()
                //产品出库只有产品这一种
                $.post(home.urls.product.getByBatchNumber(),{
                    batchNumber:batchNumber
                },function(result){
                    var res = result.data
                    //console.log(res) 
                    // console.log(currId)
                    //console.log('Product')
                    layer.open({
                        type: 1,
                        content: pro_out_manage.funcs.getTableProduct(res),
                        area: ['720px', '670px'],
                        btn: ['关闭'],
                        offset: 'auto',   // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function (index) {
                            layer.close(index);
                        }
                    })
                })   
            })
        }
        , getTableProduct: function (product) {
            return (
                "<div id='auditModal' style='padding:20px;'>"+
                "<table id='audit_table_inner' class='table_inner' align='center' width='100%'>" +
                "<thead>" +
                " <tr> <td colspan='2'>批号</td><td>检测日期</td> <td>数量(t)</td> <td>判定</td> <td></td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + (product.batchNumber) + "</td><td>" + (new Date(product.testDate).Format('yyyy-MM-dd')) + "</td> <td>" + (product.number) + "</td> <td>" + (product.judge ? product.judge.name : null) + "</td> <td></td> </tr>" +
                " </tbody>" +
                "<thead>" +
                " <tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td> <td></td> </tr>" +
                "</thead>" +
                "<tbody>" +
                " <tr> <td colspan='2'>" + (product.status ? product.status.name : '') + "</td> <td>" + (product.publisher ? product.publisher.name : '') + "</td> <td></td> <td></td> <td></td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td> <td>三级控制标准</td> <td>2016-3-2三级控制标准</td> <td>" + (product.batchNumber) + "</td> <td>编辑</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>振实密度(g/cm3)</td><td>≥2.0</td><td>2.3~2.7</td> <td>" + (product.p1?product.p1:'0') + "</td><td></td></tr>" +
                " <tr> <td colspan='2'>水分（ppm）</td>  <td>≤500</td>  <td>≤200</td>  <td>" + (product.p2?product.p2:'0') + "</td>  <td></td> </tr>" +
                "<tr> <td colspan='2'>SSA（m2/g）</td> <td>0.20~0.40</td> <td>0.22~0.48</td> <td>" + (product.p3?product.p3:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>pH值</td> <td>&le;11.80</td> <td>&le;11.80</td> <td>" + (product.p4?product.p4:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Li2CO3（%）</td> <td></td> <td>&le;0.25</td> <td>" + (product.p5?product.p5:'0') + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>LiOH（%）</td> <td></td> <td>&le;0.20</td> <td>" + (product.p6?product.p6:'0') + "</td> <td></td> </tr>" +
                "<tr> <td rowspan='5'>粒度（um）</td> <td>D1</td> <td></td> <td>&ge;3.00</td> <td>" + (product.p8?product.p8:'0') + "</td> <td></td> </tr>" +
                "<tr> <td>D10</td> <td>&ge;6.00</td> <td>&ge;5.00</td> <td>" + (product.p9?product.p9:'0') + "</td> <td></td> </tr>" +
                "<tr> <td>D50</td> <td>11.00~14.00</td> <td>11.30~13.3</td> <td>" + (product.p10?product.p10:'0') + "</td> <td></td> </tr>" +
                "<tr> <td>D90</td> <td>&le;30.00</td> <td>&le;30.00</td> <td>" + (product.p11?product.p11:'0') + "</td> <td></td> </tr>" +
                " <tr> <td>D99</td> <td></td> <td>&le;40.00</td> <td>" + (product.p12?product.p12:'0') + "</td> <td></td> </tr>" +
                "<tr> <td rowspan='5'>磁性物质检测（ppb）</td> <td>粒度宽度系数</td> <td></td> <td></td> <td>" + (product.p13?product.p13:'0') + "</td> <td></td> </tr>" +
                "<tr> <td>Fe</td> <td></td> <td></td> <td>" + (product.p14?product.p14:'0') + "</td> <td></td> </tr>" +
                " <tr> <td>Ni</td> <td></td> <td></td> <td>" + (product.p15?product.p15:'0') + "</td> <td></td> </tr>" +
                "<tr> <td>Cr</td> <td></td> <td></td> <td>" + (product.p16?product.p16:'0') + "</td> <td></td> </tr>" +
                "<tr> <td>Zn</td> <td></td> <td></td> <td>" + (product.p17?product.p17:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>总量</td> <td>&le;50</td> <td>&le;50</td> <td>" + (product.p18?product.p18:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Co（mol%）</td> <td>12.20&plusmn;1.0</td> <td>19.7&plusmn;0.5</td> <td>" + (product.p19?product.p19:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Mn（ppm）</td> <td></td> <td>19.9&plusmn;0.5</td> <td>" + (product.p20?product.p20:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Ni（ppm）</td> <td></td> <td>60.4&plusmn;0.5</td> <td>" + (product.p21?product.p21:'0') + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>Li（%）</td> <td>7.0&plusmn;0.5</td> <td>7.0&plusmn;0.5</td> <td>" + (product.p22?product.p22:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Co （%）</td> <td>12.20&plusmn;1.0</td> <td>12.20&plusmn;1.0</td> <td>" + (product.p23?product.p23:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Mn（%）</td> <td>11.4&plusmn;1.0</td> <td>11.4&plusmn;1.0</td> <td>" + (product.p24?product.p24:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Ni（%）</td> <td>36.2&plusmn;1.0</td> <td>36.2&plusmn;1.0</td> <td>" + (product.p25?product.p25:'0') + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>Na （ppm）</td> <td>&le;200</td> <td>&le;200</td> <td>" + (product.p26?product.p26:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Mg （ppm）</td> <td>&le;200</td> <td>&le;200</td> <td>" + (product.p27?product.p27:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Ca （ppm）</td> <td>&le;200</td> <td>&le;200</td> <td>" + (product.p28?product.p28:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Fe（ppm）</td> <td>&le;50</td> <td>&le;30</td> <td>" + (product.p29?product.p29:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Cu（ppm）</td> <td>&le;50</td> <td>&le;20</td> <td>" + (product.p30?product.p30:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Zn（ppm）</td> <td>&le;50</td> <td>&le;30</td> <td>" + (product.p31?product.p31:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>S（ppm）</td> <td></td> <td>&le;1500</td> <td>" + (product.p32?product.p32:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Al（ppm）</td> <td></td> <td></td> <td>" + (product.p33?product.p33:'0') + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>0.1C放电容量（mAh/g）</td> <td>1000&plusmn;300</td> <td>1000&plusmn;300</td> <td>" + (product.p34?product.p34:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>0.1C首次放电效率（%）</td> <td></td> <td>&ge;177.5</td> <td>" + (product.p35?product.p35:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>1C放电容量（mAh/g）</td> <td></td> <td>&ge;88.0</td> <td>" + (product.p36?product.p36:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>主原料</td> <td></td> <td>&ge;162</td> <td>" + (product.p37?product.p37:'0') + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>成品外观、重量抽查结果</td> <td></td> <td></td> <td>" + (product.p38?product.p38:'0') + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>产线</td> <td></td> <td></td> <td>" + (product.p39?product.p39:'0') + "</td> <td></td> </tr>" +
                "</tbody>" +
                "</table>"+
                "</div>"
            )
        }

        //编辑——新增——搜索
        ,edit_add_search:function(searchBtn){
            searchBtn.off('click').on('click',function(){
                var rawType = $("#edit_add_select option:selected").val()
                var batch_Number = $("#product_batch_number_input").val()
                $.post(home.urls.lingLiao.getByRawTypeCodeAndBatchNumberLikeByPage(),{
                    rawTypeCode:rawType,
                    batchNumber:batch_Number
                },function(result){
                    var items = result.data.content
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#edit_add_modal_table").children('tbody')
                    pro_out_manage.funcs.edit_add_renderHandler($tbody,items)
                    layui.laypage.render({
                        elem:'pro_out_add_page',
                        count:10*page.totalPages, //数据总数
                        jump:function(obj,first) {
                            if(!first){
                                $.post(home.urls.lingLiao.getByRawTypeCodeAndBatchNumberLikeByPage,{
                                    rawTypeCode:rawType,
                                    batchNumber:batch_Number,
                                    page:obj.curr - 1,
                                    size:obj.limit
                                }, function(obj,first){
                                    var items = result.data.content
                                    const $tbody = $("#edit_add_modal_table").children('tbody')
                                    pro_out_manage.funcs.edit_add_renderHandler($tbody,items)
                                    pro_out_manage.pageSize = result.data.length
                                })
                            }
                        }
                    })
                })
            })
        }
        ,edit_add_renderHandler:function($tbody,items){
            $tbody.empty() //清空表格
            if(items!=null){
                var judgeCode
                items.forEach(function(e){
                    if(e.judgeCode===1){
                        judgeCode = '已入库'
                    }else{
                        judgeCode = '未入库'
                    }
                    $tbody.append(
                        "<tr>" +
                        "<td><input type='checkbox' class='edit_add_checkbox' value='" + (e.batchNumber) + "'></td>" +
                        "<td>" + (e.batchNumber ? e.batchNumber : '') + "</td>" +
                        "<td>" + (e.currentAvailableMaterials ? e.currentAvailableMaterials : '0') + "</td>" +
                        "<td>" + (e.materialsUnit?e.materialsUnit:'kg') + "</td>" +
                        "<td>" + (judgeCode ) + "</td>" +
                        "<td><a href=\"#\" class='edit_add_search_detail' id='detail-" + (e.batchNumber) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                        "</tr>"
                    )
                })
            }
             //详情
             var edit_add_search_detailBtn = $(".edit_add_search_detail")
             pro_out_manage.funcs.edit_add_search_detail(edit_add_search_detailBtn)
             //实现全选
             var checkBoxLen = $(".edit_add_checkbox:checked").length
             home.funcs.bindSelectAll($("#edit_add_checkAll"),$(".edit_add_checkbox"),checkBoxLen,$("#edit_add_modal_table"))
        }
        /**删除对应记录 */
        , In: function (deleteBtns) {
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
                        var Code = _this.attr('id').substr(7)
                        $.post(home.urls.productOut.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    pro_out_manage.init()
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
        },

        /** 批量删除事件 */
         bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.product_out_checkbox:checked').length === 0) {
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
                            var productOutCodes = []
                            $('.product_out_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    productOutCodes.push({code: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.productOut.deleteByCodeBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(productOutCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            pro_out_manage.init()
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
        /**根据batchNumber删除记录 */
        ,bindEditDeleteClick:function(deleteBtns){
            deleteBtns.off('click').on('click',function() {
                if($('.edit_checkbox:checked').length === 0){
                    layer.msg("您还没选中任何数据！",{
                        offset:['40%','55%'],
                        time:700
                    })
                } else{
                    layer.open({
                        type:1,
                        title:'批量删除',
                        content:"<h5 style='text-align:center;padding-top:8px;'>确定要删除所有记录吗？</h5>",
                        area:['190px','130px'],
                        btn:['确认','取消'],
                        offset:['40%','55%'],
                        yes:function(index){
                            var productOut_batchNumber = []
                            $('.edit_checked').each(function(){
                                if($(this).prop('checked')) {
                                    productOut_batchNumber.push({batchNumber:$(this).val()})
                                }
                            })
                            $.ajax({
                                url:home.urls.productOut.deleteByCodeBatch(),
                                contentType:'application/json',
                                data:JSON.stringify(productOut_batchNumber),
                                dataType:'json',
                                type:'post',
                                sucess:function(result) {
                                    if(result.code === 0) {
                                        var time = setTimeout(function(){
                                            pro_out_manage.init()
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
                        },
                        btn2:function(index){
                            layer.close(index)
                        }
                    })
                }
            }) 
        }
        /** 刷新事件 */
        ,bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                //$('#transportWays').val('');
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    pro_out_manage.init()
                    $("#date").val('')
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
         //追加审核状态搜索事件
        bindStatusSearchEventListener: function (searchBtn) {
            searchBtn.off('change')
            searchBtn.on('change', function () {
                var audit_status = $('#audit_status option:selected').val();
                $.post(home.urls.productOut.getByAuditStatusByPage(), {
                    auditStatus: audit_status,
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#product_out_table").children('tbody')
                    pro_out_manage.funcs.renderHandler($tbody, items,0)
                    layui.laypage.render({
                        elem: 'product_out_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productOut.getByAuditStatusByPage(), {
                                    auditStatus: audit_status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    var page = obj.curr - 1
                                    const $tbody = $("#product_out_table").children('tbody')
                                    pro_out_manage.funcs.renderHandler($tbody, items,page)
                                    pro_out_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
        //根据时间搜索
        /* ,bindDateSearchEventListener: function (searchBtn) {
            searchBtn.off('change').on('change', function () {
                console.log(11)
                var order_date = $('#order_date').val();
                var createDate = new Date(order_date).getTime()
                $.post(home.urls.productOut.getByCreateDateByPage(), {
                    createDate:createDate
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#product_out_table").children('tbody')
                    pro_out_manage.funcs.renderHandler($tbody, items,0)
                    layui.laypage.render({
                        elem: 'product_out_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productOut.getByCreateDateByPage(), {
                                    createDate:createDate,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    var page = obj.curr - 1
                                    const $tbody = $("#product_out_table").children('tbody')
                                    pro_out_manage.funcs.renderHandler($tbody, items,page)
                                    pro_out_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }*/
        /** 根据物料名称搜索 */
        ,bindRawTypeSearchEventListener: function (searchBtn) {
            searchBtn.off('change')
            searchBtn.on('change', function () {
                var rawType_Code = $('#rawType_Code option:selected').val();
                $.post(home.urls.productOut.getByRawTypeByPage(), {
                    rawTypeCode: rawType_Code,
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#product_out_table").children('tbody')
                    pro_out_manage.funcs.renderHandler($tbody, items,0)
                    layui.laypage.render({
                        elem: 'product_out_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productOut.getByRawTypeByPage(), {
                                    rawTypeCode: rawType_Code,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    var page = obj.curr - 1
                                    const $tbody = $("#product_out_table").children('tbody')
                                    pro_out_manage.funcs.renderHandler($tbody, items,page)
                                    pro_out_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
         /** 搜索事件 */
        ,bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var audit_status = $('#audit_status option:selected').val();
                var order_date = $('#order_date').val();
                var rawType_Code = $('#rawType_Code option:selected').val();
                var createDate = new Date(order_date).getTime()
                //var createDate =order_date.getTime;//毫秒级; // date类型转成long类型 
    
                $.post(home.urls.productOut.getByAuditStatusAndRawTypeAndCreateDateByPage(), {
                    auditStatus: audit_status,
                    rawTypeCode: rawType_Code,
                    createDate:createDate?createDate:'-1'
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#product_out_table").children('tbody')
                    pro_out_manage.funcs.renderHandler($tbody, items,0)
                    layui.laypage.render({
                        elem: 'product_out_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productOut.getByAuditStatusAndRawTypeAndCreateDateByPage(), {
                                    auditStatus: audit_status,
                                    rawTypeCode: rawType_Code,
                                    createDate:order_date,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    var page = obj.curr - 1
                                    const $tbody = $("#product_out_table").children('tbody')
                                    pro_out_manage.funcs.renderHandler($tbody, items,page)
                                    pro_out_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
        ,bindInDeleteClick:function(deleteBtns){
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                if ($('.delete_checkbox:checked').length === 0) {
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
                            $('.delete_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    console.log($(this).val())
                                    $(this).parent('td').parent('tr').remove();
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
    }
}