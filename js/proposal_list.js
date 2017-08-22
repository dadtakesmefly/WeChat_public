/**
 * Created by cnaisin06 on 2017/6/16.
 */

//渲染
$(function(){

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
    var userId=GetQueryString("userId");
    //var userId ="Test_cbUFKGzn3lpZ"
    function getData(config, offset,size){
        config.isAjax = true;
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
                "type":"my",
                "timestamp":"",
                "requestType":"",
                "pagesize":"10000",
                "filter":'{"relationship":"create"}',
                "sort":""
            }
        }
        $.ajax({
            type: 'post',
            url:urls.list,
            data:JSON.stringify(datas),
            "contentType":"application/json; charset=utf-8",
            success: function(reponse){
                config.isAjax = false;
                var data = reponse.data;
                var sum = reponse.data.length;
                if( sum > 0 ){
                    console.log(data);
                    data = tabstostring(data);
                    console.log(data);
                    var result = '';
                    /************业务逻辑块：实现拼接html内容并append到页面*****************/
                    //console.log(offset , size, sum);
                    /*如果剩下的记录数不够分页，就让分页数取剩下的记录数
                     * 例如分页数是5，只剩2条，则只取2条
                     */
                    if(sum - offset < size ){
                        size = sum - offset;
                    }
                    /*使用for循环模拟SQL里的limit(offset,size)*/
                    for(var i=offset; i< (offset+size); i++){

                        result +=  ' <li>'
                        result +=  '<input style="display: none"  value =' + data[i].proposalId+'>'
                        result +=  '<img class="banner" src=" '+data[i].coverPhoto+ '" >'
                        result +=  '<div class="title">'
                        result +=  ' <h4>'+data[i].name+'</h4>'
                        result +=  ' <span class="adresspic iconfont fl">&#xe646;</span><span class="team_adress">'+data[i].tabs+'</span>'
                        result +=  '</div>'
                        result +=  '</li>'
                        result +=  '<div class="info clearfix">'
                        //判断用户是否有头像
                        if(data[i].creator.photoUrl== ""){
                            result +=    '<img class="userpic fl" src="./images/默认头像.png"/>'+'<span class="fl username">'+data[i].creator.nickname+'</span>'
                        }else{
                            result +=    '<img class="userpic fl" src=" '+data[i].creator.photoUrl+ '"  alt=>'+'<span class="fl username">'+data[i].creator.nickname+'</span>'
                        }
                        result +=   '<span class="fr focus">'+data[i].followNum+'</span><i class="iconfont star fr">&#xe614;</i><span class="fr read">'+data[i].pv+'</span><i class="iconfont eyes fr">&#xe61a;</i>'
                        result +=   '</div>'

                    }
                    $('ul').append(result);
                    $("ul li").on("click", function () {
                        var proposalId =$(this).find("input").val();
                        window.location.href='./wechat_consequence.html'+"?userId="+userId+"&proposalId="+proposalId
                        //window.location.href='./app_consequence.html'+"?userId="+userId+"&proposalId="+proposalId
                    })

                    /*******************************************/
                    /*隐藏more*/
                    if ( (offset + size) >= sum){
                        $(".js-load-more").hide();
                        //$(".js-load-more").html("到底啦")
                        config.isEnd = true; /*停止滚动加载请求*/
                        //提示没有了
                    }else{
                        $(".js-load-more").show();

                    }
                }
                else{
                    $('section').html("您还没有发过提议").css({
                      "position": "absolute",
                        "top":"50%",
                        "left":"50%",
                        "transform":"translate(-50%,-50%)",
                        "font-Size":"0.36rem"
                    })
                }
            },
            error: function(xhr, type){
                alert('Ajax error!');
            }
        });
    }
    $.loadmore.get(getData, {scroll: true, size:5});

    //tabs结构转化
    function tabstostring(data){
        //先循环data对象
        $.each(data, function (i,v) {
            //先循环 然后再创建数组
            var arr = [];
            //再循环data对象的tabs
            $.each(v.tabs,function(i,v){
                //console.log(v.name);
                //将标签名添加到数组里面
                arr[i] = v.name ;
            })
            //数组转字符串用 " | " 连接
            var str = arr.join(" | ");
            // 替换原始数据的tabs内容
            v.tabs = str
        })
        return data
    }
});

