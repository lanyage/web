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

        /** 一级菜单的容器点击会让三级菜单的内容清空*/
        menu1List.on('click', function () {
            menu3List.empty()
        })
    },

    funcs: {
        /** 渲染一级菜单 */
        renderMenu1: function () {
            menu_manage.menu1List.empty()
            $.get(home.urls.menus.getAllMenu1(), {}, function (result) {
                menu_manage.menu1s = result.data
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

                //todo
                //todo
                //todo
                //todo
                /** 给1 2级菜单删除按钮绑定事件 */
                menu_manage.funcs.bindDeleteEventListener($('.deleteBtn'))
                menu_manage.funcs.bindEditEventListener($('.editBtn'))
                // console.log($('.deleteBtn'))
                // console.log($('.editBtn'))
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
                $('.md4 .selected').removeClass('selected')
                $(this).parent('li').addClass('selected')
                menu_manage.funcs.renderMenu2()
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
                menu_manage.menu3List.empty()
                currentMenu3s.forEach(function (e) {
                    menu_manage.menu3List.append("<li class='item' id='menu3-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' id='menu3-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu3-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu3-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu3-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                })

                /** 给三级菜单删除按钮绑定事件 */
                menu_manage.funcs.bindDeleteEventListener($('.deleteBtn'))
                menu_manage.funcs.bindEditEventListener($('.editBtn'))
            })
        }
        , bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                //首先弹出一个询问框
                var _this = $(this)
                // console.log(_this)
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
                        // console.log(menuCode)
                        // console.log(_this.attr('id').charAt(4))
                        var url;
                        switch (_this.attr('id').charAt(4)) {
                            case '1' :
                                (function () {
                                    url = home.urls.menus.deleteMenu1ByCode()
                                })();
                                break;
                            case '2' :
                                (function () {
                                    url = home.urls.menus.deleteMenu2ByCode()
                                })();
                                break;
                            case '3' :
                                (function () {
                                    url = home.urls.menus.deleteMenu3ByCode()
                                })();
                                break;
                        }
                        // console.log(url)
                        $.post(url, {code: menuCode}, function (result) {
                            // console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            // INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('87', '测试菜单2', '27', '10');
                            // INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('88', '测试菜单3', '27', '10');
                            // INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('89', '测试菜单4', '27', '10');
                            // INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('90', '测试菜单5', '27', '10');
                            // INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('91', '测试菜单6', '27', '10');
                            // INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('92', '测试菜单7', '27', '10');
                            // INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('93', '测试菜单8', '27', '10');
                            // INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('94', '测试菜单9', '27', '10');
                            /** 三级菜单删除成功后的逻辑 */
                            if (result.code == 0 && url.indexOf('model') > -1) {
                                /** 删除成功之后还需要渲染三级菜单 */
                                // console.log($('.selected-menu2'))
                                $.get(home.urls.menus.getAllMenu3(), {}, function (result) {
                                    menu_manage.menu3s = result.data //存储三级菜单
                                })
                                var currentMenu3s = menu_manage.funcs.getCurrentMenu3(menu_manage.menu3s, $('.selected-menu2').attr('id').substr(6)).filter(function (ele) {
                                    return ele.code != menuCode
                                })
                                // console.log(currentMenu3s,'currentMenu3s')
                                menu_manage.menu3List.empty()
                                currentMenu3s.forEach(function (e) {
                                    menu_manage.menu3List.append("<li class='item' id='menu3-" + (e.code) + "'><a href='#' class='mainClick'>" + (e.name) + "</a>&nbsp;&nbsp;<a href='#' id='menu3-move-up-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-up'></i></a>&nbsp;&nbsp;<a href='#' id='menu3-move-down-tab-" + (e.code) + "'><i class='fa fa-arrow-circle-down'></i></a>&nbsp;&nbsp;<a href='#' class='editBtn' id='menu3-edit-tab-" + (e.code) + "'><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a href='#' class='deleteBtn' id='menu3-del-tab-" + (e.code) + "'><i class='fa fa-trash-o'></i></a></li>")
                                })
                                /** 重新渲染之后还需要给3级菜单的删除，编辑等按钮绑定新事件重新绑定新事件 */
                                menu_manage.funcs.bindDeleteEventListener($('.deleteBtn'))
                                menu_manage.funcs.bindEditEventListener($('.editBtn'))
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
        /** 编辑事件 */
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var menuCode = _selfBtn.attr('id').substr(15)
                console.log(_selfBtn.attr('id').charAt(4)) //状态量,看是1级菜单还是2级菜单
                console.log(menuCode) //当前menu的code
                var url;
                switch (_selfBtn.attr('id').charAt(4)) {
                    case '1' :
                        (function () {
                            url = home.urls.menus.getMenu1ByCode()
                        })();
                        break;
                    case '2' :
                        (function () {
                            url = home.urls.menus.getMenu2ByCode()
                        })();
                        break;
                    case '3' :
                        (function () {
                            url = home.urls.menus.getMenu3ByCode()
                        })();
                        break;
                }
                $.post(url,{code : menuCode}, function(result) {
                    var menu = result.data
                    // console.log(menu) //能够过去当前菜单
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
                            // console.log($('#menu_name').val())//能够读取到内容
                            $.post(url, {code : menuCode, name : $('#menu_name').val()}, function (result) {
                                console.log(url)
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
                // $.post(home.urls.department.getByCode(), {code: departmentCode}, function (result) {
                //     var department = result.data
                // })
            })
        }//$ bindEditEventListener——end$
    }
}