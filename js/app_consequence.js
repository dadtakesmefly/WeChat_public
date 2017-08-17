/**
 * Created by cnaisin06 on 2017/8/16.
 */

$(function () {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);  //��ȡurl��"?"������ַ���������ƥ��
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
        "common": {//��������
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
            //����ͼ��
            var html = template("head",data)
            $("#content").html(html);
            //����bannerͼ
            $(".banner img").attr("src",data.coverPhoto)
            //���ñ�ǩ
            var html1 = template("mark",data)
            $(".marks").html(html1);
            //�滻���һ����ǩ�ķָ��� "|"
            var s =$('.marks').find(".mark:last").text();
            s=s.substring(0,s.length-1)
            $(".marks").find(".mark:last").text(s);
            //���û����
            $("header  h3").html(data.name)
            //�����û��ǳ�
            //$(".nickname").html(data.nickName);
            //�����Ŷ�����
            $(".team").html(data.team);
            //���ù�ע����
            $(".focus").html(data.followNum);
            //���õ�������
            $(".sup").html(data.likeNum);
            //���ð����û�
            $(".nickname").html(data.creator.nickname);
            //�����Ƽ����б�
            var recommendList = template("sharelist",data)
            $(".foot ul ").html(recommendList);

        },
        error: function () {
            alert("fail")
        }
    })


})
