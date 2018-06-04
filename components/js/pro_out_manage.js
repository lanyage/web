var pro_out_manage = {
    pageSize: null,
    init: function () {

        /** 渲染下拉菜单 */
        pro_out_manage.funcs.renderTable()
        pro_out_manage.funcs.bindCreatoption()

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
            $.get(home.urls.productOut.getAllrawType(), {}, function (result) {
                var items = result.data
                $("#rawType_Code").html("<option>请选择产品型号</option>")
                items.forEach(function (e) {
                    $("#rawType_Code").append(
                        "<option value=" + e.code + ">" + e.code + "</option>"
                    )
                })
            })
        },
        renderTable: function () {
            console.log(11111)
            $.post(home.urls.productOut.getAllByPage(), {}, function (res) {

                var $tbody = $("#product_out_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                //console.log(items)
                pro_out_manage.funcs.renderHandler($tbody, items)
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
                                const $tbody = $("#product_out_page").children('tbody')
                                pro_out_manage.funcs.renderHandler($tbody, items)
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

            //新增里面以及编辑里面的删除按钮
            pro_out_manage.funcs.bindInDeleteClick($(".delete_roundBtn"))

        }

        /**渲染表格 */
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='product_out_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.rawType ? e.rawType.code : null) + "</td>" +
                    "<td>" + (new Date(e.applyTime).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.processManage ? e.processManage.code : null) + "</td>" +
                    "<td>" + e.auditStatus + "</td>" +
                    "<td><a href=\"#\" class='verify'id='verify-" + (code) + "'><i class=\"layui-icon\">&#xe6b2;</i></a></td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
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
                // 而且要填充模态框里面的内容 todo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    xccccc                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            c 
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#add_modal"),
                    area: ['800px', '400px'],
                    btn: ['提交', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#add_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })

            var add_addBtn = $('#add_addBtn')
            pro_out_manage.funcs.bindAddClick1(add_addBtn)


        }
        /**新增里面的新增 */
        , bindAddClick1: function (add_addBtn) {
            add_addBtn.off('click')
            add_addBtn.on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo  
                // pro_out_manage.funcs.fill_add_data("#add_modal")
                layer.open({
                    type: 1,
                    title: '查询',
                    content: $("#edit_add_modal"),
                    area: ['800px', '400px'],
                    btn: ['确定', '取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#edit_add_modal").css('display', 'none')

                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#edit_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })

        }
        /**审核 */
        , bindVerifyClick: function (verifyBtns) {
            verifyBtns.off('click')
            verifyBtns.on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOut.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data
                    pro_out_manage.funcs.fill_verify_data($("#verify_modal"), items, codeNumber)
                })
                layer.open({
                    type: 1,
                    title: '审核',
                    content: $("#verify_modal"),
                    area: ['800px', '400px'],
                    btn: ['通过', '不通过'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        /**更新产品出库审批 */
                        var auditStatus = $("#code1").text()
                        var note = $("#verify_note").text()
                        var code = codeNumber
                        var audit_Code = $("#audit_Name").text()
                        $.post(home.urls.productOut.updateAuditStatusByCode(), {
                            auditStatus: auditStatus,
                            note: note,
                            code: code,
                            auditCode: audit_Code
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
                        })
                        $("#verify_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#verify_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        /**审核界面读取数据 */
        , fill_verify_data: function (div, items, codeNumber) {
            $("#code1").text(items.code)
            $("#rawType1").text(items.rawType ? items.rawType.code : 'null')
            $("#department1").text(items.department ? items.department.name : 'null')
            $("#weight1").text((items.weight ? items.weight : 'null'))
            $("#sender1").text(items.sender ? items.sender.name : 'null')
            $("#applicant1").text(items.applicant ? items.applicant.name : 'null')
            $("#sendTime1").text(new Date(items.sendTime).Format('yyyy-MM-dd'))
            $("#applyTime1").text(new Date(items.applyTime).Format('yyyy-MM-dd'))

            productSends = items.productSends
            var $tbody = $("#verify_table").children('tbody')
            $tbody.empty() //清空表格
            productSends.forEach(function (e) {
                $tbody.append(
                    "<tr>" +
                    "<td>" + (e.code ? e.code : 'null') + "</td><td>" + (e.batchNumber ? e.batchNumber : 'null') + "</td>" +
                    "<td>" + (e.unit ? e.unit : 'null') + "</td>" + "<td>" + (e.weight ? e.weight : 'null') + "</td><td>" + (e.status ? e.status : 'null') + "</td>" +
                    "</tr>"
                );
            })

            $.post(home.urls.productOut.getByProductSendHeader(), {
                productSendHeaderCode: codeNumber
            }, function (result) {
                res = result.data
                console.log(res)
                $("#audit_Name").text(res.auditor ? res.auditor : 'null')
                $("#audit_result").text(res.auditResult ? res.auditResult : 'null')
                $("#audit_time").text(new Date(items.auditTime).Format('yyyy-MM-dd'))
                $("#audit_note").text((res.note ? res.note : 'null'))

            })


        }

        /**详情 */
        , bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOut.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data //获取数据
                    //console.log(items)
                    pro_out_manage.funcs.fill_detail_data($("#detail_modal"), items, codeNumber)
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
        fill_detail_data: function (div, items, codeNumber) {
            $("#code").text(items.code)
            $("#rawType").text(items.rawType ? items.rawType.code : 'null')
            $("#department").text(items.department ? items.department.name : 'null')
            $("#weight").text((items.weight ? items.weight : 'null'))
            $("#sender").text(items.sender ? items.sender.name : 'null')
            $("#applicant").text(items.applicant ? items.applicant.name : 'null')
            $("#sendTime").text(new Date(items.sendTime).Format('yyyy-MM-dd'))
            $("#applyTime").text(new Date(items.applyTime).Format('yyyy-MM-dd'))

            /**$("#detail_modal1").append(
             "<tr>"+
             "<td>"+items.code +"</td><td>"+ (items.rawType?items.rawType.code:'null')+"</td>"+
             "</tr>"+
             "<tr>"+
             "<td>"+(items.department?items.department.name:'null')+"</td><td>"+ (items.weight?items.weight:'null')+"</td>"+
             "</tr>"+
             "<tr>"+
             "<td>"+(items.sender?items.sender.name:'null') +"</td><td>"+ (items.applicant?items.applicant.name:'null')+"</td>"+
             "</tr>"+
             "<tr>"+
             "<td>"+items.sendTime +"</td><td>"+ items.applyTime+"</td>"+
             "</tr>"
             )*/
            productSends = items.productSends
            var $tbody = $("#detail_modal2").children('tbody')
            $tbody.empty() //清空表格
            productSends.forEach(function (e) {
                $tbody.append(
                    "<tr>" +
                    "<td>" + (e.code ? e.code : 'null') + "</td><td>" + (e.batchNumber ? e.batchNumber : 'null') + "</td>" +
                    "<td>" + (e.unit ? e.unit : 'null') + "</td>" + "<td>" + (e.weight ? e.weight : 'null') + "</td><td>" + (e.status ? e.status : 'null') + "</td>" +
                    "</tr>"
                );
            })
            console.log(codeNumber)

            $.post(home.urls.productOut.getByProductSendHeader(), {
                productSendHeaderCode: codeNumber
            }, function (result) {
                res = result.data
                console.log(res)
                $("#audit_Name").text(res.auditor ? res.auditor : 'null')
                $("#audit_result").text(res.auditResult ? res.auditResult : 'null')
                $("#audit_time").text(new Date(items.auditTime).Format('yyyy-MM-dd'))
                $("#audit_note").text((res.note ? res.note : 'null'))

            })
        }


        /**编辑 */
        , bindEditorClick: function (editBtns) {
            editBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOut.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data //获取数据
                    console.log('编辑')

                    pro_out_manage.funcs.fill_edit_data($("#editor_modal"), items)
                })
                layer.open({
                    type: 1,
                    title: '编辑',
                    content: $("#editor_modal"),
                    area: ['800px', '400px'],
                    btn: ['保存', '提交', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn3: function (index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
            var edit_addBtn = $("#edit_addBtn")
            pro_out_manage.funcs.bindEditAddClick(edit_addBtn)

            var edit_deleteBtn = $("#delete_addBtn")
            // pro_out_manage.funcs.bindEditDeleteClick(edit_deleteBtn)


        },
        /**编辑里面的增加按钮 */
        bindEditAddClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                pro_out_manage.funcs.fillData_to_edit_add("#edit_add_modal")
                layer.open({
                    type: 1,
                    title: '详情',
                    content: $("#edit_add_modal"),
                    area: ['800px', '400px'],
                    btn: ['确认', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#edit_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#edit_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                })
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
            home.funcs.bindSelectAll($("#edit_add_checkAll"), $(".edit_add_checkbox"), checkBoxLen, $("#edit_add_modal_table"))

        }

        , fill_edit_data: function (div, items) {
            $("#out_code").text(items.sender ? items.sender.code : 'null')
            $("#apply_time").text(new Date(items.applyTime).Format('yyyy-MM-dd'))
            $("#in_time").text(new Date(items.sendTime).Format('yyyy-MM-dd'))

            $.get(home.urls.productOut.getAllrawType(), {}, function (result) {
                var items = result.data
                $("#editor_select_rawType").html("<option>请选择产品型号</option>")
                items.forEach(function (e) {
                    $("#editor_select_rawType").append(
                        "<option value=" + e.code + ">" + e.code + "</option>"
                    )
                })
            })

            $.get(home.urls.check.getAll(), {}, function (result) {
                var value = result.data
                var length = value.length
                $("#editor_select_processCode").html("<option>请选择流程类型</option>")
                for (var i = 0; i < length; i++) {
                    var text = value[i].name
                    $("#editor_select_processCode").append("<option id='" + value[i].code + "' value='" + value[i].code + "'>" + text + "</option>");
                }
            })

            var productSends = items.productSends
            console.log(productSends)
            var $tbody = $("#editor_table2").children('tbody')
            $tbody.empty() //清空表格
            productSends.forEach(function (e) {
                console.log(e)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='delete_checkbox' /></td>" +
                    "<td>" + (e.code ? e.code : 'null') + "</td><td>" + (e.batchNumber ? e.batchNumber : 'null') + "</td>" +
                    "<td>" + (e.unit ? e.unit : 'null') + "</td>" + "<td>" + (e.weight ? e.weight : 'null') + "</td><td>" + (e.status ? e.status : 'null') + "</td>" +
                    "</tr>"
                );
            })

            //编辑按钮全选
            var checkedBoxLen = $('.delete_checkbox:checked').length
            home.funcs.bindSelectAll($("#edit_checkAll"), $('.delete_checkbox'), checkedBoxLen, $("#editor_table2"))

        }
        //编辑里面的新增按钮对于的界面
        , fillData_to_edit_add: function (div) {
            $.get(home.urls.productOut.getAllrawType(), {}, function (result) {
                var items = result.data
                $("#edit_add_select").html("<option>请选择原料类型</option>")
                items.forEach(function (e) {
                    $("#edit_add_select").append(
                        "<option value=" + e.code + ">" + e.name + "</option>"
                    )
                })
            })


        }
        , edit_add_search_detail: function (detailBtns) {
            detailBtns.off('click')
            detailBtns.on('click', function () {
                console.log(1111)
                var _selfBtn = $(this)
                var Code = _selfBtn.attr('id').substr(7)
                var currId = $('#edit_add_select option:selected').val()

                $.post(currId === 1 ? home.urls.rawPresoma.getByCode() : home.urls.rawLithium.getByCode(), {code: Code}, function (result) {
                    console.log(currId)
                    console.log("查看" + Code)
                    var items = result.data
                    layer.open({
                        type: 1,
                        content: pro_out_manage.funcs.getData(items),
                        area: ['550px', '700px'],
                        btn: ['关闭'],
                        offset: 'auto',   // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function (index) {
                            layer.close(index);
                        }
                    })
                })
            })
        },
        getData: function (items) {
            var currId = $('#edit_add_select option:selected').val()
            var data =
                "<div id='auditModal'>" +
                "<div class='arrow_div_left'>" +
                "<span id='model-li-hide-left-113'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe603;</i></a></span>" +
                "</div>" +
                "<div class='arrow_div_right'>" +
                "<span id='model-li-hide-right-113'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe602;</i></a></span>" +
                "</div>";
            if (currId === 2) {
                data += pro_out_manage.funcs.getTableLithium(items);
                console.log(currId)
                console.log('Lithium')
            }
            else {
                data += pro_out_manage.funcs.getTablePresoma(items);
                console.log('Presoma')
            }
            return data;
        }

        , getTablePresoma: function (presoma) {
            return (
                "<div id='div_table' class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr> <td colspan='2'>批号</td> <td>检测日期</td> <td>数量(t)</td> <td>判定</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + presoma.batchNumber + "</td> <td>" + (new Date(presoma.testDate).Format('yyyy-MM-dd')) + "</td> <td>" + presoma.number + "</td> <td>" + (presoma.judge ? presoma.judge.name : '无') + "</td></tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td></tr>" +
                "</thead>" +
                "<tr> <td colspan='2'>" + presoma.status.name + "</td> <td>" + (presoma.publisher ? presoma.publisher : '无') + "</td> <td></td> <td></td></tr>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td> <td>控制采购标准-2016-11-21</td> <td>2017.07.01采购标准</td> <td>" + presoma.batchNumber + "</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>振实密度(g/cm3)</td> <td>&ge;2.0</td> <td></td> <td>" + presoma.c1 + "</td></tr>" +
                "<tr> <td colspan='2'>水分(ppm)</td> <td>&le;1.0</td> <td></td> <td>" + presoma.c2 + "</td></tr>" +
                "<tr> <td colspan='2'>SSA(m2/g)</td> <td>4.0~7.0</td> <td></td> <td>" + presoma.c3 + "</td></tr>" +
                "<tr> <td colspan='2'>pH值</td> <td>7.0~9.0</td> <td></td> <td>" + presoma.c4 + "</td></tr>" +
                "<tr> <td rowspan='5'>粒度(&mu;m)</td> <td>&ge;2.5</td> <td></td> <td></td> <td>" + presoma.c5 + "</td></tr>" +
                "<tr> <td>D10</td> <td>&ge;5.0</td> <td></td> <td>" + presoma.c6 + "</td></tr>" +
                "<tr> <td>D50</td> <td>9.8~10.5</td> <td></td> <td>" + presoma.c7 + "</td></tr>" +
                "<tr> <td>D90</td> <td>&le;22</td> <td></td> <td>" + presoma.c8 + "</td></tr>" +
                "<tr> <td>D99</td> <td>&le;35</td> <td></td> <td>" + presoma.c9 + "</td></tr>" +
                "<tr> <td colspan='2'>筛上物</td> <td>&le;0.3</td> <td></td> <td>" + presoma.c10 + "</td></tr>" +
                "<tr> <td rowspan='5'>磁性物质检测(ppb)</td> <td>Fe</td> <td></td> <td></td> <td>" + presoma.c11 + "</td></tr>" +
                "<tr> <td>Ni</td> <td></td> <td></td> <td>" + presoma.c12 + "</td></tr>" +
                "<tr> <td>Cr</td> <td></td> <td></td> <td>" + presoma.c13 + "</td></tr>" +
                "<tr> <td>Zn</td> <td></td> <td></td> <td>" + presoma.c14 + "</td></tr>" +
                "<tr> <td>总量</td> <td>&le;100</td> <td></td> <td>" + presoma.c15 + "</td></tr>" +
                "<tr> <td colspan='2'>Ni+Co+Mn(%)</td> <td>60~64</td> <td>19.7&plusmn;0.5</td> <td>" + presoma.c16 + "</td></tr>" +
                "<tr> <td colspan='2'>Co(%)</td> <td>12.2~13.0</td> <td></td> <td>" + presoma.c17 + "</td></tr>" +
                "<tr> <td colspan='2'>Mn(%)</td> <td>11.6~12.2</td> <td></td> <td>" + presoma.c18 + "</td></tr>" +
                "<tr> <td colspan='2'>Ni(%)</td> <td>37.6~38.8</td> <td></td> <td>" + presoma.c19 + "</td></tr>" +
                "<tr> <td colspan='2'>Na(ppm)</td> <td>&le;120</td> <td></td> <td>" + presoma.c20 + "</td></tr>" +
                "<tr> <td colspan='2'>Mg(ppm)</td> <td>&le;100</td> <td></td> <td>" + presoma.c21 + "</td></tr>" +
                "<tr> <td colspan='2'>Ca(ppm)</td> <td>&le;100</td> <td></td> <td>" + presoma.c22 + "</td></tr>" +
                "<tr> <td colspan='2'>Fe(ppm)</td> <td>&le;50</td> <td></td> <td>" + presoma.c23 + "</td></tr>" +
                "<tr> <td colspan='2'>Cu(ppm)</td> <td>&le;50</td> <td></td> <td>" + presoma.c24 + "</td></tr>" +
                "<tr> <td colspan='2'>Cd(ppm)</td> <td>&le;20</td> <td></td> <td>" + presoma.c25 + "</td></tr>" +
                "<tr> <td colspan='2'>Zn(ppm)</td> <td>&le;40</td> <td></td> <td>" + presoma.c26 + "</td></tr>" +
                "<tr> <td colspan='2'>S(ppm)</td> <td>&le;1000</td> <td>&le;1300</td> <td>" + presoma.c27 + "</td></tr>" +
                "<tr> <td colspan='2'>Cl-(%)</td> <td>&le;0.03</td> <td></td> <td>" + presoma.c28 + "</td></tr>" +
                "<tr> <td colspan='2'>Zr(ppm)</td> <td></td> <td></td> <td>" + presoma.c29 + "</td></tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            );
        },
        getIcon: function (status, code) {
            if (status == 1) {
                return "<a href=\"#\" class='audit' id='audit-" + code + "'><i class=\"layui-icon\">&#xe6b2;";
            }
            else {
                return "<a href=\"#\" class='detail' id='check-" + code + "'><i class=\"layui-icon\">&#xe60a;";
            }
        },

        /**
         * lithium表格-已完成
         * @param lithium
         * @returns {string}
         */
        getTableLithium: function (lithium) {
            return (
                "<div id='div_table' class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr> <td colspan='2'>批号</td> <td>检测日期</td> <td>数量(t)</td> <td>判定</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + (lithium.batchNumber ? lithium.batchNumber : 'null') + "</td> <td>" + (new Date(lithium.testDate).Format('yyyy-MM-dd')) + "</td> <td>" + lithium.number + "</td> <td>" + lithium.judge.name + "</td></tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td></tr>" +
                "</thead>" +
                "<tr> <td colspan='2'>" + lithium.status.name + "</td> <td>" + (lithium.publisher ? lithium.publisher : '无') + "</td> <td></td> <td></td></tr>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td><td colspan='2'>原料技术标准<td>" + lithium.batchNumber + "</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>水分(%)</td> <td>&le;0.25</td> <td>&le;0.25</td> <td>" + lithium.c1 + "</td></tr>" +
                "<tr> <td rowspan='5'>粒度(&mu;m)</td> <td>D1</td> <td></td> <td></td> <td>" + lithium.c2 + "</td></tr>" +
                "<tr> <td>D10</td> <td></td> <td></td> <td>" + lithium.c3 + "</td></tr>" +
                "<tr> <td>D50</td> <td>3~7</td> <td>3~7</td> <td>" + lithium.c4 + "</td></tr>" +
                "<tr> <td>D90</td> <td>&le;30</td> <td>&le;30</td> <td>" + lithium.c5 + "</td></tr>" +
                "<tr> <td>D99</td> <td></td> <td></td> <td>" + lithium.c6 + "</td></tr>" +
                "<tr> <td colspan='2'>筛上物</td> <td>&le;0.3</td> <td>&le;0.3</td> <td>" + lithium.c7 + "</td></tr>" +
                "<tr> <td rowspan='5'>磁性物质检测(ppb)</td> <td>Fe</td> <td></td> <td></td> <td>" + lithium.c8 + "</td></tr>" +
                "<tr> <td>Ni</td> <td></td> <td></td> <td>" + lithium.c9 + "</td></tr>" +
                "<tr> <td>Cr</td> <td></td> <td></td> <td>" + lithium.c10 + "</td></tr>" +
                "<tr> <td>Zn</td> <td></td> <td></td> <td>" + lithium.c11 + "</td></tr>" +
                "<tr> <td>总量</td> <td>&le;800</td> <td>&le;500</td> <td>" + lithium.c12 + "</td></tr>" +
                "<tr> <td colspan='2'>Li2CO3(%)</td> <td>&ge;18.66</td> <td>&ge;18.66</td> <td>" + lithium.c13 + "</td></tr>" +
                "<tr> <td colspan='2'>Na(ppm)</td> <td>&le;250</td> <td>&le;250</td> <td>" + lithium.c14 + "</td></tr>" +
                "<tr> <td colspan='2'>Mg(ppm)</td> <td>&le;80</td> <td>&le;80</td> <td>" + lithium.c15 + "</td></tr>" +
                "<tr> <td colspan='2'>Ca(ppm)</td> <td>&le;50</td> <td>&le;50</td> <td>" + lithium.c16 + "</td></tr>" +
                "<tr> <td colspan='2'>Fe(ppm)</td> <td>&le;10</td> <td>&le;10</td> <td>" + lithium.c17 + "</td></tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            );
        }


        //编辑——新增——搜索
        , edit_add_search: function (searchBtn) {
            searchBtn.off('click').on('click', function () {
                var rawType = $("#edit_add_select option:selected").val()
                var batch_Number = $("#product_batch_number_input").val()
                console.log("rawType", rawType)
                console.log("batch_Number", batch_Number)
                $.post(home.urls.productOut.getDetail(), {
                    rawTypeCode: rawType,
                    batchNumber: batch_Number
                }, function (result) {
                    var items = result.data
                    page = result.data
                    console.log(items)
                    const $tbody = $("#edit_add_modal_table").children('tbody')
                    pro_out_manage.funcs.edit_add_renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'pro_out_add_page',
                        count: 10 * page.totalPages, //数据总数
                        jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productOut.getDetail(), {
                                    rawTypeCode: rawType,
                                    batchNumber: batch_Number,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (obj, first) {
                                    var items = result.data
                                    const $tbody = $("#edit_add_modal_table").children('tbody')
                                    pro_out_manage.funcs.edit_add_renderHandler($tbody, items)
                                    pro_out_manage.pageSize = result.data.length
                                })
                            }
                        }
                    })
                })
            })
        }
        , edit_add_renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            items.forEach(function () {
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='edit_add_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.currentAvailableMaterials + "</td>" +
                    "<td>" + e.meterialsUnit + "</td>" +
                    "<td>" + e.judgeCode + "</td>" +
                    "<td><a href=\"#\" class='edit_add_search_detail' id='detail-" + (e.code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "</tr>"
                )
            })
        }
        /**删除对应记录 */
        , In: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                console.log(1)
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
        , bindEditDeleteClick: function (deleteBtns) {
            deleteBtns.off('click').on('click', function () {
                if ($('.edit_checkbox:checked').length === 0) {
                    layer.msg("您还没选中任何数据！", {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '批量删除',
                        content: "<h5 style='text-align:center;padding-top:8px;'>确定要删除所有记录吗？</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var productOut_batchNumber = []
                            $('.edit_checked').each(function () {
                                if ($(this).prop('checked')) {
                                    productOut_batchNumber.push({batchNumber: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.productOut.deleteByCodeBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(productOut_batchNumber),
                                dataType: 'json',
                                type: 'post',
                                sucess: function (result) {
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
        /** 刷新事件 */
        , bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {

                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    pro_out_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
        /** 搜索事件 */
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var audit_status = $('#audit_status option:selected').val();
                var order_date = $('#order_date').val();
                var rawType_Code = $('#rawType_Code option:selected').val();
                var createDate = new Date(order_date).getTime()
                //var createDate =order_date.getTime;//毫秒级; // date类型转成long类型 
                console.log(audit_status)
                console.log(createDate)
                console.log(rawType_Code)
                $.post(home.urls.productOut.getByAuditStatusAndRawTypeAndCreateDateByPage(), {
                    auditStatus: audit_status === '选择审核状态' ? -1 : audit_status,
                    rawTypeCode: rawType_Code === '请选择产品型号' ? -1 : rawType_Code,
                    createDate: createDate
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    console.log(items)
                    const $tbody = $("#product_out_table").children('tbody')
                    pro_out_manage.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'product_out_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productOut.getByAuditStatusAndRawTypeAndCreateDateByPage(), {
                                    auditStatus: audit_status,
                                    rawTypeCode: rawType_Code,
                                    createDate: order_date,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#product_out_table").children('tbody')
                                    pro_out_manage.funcs.renderHandler($tbody, items)
                                    pro_out_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
        , bindInDeleteClick: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                console.log('删除')
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