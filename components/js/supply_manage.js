var supply_manage = {
    suppliers:[],
    init: function () {
        /** 获取供应商信息分页显示并展示 */
        supply_manage.funcs.renderTable()
        supply_manage.funcs.renderSelect()
        $.post(home.urls.supplyman.getCustomer(),{code:10},function(result){
            supply_manage.suppliers = result.data
        })
        //将分页居中
        var out = $('#supplyman_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#supplyman_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    }
    , pageSize: 0
    , funcs: {
        renderTable: function () {
            userStr = $.session.get('user')
            userJson = JSON.parse(userStr)
            supplierCode = userJson.supplier?userJson.supplier.code:null
            //console.log(userJson)
            if(supplierCode===null){
                $.post(home.urls.supplyman.getBySupplierTypeByPage(), {code:1}, function (res) {
                    var $tbody = $("#supplier_table").children('tbody')
                    /** 过滤返回的数据 */
                    var items = res.data.content
                    //console.log(items)
                    supply_manage.funcs.renderHandler($tbody, items)
                    /** 渲染表格结束之后 */
                    supply_manage.pageSize = res.data.content.length //该页的记录数
                    var page = res.data //分页json
                    /** 分页信息 */
                    layui.laypage.render({
                        elem: 'supplyman_page',
                        count: 10 * page.totalPages,//数据总数
                        /** 页面变化后的逻辑 */
                        jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.supplyman.getBySupplierTypeByPage(), {
                                    code:1,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    const $tbody = $("#supplyman_page").children('tbody')
                                    supply_manage.funcs.renderHandler($tbody, items)
                                    supply_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            $("#fr").show()
            $("#fl").hide()
            /** 刷新*/
            var refreshBtn = $('#model-li-hide-refresh-80')
            supply_manage.funcs.bindRefreshEventLisener(refreshBtn)
            /** 搜索*/
            var searchBtn = $('#model-li-hide-search-80')
            supply_manage.funcs.bindSearchEventListener(searchBtn)
            }
            else{
                $.post(home.urls.supplyman.getAllBySupplier(), {supplierCode:supplierCode}, function (res) {
                    var $tbody = $("#supplier_table").children('tbody')
                    /** 过滤返回的数据 */
                    var items = res.data.content
                    //console.log(items)
                    supply_manage.funcs.renderHandler($tbody, items)
                    /** 渲染表格结束之后 */
                    supply_manage.pageSize = res.data.content.length //该页的记录数
                    var page = res.data //分页json
                    /** 分页信息 */
                    layui.laypage.render({
                        elem: 'supplyman_page',
                        count: 10 * page.totalPages,//数据总数
                        /** 页面变化后的逻辑 */
                        jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.supplyman.getAllBySupplier(),{
                                    supplierCode:supplierCode,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    const $tbody = $("#supplyman_page").children('tbody')
                                    supply_manage.funcs.renderHandler($tbody, items)
                                    supply_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            $("#fl").show()
            $("#fr").hide()
            /** 新增*/
            var addBtn = $("#model-li-hide-add-80")
            supply_manage.funcs.bindAddEventListener(addBtn) 
            /** 批量删除*/
            var deleteBatchBtn = $('#model-li-hide-delete-80')
            supply_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            }
          
            
           
        }
        , renderHandler: function ($tbody, supplymans) {
            $tbody.empty() //清空表格
            supplymans.forEach(function (e) {
                //var dt = new Date(e.header.supplyTime).Format("yyyy-MM-dd") 
                var status
                switch(e.status){
                    case 0:
                        status = '待发货'
                        break
                    case 1:
                        status = '已发货'
                        break
                    case 2:
                        status = '已收货'
                        break
                }
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='sup_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.contractNumber) + "</td>" +
                    "<td>" + (e.sender?e.sender.name:' ') + "</td>" +
                    "<td>" + (e.sendDate) + "</td>" +
                    "<td>" + (e.contact) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.weight) + "</td>" +
                    "<td>" + (status) + "</td>" +
                    "<td><a href='#' class='detailSupplyman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe63c;</i></a></td>" +
                    "<td><a href='#' class='editSupplyman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteSupplyman' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })
            var editBtns = $('.editSupplyman')
            var deleteBtns = $('.deleteSupplyman')
            var detailBtns = $('.detailSupplyman')
            /** 详情事件*/
            supply_manage.funcs.bindDetailEventListener(detailBtns)
            /** 删除事件*/
            supply_manage.funcs.bindDeleteEventListener(deleteBtns)
            /** 编辑事件*/
            supply_manage.funcs.bindEditEventListener(editBtns)

            var checkedBoxLen = $('.sup_checkbox:checked').length
            home.funcs.bindSelectAll($("#sup_checkAll"), $('.sup_checkbox'), checkedBoxLen, $("#supplier_table"))
            
            supply_manage.funcs.add_edit($(".editor"))
            supply_manage.funcs.add_delete($(".delete"))
        }

        ,renderSelect:function(){
            supply_manage.suppliers = []
            $.get(home.urls.supplyman.getAllSupplier(),{ },function(result){ 
                var res = result.data
                $("#supplyman_name_select").html("<option value='-1'>请选择公司名称</option>")
                res.forEach(function(e){
                    $("#supplyman_name_select").append(
                        "<option value="+e.code+">"+e.name+"</option>"
                    )
                })
            })
        }
        /**新增*/
        , bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                /** 新增默认输入框为空*/
                $('#diliverer_inp').empty()
                $('#diliverer_inp').html("<option>请选择送货人名称</option>")
                supply_manage.suppliers.forEach(function(e){
                        $('#diliverer_inp').append(
                        "<option value="+(e.code)+">"+e.name+"</option>"
                    )
                    })     
                $('#header_inp').val('')
                $('#dilivery_time_inp').val('')
                //$('#diliverer_inp').val('')
                $('#contact_inp').val('')
                $('#total_inp').val(0)
                $('#name_inp').val('')
                $tbody = $("#provider_body_downtable").children('tbody')
                $tbody.empty()
                //supply_manage.funcs.fill_add_data("#provider_info")
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $('#provider_info'),
                    area: ['700px', '350px'],
                    btn: ['确认', '取消'],
                    offset: ['20%', '28%'],
                    closeBtn : 0,
                    yes: function (index) {
                        var total_weight = 0.00
                            var sendEntries =[]
                            $("#provider_body_downtable").children('tbody').find("tr").each(function(){  
                                var e = $(this).children();  
                                total_weight += parseFloat(e.eq(2).text()).toFixed(2)
                                sendEntries.push({
                                    batchNumber:e.eq(0).text(),
                                    unit:e.eq(1).text(),
                                    weight:e.eq(2).text()  
                                })
                            }); 
                            //console.log(e.eq(2).text())
                            var supplier
                            supply_manage.suppliers.forEach(function(e){
                               if($('#diliverer_inp').val()===e.code){
                                   supplier = e.supplier.code
                               }
                            })  
                             console.log(supplier)
                            time = new Date($('#dilivery_time_inp').val()).getTime()
                            var data = {
                                contractNumber:$('#header_inp').val(),
                                supplier:{code:supplier},
                                sender:{code : $('#diliverer_inp').val()},
                                sendDate:time,
                                contact:$('#contact_inp').val(),
                                name:$('#name_inp').val(),
                                weight:total_weight.toFixed(2),
                                //rawType:{code : res.rawType.code},
                                status:0,
                                sendEntries:[]
                            }
                            data.sendEntries = sendEntries
                           // console.log(data)   
                            $.ajax({
                                url: home.urls.supplyman.add(),
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            supply_manage.init()
                                            clearTimeout(time)
                                        }, 500)
                                    }
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                    layer.close(index)
                                    $("#provider_info").css('display', 'none')
                                }
                        })
                        layer.close(index)
                        $("#provider_info").css('display', 'none')
                    },
                    btn2: function (index) {
                        layer.close(index)
                        $("#provider_info").css('display', 'none')
                    }
                })   
            })
            var add_addBtn = $("#add_addBtn")
            supply_manage.funcs.bindAddClick(add_addBtn)
        }
       
        ,bindAddClick:function(addBtn){
            addBtn.off('click').on('click',function(){
                $('#add_batchNumber').val(' ')
                $('#add_unit').val(' ')
                $('#add_weight').val(' ')  
                layer.open({
                    type:1,
                    title:'新增',
                    content:$('#provider_info_add'),
                    area:['330px','270px'],
                    btn:['确定','取消'],
                    offset:"auto",
                    closeBtn:0,
                    yes:function(index){
                        var total_weight = parseFloat($('#total_inp').val())
                        batchNumber = $('#add_batchNumber').val()
                        unit = $('#add_unit').val()
                        weight = $('#add_weight').val()    
                        $tbody = $("#provider_body_downtable").children('tbody')
                        $tbody.append(
                            "<tr>"+
                            "<td>"+batchNumber+"</td><td>"+unit+"</td><td>"+weight+"</td>"+
                            "<td><a href='#' class='editor' id='editor-" + (batchNumber) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                            "<td><a href='#' class='delete' id='delete-" + (batchNumber) + "'><i class='fa fa-times-circle-o'></a></td>" +
                            "</tr>"
                        )
                        total_weight += parseFloat(weight)
                        $('#total_inp').val(total_weight.toFixed(2))
                        supply_manage.funcs.add_edit($(".editor"))
                        supply_manage.funcs.add_delete($(".delete"))
                        $("#provider_info_add").css('display','none')
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#provider_info_add").css('display','none')
                        layer.close(index)
                    }
                })
            })
        }
        ,add_edit:function(editBtns){
            editBtns.off('click').on('click',function(){
                var e = $(this).parent('td').parent('tr').children('td')
                $('#add_batchNumber').val(e.eq(0).text()) 
                $('#add_unit').val(e.eq(1).text())  
                $('#add_weight').val(e.eq(2).text()) 
                var total_weight = parseFloat($('#total_inp').val()) - parseFloat($('#add_weight').val() )
                layer.open({
                    type:1,
                    title:'编辑',
                    content:$('#provider_info_add'),
                    area:['300px','250px'],
                    btn:['确定','取消'],
                    offset:"auto",
                    closeBtn:0,
                    yes:function(index){
                        batchNumber = $('#add_batchNumber').val()
                        unit = $('#add_unit').val()
                        weight = $('#add_weight').val()    
                        e.eq(0).text(batchNumber) 
                        e.eq(1).text(unit) 
                        e.eq(2).text(weight) 
                        total_weight += parseFloat($('#add_weight').val())
                        $('#total_inp').val(total_weight.toFixed(2))
                        $("#provider_info_add").css('display','none')
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#provider_info_add").css('display','none')
                        layer.close(index)
                    }
                })
                
            })
        }
        ,add_delete:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                //console.log('add_delete')
                var _this = $(this)
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录吗?</h5>",
                    area: ['190px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        var total_weight = parseFloat($('#total_inp').val())
                        //console.log(total_weight)
                        var td2 = _this.parent('td').parent('tr').children('td').eq(2).text()
                        //console.log(parseFloat(td2))
                        total_weight -= parseFloat(td2)
                        parseFloat(td2)
                        $('#total_inp').val(total_weight.toFixed(2))
                        _this.parent('td').parent('tr').remove()   
                        layer.close(index)
                    }
                    ,btn2: function (index) {
                        layer.close(index)
                    }
            })
        })
    }
        /**删除 */
        , bindDeleteEventListener: function (deleteBtns) {
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
                        var supplymanCode = _this.attr('id').substr(3)
                        $.post(home.urls.supplyman.deleteByCode(), {code: supplymanCode}, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    supply_manage.init()
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
        /** 搜索*/
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var supply_code = $('#supplyman_name_select').val()
                $.post(home.urls.supplyman.getBySupplierCodeByPage(), {supplierCode: supply_code}, function (result) {
                    res = result.data.content
                    page = result.data
                    const $tbody = $("#supplier_table").children('tbody')
                    supply_manage.funcs.renderHandler($tbody, res)
                    layui.laypage.render({
                        elem: 'supplyman_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.supplyman.getBySupplierCodeByPage(), {
                                    headCode: supply_code,
                                }, function (result) {
                                    //var page = []
                                    //page.push(result.data) //获取数据
                                    res = result.data.content
                                    const $tbody = $("#supplier_table").children('tbody')
                                    supply_manage.funcs.renderHandler($tbody, res)
                                    supply_manage.pageSize = result.data.length
                                })
                            }
                        }
                    })
                })
            })
        } 

        /** 刷新*/
        , bindRefreshEventLisener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    supply_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        }
       
        /**批量删除 */
        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.sup_checkbox:checked').length === 0) {
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
                            var supplymanCodes = []
                            $('.sup_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    supplymanCodes.push({code: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.supplyman.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(supplymanCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            supply_manage.init()
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
        /** 编辑*/
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var supplymanCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.supplyman.getByCode(), {code: supplymanCode}, function (result) {
                    res = result.data
                   // console.log(res)
                    supply_manage.funcs.fill_edit_data($("#provider_info"),res)
                    /**初始化新增框*/
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $('#provider_info'),
                        area: ['700px', '350px'],
                        btn: ['确认', '取消'],
                        offset: ['20%', '28%'],
                        closeBtn : 0,
                        yes: function (index) {
                            var total_weight = 0
                            var sendEntries =[]
                            $("#provider_body_downtable").children('tbody').find("tr").each(function(){  
                                var e = $(this).children();  
                                total_weight += parseFloat(e.eq(2).text())
                                sendEntries.push({
                                    batchNumber:e.eq(0).text(),
                                    unit:e.eq(1).text(),
                                    weight:e.eq(2).text()  
                                })
                            });  
                        
                            time = $('#dilivery_time_inp').val()
                            var data = {
                                code:res.code,
                                contractNumber:$('#header_inp').val(),
                                supplier:{code:res.supplier.code},
                                sender:{code : res.sender.code},
                                sendDate:new Date(time).getTime(),
                                contact:$('#contact_inp').val(),
                                name:$('#name_inp').val(),
                                weight:total_weight,
                                //rawType:{code : res.rawType?res.rawType.code:null},
                                status:res.status,
                                sendEntries:[]
                            }
                            data.sendEntries = sendEntries
                            //console.log(data)
                            $.ajax({
                                url: home.urls.supplyman.update(),
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            supply_manage.init()
                                            clearTimeout(time)
                                        }, 500)
                                    }
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                    layer.close(index)
                                    $("#provider_info").css('display', 'none')
                                }
                           })
                            layer.close(index)
                            $("#provider_info").css('display', 'none')
                               
                        },
                        btn2: function (index) {
                            layer.close(index)
                            $("#provider_info").css('display', 'none')
                        }
                    })
                })

            })
        }
        ,fill_edit_data:function(div,res){
            var total_weight = 0
            sendEntries = res.sendEntries
            $tbody = $("#provider_body_downtable").children('tbody')
            $tbody.empty()
            sendEntries.forEach(function(e){
                total_weight += parseFloat(e.weight)
                $tbody.append(
                    "<tr>"+
                    "<td>"+e.batchNumber+"</td><td>"+e.unit+"</td><td>"+e.weight+"</td>"+
                    "<td><a href=\"#\" class='editor' id='editor-" + (e.batchNumber) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (e.batchNumber) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
            })

            $('#header_inp').val(res.contractNumber)
            $('#dilivery_time_inp').val(res.sendDate)
            $('#contact_inp').val(res.contact)
            $('#name_inp').val(res.name)
            $('#total_inp').val(total_weight)
            $.post(home.urls.supplyman.getCustomer(),{code:supplierCode},function(result){
                var items = result.data
                $("#diliverer_inp").empty()
                $("#diliverer_inp").append("<option value='" + res.sender.code+ "'>" + res.sender.name + "</option>")
                items.forEach(function(e){
                    if(e.name!=res.sender.name){
                        $('#diliverer_inp').append(
                    "<option value="+e.code+">"+e.name+"</option>"
                )
                    }
                    
                })     
            })

            supply_manage.funcs.add_edit($(".editor"))
            supply_manage.funcs.add_delete($(".delete"))
        }

        /** 详情*/
        , bindDetailEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var supplymanCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.supplyman.getByCode(), {code: supplymanCode}, function (result) {
                    var res = result.data
                   // var dt = new Date(page.header.supplyTime).Format("yyyy-MM-dd")
                    supply_manage.funcs.fill_detail_data($("#provider_info1"),res)
                    layer.open({
                        type: 1,
                        title: '详情',
                        content: $('#provider_info1'),
                        area: ['700px', '350px'],
                        btn: ['返回'],
                        offset: ['20%', '28%'],
                        closeBtn : 0,
                        yes: function (index) {
                            layer.close(index)
                            $("#provider_info1").css('display', 'none')
                        },
                    })
                })
            })
        }
        ,fill_detail_data:function(div,res){
            var total_weight = 0
            sendEntries = res.sendEntries
            $tbody = $("#provider_body_downtable1").children('tbody')
            $tbody.empty()
            sendEntries.forEach(function(e){
                total_weight += parseFloat(e.weight)
                $tbody.append(
                    "<tr>"+
                    "<td>"+e.batchNumber+"</td><td>"+e.unit+"</td><td>"+e.weight+"</td>"+
                    "</tr>"
                )
            })
            $('#header_inp1').text(res.contractNumber)
            $('#diliverer_inp1').text(res.sender?res.sender.name:' ')
            $('#dilivery_time_inp1').text(res.sendDate)
            $('#contact_inp1').text(res.contact)
            $('#name').text(res.name)
            $('#total_inp1').text(total_weight)

        }
    }
}