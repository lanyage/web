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
        <div class="top-left">
            <div class="top-left-text">长远锂科MES系统<i class="fa fa-chevron-square-left"></i></div>
        </div>
        <div class="top-right">
            <div id='user-info-hover' style="position:relative; padding: 10px;font-size: 15px;"><a href="#">管理员<i class="fa fa-chevron-down"></i></a></div>
            <div id="hover-body" class="hide">
                <p><span>ID:123456</span></p>
                <p><a href="#"><i class="fa fa-user-o"></i>&nbsp;进入个人中心</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="exit">退出</a></p>
            </div>
        </div>
    </div>
    <div class="left">
        <div class="menus1" style="max-height: 100%;overflow-y: auto;">
            <ul>

            </ul>
        </div>
        <div class="menus2">
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
        var userStr = $.session.get('user')
        if(!userStr){
            console.log('用户已经失去登录，请重新登录')
            document.location='../login.jsp';
        }
        var userJson = JSON.parse(userStr)
        var menu1Wrapper = $('.menus1 ul')
        var menu2Wrapper = $('.menus2 ul')
        home.init(userJson, menu1Wrapper, menu2Wrapper)
    })
</script>
</body>
</html>
