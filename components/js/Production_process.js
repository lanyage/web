var Production_process = {
    
    init:function(){

        Production_process.funcs.renderTable();
        Production_process.funcs.hideTable();
    }
    , process_type: 0   // choose material type: 0-premix, 1-size, 2-lithium, 3-buckle
    , pageSize: 0
    , currId: null  // current chosen Id

    ,funcs : {

         /**
         * 页面渲染-已完成
         */
        renderTable: function () {
            Production_process.funcs.hideTable();
            var status = $('#status').val()
            // POST
            $.post(Production_process.funcs.chooseUrl(), {
                page: 0,
                statusCode: status
            }, function (result) {
                var process = result.data.content;
                var $tbody = $(Production_process.funcs.chooseTable()).children('tbody');
                Production_process.pageSize = result.data.content.length;
                Production_process.funcs.chooseHandler($tbody, process);

                var page = result.data;
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: '_25page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            //console.log('不是首次,可以执行');
                            var status = $('#status').val();
                            $.post(Production_process.funcs.chooseUrl(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                statusCode: status
                            }, function (result) {
                                var process = result.data.content;//获取数据
                                var $tbody = $(Production_process.funcs.chooseTable()).children('tbody');
                                Production_process.pageSize = result.data.content.length;
                                Production_process.funcs.chooseHandler($tbody, process);
                            })
                        }
                    }
                })
                $('#_25page').css('padding-left', '37%')
            });

            // 追加刷新事件
            Production_process.funcs.bindRefreshEventListener($('#model-li-hide-refresh-25'));//追加刷新事件
            // 追加搜索事件
            Production_process.funcs.bindSearchEventListener($('#model-li-hide-search-25'));
            // 追加状态下拉框事件
            Production_process.funcs.bindSelectEventListener($('#model-li-hide-select-25'));
            // 追加类别选择事件
            Production_process.funcs.selectPremix($('#select-premix'));
            Production_process.funcs.selectSize($('#select-size'));
            Production_process.funcs.selectLithium($('#select-lithium'));
            Production_process.funcs.selectBuckle($('#select-buckle'));
        },

          /**
         * 四个选择标签响应函数-已完成
         */
        selectPremix: function (premixSelect) {
            premixSelect.off('click');
            premixSelect.on('click', function () {
                //console.log("premixSelect");
                var select_premix = $('#select-premix');
                var select_size = $('#select-size');
                var select_lithium = $('#select-lithium');
                var select_buckle = $('#select-buckle');
                select_premix.html("预混");
                select_premix.removeClass("label_not_selected").addClass("label_selected");
                select_size.html("<a href='#'>粉碎粒度</a>");
                select_size.removeClass("label_selected").addClass("label_not_selected");
                select_lithium.html("<a href='#'>粉碎总锂</a>");
                select_lithium.removeClass("label_selected").addClass("label_not_selected");
                select_buckle.html("<a href='#'>粉碎SSA</a>");
                select_buckle.removeClass("label_selected").addClass("label_not_selected");
                Production_process.process_type = 0;
                Production_process.funcs.renderTable();
            })
        },
        selectSize: function (sizeSelect) {
            sizeSelect.off('click');
            sizeSelect.on('click', function () {
                console.log("sizeSelect");
                var select_premix = $('#select-premix');
                var select_size = $('#select-size');
                var select_lithium = $('#select-lithium');
                var select_buckle = $('#select-buckle');
                select_premix.html("<a href='#'>预混</a>");
                select_premix.removeClass("label_selected").addClass("label_not_selected");
                select_size.html("粉碎粒度");
                select_size.removeClass("label_not_selected").addClass("label_selected");
                select_lithium.html("<a href='#'>粉碎总锂</a>");
                select_lithium.removeClass("label_selected").addClass("label_not_selected");
                select_buckle.html("<a href='#'>粉碎SSA</a>");
                select_buckle.removeClass("label_selected").addClass("label_not_selected");
                Production_process.process_type = 1;
                Production_process.funcs.renderTable();
            })
        },
        selectLithium: function (lithiumSelect) {
            lithiumSelect.off('click');
            lithiumSelect.on('click', function () {
               // console.log("lithiumSelect");
                var select_premix = $('#select-premix');
                var select_size = $('#select-size');
                var select_lithium = $('#select-lithium');
                var select_buckle = $('#select-buckle');
                select_premix.html("<a href='#'>预混</a>");
                select_premix.removeClass("label_selected").addClass("label_not_selected");
                select_size.html("<a href='#'>粉碎粒度</a>");
                select_size.removeClass("label_selected").addClass("label_not_selected");
                select_lithium.html("粉碎总锂");
                select_lithium.removeClass("label_not_selected").addClass("label_selected");
                select_buckle.html("<a href='#'>粉碎SSA</a>");
                select_buckle.removeClass("label_selected").addClass("label_not_selected");
                Production_process.process_type = 2;
                Production_process.funcs.renderTable();
            })
        },
        selectBuckle: function (buckleSelect) {
            buckleSelect.off('click');
            buckleSelect.on('click', function () {
                //console.log("premixSelect");
                var select_premix = $('#select-premix');
                var select_size = $('#select-size');
                var select_lithium = $('#select-lithium');
                var select_buckle = $('#select-buckle');
                select_premix.html("<a href='#'>预混</a>");
                select_premix.removeClass("label_selected").addClass("label_not_selected");
                select_size.html("<a href='#'>粉碎粒度</a>");
                select_size.removeClass("label_selected").addClass("label_not_selected");
                select_lithium.html("<a href='#'>粉碎总锂</a>");
                select_lithium.removeClass("label_selected").addClass("label_not_selected");
                select_buckle.html("粉碎SSA");
                select_buckle.removeClass("label_not_selected").addClass("label_selected");
                Production_process.process_type = 3;
                Production_process.funcs.renderTable();
            })
        },

        /**
         * 四个表格渲染函数-需要修改
         * @param $tbody
         */
        renderHandlerPremix: function ($tbody, premix) {
            $tbody.empty();
            premix.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='Production-process-" + (e.code) + "'>" +
                    "<td style='color:black'>"+ Production_process.funcs.getIcon(status, e.code) +"</td>"+
                    "<td style='color:black'>"+ (e.publisher ? e.publisher.name : '无') +"</td>"+
                    "<td style='color:black'>"+ (new Date(e.testDate).Format('yyyy-MM-dd'))  +"</td>"+
                    "<td style='color:black'>"+ e.batchNumber +"</td>"+
                    "<td style='color:black'>"+ e.type +"</td>"+
                    "<td style='color:black'>"+e.lithiumSoluble +"</td>"+
                    "<td style='color:black'>"+ (e.supplier?e.supplier.name:'无') +"</td>"+
                    "<td style='color:black'>"+ e.pc1 +"</td>"+
                    "<td style='color:black'>"+ e.pc2 +"</td>"+
                    "<td style='color:black'>"+ e.pc3 +"</td>"+
                    "<td style='color:black'>"+ e.pc4 +"</td>"+
                    "<td style='color:black'>"+ e.pc5 +"</td>"+
                    "<td style='color:black'>"+ e.pc6 +"</td>"+
                    "<td style='color:black'>"+ e.pc7 +"</td>"+
                    "<td style='color:black'></td>"+
                    "</tr>"
                )
            });
            var auditBtns = $('.audit');
            var detailBtns = $('.detail');
            Production_process.funcs.bindAuditEventListener(auditBtns);
            Production_process.funcs.bindDetailEventListener(detailBtns);
        },
        renderHandlerSize: function ($tbody, size) {
            $tbody.empty();
            size.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='Production-process-" + (e.code) + "'>" +
                    "<td style='color:black'>"+ Production_process.funcs.getIcon(status, e.code) +"</td>"+
                        "<td style='color:black'>"+ (e.publisher ? e.publisher.name : '无') +"</td>"+
                        "<td style='color:black'>"+ (new Date(e.testDate).Format('yyyy-MM-dd'))  +"</td>"+
                        "<td style='color:black'>"+ e.batchNumber +"</td>"+
                        "<td style='color:black'>"+ e.furnaceNum +"</td>"+
                        "<td style='color:black'>"+ e.pc1 +"</td>"+
                        "<td style='color:black'>"+ e.pc2 +"</td>"+
                        "<td style='color:black'>"+ e.pc3 +"</td>"+
                        "<td style='color:black'>"+ e.pc4 +"</td>"+
                        "<td style='color:black'>"+ e.pc5 +"</td>"+
                        "<td style='color:black'>"+ e.pc6 +"</td>"+
                        "<td style='color:black'>"+ e.pc7 +"</td>"+
                        "<td style='color:black'>"+ e.pc8 +"</td>"+
                        "<td style='color:black'>"+ e.pc9 +"</td>"+
                        "<td style='color:black'>"+ e.pc10 +"</td>"+
                        "<td style='color:black'>"+ e.pc10 +"</td>"+
                    "</tr>"
                )
            });
            var auditBtns = $('.audit');
            var detailBtns = $('.detail');
            Production_process.funcs.bindAuditEventListener(auditBtns);
            Production_process.funcs.bindDetailEventListener(detailBtns);
        },
        renderHandlerLithium: function ($tbody, lithium) {
            $tbody.empty();
            lithium.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='Production-process-" + (e.code) + "'>" +
                       "<td style='color:black'>"+ Production_process.funcs.getIcon(status, e.code) +"</td>"+
                       "<td style='color:black'>"+ (e.publisher ? e.publisher.name : '无') +"</td>"+
                       "<td style='color:black'>"+ (new Date(e.testDate).Format('yyyy-MM-dd'))  +"</td>"+
                       "<td style='color:black'>"+ e.batchNumber +"</td>"+
                       "<td style='color:black'>"+e.furnaceNum+"</td>"+
                       "<td style='color:black'>"+ e.pc1 +"</td>"+
                       "<td style='color:black'>"+ e.pc2 +"</td>"+
                       "<td style='color:black'>"+ e.pc3 +"</td>"+
                    "</tr>"
                )
            });
            var auditBtns = $('.audit');
            var detailBtns = $('.detail');
            Production_process.funcs.bindAuditEventListener(auditBtns);
            Production_process.funcs.bindDetailEventListener(detailBtns);
        },
        renderHandlerBuckle: function ($tbody, buckle) {
            $tbody.empty();
            buckle.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='Production-process-" + (e.code) + "'>" +
                    "<td style='color:black'>"+  Production_process.funcs.getIcon(status, e.code) +"</td>"+
                        "<td style='color:black'>"+ (e.publisher ? e.publisher.name : '无') +"</td>"+
                        "<td style='color:black'>"+ (new Date(e.testDate).Format('yyyy-MM-dd'))  +"</td>"+
                        "<td style='color:black'>"+ e.batchNumber +"</td>"+
                        "<td style='color:black'>"+ e.furnaceNum +"</td>"+
                        "<td style='color:black'>"+ e.pc1 +"</td>"+
                        "<td style='color:black'>"+ e.pc2 +"</td>"+
                        "<td style='color:black'>"+ e.pc3 +"</td>"+
                    "</tr>"
                )
            });
            var auditBtns = $('.audit');
            var detailBtns = $('.detail');
            Production_process.funcs.bindAuditEventListener(auditBtns);
            Production_process.funcs.bindDetailEventListener(detailBtns);
        },

          /**
         * 四个弹出页面的渲染函数
         */
        getTablePremix: function (premix) {
            return (
                "<div id='div_table' class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr> <td>批号</td> <td>检测日期</td> <td>预混</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td>" + premix.batchNumber + "</td> <td>" + new Date(premix.testDate).Format('yyyy-MM-dd') + "</td> <td>" + premix.type + "</td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td>审核状态</td> <td>审核人</td> <td></td> </tr>" +
                "</thead>" +
                "<tr> <td>" + premix.status.name + "</td> <td>" + Production_process.funcs.getName(premix.auditor) + "</td> <td></td> </tr>" +
                "<thead>" +
                "<tr> <td>检测项目</td> <td>控制标准</td> <td>" + premix.batchNumber + "</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td>可溶锂 %</td> <td>理论含量&plusmn;0.08</td> <td>" + premix.lithiumSoluble + "</td> </tr>" +
                "<tr> <td>主原料厂家</td> <td></td> <td>" + Production_process.funcs.getName(premix.supplier) + "</td> </tr>" +
                "<tr> <td>配比</td> <td></td> <td>" + premix.pc1 + "</td> </tr>" +
                "<tr> <td>锂的理论含量 %</td> <td></td> <td>" + premix.pc2 + "</td> </tr>" +
                "<tr> <td>锂的理论下限 %</td> <td></td> <td>" + premix.pc3 + "</td> </tr>" +
                "<tr> <td>锂的理论上限 %</td> <td></td> <td>" + premix.pc4 + "</td> </tr>" +
                "<tr> <td>Me%</td> <td></td> <td>" + premix.pc5 + "</td> </tr>" +
                "<tr> <td>L/M（实际）</td> <td></td> <td>" + premix.pc6 + "</td> </tr>" +
                "<tr> <td>L/M（理论）</td> <td></td> <td>" + premix.pc7 + "</td> </tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            );
        },
        getTableSize: function (size) {
            return (
                "<div id='div_table' class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr> <td colspan='2'>批号</td> <td>检测日期</td> <td>炉号</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + size.batchNumber + "</td> <td>" + new Date(size.testDate).Format('yyyy-MM-dd')+ "</td> <td>" + size.furnaceNum + "</td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> </tr>" +
                "</thead>" +
                "<tr> <td colspan='2'>" + size.status.name + "</td> <td>" + Production_process.funcs.getName(size.auditor) + "</td> <td></td> </tr>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td> <td>三级文件控制标准</td> <td>" + size.batchNumber + "</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td rowspan='9'>振筛粒度</td> <td>D0</td> <td rowspan='9'>12.5&plusmn;1.5</td> <td>" + size.pc1 + "</td> </tr>" +
                "<tr> <td>D1</td> <td>" + size.pc2 + "</td> </tr>" +
                "<tr> <td>D5</td> <td>" + size.pc3 + "</td> </tr>" +
                "<tr> <td>D10</td> <td>" + size.pc4 + "</td> </tr>" +
                "<tr> <td>D50</td> <td>" + size.pc5 + "</td> </tr>" +
                "<tr> <td>D90</td> <td>" + size.pc6 + "</td> </tr>" +
                "<tr> <td>D95</td> <td>" + size.pc7 + "</td> </tr>" +
                "<tr> <td>D99</td> <td>" + size.pc8 + "</td> </tr>" +
                "<tr> <td>D99.99</td> <td>" + size.pc9 + "</td> </tr>" +
                "<tr> <td colspan='2'>宽度系数</td> <td>(D90-D10)/D50</td> <td>" + size.pc10 + "</td> </tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            );
        },
        getTableLithium: function (lithium) {
            return (
                "<div id='div_table' class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr> <td>批号</td> <td>检测日期</td> <td>炉号</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td>" + lithium.batchNumber + "</td> <td>" + new Date(lithium.testDate).Format('yyyy-MM-dd') + "</td> <td>" + lithium.furnaceNum + "</td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td>审核状态</td> <td>审核人</td> <td></td> </tr>" +
                "</thead>" +
                "<tr> <td>" + lithium.status.name + "</td> <td>" + Production_process.funcs.getName(lithium.auditor) + "</td> <td></td> </tr>" +
                "<thead>" +
                "<tr> <td>检测项目</td> <td>三级文件控制标准</td> <td>" + lithium.batchNumber + "</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td>Li2CO3</td> <td></td> <td>" + lithium.pc1 + "</td> </tr>" +
                "<tr> <td>LiOH</td> <td></td> <td>" + lithium.pc2 + "</td> </tr>" +
                "<tr> <td>总Li含量</td> <td></td> <td>" + lithium.pc3 + "</td> </tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            );
        },
        getTableBuckle: function (buckle) {
            return (
                "<div id='div_table' class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr> <td>批号</td> <td>检测日期</td> <td>炉号</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td>" + buckle.batchNumber + "</td> <td>" + new Date(buckle.testDate).Format('yyyy-MM-dd')+ "</td> <td>" + buckle.furnaceNum + "</td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td>审核状态</td> <td>审核人</td> <td></td> </tr>" +
                "</thead>" +
                "<tr> <td>" + buckle.status.name + "</td> <td>" + Production_process.funcs.getName(buckle.auditor) + "</td> <td></td> </tr>" +
                "<thead>" +
                "<tr> <td>检测项目</td> <td>三级文件控制标准</td> <td>" + buckle.batchNumber + "</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td>SSA</td> <td>0.30&plusmn;0.08</td> <td>" + buckle.pc1 + "</td> </tr>" +
                "<tr> <td>扣电</td> <td>&ge;177.5</td> <td>" + buckle.pc2 + "</td> </tr>" +
                "<tr> <td>XRD<br>FWHM(104)</td> <td></td> <td>" + buckle.pc3 + "</td> </tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            );
        },

        
        /** 日期格式化 */
        formatDate: function (strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },

        /** 获得名字 */
        getName: function (e) {
            if (e == null) {
                return "无";
            }
            else {
                return e.name;
            }
        },

        /**
         * 刷新事件-已完成
         * @param refreshBtn
         */
        bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    Production_process.init()
                    $("#product_batch_number_input").val('')
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },

         /**
         * 搜索事件-已完成
         * @param searchBtn
         */
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var process_batch_number = $('#product_batch_number_input').val()
                //console.log(process_batch_number)
                var status = $('#status').val()
                $.post(Production_process.funcs.chooseUrlSearch(), {
                    batchNumber: process_batch_number,
                    statusCode: status
                }, function (result) {
                    var page = result.data
                    var process = result.data.content //获取数据
                    var status = $('#status').val()
                    const $tbody = $(Production_process.funcs.chooseTable()).children('tbody')
                    Production_process.funcs.chooseHandler($tbody, process)
                    layui.laypage.render({
                        elem: '_25page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(Production_process.funcs.chooseUrlSearch(), {
                                    batchNumber: process_batch_number,
                                    statusCode: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var process = result.data.content //获取数据
                                    const $tbody = $(Production_process.funcs.chooseTable()).children('tbody')
                                    Production_process.funcs.chooseHandler($tbody, process)
                                    Production_process.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },

         /**
         * 隐藏/显示表格
         */
        hideTable: function () {
            var premix_table = $('#premix_table');
            var size_table = $('#size_table');
            var lithium_table = $('#lithium_table');
            var buckle_table = $('#buckle_table');
            switch (Production_process.process_type) {
                case 0:
                    premix_table.show();
                    size_table.hide();
                    lithium_table.hide();
                    buckle_table.hide();
                    break;
                case 1:
                    premix_table.hide();
                    size_table.show();
                    lithium_table.hide();
                    buckle_table.hide();
                    break;
                case 2:
                    premix_table.hide();
                    size_table.hide();
                    lithium_table.show();
                    buckle_table.hide();
                    break;
                case 3:
                    premix_table.hide();
                    size_table.hide();
                    lithium_table.hide();
                    buckle_table.show();
                    break;
            }
        },


        chooseUrl: function () {
            switch (Production_process.process_type) {
                case 0:
                    return home.urls.processPremix.getAllByStatusCodeByPage();
                case 1:
                    return home.urls.processSize.getAllByStatusCodeByPage();
                case 2:
                    return home.urls.processLithium.getAllByStatusCodeByPage();
                case 3:
                    return home.urls.processBuckle.getAllByStatusCodeByPage();
            }
        },

        /**
         * 更新表
         * @param $div
         * @param process
         */
        changeTable: function ($div, process) {
            $div.empty();
            $div.append(Production_process.funcs.getTableFunc(process));
        },

         /**
         * 更新表格
         * @returns {string}
         */
        chooseTable: function () {
            switch (Production_process.process_type) {
                case 0:
                    return "#premix_table";
                case 1:
                    return "#size_table";
                case 2:
                    return "#lithium_table";
                case 3:
                    return "#buckle_table";
            }
        },

        /**
         * 操作图标
         * @param status    状态码
         * @param code      产品编码
         * @returns {string}
         */
        getIcon: function (status, code) {
            if (status == 1) {
                return "<a href=\"#\" class='audit' id='audit-" + code + "'><i class=\"layui-icon\">&#xe6b2;";
            }
            else {
                return "<a href=\"#\" class='detail' id='check-" + code + "'><i class=\"layui-icon\">&#xe60a;";
            }
        },

        /**
         * 监听状态下拉选框-已完成
         * @param statusSelect
         */
        bindSelectEventListener: function (statusSelect) {
            statusSelect.off('change')
            statusSelect.on('change', function () {
                Production_process.funcs.renderTable()
            })
        },

        /**
         * 发布按钮事件-已完成
         * @param auditBtns
         */
        bindAuditEventListener: function (auditBtns) {
            auditBtns.off('click');
            auditBtns.on('click', function () {
                var _selfBtn = $(this);
                var code = _selfBtn.attr('id').substr(6);
                Production_process.currId = "Production-process-" + code;
                $.post(Production_process.funcs.chooseUrlCode(), {code: code}, function (result) {
                    //console.log("发布" + code);
                    var process = result.data;
                    layer.open({
                        type: 1,
                        content: Production_process.funcs.getData(process),
                        area: ['500px', '500px'],
                        btn: ['通过发布', '取消'],
                        offset: 'auto', // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function () {
                            //console.log("提交发布" + code);
                            $.post(Production_process.funcs.chooseUrlAudit(), {
                                code: code,
                                auditorCode: home.user.code,     // 此处需要读取用户编号
                                statusCode: 2
                            }, function (result) {
                                if (result.code == 0) {
                                    // 成功
                                    //console.log("发布成功" + code);
                                    layer.open({
                                        type: 1,
                                        content: "<div class='align_middle'>" + "发布成功" + "</div>",
                                        area: ['280px', '180px'],
                                        btn: ['关闭'],
                                        offset: 'auto', // ['43%', '49%'],
                                        btnAlign: 'c',
                                        yes: function () {
                                            layer.closeAll();
                                            Production_process.funcs.renderTable();
                                        }
                                    });
                                } else {
                                    // 失败
                                    //console.log("发布失败" + result.message);
                                    layer.open({
                                        type: 1,
                                        content: "<div class='align_middle'>" + "失败<br>" + result.message + "</div>",
                                        area: ['280px', '180px'],
                                        btn: ['关闭'],
                                        offset: 'auto', // ['43%', '49%'],
                                        btnAlign: 'c',
                                        yes: function () {
                                            layer.closeAll();
                                            Production_process.funcs.renderTable();
                                        }
                                    });
                                }
                            })
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    });
                    Production_process.funcs.bindLeftBtn($('#model-li-hide-left-25'));
                    Production_process.funcs.bindRightBtn($('#model-li-hide-right-25'));
                })
            })
        },

         /**
         * 查看按钮事件-已完成
         * @param detailBtns
         */
        bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click')
            detailBtns.on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(6);
                Production_process.currId = "Production-process-" + code;
                $.post(Production_process.funcs.chooseUrlCode(), {code: code}, function (result) {       
                    var process = result.data;
                    layer.open({
                        type: 1,
                        content: Production_process.funcs.getData(process),
                        area: ['550px', '700px'],
                        btn: ['关闭'],
                        offset: 'auto',   // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function (index) {
                            layer.close(index);
                        }
                    });
                    Production_process.funcs.bindLeftBtn($('#model-li-hide-left-25'));
                    Production_process.funcs.bindRightBtn($('#model-li-hide-right-25'));
                })
            })
        },

        /**
         * 选择表的函数
         * @param process
         * @returns {*}
         */
        getTableFunc: function (process) {
            switch (Production_process.process_type) {
                case 0:
                    return Production_process.funcs.getTablePremix(process);
                case 1:
                    return Production_process.funcs.getTableSize(process);
                case 2:
                    return Production_process.funcs.getTableLithium(process);
                case 3:
                    return Production_process.funcs.getTableBuckle(process);
            }
        },
        chooseUrlSearch: function () {
            switch (Production_process.process_type) {
                case 0:
                    return home.urls.processPremix.getByLikeBatchNumberByPage();
                case 1:
                    return home.urls.processSize.getByLikeBatchNumberByPage();
                case 2:
                    return home.urls.processLithium.getByLikeBatchNumberByPage();
                case 3:
                    return home.urls.processBuckle.getByLikeBatchNumberByPage();
            }
        },
        chooseUrlAudit: function () {
            switch (Production_process.process_type) {
                case 0:
                    return home.urls.processPremix.updatePublishByCode();
                case 1:
                    return home.urls.processSize.updatePublishByCode();
                case 2:
                    return home.urls.processLithium.updatePublishByCode();
                case 3:
                    return home.urls.processBuckle.updatePublishByCode();
            }
        },
        chooseUrlCode: function () {
            switch (Production_process.process_type) {
                case 0:
                    return home.urls.processPremix.getByCode();
                case 1:
                    return home.urls.processSize.getByCode();
                case 2:
                    return home.urls.processLithium.getByCode();
                case 3:
                    return home.urls.processBuckle.getByCode();
            }
        },
        getData: function (process) {
            var data =
                "<div id='auditModal'>" +
                "<div class='arrow_div_left'>" +
                "<span id='model-li-hide-left-25'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe603;</i></a></span>" +
                "</div>" +
                "<div class='arrow_div_right'>" +
                "<span id='model-li-hide-right-25'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe602;</i></a></span>" +
                "</div>";
            data += Production_process.funcs.getTableFunc(process);
            return data;
        },
         /**
         * 弹出窗口左按钮事件-已完成
         * @param leftBtn
         */
        bindLeftBtn: function (leftBtn) {
            leftBtn.off('click');
            leftBtn.on('click', function () {
                var $table = $(Production_process.funcs.chooseTable());
                var firstId = $($table.children('tbody').children('tr')[0]).attr('id');
                //console.log(firstId);
                if (firstId != Production_process.currId) {
                    var prevCode = $('#' + Production_process.currId).prev('tr').attr('id').substr(19);
                    //console.log(prevCode);
                    $.post(Production_process.funcs.chooseUrlCode(), {code: prevCode}, function (result) {
                        Production_process.currId = "Production-process-" + prevCode;
                        var process = result.data;
                        const $div = $("#div_table");
                        Production_process.funcs.changeTable($div, process);
                    })
                }
                else {
                    //console.log("First one");
                    layer.msg('已经是页面第一项', {
                        time: 1000
                    })
                }
            })
        },

        /**
         * 弹出窗口右按钮事件-已完成
         * @param rightBtn
         */
        bindRightBtn: function (rightBtn) {
            rightBtn.off('click');
            rightBtn.on('click', function () {
                //console.log("右");
                var $table = $(Production_process.funcs.chooseTable());
               var rows = $table.children('tbody').children('tr').length-1;
                var lastId = $($table.children('tbody').children('tr')[rows]).attr('id');
                if (lastId != Production_process.currId) {
                   // console.log( $('#' + Production_process.currId).next('tr').attr('id'))
                    var nextCode = $('#' + Production_process.currId).next('tr').attr('id').substr(19);
                   // console.log(nextCode);
                    $.post(Production_process.funcs.chooseUrlCode(), {code: nextCode}, function (result) {
                        Production_process.currId = "Production-process-" + nextCode;
                        var process = result.data;
                        const $div = $("#div_table");
                        Production_process.funcs.changeTable($div, process);
                    })
                }
                else {
                    //console.log("Last one");
                    layer.msg('已经是页面最后一项', {
                        time: 1000
                    })
                }
            })
        },


        chooseHandler: function ($tbody, process) {
            switch (Production_process.process_type) {
                case 0:
                    Production_process.funcs.renderHandlerPremix($tbody, process);
                    break;
                case 1:
                    Production_process.funcs.renderHandlerSize($tbody, process);
                    break;
                case 2:
                    Production_process.funcs.renderHandlerLithium($tbody, process);
                    break;
                case 3:
                    Production_process.funcs.renderHandlerBuckle($tbody, process);
                    break;
            }
        }
       
    }
}