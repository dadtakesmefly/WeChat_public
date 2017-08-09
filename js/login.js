/**
 * Created by cnaisin06 on 2017/8/3.
 */

//验证手机号
var usertel=document.getElementById("usertel");
var regPhone=/^0?(13|14|15|18)[0-9]{9}$/;
check(usertel,regPhone);
function check(inp, reg) {
    inp.onblur = function () {
        if (reg.test(this.value)) {
            sbm.disabled = false ;
            return;
        } else {
            sbm.disabled = "disabled"
            layer.open({
                skin:"demo-class",
                title:"提示",
                content:"手机号错误",
            })
        }
    };
}
var img =document.querySelector("img");
var password = document.getElementById("password");
var sbm =   document.querySelector("#sbm");
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
    else if(val.length < 6){
        layer.open({
            skin:"demo-class",
            title:"提示",
            content:"密码至少6位数",
        })
        sbm.disabled = "disabled"
    }
    else{
        sbm.disabled = false;
    }
}
//$("#sbm").on("click", function () {
//    //手机号不能为空
//    if($("#usertel").val().length != 11){
//        return
//    }
//    if($("$password").val().length <6 ){
//        return
//    }
//
//})
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
            "phone":$("#usertel").val(),
            }
    }
    $.ajax({
        url: reqUrl,
        type: 'post',
        data: JSON.stringify(datas),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //console.log(data);
            //获取userId
            var userId=data.data.userId;
            if(data.ok == true){
                layer.open({
                    skin:"demo-class",
                    title:"提示",
                    content:"登陆成功",
                    end: function () {
                        window.open('./create.html'+"?userId="+userId)
                    }
                })
            }
            else{
                layer.open({
                    skin:"demo-class",
                    title:"提示",
                    content:data.msg,
                    end: function () {

                    }
                })
            }
        },
        error: function () {
            layer.open({
                skin:"demo-class",
                title:"提示",
                content:"登陆失败"
            })
        }
    });
}

// Call this code when the page is done loading.
$(function () {
    $('#sbm').click(function () {
        //手机号不能为空
    if($("#usertel").val().length != 11){
        return
    }
    if($("#password").val().length <6 ){
        return
    }
       var data = [];
//      data['phone'] = $("#phone").val(); //手机号不用加密
        data['password'] = $('#password').val();
        var pkey = $('#pubkey').val();
        encryptRequest(urls.login, data, pkey);
    });
});


