<%--
  Created by IntelliJ IDEA.
  User: lanyage
  Date: 2018/3/30
  Time: 下午8:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>主页</title>
    <link href="../fontawesome/css/font-awesome.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="../css/home.css">
    <link rel="stylesheet" href="../layui/css/layui.css" media="all">
</head>
<%--Hello world--%>
<body>
<div class="parent">
    <div class="top">
        <div class="top-left" style="padding-left: 12px;">
            <div class="fl" style="position: relative;top: 12px;"><img src="../dist/images/login/logo.png" width="30px"
                                                                       height="30px"></div>
            <div class="top-left-text">长远锂科MES系统</div>
        </div>
        <div class="top-right">
            <div id='user-info-hover' style="position:relative; padding: 10px 0px 10px 10px;font-size: 14px;"><a
                    href="#"><span id="currentUser"></span><i class="fa fa-chevron-down"></i></a></div>
            <div id="hover-body" class="hide" style="text-align: center;">
                <div style="position: relative;top: 12px;display: inline-block">
                    <p>
                    <div class="fl">&nbsp;<a href="#"><i class="fa fa-sign-in"></i>&nbsp;进入个人中心</a></div>
                    </p>
                    <div style="clear: both;padding: 1px;"></div>
                    <p style="padding: 0px 30px 0px 20px;">
                    <div class="fl">&nbsp;<i class="fa fa-id-badge"></i>&nbsp;<span id='user-id'></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div class="fl">&nbsp;<a href="#" id="exit">&nbsp;退出&nbsp;</a></div>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="left">
        <div class="menus1" style="min-height: 100%;overflow-y: auto;">
            <ul>

            </ul>
        </div>
        <div class="menus2" style="height:100%;overflow-y: auto;">
            <div>
                <i class="fa fa-bars"></i><span>&nbsp;&nbsp;菜单</span>
            </div>
            <ul>
            </ul>
        </div>
    </div>
    <div class="right" style="max-height: 100%;overflow-y: scroll;">

    </div>
</div>

<script src="../js/jquery.min.js"></script>

<script src="../layui/layui.all.js" charset="utf-8"></script>
<script src="../layer/layer/layer.js"></script>
<script src="../js/jquerysession.js"></script>

<script src="../js/servers.js"></script>
<script src="../js/home.js"></script>
<script src="../js/Chart.js"></script>
<script type="application/javascript">
    $(function () {

        (function () {
            Date.prototype.Format = function (fmt) { //author: meizz
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;

            }
        })()

        function createVersion() {
            var date = new Date();
            return "v4.275."+( date.getMonth() + 1) + date.getDate()+ ".BETA";
        }

        /** 日期显示 */
        $('.top-left-text')[0].innerHTML = "<span>长远锂科MES系统&nbsp;<strong id='version' style='color: #1E9FFF;font-size:13px; font-weight: 600;'>&nbsp;" + createVersion() + "</strong></span>"
        var userStr = $.session.get('user')
        if (!userStr) {
            console.log('用户已经失去登录，请重新登录')
            document.location = '../login.jsp';
        }
        var userJson = JSON.parse(userStr)
        var menu1Wrapper = $('.menus1 ul')
        var menu2Wrapper = $('.menus2 ul')
        home.init(userJson, menu1Wrapper, menu2Wrapper)
    })

</script>
</body>
</html>
