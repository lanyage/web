var raw_audit = {
    init: function () {
        // display
        raw_audit.funcs.renderTable();

        // hide
        var lithium_table = $('#lithium_table');
        lithium_table.hide();

        var out = $('#raw_audit_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#raw_audit_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    }
    , raw_type: 0   // choose material type: 0-personma, 1-lithium
    , pageSize: 0
    , funcs: {
        renderTable: function () {
            /** 获取所有记录 */
            var status = $('#status').val()
            if (raw_audit.raw_type === 0) {
                $.post(home.urls.rawPresoma.getAllByStatusCodeByPage(), {
                    page: 0,
                    statusCode: status
                }, function (result) {
                    var presomas = result.data.content
                    const $tbody = $("#presoma_table").children('tbody')
                    raw_audit.funcs.renderHandlerPresoma($tbody, presomas)
                    raw_audit.pageSize = result.data.content.length

                    var page = result.data
                    /** @namespace page.totalPages 这是返回数据的总页码数 */
                    /** 分页信息 */
                    layui.laypage.render({
                        elem: 'raw_audit_page'
                        , count: 10 * page.totalPages//数据总数
                        /** 页面变化后的逻辑 */
                        , jump: function (obj, first) {
                            if (!first) {
                                console.log('不是首次,可以执行')
                                var status = $('#status').val()
                                $.post(home.urls.rawPresoma.getAllByStatusCodeByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit,
                                    statusCode: status
                                }, function (result) {
                                    var presomas = result.data.content //获取数据
                                    const $tbody = $("#presoma_table").children('tbody')
                                    raw_audit.funcs.renderHandlerPresoma($tbody, presomas)
                                    raw_audit.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            }
            else {
                $.post(home.urls.rawLithium.getAllByStatusCodeByPage(), {
                    page: 0,
                    statusCode: status
                }, function (result) {
                    var lithiums = result.data.content
                    const $tbody = $("#presoma_table").children('tbody')
                    raw_audit.funcs.renderHandlerLithium($tbody, lithiums)
                    raw_audit.pageSize = result.data.content.length

                    var page = result.data
                    /** @namespace page.totalPages 这是返回数据的总页码数 */
                    /** 分页信息 */
                    layui.laypage.render({
                        elem: 'raw_audit_page'
                        , count: 10 * page.totalPages//数据总数
                        /** 页面变化后的逻辑 */
                        , jump: function (obj, first) {
                            if (!first) {
                                console.log('不是首次,可以执行')
                                var status = $('#status').val()
                                $.post(home.urls.rawLithium.getAllByStatusCodeByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit,
                                    statusCode: status
                                }, function (result) {
                                    var lithiums = result.data.content //获取数据
                                    const $tbody = $("#lithium_table").children('tbody')
                                    raw_audit.funcs.renderHandler($tbody, lithiums)
                                    raw_audit.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            }

            // 追加刷新事件
            var refreshBtn = $('#model-li-hide-refresh-21');
            raw_audit.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件
            // 追加搜索事件
            var searchBtn = $('#model-li-hide-search-21');
            raw_audit.funcs.bindSearchEventListener(searchBtn);
            // 追加状态下拉框事件
            var statusSelect = $('#model-li-hide-select-21');
            raw_audit.funcs.bindSelectEventListener(statusSelect);
            // 追加类别选择事件
            var presomaSelect = $('#select-presoma');
            var lithiumSelect = $('#select-lithium');
            raw_audit.funcs.selectPresoma(presomaSelect);
            raw_audit.funcs.selectLithium(lithiumSelect);
        },

        selectPresoma: function (presomaSelect) {
            presomaSelect.off('click');
            presomaSelect.on('click', function () {
                if (raw_audit.raw_type === 1) {
                    raw_audit.raw_type = 0;
                }
            })
        },

        selectLithium: function (lithiumSelect) {

        },

        /**
         * 渲染presoma-已完成
         * @param $tbody
         * @param presomas
         */
        renderHandlerPresoma: function ($tbody, presomas) {
            $tbody.empty()
            presomas.forEach(function (e) {
                var status = $('#status').val()
                $tbody.append(
                    "<tr>" +
                    "<td>" + raw_audit.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + raw_audit.funcs.getAuditor(e.auditor) + "</td>" +
                    "<td>" + raw_audit.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.insideCode + "</td>" +
                    "<td>" + raw_audit.funcs.formatDate(e.productDate) + "</td>" +
                    "<td>" + e.number + "</td>" +
                    "<td>" + e.judge.name + "</td>" +
                    "<td>" + e.c1 + "</td>" +
                    "<td>" + e.c2 + "</td>" +
                    "<td>" + e.c3 + "</td>" +
                    "<td>" + e.c4 + "</td>" +
                    "<td>" + e.c7 + "</td>" +
                    "<td>" + e.c10 + "</td>" +
                    "<td>" + e.c16 + "</td>" +
                    "<td>" + e.c17 + "</td>" +
                    "<td>" + e.c18 + "</td>" +
                    "<td>" + e.c19 + "</td>" +
                    "<td>" + e.c20 + "</td>" +
                    "<td>" + e.c21 + "</td>" +
                    "<td>" + e.c22 + "</td>" +
                    "<td>" + e.c23 + "</td>" +
                    "<td>" + e.c24 + "</td>" +
                    "<td>" + e.c25 + "</td>" +
                    "</tr>"
                )
            })
            var auditBtns = $('.audit')
            var detailBtns = $('.detail')
            raw_audit.funcs.bindAuditEventListener(auditBtns)
            raw_audit.funcs.bindDetailEventListener(detailBtns)
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
                    raw_audit.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },

        /**
         * 搜索事件-需要分离
         * @param searchBtn
         */
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                console.log('search')
                var product_batch_number = $('#product_batch_number_input').val()
                var status = $('#status').val()
                $.post(home.urls.product.getByLikeBatchNumberByPage(), {
                    batchNumber: product_batch_number,
                    statusCode: status
                }, function (result) {
                    var page = result.data
                    var products = result.data.content //获取数据
                    var status = $('#status').val()
                    const $tbody = $("#product_table").children('tbody')
                    raw_audit.funcs.renderHandler($tbody, products)
                    layui.laypage.render({
                        elem: 'raw_audit_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.product.getByLikeBatchNumberByPage(), {
                                    batchNumber: product_batch_number,
                                    statusCode: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var products = result.data.content //获取数据
                                    const $tbody = $("#product_table").children('tbody')
                                    raw_audit.funcs.renderHandler($tbody, products)
                                    raw_audit.pageSize = result.data.content.length
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
            statusSelect.change(function () {
                raw_audit.funcs.renderTable()
            })
        },

        /**
         * 审核按钮-需要分离？
         * @param auditBtns
         */
        bindAuditEventListener: function (auditBtns) {
            auditBtns.off('click')
            auditBtns.on('click', function () {
                var _selfBtn = $(this)
                var presomaCode = _selfBtn.attr('id').substr(6)
                console.log("审核" + presomaCode)
                $.post(home.urls.rawPresoma.getByCode(), {code: presomaCode}, function (result) {
                    var presoma = result.data
                    layer.open({
                        type: 1,
                        content: raw_audit.funcs.getDataPresoma(presoma),
                        area: ['550px', '700px'],
                        btn: ['通过审核', '取消'],
                        offset: 'auto', // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function () {
                            console.log("提交审核" + presomaCode);
                            $.post(home.urls.rawPresoma.updateAuditByCode(), {
                                code: presomaCode,
                                auditorCode: "001",     // 此处需要读取用户编号
                                statusCode: 2
                            }, function (result) {
                                if (result.code == 0) {
                                    // 成功
                                    console.log("审核成功" + presomaCode);
                                    layer.open({
                                        type: 1,
                                        content: "<div class='align_middle'>" + "审核成功" + "</div>",
                                        area: ['280px', '180px'],
                                        btn: ['关闭'],
                                        offset: 'auto', // ['43%', '49%'],
                                        btnAlign: 'c',
                                        yes: function () {
                                            layer.closeAll();
                                            raw_audit.funcs.renderTable();
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
                                            raw_audit.funcs.renderTable();
                                        }
                                    });
                                }
                            })
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
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
                var presomaCode = _selfBtn.attr('id').substr(6)
                console.log("查看" + presomaCode)
                $.post(home.urls.rawPresoma.getByCode(), {code: presomaCode}, function (result) {
                    var presoma = result.data
                    layer.open({
                        type: 1,
                        content: raw_audit.funcs.getDataPresoma(presoma),
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

        /** 日期格式化 */
        formatDate: function (strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },

        /** 获得审核人*/
        getAuditor: function (e) {
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
         * 查看presoma-需要修改标准
         * @param presoma
         * @returns {string}
         */
        getDataPresoma: function (presoma) {
            return (
                "<div id='auditModal'>" +
                "<div class='arrow_div_left'>" +
                "<span id='model-li-hide-left-20'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe603;</i></a></span>" +
                "</div>" +
                "<div class='arrow_div_right'>" +
                "<span id='model-li-hide-right-20'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe602;</i></a></span>" +
                "</div>" +
                "<div class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr><td colspan='2'>批号</td><td>检测日期</td><td>数量(t)</td><td>判定</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr><td colspan='2'>" + presoma.batchNumber + "</td><td>" + raw_audit.funcs.formatDate(presoma.testDate) + "</td><td>" + presoma.number + "</td><td>" + presoma.judge.name + "</td></tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr><td colspan='2'>审核状态</td><td>审核人</td><td></td><td></td></tr>" +
                "</thead>" +
                "<tr><td colspan='2'>" + presoma.status.name + "</td><td>" + raw_audit.funcs.getAuditor(presoma.auditor) + "</td><td></td><td></td></tr>" +
                "<thead>" +
                "<tr><td colspan='2'>检测项目</td><td>控制采购标准-2016-11-21</td><td>2017.07.01采购标准</td><td>" + presoma.batchNumber + "</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr><td colspan='2'>振实密度(g/cm3)</td><td>&ge;2.0</td><td>2.3~2.7</td><td>" + presoma.c1 + "</td></tr>" +
                "<tr><td colspan='2'>水分(ppm)</td><td>&le;500</td><td>&le;200/td><td>" + presoma.c2 + "</td></tr>" +
                "<tr><td colspan='2'>SSA(m2/g)</td><td>0.20~0.40</td><td>0.22~0.48</td><td>" + presoma.c3 + "</td></tr>" +
                "<tr><td colspan='2'>pH值</td><td>&le;11.80</td><td>&le;11.80</td><td>" + presoma.c4 + "</td></tr>" +
                "<tr><td rowspan='5'>粒度(&mu;m)</td><td>D1</td><td></td><td>&ge;3.00</td><td>" + presoma.c5 + "</td></tr>" +
                "<tr><td>D10</td><td>&ge;6.00</td><td>&ge;5.00</td><td>" + presoma.c6 + "</td></tr>" +
                "<tr><td>D50</td><td>11.00~14.00</td><td>11.30~13.3</td><td>" + presoma.c7 + "</td></tr>" +
                "<tr><td>D90</td><td>&le;30.00</td><td>&le;30.00</td><td>" + presoma.c8 + "</td></tr>" +
                "<tr><td>D99</td><td></td><td>&le;40.00</td><td>" + presoma.c9 + "</td></tr>" +
                "<tr><td colspan='2'>筛上物</td><td>&le;11.80</td><td>&le;11.80</td><td>" + presoma.c10 + "</td></tr>" +
                "<tr><td rowspan='5'>磁性物质检测(ppb)</td><td>Fe</td><td></td><td></td><td>" + presoma.c11 + "</td></tr>" +
                "<tr><td>Ni</td><td></td><td></td><td>" + presoma.c12 + "</td></tr>" +
                "<tr><td>Cr</td><td></td><td></td><td>" + presoma.c13 + "</td></tr>" +
                "<tr><td>Zn</td><td></td><td></td><td>" + presoma.c14 + "</td></tr>" +
                "<tr><td>总量</td><td>&le;50</td><td>&le;50</td><td>" + presoma.c15 + "</td></tr>" +
                "<tr><td colspan='2'>Ni+Co+Mn(%)</td><td></td><td>19.7&plusmn;0.5</td><td>" + presoma.c16 + "</td></tr>" +
                "<tr><td colspan='2'>Co(%)</td><td></td><td>19.7&plusmn;0.5</td><td>" + presoma.c17 + "</td></tr>" +
                "<tr><td colspan='2'>Mn(%)</td><td></td><td>19.9&plusmn;0.5</td><td>" + presoma.c18 + "</td></tr>" +
                "<tr><td colspan='2'>Ni(%)</td><td></td><td>60.4&plusmn;0.5</td><td>" + presoma.c19 + "</td></tr>" +
                "<tr><td colspan='2'>Na(ppm)</td><td>&le;200</td><td>&le;200</td><td>" + presoma.c20 + "</td></tr>" +
                "<tr><td colspan='2'>Mg(ppm)</td><td>&le;200</td><td>&le;200</td><td>" + presoma.c21 + "</td></tr>" +
                "<tr><td colspan='2'>Ca(ppm)</td><td>&le;200</td><td>&le;200</td><td>" + presoma.c22 + "</td></tr>" +
                "<tr><td colspan='2'>Fe(ppm)</td><td>&le;50</td><td>&le;30</td><td>" + presoma.c23 + "</td></tr>" +
                "<tr><td colspan='2'>Cu(ppm)</td><td>&le;50</td><td>&le;20</td><td>" + presoma.c24 + "</td></tr>" +
                "<tr><td colspan='2'>Cd(ppm)</td><td>&le;50</td><td>&le;30</td><td>" + presoma.c25 + "</td></tr>" +
                "<tr><td colspan='2'>Zn(ppm)</td><td>&le;50</td><td>&le;30</td><td>" + presoma.c26 + "</td></tr>" +
                "<tr><td colspan='2'>S(ppm)</td><td></td><td>&le;1500</td><td>" + presoma.c27 + "</td></tr>" +
                "<tr><td colspan='2'>Cl-(%)</td><td>1000&plusmn;300</td><td>1000&plusmn;300</td><td>" + presoma.c28 + "</td></tr>" +
                "<tr><td colspan='2'>Zr(ppm)</td><td>1000&plusmn;300</td><td>1000&plusmn;300</td><td>" + presoma.c29 + "</td></tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            );
        }

    }
}