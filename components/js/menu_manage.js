var menu_manage = {
    menu1s: [],
    menu2s: [],
    menu3s: [],
    operations: [],
    currentOperations: [],
    init: function () {
        /** 获取所有的operations */
        menu_manage.funcs.storeOperations()
        /** 渲染一级菜单 */
        menu_manage.funcs.renderMenu1()
        /** 绑定所有的操作管理事件 */
        menu_manage.funcs.bindAllEvent()
    },
    funcs: {
        /** 渲染一级菜单 */
        renderMenu1: function () {
            $('#menu1List').empty()
            $.get(home.urls.menus.getAllMenu1(), {sort: 'rank'}, function (result) {
                menu_manage.funcs.sortMenus(result.data)
                menu_manage.menu1s = result.data //存储一级菜单
                menu_manage.menu1s.forEach(function (e, index) {
                    if (index == 0)
                        $('#menu1List').append("<li class='item selected' id='menu1-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu1-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' class='shift-down' id='menu1-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu1-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu1-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                    else
                        $('#menu1List').append("<li class='item' id='menu1-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu1-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' class='shift-down' id='menu1-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu1-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu1-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                })
                /** 渲染二级菜单 */
                menu_manage.funcs.renderMenu2()
                /** 为一级菜单添加点击事件 */
                menu_manage.funcs.bindClickForMenu1s($('#menu1List .item .mainClick'))
            })
        },
        sortMenus: function (menus) {
            menus.sort(function (a, b) {
                return a.rank - b.rank
            })
        },
        /** 渲染二级菜单 */
        renderMenu2: function () {
            $('#operationList').empty()
            // /** 获取所有的三级菜单 */
            $.get(home.urls.menus.getAllMenu3(), {sort: 'rank'}, function (result) {
                menu_manage.funcs.sortMenus(result.data)
                menu_manage.menu3s = result.data //存储三级菜单
            })
            /** 获取所有二级菜单 */
            $.get(home.urls.menus.getAllMenu2(), {sort: 'rank'}, function (result) {
                menu_manage.funcs.sortMenus(result.data)
                menu_manage.menu2s = result.data //存储二级菜单

                /** 过滤掉不是当前选中一级菜单下的二级菜单 */
                var menu2ToSelected = menu_manage.funcs.getCurrentMenu2(menu_manage.menu2s, $('.selected').attr('id').substr(6))

                /** 清空二级菜单的container */
                $('#menu2List').empty()
                /** 给二级菜单的容器添加二级菜单 */
                menu2ToSelected.forEach(function (e) {
                    $('#menu2List').append("<li class='item' id='menu2-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu2-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' class='shift-down' id='menu2-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu2-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu2-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                })
                /** 给容器中二级菜单添加点击事件 */
                menu_manage.funcs.bindClickForMenu2($('#menu2List .item .mainClick'))
                menu_manage.funcs.bindCrubEvent()
                /** 给所有footer下面的链接添加点击事件 */
                menu_manage.funcs.bindAddEventListener($('footer .addBtn'))
            })
        },
        bindCrubEvent: function () {
            /** 给1 2级菜单删除按钮绑定事件 */
            menu_manage.funcs.bindDeleteEventListener($('.deleteBtn'))
            /** 给1 2级编辑按钮绑定事件 */
            menu_manage.funcs.bindEditEventListener($('.editBtn'))
            /** 给1 2级shift上按钮绑定事件 */
            menu_manage.funcs.bindShiftUpListener($('.shift-up'))
            /** 给1 2级shift下按钮绑定事件 */
            menu_manage.funcs.bindShiftDownListener($('.shift-down'))
        }
        /**
         * 获取当前选中一级菜单下的所有二级菜单
         * @param candidates 所有的二级菜单候选项
         * @param menu1Code 被选中的一级菜单的code,默认是第一个一级菜单被选中
         * @returns {*|{TAG, CLASS, ATTR, CHILD, PSEUDO}|Array.<T>}
         */
        , getCurrentMenu2: function (candidates, menu1Code) {
            var menu2ToMenu1 = candidates.filter(function (ele) {
                return ele.menu1.code == menu1Code
            })
            menu2ToMenu1.sort(function (a, b) {
                return a.rank - b.rank
            }) //一级菜单排序
            return menu2ToMenu1
        }
        /**
         * 获取当前二级菜单下的三级菜单
         * @param candidates 三级菜单候选项
         * @param menu2Code 当前二级菜单下的三级菜单
         * @returns {*|{TAG, CLASS, ATTR, CHILD, PSEUDO}|Array.<T>}
         */
        , getCurrentMenu3: function (candidates, menu2Code) {
            var menu3ToMenu2 = candidates.filter(function (ele) {
                return ele.menu2.code == menu2Code
            })
            menu3ToMenu2.sort(function (a, b) {
                return a.code - b.code
            })
            return menu3ToMenu2
        }
        /** 为一级菜单绑定点击事件 */
        , bindClickForMenu1s: function (items) {
            items.off('click')
            items.on('click', function () {
                /** 点击所有的一级菜单的时候都必须将三级菜单关掉 */
                /** 页面加载完就有了所有的一二三级菜单 */
                // console.log(menu_manage.menu1s)
                // console.log(menu_manage.menu2s)
                // console.log(menu_manage.menu3s)
                $('#menu3List').empty()
                $('.md4 .selected').removeClass('selected')
                $(this).parent('li').addClass('selected')
                menu_manage.funcs.renderMenu2()
            })
        }
        , renderMenu3: function (items) {
            $('#operationList').empty()
            $('#menu3List').empty()
            items.forEach(function (e) {
                $('#menu3List').append("<li class='item' id='menu3-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu3-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' class='shift-down' id='menu3-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu3-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu3-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
            })
            /** 在此处的话已经完全渲染了当前二级菜单下的menu3了,然后要给所有的存在的menu3绑定点击事件 */
            menu_manage.funcs.bindClickForModels($('#menu3List .item .mainClick'))
        }
        /** 给models绑定点击事件 */
        , bindClickForModels: function (items) {
            items.off('click')
            items.on('click', function () {
                $('.md4 .selected-model').removeClass('selected-model')
                $(this).parent('li').addClass('selected-model')
                var currentModelCode = $(this).parent('li').attr('id').substr(6)
                /** 获取所有的operations */
                $.post(home.urls.menus.getOperationsByModel(), {modelCode: currentModelCode}, function (result) {
                    menu_manage.currentOperations.splice(0, menu_manage.currentOperations.length)

                    /** 获取了所有的operations 然后需要给东西填充*/
                    $('#operationList').empty()
                    result.data.forEach(function (e) {
                        var currentOperation = menu_manage.operations.filter(function (ele) {
                            return ele.code == e.operationCode
                        })[0]
                        menu_manage.currentOperations.push(currentOperation)
                        $('#operationList').append("<li class='item' id='operation-" + (currentOperation.code) + "'><a href='#' class='mainClick'>" + (currentOperation.name) + "</a>&nbsp;<a href='#' class='rm-circle'><i class='fa fa-times-circle-o'></i></a></li>")
                    })
                    //所有的三级菜单添加好之后,要给删除按钮绑定事件
                    menu_manage.funcs.bindRemoveClickfor($('.rm-circle'));
                })
            })
        }
        /** 移除click事件的绑定 */
        , bindRemoveClickfor: function (items) {
            items.off("click")
            items.on('click', function () {
                var operationCode = $(this).parent('li').attr('id').substr(10)
                var modelCode = $('.selected-model').attr('id').substr(6)
                $(this).parent('li').remove()
                /** 调用删除operation的接口 */
                $.post(home.urls.menus.deleteOperationModel(), {
                    modelCode: modelCode,
                    operationCode: operationCode
                }, function (res) {
                    layer.msg(res.message, {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                })
            })
        }
        /** 给二级菜单绑定点击事件 */
        , bindClickForMenu2: function (items) {
            items.off('click')
            items.on('click', function () {
                $('.md4 .selected-menu2').removeClass('selected-menu2')
                $(this).parent('li').addClass('selected-menu2')
                /** 获取三级菜单 */
                var currentMenu3s = menu_manage.funcs.getCurrentMenu3(menu_manage.menu3s, $(this).parent('li').attr('id').substr(6))
                /** 渲染当前二级菜单下的三级菜单 */
                menu_manage.funcs.renderMenu3(currentMenu3s)
                /** 给三级菜单删除按钮绑定事件 */
                menu_manage.funcs.bindDeleteEventListener($('.deleteBtn'))
                /** 给三级菜单按钮绑定编辑事件 */
                menu_manage.funcs.bindEditEventListener($('.editBtn'))
                /** 给3级shift上按钮绑定事件 */
                menu_manage.funcs.bindShiftUpListener($('.shift-up'))
                /** 给3级shift下按钮绑定事件 */
                menu_manage.funcs.bindShiftDownListener($('.shift-down'))
                /** 给三级菜单绑定新增事件*/
                menu_manage.funcs.bindAddEventListener($('footer .addBtn'))
            })
        }
        , bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                //首先弹出一个询问框
                var _this = $(this)
                var deleteUrl
                var subList
                switch (_this.attr('id').charAt(4)) {
                    case '1' :
                        (function () {
                            deleteUrl = home.urls.menus.deleteMenu1ByCode()
                            subList = menu_manage.funcs.getCurrentMenu2(menu_manage.menu2s, _this.attr('id').substr(14))
                        })();
                        break;
                    case '2' :
                        (function () {
                            deleteUrl = home.urls.menus.deleteMenu2ByCode()
                            subList = menu_manage.funcs.getCurrentMenu3(menu_manage.menu3s, _this.attr('id').substr(14))
                        })();
                        break;
                    case '3' :
                        (function () {
                            deleteUrl = home.urls.menus.deleteMenu3ByCode()
                            subList = []
                        })();
                        break;
                }
                /** 获取当前二级菜单下的三级菜单 */
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                    area: ['180px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        /** 接下来就是不存在子菜单的情况 */
                        var menuCode = _this.attr('id').substr(14)
                        $.post(deleteUrl, {code: menuCode}, function (result) {
                            if (result.code != 0) {
                                layer.msg('当前' + _this.attr('id').charAt(4) + '级菜单下还存在子菜单,您必须删除其下的所有子菜单后才能删除该菜单！', {
                                    offset: ['45%', '48%'],
                                    time: 1200
                                })
                            }
                            /** 三级菜单删除成功后的逻辑 */
                            if (result.code == 0 && deleteUrl.indexOf('model') > -1) {
                                /** 删除成功之后还需要渲染三级菜单 */
                                $.get(home.urls.menus.getAllMenu3(), {sort: 'rank'}, function (result) {
                                    menu_manage.funcs.sortMenus(result.data)
                                    menu_manage.menu3s = result.data //存储三级菜单
                                    menu_manage.funcs.bindClickForMenu2($('#menu2List .item .mainClick'))
                                })
                                $('#menu3List').children('#' + _this.parent('li').attr('id')).remove()
                            }
                            /** 如果删除二级菜单成功 */
                            if (result.code == 0 && deleteUrl.indexOf('menu2') > -1) {
                                /** 删除二级菜单首先清空三级菜单 */
                                $('#menu3List') && $('#menu3List').empty()
                                $('.selected-menu2') ? $('.selected-menu2').removeClass('selected-menu2') : (function () {
                                })()
                                /** 在二级菜单中删除指定的元素 */
                                $('#menu2List').children('#' + _this.parent('li').attr('id')).remove()
                            }
                            /** 如果删除一级菜单成功 */
                            if (result.code == 0 && deleteUrl.indexOf('menu1') > -1) {
                                $('#menu3List') && $('#menu3List').empty()
                                $('#menu2List') && $('#menu2List').empty()
                                //删除一级菜单不能级联删除二级菜单和三级菜单
                                $('#menu1List').children('#' + _this.parent('li').attr('id')).remove()
                            }
                            layer.close(index)
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
            })
        }//$ bindDeleteEventListener_end$

        /** 添加事件 */
        , bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                /** 弹出一个询问框 */
                var _this = $(this)
                /** 如果是点击三级菜单的添加必须要先选定二级菜单,否则就要弹出相应的提示框 */
                if (_this.attr('id').substr(4) == 2 && !$('.selected')[0]) {
                    layer.msg('您还没有选择一级级菜单,请先选择一级菜单项', {
                        offset: ['45%', '47%'],
                        time: 900
                    })
                    return
                }
                if (_this.attr('id').substr(4) == 3 && !$('.selected-menu2')[0]) {
                    layer.msg('您还没有选择二级菜单,请先选择二级菜单项', {
                        offset: ['45%', '47%'],
                        time: 900
                    })
                    return
                }
                if (_this.attr('id') == 'operation_manage' && !$('.selected-model')[0]) {
                    layer.msg('您还没有选择三级菜单,请先选择二级菜单项', {
                        offset: ['45%', '47%'],
                        time: 900
                    })
                    return
                }

                var content
                var options = [];
                options.push("<select id='operations-select' style='width: 50%;' '>")
                menu_manage.operations.forEach(function (e, index) {
                    options.push("<option value='" + (e.code) + "'>" + (e.name) + "</option>")
                })
                options.push("</select>")
                var select = options.join("\n")
                if (_this.attr('id').substr(4) == 1)
                    content = ("<div id='addModal'>" +
                    "<div style='text-align: center;padding:10px 30px 10px 20px;'>" +
                    "<p style='padding: 5px 0px 5px 0px;'><div class='fl' style='text-align: right;width: 30%'>菜单名称:</div><div class='fl' style='padding-left: 3%'><input type='text' id='menu_name'/></div></p>" +
                    "<div style='padding: 5px'></div>" +
                    "<p style='padding: 5px 0px 5px 0px;margin-top: 5px;'><div class='fl' style='text-align: right;width: 30%'>菜单路径:</div><div class='fl' style='padding-left: 3%'><input type='text' id='menu_path'/></div></p>" +
                    "</div>" +
                    "</div>")
                else if (_this.attr('id').substr(4) == 2 || _this.attr('id').substr(4) == 3)
                    content = ("<div id='addModal'>" +
                    "<div style='text-align: center;padding:10px 30px 10px 20px;'>" +
                    "<p style='padding: 5px 0px 5px 0px;'><div class='fl' style='text-align: right;width: 30%'>菜单名称:</div><div class='fl' style='padding-left: 3%'><input type='text' id='menu_name'/></div></p>" +
                    "</div>" +
                    "</div>")
                if (_this.attr('id') != 'operation_manage') {
                    layer.open({
                        type: 1,
                        title: '添加',
                        content: content,
                        area: [_this.attr('id').substr(4) == 1 ? '330px' : '318px', _this.attr('id').substr(4) == 1 ? '180px' : '150px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var menuName = $('#menu_name').val()
                            var menuPath = $('#menu_path').val()
                            /** 请求添加元素的接口地址 */
                            var addUrl;
                            /** 请求添加元素所要传输的数据 */
                            var addData;
                            switch (_this.attr('id').substr(4)) {
                                case '1' :
                                    (function () {
                                        addUrl = home.urls.menus.addMenu1()
                                        addData = {name: menuName, path: menuPath}
                                    })();
                                    break;
                                case '2' :
                                    (function () {
                                        addUrl = home.urls.menus.addMenu2()
                                        addData = {
                                            name: menuName,
                                            'menu1.code': $('#menu1List').children('.selected').attr('id').substr(6)
                                        }
                                    })();
                                    break;
                                case '3' :
                                    (function () {
                                        addUrl = home.urls.menus.addMenu3()
                                        addData = {
                                            name: menuName,
                                            'menu1.code': $('#menu1List').children('.selected').attr('id').substr(6),
                                            'menu2.code': $('#menu2List').children('.selected-menu2').attr('id').substr(6)
                                        }
                                    })();
                                    break;
                            }
                            var addType = _this.attr('id').substr(4)
                            $.post(addUrl, addData, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        /** 如果添加成功了以后要重新填充容器,还要分情况,添加一菜单不需要设置什么,添加二级菜单要设置其相应的1级菜单,添加三级菜单的时候需要添加相应的二级菜单和一级菜单 */
                                        addType == '1' && (function () {
                                            $('#menu1List').append("<li class='item' id='menu1-" + (result.data.code) + "'><a href='#' class='mainClick'>" + (result.data.name) + "</a>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu1-move-up-tab-" + (result.data.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' class='shift-down' id='menu1-move-down-tab-" + (result.data.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu1-edit-tab-" + (result.data.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu1-del-tab-" + (result.data.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                                            menu_manage.funcs.bindClickForMenu1s($('#menu1List .item .mainClick'))
                                            menu_manage.funcs.bindCrubEvent()
                                        })()
                                        addType == '2' && (function () {
                                            $('#menu2List').append("<li class='item' id='menu2-" + (result.data.code) + "'><a href='#' class='mainClick'>" + (result.data.name) + "</a>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu2-move-up-tab-" + (result.data.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' class='shift-down' id='menu2-move-down-tab-" + (result.data.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu2-edit-tab-" + (result.data.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu2-del-tab-" + (result.data.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                                            /** 给容器中二级菜单添加点击事件 */
                                            menu_manage.funcs.bindClickForMenu2($('#menu2List .item .mainClick'))
                                            menu_manage.funcs.bindCrubEvent()
                                        })()
                                        addType == '3' && (function () {
                                            // /** 获取所有的三级菜单 */
                                            $.get(home.urls.menus.getAllMenu3(), {sort: 'rank'}, function (result) {
                                                menu_manage.funcs.sortMenus(result.data)
                                                menu_manage.menu3s = result.data //存储三级菜单
                                                /** 继续给二级菜单绑定事件 */
                                                menu_manage.funcs.bindClickForMenu2($('#menu2List .item .mainClick'))
                                            })
                                            $('#menu3List').append("<li class='item' id='menu3-" + (result.data.code) + "'><a href='#' class='mainClick'>" + (result.data.name) + "</a>&nbsp;&nbsp;<a href='#' class='shift-up' id='menu3-move-up-tab-" + (result.data.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' class='shift-down' id='menu3-move-down-tab-" + (result.data.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu3-edit-tab-" + (result.data.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu3-del-tab-" + (result.data.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                                            menu_manage.funcs.bindClickForModels($('#menu3List .item .mainClick'))
                                            menu_manage.funcs.bindCrubEvent()
                                        })()
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
                } else {
                    layer.open({
                        type: 1,
                        title: '选择操作',
                        content: $('#operations_table_wrapper'),
                        area: ['580px', '300px'],
                        btn: ['确认', '取消'],
                        offset: ['35%', '35%'],
                        closeBtn: 0,
                        yes: function (index) {
                            layer.close(index)
                            $("#operations_table_wrapper").css('display', 'none')
                        },
                        btn2: function (index) {
                            layer.close(index)
                            $("#operations_table_wrapper").css('display', 'none')
                        }
                    })
                    var $tbody = $("#operations_table").children("tbody")
                    $tbody.empty()
                    // console.log(menu_manage.operations)
                    // console.log(menu_manage.currentOperations)
                    menu_manage.operations.forEach(function (e) {
                        $tbody.append("<tr>" +
                            "<td><input type='checkbox' class='operation_box'></td>" +
                            "<td>" + (e.code) + "</td>" +
                            "<td>" + (e.name) + "</td>" +
                            "</tr>")
                    })
                    /** 绑定全选事件 */
                    menu_manage.funcs.bindSelectAll($("#operations_checkAll"))
                    /** 绑定非全选事件 */
                    menu_manage.funcs.disselectAll($(".operation_box"), $("#operations_checkAll"))
                }
            })

        }//$ bindAddEventListener——end$
        /** 编辑事件 */
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _this = $(this)
                var menuCode = _this.attr('id').substr(15)
                var detailUrl
                var container
                switch (_this.attr('id').charAt(4)) {
                    case '1' :
                        (function () {
                            detailUrl = home.urls.menus.getMenu1ByCode()
                            container = $('#menu1List')
                        })();
                        break;
                    case '2' :
                        (function () {
                            detailUrl = home.urls.menus.getMenu2ByCode()
                            container = $('#menu2List')
                        })();
                        break;
                    case '3' :
                        (function () {
                            detailUrl = home.urls.menus.getMenu3ByCode()
                            container = $('#menu3List')
                        })();
                        break;
                }
                /** 更新之前先查询填充表单元素 */
                $.post(detailUrl, {code: menuCode}, function (result) {
                    var menu = result.data
                    layer.open({
                        type: 1,
                        content: _this.attr('id').charAt(4) == 1 ?
                            ("<div id='editModal'>" +
                            "<div style='text-align: center;padding:10px 30px 10px 20px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'><div class='fl' style='text-align: right;width: 30%'>菜单名称:</div><div class='fl' style='padding-left: 3%'><input type='text' id='menu_name' value='" + (menu.name) + "'/></div></p>" +
                            "<div style='padding: 5px'></div>" +
                            "<p style='padding: 5px 0px 5px 0px;margin-top: 5px;'><div class='fl' style='text-align: right;width: 30%'>路径:</div><div class='fl' style='padding-left: 3%'><input type='text' id='menu_path' value='" + (menu.path) + "'/></div></p>" +
                            "</div>" +
                            "</div>") :
                            ("<div id='editModal'>" +
                            "<div style='text-align: center;padding:10px 30px 10px 20px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'><div class='fl' style='text-align: right;width: 30%'>菜单名称:</div><div class='fl' style='padding-left: 3%'><input type='text' id='menu_name' value='" + (menu.name) + "'/></div></p>" +
                            "</div>" +
                            "</div>"),
                        area: [_this.attr('id').charAt(4) == 1 ? '330px' : '318px', _this.attr('id').charAt(4) == 1 ? '180px' : '150px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var updateUrl
                            var updateData
                            switch (_this.attr('id').charAt(4)) {
                                case '1' :
                                    (function () {
                                        updateUrl = home.urls.menus.updateMenu1ByCode()
                                        updateData = {
                                            code: menuCode,
                                            name: $('#menu_name').val(),
                                            path: $('#menu_path').val()
                                        }
                                    })();
                                    break;
                                case '2' :
                                    (function () {
                                        updateUrl = home.urls.menus.updateMenu2ByCode()
                                        updateData = {
                                            code: menuCode,
                                            name: $('#menu_name').val()
                                        }
                                    })();
                                    break;
                                case '3' :
                                    (function () {
                                        updateUrl = home.urls.menus.updateMenu3ByCode()
                                        updateData = {
                                            code: menuCode,
                                            name: $('#menu_name').val()
                                        }
                                    })();
                                    break;
                            }
                            /** 然后再更新当前记录 */
                            $.post(updateUrl, updateData, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        /** 如果成功了,要更新相应的菜单外壳,先清空,后append */
                                        var list = container.children('#' + _this.parent('li').attr('id'))
                                        list.children('.mainClick').text(updateData.name)
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
            })
        }//$ bindEditEventListener——end$
        , bindShiftUpListener: function (shiftUps) {
            shiftUps.off('click')
            shiftUps.on('click', function () {
                var _this = $(this)
                /** 点击向上的箭头会交换和上一个菜单的rank值 */
                var menuType = $(this).attr('id').charAt(4)
                var beforeCode = $(this).parent('li').prev('li')[0] ? $(this).parent('li').prev('li').attr('id').substr(6) : undefined
                var currentCode = $(this).parent('li').attr('id').substr(6)
                var shiftUrl
                switch (menuType) {
                    case '1':
                        (function () {
                            shiftUrl = home.urls.menus.menu1Shift()
                        })();
                        break;
                    case '2':
                        (function () {
                            shiftUrl = home.urls.menus.menu2Shift()
                        })();
                        break;
                    case '3':
                        (function () {
                            shiftUrl = home.urls.menus.menu3Shift()
                        })();
                        break;
                }
                if (beforeCode != undefined) {
                    $.post(shiftUrl, {code1: beforeCode, code2: currentCode}, function (result) {
                        if (result.code === 0) {
                            /** 当你修改数据成功之后,需要将一级菜单当前元素移除，然后在前一个元素的前面添加当前元素 */
                            var beforeOne = _this.parent('li').prev('li').detach()
                            var currentOne = _this.parent('li')
                            currentOne.after(beforeOne)
                        }
                    })
                }
            })
        }//$ bindShiftUpListener--ends$

        , bindShiftDownListener: function (shiftDowns) {
            shiftDowns.off('click')
            shiftDowns.on('click', function () {
                var _this = $(this)
                /** 点击向上的箭头会交换和上一个菜单的rank值 */
                var menuType = $(this).attr('id').charAt(4)
                var currentCode = $(this).parent('li').attr('id').substr(6)
                var afterCode = $(this).parent('li').next('li')[0] ? $(this).parent('li').next('li').attr('id').substr(6) : undefined
                var shiftUrl
                switch (menuType) {
                    case '1':
                        (function () {
                            shiftUrl = home.urls.menus.menu1Shift()
                        })();
                        break;
                    case '2':
                        (function () {
                            shiftUrl = home.urls.menus.menu2Shift()
                        })();
                        break;
                    case '3':
                        (function () {
                            shiftUrl = home.urls.menus.menu3Shift()
                        })();
                        break;
                }
                if (afterCode != undefined) {
                    $.post(shiftUrl, {code1: afterCode, code2: currentCode}, function (result) {
                        if (result.code === 0) {
                            /** 当你修改数据成功之后,需要将一级菜单当前元素移除，然后在前一个元素的前面添加当前元素 */
                            var afterOne = _this.parent('li').next('li').detach()
                            var currentOne = _this.parent('li')
                            currentOne.before(afterOne)
                        }
                    })
                }
            })
        }//$ bindShiftUpListener--ends$
        , storeOperations: function () {
            $.get(home.urls.menus.listOperations(), {}, function (result) {
                menu_manage.operations = result.data.sort(function (a, b) {
                    return a.code - b.code
                })
            })
        }
        , bindAllEvent: function () {
            $("#op_manageBtn").off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '操作管理',
                    content: $('#operations_table_wrapper2'),
                    area: ['580px', '300px'],
                    btn: ['确认', '取消'],
                    offset: ['35%', '35%'],
                    closeBtn: 0,
                    yes: function (index) {
                        layer.close(index)
                        $("#operations_table_wrapper2").css('display', 'none')
                    },
                    btn2: function (index) {
                        layer.close(index)
                        $("#operations_table_wrapper2").css('display', 'none')
                    }
                })
            })
            $("#op_addBtn").off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '操作管理',
                    content: ("<div id='addModal'>" +
                    "<div style='text-align: center;padding:10px 30px 10px 20px;'>" +
                    "<p style='padding: 5px 0px 5px 0px;'><div class='fl' style='text-align: right;width: 30%'>操作名称:</div><div class='fl' style='padding-left: 3%'><input type='text' id='op_name'/></div></p>" +
                    "</div>" +
                    "</div>"),
                    area: ['380px', '150px'],
                    btn: ['确认', '取消'],
                    offset: ['44%', '42%'],
                    closeBtn: 0,
                    yes: function (index) {
                        layer.close(index)
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
            })
        }
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.operation_box').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }
        , disselectAll: function (operation_boxes, selectAllBox) {
            var $tbody = $("#operations_table").children('tbody')
            var $operationsItems = $tbody.children("tr")
            var pageSize = $operationsItems.length
            operation_boxes.off('change')
            operation_boxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.operation_box:checked').length === pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}