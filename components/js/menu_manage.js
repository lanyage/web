var menu_manage = {
    menu1s: [],
    menu2s: [],
    menu3s: [],
    menu1List: null,
    menu2List: null,
    menu3List: null,
    init: function (menu1List, menu2List, menu3List) {
        // console.log('init menu manage!')
        /** 渲染一级菜单 */
        menu_manage.menu1List = menu1List
        menu_manage.menu2List = menu2List
        menu_manage.menu3List = menu3List
        menu_manage.funcs.renderMenu1()

        /** 给所有footer下面的链接添加点击事件 */
        menu_manage.funcs.bindAddEventListener($('footer .addBtn'))
    },

    funcs: {
        /** 渲染一级菜单 */
        renderMenu1: function () {
            menu_manage.menu1List.empty()
            $.get(home.urls.menus.getAllMenu1(), {}, function (result) {
                menu_manage.menu1s = result.data //存储一级菜单
                menu_manage.menu1s.forEach(function (e, index) {
                    if (index == 0)
                        menu_manage.menu1List.append("<li class='item selected' id='menu1-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' id='menu1-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu1-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu1-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu1-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                    else
                        menu_manage.menu1List.append("<li class='item' id='menu1-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' id='menu1-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu1-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu1-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu1-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                })
                /** 渲染二级菜单 */
                menu_manage.funcs.renderMenu2()
                /** 为一级菜单添加点击事件 */
                menu_manage.funcs.bindClickForMenu1s($('#menu1List .item .mainClick'))
            })
        },
        /** 渲染二级菜单 */
        renderMenu2: function () {
            /** 获取所有的三级菜单 */
            $.get(home.urls.menus.getAllMenu3(), {}, function (result) {
                menu_manage.menu3s = result.data //存储三级菜单
            })
            /** 获取所有二级菜单 */
            $.get(home.urls.menus.getAllMenu2(), {}, function (result) {
                menu_manage.menu2s = result.data //存储二级菜单

                /** 过滤掉不是当前选中一级菜单下的二级菜单 */
                var menu2ToSelected = menu_manage.funcs.getCurrentMenu2(menu_manage.menu2s, $('.selected').attr('id').substr(6))

                /** 清空二级菜单的container */
                menu_manage.menu2List.empty()
                /** 给二级菜单的容器添加二级菜单 */
                menu2ToSelected.forEach(function (e) {
                    menu_manage.menu2List.append("<li class='item' id='menu2-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' id='menu2-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu2-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu2-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu2-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                })
                /** 给容器中二级菜单添加点击事件 */
                menu_manage.funcs.bindClickForMenu2($('#menu2List .item .mainClick'))

                /** 给1 2级菜单删除按钮绑定事件 */
                menu_manage.funcs.bindDeleteEventListener($('.deleteBtn'))
                /** 给1 2级编辑按钮绑定事件 */
                menu_manage.funcs.bindEditEventListener($('.editBtn'))
            })
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
                return a.code - b.code
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

            // console.log(items)
            items.off('click')
            items.on('click', function () {
                /** 点击所有的一级菜单的时候都必须将三级菜单关掉 */
                // /** 页面加载完就有了所有的一二三级菜单 */
                // console.log(menu_manage.menu1s)
                // console.log(menu_manage.menu2s)
                // console.log(menu_manage.menu3s)
                menu_manage.menu3List.empty()
                $('.md4 .selected').removeClass('selected')
                $(this).parent('li').addClass('selected')
                menu_manage.funcs.renderMenu2()
            })
        }
        , renderMenu3: function (items) {
            // console.log(items)
            menu_manage.menu3List.empty()
            items.forEach(function (e) {
                menu_manage.menu3List.append("<li class='item' id='menu3-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' id='menu3-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu3-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu3-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu3-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
            })
        }
        /** 给二级菜单绑定点击事件 */
        , bindClickForMenu2: function (items) {
            // console.log(items)
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
                /** 给三级菜单绑定新增事件*/
                menu_manage.funcs.bindAddEventListener($('footer .addBtn'))
            })
        }
        , bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                //首先弹出一个询问框
                var _this = $(this)
                console.log('点击的是' + _this.attr('id').charAt(4) + '级菜单！')
                console.log(_this)
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                    area: ['180px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        // console.log('yes')
                        var menuCode = _this.attr('id').substr(14)
                        var deleteUrl;
                        switch (_this.attr('id').charAt(4)) {
                            case '1' :
                                (function () {
                                    deleteUrl = home.urls.menus.deleteMenu1ByCode()
                                })();
                                break;
                            case '2' :
                                (function () {
                                    deleteUrl = home.urls.menus.deleteMenu2ByCode()
                                })();
                                break;
                            case '3' :
                                (function () {
                                    deleteUrl = home.urls.menus.deleteMenu3ByCode()
                                })();
                                break;
                        }
                        console.log(deleteUrl)
                        $.post(deleteUrl, {code: menuCode}, function (result) {
                            // console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            /** 三级菜单删除成功后的逻辑 */
                            if (result.code == 0 && deleteUrl.indexOf('model') > -1) {
                                /** 删除成功之后还需要渲染三级菜单 */
                                $.get(home.urls.menus.getAllMenu3(), {}, function (result) {
                                    menu_manage.menu3s = result.data //存储三级菜单
                                })
                                var currentMenu3s = menu_manage.funcs.getCurrentMenu3(menu_manage.menu3s, $('.selected-menu2').attr('id').substr(6)).filter(function (ele) {
                                    return ele.code != menuCode
                                })
                                menu_manage.funcs.renderMenu3(currentMenu3s)
                                /** 重新渲染之后还需要给3级菜单的删除，编辑等按钮绑定新事件重新绑定新事件 */
                                menu_manage.funcs.bindDeleteEventListener($('.deleteBtn'))
                                /** 重新绑定编辑 */
                                menu_manage.funcs.bindEditEventListener($('.editBtn'))
                                /** 重新绑定删除 */
                                menu_manage.funcs.bindAddEventListener($('footer .addBtn'))
                            }
                            if (result.code == 0 && deleteUrl.indexOf('menu2') > -1) {
                                //todo 如果删除的是二级菜单,二级菜单下的所有三级菜单都会被删除,并且需要重新渲染所有的二级菜单,3级菜单需要清空
                                console.log(home.menu)
                                /** 删除二级菜单首先清空三级菜单 */
                                home.menu3List && home.menu3List.empty()
                                /** 然后得重新render二级菜单 */
                                menu_manage.funcs.renderMenu2()
                                /** 重新填充二级菜单的容器 */
                            }
                            if (result.code == 0 && deleteUrl.indexOf('menu1') > -1) {
                                //todo 如果删除的是一级菜单,一级菜单下的所有二级菜单和三级菜单都会被删除,并且需要重新渲染1级菜单和二级菜单,三级菜单需要被清空
                                home.menu3List && home.menu3List.empty()
                                home.menu2List && home.menu2List.empty()
                                menu_manage.funcs.renderMenu1()
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
                console.log('点击的是' + _this.attr('id').charAt(4) + '级菜单！')
                /** 如果是点击三级菜单的添加必须要先选定二级菜单,否则就要弹出相应的提示框 */
                if (_this.attr('id').substr(4) == 3 && !$('.selected-menu2')[0]) {
                    layer.msg('您还没有选择二级菜单,请先点击二级菜单项', {
                        offset: ['40%', '47%'],
                        time: 700
                    })
                    return
                }
                layer.open({
                    type: 1,
                    title: '添加',
                    content: "<div id='addModal'>" +
                    "<div style='text-align: center;padding-top: 10px;'>" +
                    "<p style='padding: 5px 0px 5px 0px;'>" + (_this.attr('id').charAt(4)) + "级菜单名称:&nbsp;&nbsp;<input type='text' id='menu_name'/></p>" +
                    "</div>" +
                    "</div>",
                    area: ['350px', '140px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var menuName = $('#menu_name').val()
                        console.log(menuName)
                        /** 请求添加元素的接口地址 */
                        var addUrl;
                        /** 请求添加元素所要传输的数据 */
                        var addData;
                        switch (_this.attr('id').substr(4)) {
                            case '1' :
                                (function () {
                                    addUrl = home.urls.menus.addMenu1()
                                    addData = {name: menuName}
                                })();
                                break;
                            case '2' :
                                (function () {
                                    addUrl = home.urls.menus.addMenu2()
                                    addData = {name: menuName}
                                })();
                                break;
                            case '3' :
                                (function () {
                                    addUrl = home.urls.menus.addMenu3()
                                    addData = {name: menuName}
                                })();
                                break;
                        }
                        console.log(addData)
                        // console.log(url)
                        $.post(addUrl, addData, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    /** 如果添加成功了以后要重新填充容器,还要分情况,添加一菜单不需要设置什么,添加二级菜单要设置其相应的1级菜单,添加三级菜单的时候需要添加相应的二级菜单和一级菜单 */
                                    //todo
                                    //todo
                                    //todo
                                    //todo
                                    //todo
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.close(index)
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                });
            })
        }//$ bindAddEventListener——end$

        /** 编辑事件 */
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var menuCode = _selfBtn.attr('id').substr(15)
                console.log('点击的是' + _selfBtn.attr('id').charAt(4) + '级菜单！') //状态量,看是1级菜单还是2级菜单
                // console.log(menuCode) //当前menu的code
                var updateUrl;
                switch (_selfBtn.attr('id').charAt(4)) {
                    case '1' :
                        (function () {
                            updateUrl = home.urls.menus.getMenu1ByCode()
                        })();
                        break;
                    case '2' :
                        (function () {
                            updateUrl = home.urls.menus.getMenu2ByCode()
                        })();
                        break;
                    case '3' :
                        (function () {
                            updateUrl = home.urls.menus.getMenu3ByCode()
                        })();
                        break;
                }
                /** 更新之前先查询填充表单元素 */
                $.post(updateUrl, {code: menuCode}, function (result) {
                    var menu = result.data
                    layer.open({
                        type: 1,
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>菜单名称:<input type='text' id='menu_name' value='" + (menu.name) + "'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '140px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var url;
                            switch (_selfBtn.attr('id').charAt(4)) {
                                case '1' :
                                    (function () {
                                        url = home.urls.menus.updateMenu1ByCode()
                                    })();
                                    break;
                                case '2' :
                                    (function () {
                                        url = home.urls.menus.updateMenu2ByCode()
                                    })();
                                    break;
                                case '3' :
                                    (function () {
                                        url = home.urls.menus.updateMenu3ByCode()
                                    })();
                                    break;
                            }
                            console.log(updateUrl)
                            /** 然后再更新当前记录 */
                            $.post(updateUrl, {code: menuCode, name: $('#menu_name').val()}, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        /** 如果成功了,要更新相应的菜单外壳,先清空,后append */
                                        //todo
                                        //todo
                                        //todo
                                        //todo
                                        //todo
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
    }
}