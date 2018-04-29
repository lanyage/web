var process_audit = {
    init: function () {
        process_audit.funcs.renderTable();
        process_audit.funcs.hideTable();

        var out = $('#process_audit_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#process_audit_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    }
    , process_type: 0   // choose material type: 0-premix, 1-size, 2-lithium, 3-buckle
    , pageSize: 0
    , currId: null  // current chosen Id
    , funcs: {
        /**
         * 页面渲染-已完成
         */
        renderTable: function () {
            process_audit.funcs.hideTable();
            console.log(process_audit.process_type);
            var status = $('#status').val()
            // POST
            $.post(process_audit.funcs.chooseUrl(), {
                page: 0,
                statusCode: status
            }, function (result) {
                var process = result.data.content;
                var $tbody = $(process_audit.funcs.chooseTable()).children('tbody');
                process_audit.pageSize = result.data.content.length;
                process_audit.funcs.chooseHandler($tbody, process);

                var page = result.data;
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'process_audit_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行');
                            var status = $('#status').val();
                            $.post(process_audit.funcs.chooseUrl(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                statusCode: status
                            }, function (result) {
                                var process = result.data.content;//获取数据
                                var $tbody = $(process_audit.funcs.chooseTable()).children('tbody');
                                process_audit.pageSize = result.data.content.length;
                                process_audit.funcs.chooseHandler($tbody, process);
                            })
                        }
                    }
                })
            });

            // 追加刷新事件
            process_audit.funcs.bindRefreshEventListener($('#model-li-hide-refresh-22'));//追加刷新事件
            // 追加搜索事件
            process_audit.funcs.bindSearchEventListener($('#model-li-hide-search-22'));
            // 追加状态下拉框事件
            process_audit.funcs.bindSelectEventListener($('#model-li-hide-select-22'));
            // 追加类别选择事件
            process_audit.funcs.selectPremix($('#select-premix'));
            process_audit.funcs.selectSize($('#select-size'));
            process_audit.funcs.selectLithium($('#select-lithium'));
            process_audit.funcs.selectBuckle($('#select-buckle'));
        },

        /**
         * 四个选择标签响应函数-已完成
         */
        selectPremix: function (premixSelect) {
            premixSelect.off('click');
            premixSelect.on('click', function () {
                console.log("premixSelect");
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
                process_audit.process_type = 0;
                process_audit.funcs.renderTable();
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
                process_audit.process_type = 1;
                process_audit.funcs.renderTable();
            })
        },
        selectLithium: function (lithiumSelect) {
            lithiumSelect.off('click');
            lithiumSelect.on('click', function () {
                console.log("lithiumSelect");
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
                process_audit.process_type = 2;
                process_audit.funcs.renderTable();
            })
        },
        selectBuckle: function (buckleSelect) {
            buckleSelect.off('click');
            buckleSelect.on('click', function () {
                console.log("premixSelect");
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
                process_audit.process_type = 3;
                process_audit.funcs.renderTable();
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
                    "<tr id='process-audit-" + (e.code) + "'>" +
                    "<td>" + process_audit.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + process_audit.funcs.getName(e.auditor) + "</td>" +
                    "<td>" + process_audit.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.type + "</td>" +
                    "<td>" + e.lithiumSoluble + "</td>" +
                    "<td>" + process_audit.funcs.getName(e.supplier) + "</td>" +
                    "<td>" + e.pc1 + "</td>" +
                    "<td>" + e.pc2 + "</td>" +
                    "<td>" + e.pc4 + "</td>" +
                    "<td>" + e.pc5 + "</td>" +
                    "<td>" + e.pc6 + "</td>" +
                    "<td>" + e.pc7 + "</td>" +
                    "<td> </td>" +
                    "</tr>"
                )
            });
            var auditBtns = $('.audit');
            var detailBtns = $('.detail');
            process_audit.funcs.bindAuditEventListener(auditBtns);
            process_audit.funcs.bindDetailEventListener(detailBtns);
        },
        renderHandlerSize: function ($tbody, size) {
            $tbody.empty();
            size.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='process-audit-" + (e.code) + "'>" +
                    "<td>" + process_audit.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + process_audit.funcs.getName(e.auditor) + "</td>" +
                    "<td>" + process_audit.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.furnaceNum + "</td>" +
                    "<td>" + e.pc1 + "</td>" +
                    "<td>" + e.pc2 + "</td>" +
                    "<td>" + e.pc3 + "</td>" +
                    "<td>" + e.pc4 + "</td>" +
                    "<td>" + e.pc5 + "</td>" +
                    "<td>" + e.pc6 + "</td>" +
                    "<td>" + e.pc7 + "</td>" +
                    "<td>" + e.pc8 + "</td>" +
                    "<td>" + e.pc9 + "</td>" +
                    "<td>" + e.pc10 + "</td>" +
                    "</tr>"
                )
            });
            var auditBtns = $('.audit');
            var detailBtns = $('.detail');
            process_audit.funcs.bindAuditEventListener(auditBtns);
            process_audit.funcs.bindDetailEventListener(detailBtns);
        },
        renderHandlerLithium: function ($tbody, lithium) {
            $tbody.empty();
            lithium.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='process-audit-" + (e.code) + "'>" +
                    "<td>" + process_audit.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + process_audit.funcs.getName(e.auditor) + "</td>" +
                    "<td>" + process_audit.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.furnaceNum + "</td>" +
                    "<td>" + e.pc1 + "</td>" +
                    "<td>" + e.pc2 + "</td>" +
                    "<td>" + e.pc3 + "</td>" +
                    "</tr>"
                )
            });
            var auditBtns = $('.audit');
            var detailBtns = $('.detail');
            process_audit.funcs.bindAuditEventListener(auditBtns);
            process_audit.funcs.bindDetailEventListener(detailBtns);
        },
        renderHandlerBuckle: function ($tbody, buckle) {
            $tbody.empty();
            buckle.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='process-audit-" + (e.code) + "'>" +
                    "<td>" + process_audit.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + process_audit.funcs.getName(e.auditor) + "</td>" +
                    "<td>" + process_audit.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.furnaceNum + "</td>" +
                    "<td>" + e.pc1 + "</td>" +
                    "<td>" + e.pc2 + "</td>" +
                    "<td>" + e.pc3 + "</td>" +
                    "</tr>"
                )
            });
            var auditBtns = $('.audit');
            var detailBtns = $('.detail');
            process_audit.funcs.bindAuditEventListener(auditBtns);
            process_audit.funcs.bindDetailEventListener(detailBtns);
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
                    process_audit.init()
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
                console.log('search')
                var process_batch_number = $('#process_batch_number_input').val()
                console.log(process_batch_number)
                var status = $('#status').val()
                $.post(process_audit.funcs.chooseUrlSearch(), {
                    batchNumber: process_batch_number,
                    statusCode: status
                }, function (result) {
                    var page = result.data
                    var process = result.data.content //获取数据
                    var status = $('#status').val()
                    const $tbody = $(process_audit.funcs.chooseTable()).children('tbody')
                    process_audit.funcs.chooseHandler($tbody, process)
                    layui.laypage.render({
                        elem: 'process_audit_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(process_audit.funcs.chooseUrlSearch(), {
                                    batchNumber: process_batch_number,
                                    statusCode: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var process = result.data.content //获取数据
                                    const $tbody = $(process_audit.funcs.chooseTable()).children('tbody')
                                    process_audit.funcs.chooseHandler($tbody, process)
                                    process_audit.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },

        /**
         * 监听状态下拉选框-已完成
         * @param statusSelect
         */
        bindSelectEventListener: function (statusSelect) {
            statusSelect.off('change')
            statusSelect.on('change', function () {
                process_audit.funcs.renderTable()
            })
        },


        /**
         * 审核按钮事件-已完成
         * @param auditBtns
         */
        bindAuditEventListener: function (auditBtns) {
            auditBtns.off('click');
            auditBtns.on('click', function () {
                var _selfBtn = $(this);
                var code = _selfBtn.attr('id').substr(6);
                process_audit.currId = "process-audit-" + code;
                $.post(process_audit.funcs.chooseUrlCode(), {code: code}, function (result) {
                    console.log("审核" + code);
                    var process = result.data;
                    layer.open({
                        type: 1,
                        content: process_audit.funcs.getData(process),
                        area: ['550px', '700px'],
                        btn: ['通过审核', '取消'],
                        offset: 'auto', // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function () {
                            console.log("提交审核" + code);
                            $.post(process_audit.funcs.chooseUrlAudit(), {
                                code: code,
                                auditorCode: home.user.code,     // 此处需要读取用户编号
                                statusCode: 2
                            }, function (result) {
                                if (result.code == 0) {
                                    // 成功
                                    console.log("审核成功" + code);
                                    layer.open({
                                        type: 1,
                                        content: "<div class='align_middle'>" + "审核成功" + "</div>",
                                        area: ['280px', '180px'],
                                        btn: ['关闭'],
                                        offset: 'auto', // ['43%', '49%'],
                                        btnAlign: 'c',
                                        yes: function () {
                                            layer.closeAll();
                                            process_audit.funcs.renderTable();
                                        }
                                    });
                                } else {
                                    // 失败
                                    console.log("审核失败" + result.message);
                                    layer.open({
                                        type: 1,
                                        content: "<div class='align_middle'>" + "失败<br>" + result.message + "</div>",
                                        area: ['280px', '180px'],
                                        btn: ['关闭'],
                                        offset: 'auto', // ['43%', '49%'],
                                        btnAlign: 'c',
                                        yes: function () {
                                            layer.closeAll();
                                            process_audit.funcs.renderTable();
                                        }
                                    });
                                }
                            })
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    });
                    process_audit.funcs.bindLeftBtn($('#model-li-hide-left-22'));
                    process_audit.funcs.bindRightBtn($('#model-li-hide-right-22'));
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
                process_audit.currId = "process-audit-" + code;
                $.post(process_audit.funcs.chooseUrlCode(), {code: code}, function (result) {
                    console.log("查看" + code);
                    var process = result.data;
                    layer.open({
                        type: 1,
                        content: process_audit.funcs.getData(process),
                        area: ['550px', '700px'],
                        btn: ['关闭'],
                        offset: 'auto',   // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function (index) {
                            layer.close(index);
                        }
                    });
                    process_audit.funcs.bindLeftBtn($('#model-li-hide-left-22'));
                    process_audit.funcs.bindRightBtn($('#model-li-hide-right-22'));
                })
            })
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
         * 弹出窗口左按钮事件-已完成
         * @param leftBtn
         */
        bindLeftBtn: function (leftBtn) {
            leftBtn.off('click');
            leftBtn.on('click', function () {
                console.log("左");
                var $table = $(process_audit.funcs.chooseTable());
                var firstId = $($table.children('tbody').children('tr')[0]).attr('id');
                console.log(firstId);
                if (firstId != process_audit.currId) {
                    var prevCode = $('#' + process_audit.currId).prev('tr').attr('id').substr(14);
                    console.log(prevCode);
                    $.post(process_audit.funcs.chooseUrlCode(), {code: prevCode}, function (result) {
                        process_audit.currId = "process-audit-" + prevCode;
                        var process = result.data;
                        const $div = $("#div_table");
                        process_audit.funcs.changeTable($div, process);
                    })
                }
                else {
                    console.log("First one");
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
                console.log("右");
                var $table = $(process_audit.funcs.chooseTable());
                var lastId = $($table.children('tbody').children('tr')[9]).attr('id');
                if (lastId != process_audit.currId) {
                    var nextCode = $('#' + process_audit.currId).next('tr').attr('id').substr(14);
                    console.log(nextCode);
                    $.post(process_audit.funcs.chooseUrlCode(), {code: nextCode}, function (result) {
                        process_audit.currId = "process-audit-" + nextCode;
                        var process = result.data;
                        const $div = $("#div_table");
                        process_audit.funcs.changeTable($div, process);
                    })
                }
                else {
                    console.log("Last one");
                    layer.msg('已经是页面最后一项', {
                        time: 1000
                    })
                }
            })
        },

        getData: function (process) {
            var data =
                "<div id='auditModal'>" +
                "<div class='arrow_div_left'>" +
                "<span id='model-li-hide-left-22'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe603;</i></a></span>" +
                "</div>" +
                "<div class='arrow_div_right'>" +
                "<span id='model-li-hide-right-22'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe602;</i></a></span>" +
                "</div>";
            data += process_audit.funcs.getTableFunc(process);
            return data;
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
                "<tr> <td>" + premix.batchNumber + "</td> <td>" + process_audit.funcs.formatDate(premix.testDate) + "</td> <td>" + premix.type + "</td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td>审核状态</td> <td>审核人</td> <td></td> </tr>" +
                "</thead>" +
                "<tr> <td>" + premix.status.name + "</td> <td>" + process_audit.funcs.getName(premix.auditor) + "</td> <td></td> </tr>" +
                "<thead>" +
                "<tr> <td>检测项目</td> <td>控制标准</td> <td>" + premix.batchNumber + "</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td>可溶锂 %</td> <td>理论含量&plusmn;0.08</td> <td>" + premix.lithiumSoluble + "</td> </tr>" +
                "<tr> <td>主原料厂家</td> <td></td> <td>" + process_audit.funcs.getName(premix.supplier) + "</td> </tr>" +
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
                "<tr> <td colspan='2'>" + size.batchNumber + "</td> <td>" + process_audit.funcs.formatDate(size.testDate) + "</td> <td>" + size.furnaceNum + "</td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> </tr>" +
                "</thead>" +
                "<tr> <td colspan='2'>" + size.status.name + "</td> <td>" + process_audit.funcs.getName(size.auditor) + "</td> <td></td> </tr>" +
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
                "<tr> <td>" + lithium.batchNumber + "</td> <td>" + process_audit.funcs.formatDate(lithium.testDate) + "</td> <td>" + lithium.furnaceNum + "</td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td>审核状态</td> <td>审核人</td> <td></td> </tr>" +
                "</thead>" +
                "<tr> <td>" + lithium.status.name + "</td> <td>" + process_audit.funcs.getName(lithium.auditor) + "</td> <td></td> </tr>" +
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
                "<tr> <td>" + buckle.batchNumber + "</td> <td>" + process_audit.funcs.formatDate(buckle.testDate) + "</td> <td>" + buckle.furnaceNum + "</td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td>审核状态</td> <td>审核人</td> <td></td> </tr>" +
                "</thead>" +
                "<tr> <td>" + buckle.status.name + "</td> <td>" + process_audit.funcs.getName(buckle.auditor) + "</td> <td></td> </tr>" +
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

        /**
         * 选择表的函数
         * @param process
         * @returns {*}
         */
        getTableFunc: function (process) {
            switch (process_audit.process_type) {
                case 0:
                    return process_audit.funcs.getTablePremix(process);
                case 1:
                    return process_audit.funcs.getTableSize(process);
                case 2:
                    return process_audit.funcs.getTableLithium(process);
                case 3:
                    return process_audit.funcs.getTableBuckle(process);
            }
        },

        /**
         * 更新表
         * @param $div
         * @param process
         */
        changeTable: function ($div, process) {
            $div.empty();
            $div.append(process_audit.funcs.getTableFunc(process));
        },

        /**
         * 更新表格
         * @returns {string}
         */
        chooseTable: function () {
            switch (process_audit.process_type) {
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
         * 隐藏/显示表格
         */
        hideTable: function () {
            var premix_table = $('#premix_table');
            var size_table = $('#size_table');
            var lithium_table = $('#lithium_table');
            var buckle_table = $('#buckle_table');
            switch (process_audit.process_type) {
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
            switch (process_audit.process_type) {
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

        chooseUrlSearch: function () {
            switch (process_audit.process_type) {
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

        chooseUrlCode: function () {
            switch (process_audit.process_type) {
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

        chooseUrlAudit: function () {
            switch (process_audit.process_type) {
                case 0:
                    return home.urls.processPremix.updateAuditByCode();
                case 1:
                    return home.urls.processSize.updateAuditByCode();
                case 2:
                    return home.urls.processLithium.updateAuditByCode();
                case 3:
                    return home.urls.processBuckle.updateAuditByCode();
            }
        },

        chooseHandler: function ($tbody, process) {
            switch (process_audit.process_type) {
                case 0:
                    process_audit.funcs.renderHandlerPremix($tbody, process);
                    break;
                case 1:
                    process_audit.funcs.renderHandlerSize($tbody, process);
                    break;
                case 2:
                    process_audit.funcs.renderHandlerLithium($tbody, process);
                    break;
                case 3:
                    process_audit.funcs.renderHandlerBuckle($tbody, process);
                    break;
            }
        }
    }
}