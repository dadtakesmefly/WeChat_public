/**
 * Created by cnaisin06 on 2017/7/27.
 */
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
var phone=GetQueryString("phone");

$("#phone").attr("value",phone);

var img =document.querySelector("img");
var password = document.getElementById("password");
var sbm =   document.querySelector("#sbm");

var nickname = document.getElementById("nickname");
nickname.onblur= function () {
    var val =this.value;
    var regnickname=/^(?=.*?[\u4E00-\u9FA5\-a-zA-Z\d])[\d\u4E00-\u9FA5\-a-zA-Z\d]+/;
    //console.log(regnickname.test(val));
    if(regnickname.test(val)){
        sbm.disabled = false;
    }
    else{
        sbm.disabled = "disabled"
    }
}


//console.log(img);
var isopen=true;
img.onclick= function () {
    if(isopen){
        this.src="images/eyesopen.png";
        password.setAttribute("type","text")
    }
    else{
        this.src="images/eyesclose.png";
        password.setAttribute("type","password")
    }
    isopen=!isopen;
}
//提示不要输入空格
//password.onkeydown= function () {
//    if(event.keyCode==32){
//        layer.open({
//            skin:"demo-class",
//            title:"提示",
//            content:"请不要输入空格"
//        })
//    }
//}




password.onblur= function () {

    var val =this.value;
    //console.log(val);
    var regchildname=/[\u4e00-\u9fa5]{1,}$/;
    //console.log(regchildname.test(val));
    if(regchildname.test(val)){
        layer.open({
            skin:"demo-class",
            title:"提示",
            content:"请不要输入中文",
        })
        sbm.disabled = "disabled"
    }
    else{
        sbm.disabled = false;
    }
}


// 使用jsencrypt类库加密js方法，
function encryptRequest(reqUrl, data, publicKey) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    // ajax请求发送的数据对象
    var sendData = new Object();
    // 将data数组赋给ajax对象
    for (var key in data) {
        sendData[key] = encrypt.encrypt(data[key]);

    }
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
            "password":sendData.password,
            "phone":$("#phone").val(),
            "nickname":$('#nickname').val()}
    }
    $.ajax({
        url: reqUrl,
        type: 'post',
        data: JSON.stringify(datas),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //console.log(data);
            if(data.ok == true){
                layer.open({
                    skin:"demo-class",
                    title:"提示",
                    content:"操作成功",
                    end: function () {
                        window.location.href="./create.html"
                    }
                })
            }
            else{
                layer.open({
                    skin:"demo-class",
                    title:"提示",
                    content:"操作不成功",
                    end: function () {

                    }
                })
            }
        },
        error: function (data) {
            //console.log(data)
        }
    });
}
// Call this code when the page is done loading.
$(function () {
    $('#sbm').click(function () {
        var data = [];
//      data['phone'] = $("#phone").val(); //手机号和昵称不用加密

        data['password'] = $('#password').val();
        var pkey = $('#pubkey').val();
        encryptRequest(urls.registerUrl, data, pkey);
    });
});
