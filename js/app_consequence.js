/**
 * Created by cnaisin06 on 2017/8/16.
 */

$(function () {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }
    var userId = GetQueryString("userId");
    var proposalId = GetQueryString("proposalId");
    var datas = {
        "common": {//公共参数
            "v": "1.0",
            "sign": "",
            "appversion": "1.0",
            "timestamp": "1425185923140",
            "deviceType": "3",
            "deviceVersion": "6.1",
            "deviceNo": ""
        },
        "params":{
            "userId":userId,
            "proposalId":proposalId,
        }
    }
    $.ajax({
        url:urls.detail,
        //url:"./package.json",
        type:"post",
        data:JSON.stringify(datas),
        "contentType":"application/json; charset=utf-8",
        success: function (data) {
            var data =data.data
            console.log(data);
            //设置图文
            var html = template("head",data)
            $("#content").html(html);
            //设置banner图
            $(".banner img").attr("src",data.coverPhoto)
            //设置标签
            var html1 = template("mark",data)
            $(".marks").html(html1);
            //替换最后一个标签的分隔符 "|"
            var s =$('.marks').find(".mark:last").text();
            s=s.substring(0,s.length-1)
            $(".marks").find(".mark:last").text(s);
            //设置活动标题
            $("header  h3").html(data.name)
            //设置用户昵称
            //$(".nickname").html(data.nickName);
            //设置团队名称
            $(".team").html(data.team);
            //设置关注人数
            $(".focus").html(data.followNum);
            //设置点赞人数
            $(".sup").html(data.likeNum);
            //设置爱信用户
            $(".nickname").html(data.creator.nickname);
            //设置推荐人列表
            var recommendList = template("sharelist",data)
            $(".foot ul ").html(recommendList);

        },
        error: function () {
            alert("fail")
        }
    })


})
