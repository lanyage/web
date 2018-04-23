var product_audit = {
    init: function () {
        console.log('user = ', home.user.code)
        // display
        product_audit.funcs.renderTable()

        var out = $('#product_audit_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#product_audit_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    }
    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0
    /** 记录当前打开的id */
    , currId: null
    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面*/
        renderTable: function () {
            /** 获取所有记录 */
            var status = $('#status').val()
            $.post(home.urls.product.getAllByStatusCodeByPage(), {
                page: 0,
                statusCode: status
            }, function (result) {
                var products = result.data.content
                const $tbody = $("#product_table").children('tbody')
                product_audit.funcs.renderHandler($tbody, products)
                product_audit.pageSize = result.data.content.length

                console.log("完成刷新");

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'product_audit_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            console.log('不是首次,可以执行')
                            var status = $('#status').val()
                            $.post(home.urls.product.getAllByStatusCodeByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit,
                                statusCode: status
                            }, function (result) {
                                var products = result.data.content //获取数据
                                const $tbody = $("#product_table").children('tbody')
                                product_audit.funcs.renderHandler($tbody, products)
                                product_audit.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            /** 追加状态下拉框事件 */
            var statusSelect = $('#model-li-hide-select-20');
            product_audit.funcs.bindSelectEventListener(statusSelect);
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-20');
            product_audit.funcs.bindRefreshEventListener(refreshBtn);//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-20');
            product_audit.funcs.bindSearchEventListener(searchBtn);
        },

        /** 渲染 */
        renderHandler: function ($tbody, products) {
            $tbody.empty()
            products.forEach(function (e) {
                var status = $('#status').val();
                $tbody.append(
                    "<tr id='product-audit-" + (e.code) + "'>" +
                    "<td>" + product_audit.funcs.getIcon(status, e.code) + "</i></td>" +
                    "<td>" + product_audit.funcs.getAuditor(e.auditor) + "</td>" +
                    "<td>" + product_audit.funcs.formatDate(e.testDate) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.judge.name + "</td>" +
                    "<td>" + e.number + "</td>" +
                    "<td>" + e.p1 + "</td>" +
                    "<td>" + e.p2 + "</td>" +
                    "<td>" + e.p3 + "</td>" +
                    "<td>" + e.p4 + "</td>" +
                    "<td>" + e.p7 + "</td>" +
                    "<td>" + e.p10 + "</td>" +
                    "<td>" + e.p13 + "</td>" +
                    "<td>" + e.p19 + "</td>" +
                    "<td>" + e.p20 + "</td>" +
                    "<td>" + e.p21 + "</td>" +
                    "<td>" + e.p22 + "</td>" +
                    "<td>" + e.p23 + "</td>" +
                    "<td>" + e.p24 + "</td>" +
                    "<td>" + e.p25 + "</td>" +
                    "<td>" + e.p34 + "</td>" +
                    "<td>" + e.p35 + "</td>" +
                    "<td>" + e.p36 + "</td>" +
                    "</tr>"
                )
            })
            var auditBtns = $('.audit')
            var detailBtns = $('.detail')
            product_audit.funcs.bindAuditEventListener(auditBtns)
            product_audit.funcs.bindDetailEventListener(detailBtns)
        },

        /** 刷新事件 */
        bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    product_audit.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },

        /** 搜索事件 */
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
                    product_audit.funcs.renderHandler($tbody, products)
                    layui.laypage.render({
                        elem: 'product_audit_page'
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
                                    product_audit.funcs.renderHandler($tbody, products)
                                    product_audit.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },

        /** 监听状态下拉选框 */
        bindSelectEventListener: function (statusSelect) {
            statusSelect.off('change')
            statusSelect.on('change', function () {
                product_audit.funcs.renderTable()
            })
        },

        /** 审核按钮事件 */
        bindAuditEventListener: function (auditBtns) {
            auditBtns.off('click')
            auditBtns.on('click', function () {
                var _selfBtn = $(this)
                var productCode = _selfBtn.attr('id').substr(6)
                product_audit.currId = "product-audit-" + productCode

                $.post(home.urls.product.getByCode(), {code: productCode}, function (result) {
                    console.log("审核" + productCode)
                    var product = result.data
                    layer.open({
                        type: 1,
                        content: product_audit.funcs.getData(product),
                        area: ['530px', '700px'],
                        btn: ['通过审核', '取消'],
                        offset: 'auto', // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function () {
                            console.log("提交审核" + productCode)
                            $.post(home.urls.product.updateAuditByCode(), {
                                code: productCode,
                                auditorCode: home.user.code,     // 此处需要读取用户编号
                                statusCode: 2
                            }, function (result) {
                                if (result.code == 0) {
                                    // 成功
                                    console.log("审核成功" + productCode);
                                    layer.open({
                                        type: 1,
                                        content: "<div class='align_middle'>" + "审核成功" + "</div>",
                                        area: ['280px', '180px'],
                                        btn: ['关闭'],
                                        offset: 'auto', // ['43%', '49%'],
                                        btnAlign: 'c',
                                        yes: function () {
                                            layer.closeAll();
                                            product_audit.funcs.renderTable();
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
                                            product_audit.funcs.renderTable();
                                        }
                                    });
                                }
                            })
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                    product_audit.funcs.bindLeftBtn($('#model-li-hide-left-20'))
                    product_audit.funcs.bindRightBtn($('#model-li-hide-right-20'))
                })
            })
        },

        /** 查看按钮事件 */
        bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click')
            detailBtns.on('click', function () {
                var _selfBtn = $(this)
                var productCode = _selfBtn.attr('id').substr(6)
                product_audit.currId = "product-audit-" + productCode
                console.log("查看" + productCode)
                $.post(home.urls.product.getByCode(), {code: productCode}, function (result) {
                    var product = result.data
                    layer.open({
                        type: 1,
                        content: product_audit.funcs.getData(product),
                        area: ['530px', '700px'],
                        btn: ['关闭'],
                        offset: 'auto',   // ['10%', '40%'],
                        btnAlign: 'c',
                        yes: function (index) {
                            layer.close(index);
                        }
                    })
                    product_audit.funcs.bindLeftBtn($('#model-li-hide-left-20'))
                    product_audit.funcs.bindRightBtn($('#model-li-hide-right-20'))
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
         * 查看数据，不含表格
         * @param product
         * @returns {string}
         */
        getData: function (product) {
            var data = "<div id='auditModal'>" +
                "<div class='arrow_div_left'>" +
                "<span id='model-li-hide-left-20'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe603;</i></a></span>" +
                "</div>" +
                "<div class='arrow_div_right'>" +
                "<span id='model-li-hide-right-20'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe602;</i></a></span>" +
                "</div>" +
                product_audit.funcs.getTale(product);
            return data
        },

        /**
         * 返回表格
         * @param product
         * @returns {string}
         */
        getTale: function (product){
            return (
                "<div id='div_table' class='table_scroll'>" +
                "<table id='audit_table_inner' class='table_inner' align='center'>" +
                "<thead>" +
                "<tr><td colspan='2'>批号</td><td>检测日期</td><td>数量(t)</td><td>判定</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr><td colspan='2'>" + product.batchNumber + "</td><td>" + product_audit.funcs.formatDate(product.testDate) + "</td><td>" + product.number + "</td><td>" + product.judge.name + "</td></tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr><td colspan='2'>审核状态</td><td>审核人</td><td></td><td></td></tr>" +
                "</thead>" +
                "<tr><td colspan='2'>" + product.status.name + "</td><td>" + product_audit.funcs.getAuditor(product.auditor) + "</td><td></td><td></td></tr>" +
                "<thead>" +
                "<tr><td colspan='2'>检测项目</td><td>三级控制标准</td><td>2016-3-2三级控制标准</td><td>" + product.batchNumber + "</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr><td colspan='2'>振实密度(g/cm3)</td><td>&ge;2.0</td><td>2.3~2.7</td><td>" + product.p1 + "</td></tr>" +
                "<tr><td colspan='2'>水分(ppm)</td><td>&le;500</td><td>&le;200/td><td>" + product.p2 + "</td></tr>" +
                "<tr><td colspan='2'>SSA(m2/g)</td><td>0.20~0.40</td><td>0.22~0.48</td><td>" + product.p3 + "</td></tr>" +
                "<tr><td colspan='2'>pH值</td><td>&le;11.80</td><td>&le;11.80</td><td>" + product.p4 + "</td></tr>" +
                "<tr><td colspan='2'>Li2CO3(%)</td><td></td><td>&le;0.25</td><td>" + product.p5 + "</td></tr>" +
                "<tr><td colspan='2'>LiOH(%)</td><td></td><td>&le;0.20</td><td>" + product.p6 + "</td></tr>" +
                "<tr><td colspan='2'>总Li含量</td><td>&le;100</td><td>&le;120</td><td>" + product.p7 + "</td></tr>" +
                "<tr><td rowspan='6'>粒度(&mu;m)</td><td>D1</td><td></td><td>&ge;3.00</td><td>" + product.p8 + "</td></tr>" +
                "<tr><td>D10</td><td>&ge;6.00</td><td>&ge;5.00</td><td>" + product.p9 + "</td></tr>" +
                "<tr><td>D50</td><td>11.00~14.00</td><td>11.30~13.3</td><td>" + product.p10 + "</td></tr>" +
                "<tr><td>D90</td><td>&le;30.00</td><td>&le;30.00</td><td>" + product.p11 + "</td></tr>" +
                "<tr><td>D99</td><td></td><td>&le;40.00</td><td>" + product.p12 + "</td></tr>" +
                "<tr><td>粒度宽度系数</td><td></td><td></td><td>" + product.p13 + "</td></tr>" +
                "<tr><td rowspan='5'>磁性物质检测(ppb)</td><td>Fe</td><td></td><td></td><td>" + product.p14 + "</td></tr>" +
                "<tr><td>Ni</td><td></td><td></td><td>" + product.p15 + "</td></tr>" +
                "<tr><td>Cr</td><td></td><td></td><td>" + product.p16 + "</td></tr>" +
                "<tr><td>Zn</td><td></td><td></td><td>" + product.p17 + "</td></tr>" +
                "<tr><td>总量</td><td>&le;50</td><td>&le;50</td><td>" + product.p18 + "</td></tr>" +
                "<tr><td colspan='2'>Co(mol%)</td><td></td><td>19.7&plusmn;0.5</td><td>" + product.p19 + "</td></tr>" +
                "<tr><td colspan='2'>Mn(mol%)</td><td></td><td>19.9&plusmn;0.5</td><td>" + product.p20 + "</td></tr>" +
                "<tr><td colspan='2'>Ni(mol%)</td><td></td><td>60.4&plusmn;0.5</td><td>" + product.p21 + "</td></tr>" +
                "<tr><td colspan='2'>Li(%)</td><td>7.0&plusmn;0.5</td><td>7.0&plusmn;0.5</td><td>" + product.p22 + "</td></tr>" +
                "<tr><td colspan='2'>Co(%)</td><td>12.20&plusmn;1.0</td><td>12.20&plusmn;1.0</td><td>" + product.p23 + "</td></tr>" +
                "<tr><td colspan='2'>Mn(%)</td><td>11.4&plusmn;1.0</td><td>11.4&plusmn;1.0</td><td>" + product.p24 + "</td></tr>" +
                "<tr><td colspan='2'>Ni(%)</td><td>36.2&plusmn;1.0</td><td>36.2&plusmn;1.0</td><td>" + product.p25 + "</td></tr>" +
                "<tr><td colspan='2'>Na(ppm)</td><td>&le;200</td><td>&le;200</td><td>" + product.p26 + "</td></tr>" +
                "<tr><td colspan='2'>Mg(ppm)</td><td>&le;200</td><td>&le;200</td><td>" + product.p27 + "</td></tr>" +
                "<tr><td colspan='2'>Ca(ppm)</td><td>&le;200</td><td>&le;200</td><td>" + product.p28 + "</td></tr>" +
                "<tr><td colspan='2'>Fe(ppm)</td><td>&le;50</td><td>&le;30</td><td>" + product.p29 + "</td></tr>" +
                "<tr><td colspan='2'>Cu(ppm)</td><td>&le;50</td><td>&le;20</td><td>" + product.p30 + "</td></tr>" +
                "<tr><td colspan='2'>Zn(ppm)</td><td>&le;50</td><td>&le;30</td><td>" + product.p31 + "</td></tr>" +
                "<tr><td colspan='2'>S(ppm)</td><td></td><td>&le;1500</td><td>" + product.p32 + "</td></tr>" +
                "<tr><td colspan='2'>Al(ppm)</td><td>1000&plusmn;300</td><td>1000&plusmn;300</td><td>" + product.p33 + "</td></tr>" +
                "<tr><td colspan='2'>0.1C放电容量(mAh/g)</td><td></td><td>&ge;177.5</td><td>" + product.p34 + "</td></tr>" +
                "<tr><td colspan='2'>0.1C首次放电效率(%)</td><td></td><td>&ge;88.0</td><td>" + product.p35 + "</td></tr>" +
                "<tr><td colspan='2'>1C放电容量(mAh/g)</td><td></td><td>&ge;162</td><td>" + product.p36 + "</td></tr>" +
                "<tr><td colspan='2'>主原料</td><td></td><td></td><td>" + product.p37 + "</td></tr>" +
                "<tr><td colspan='2'>成品外观、重量抽查结果</td><td></td><td></td><td>" + product.p38 + "</td></tr>" +
                "<tr><td colspan='2'>产线</td><td></td><td></td><td>" + product.p39 + "</td></tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</div>"
            )
        },

        bindLeftBtn: function (leftBtn) {
            leftBtn.off('click');
            leftBtn.on('click', function () {
                console.log("左");
                var $table = $('#product_table');
                var firstId = $($table.children('tbody').children('tr')[0]).attr('id');
                if (firstId != product_audit.currId){
                    var prevCode = $('#' + product_audit.currId).prev('tr').attr('id').substr(14);
                    console.log(prevCode);
                    $.post(home.urls.product.getByCode(), {code: prevCode}, function (result) {
                        product_audit.currId = "product-audit-" + prevCode;
                        var product = result.data;
                        const $div = $("#div_table");
                        product_audit.funcs.changeTable($div, product);
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

        bindRightBtn: function (rightBtn) {
            rightBtn.off('click');
            rightBtn.on('click', function () {
                console.log("右");
                var $table = $('#product_table');
                var lastId = $($table.children('tbody').children('tr')[9]).attr('id');
                if (lastId != product_audit.currId) {
                    var nextCode = $('#' + product_audit.currId).next('tr').attr('id').substr(14);
                    console.log(nextCode);
                    $.post(home.urls.product.getByCode(), {code: nextCode}, function (result) {
                        product_audit.currId = "product-audit-" + nextCode;
                        var product = result.data;
                        const $div = $("#div_table");
                        product_audit.funcs.changeTable($div, product);
                    })
                }
                else{
                    console.log("Last one");
                    layer.msg('已经是页面最后一项', {
                        time: 1000
                    })
                }
            })
        },

        /**
         * 更新表
         * @param $div
         * @param product
         */
        changeTable: function ($div, product) {
            $div.empty();
            $div.append(product_audit.funcs.getTale(product));
        }
    }
}