/**
 * Created by cnaisin06 on 2017/8/11.
 */
function openApp(){
    var data = {"type":"Normal","relatId":"8","title":"","content":"","remark":""};
    var schemeUrl = "cnaisin://?data="+JSON.stringify(data);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
        var loadDateTime = new Date();
        window.setTimeout(function() {
            var timeOutDateTime = new Date();
            if (timeOutDateTime - loadDateTime > 5000) {

            } else {
                window.location.href = "itms-apps://itunes.apple.com/app/id1190774356";
            }
        },25);
        window.location.href = schemeUrl;
    } else if (navigator.userAgent.match(/android/i)) {
        var state = null;
        try {
            state = window.open(schemeUrl, '_self');
        } catch(e) {}
        if (state) {
        } else {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.cnaisin.axgy"
        }
    }
}
//判断用户设备是pc还是移动  pc时候点击打开app 跳转到官网 里面都附有下载链接
function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return
    } else {
        $(".downloading").on("click", function () {
            window.open("https://www.cnaisin.com")  //新页面打开
            //window.location.href="https://www.cnaisin.com";
        })
    }
}
browserRedirect();
var u = navigator.userAgent;
//点击底部下载app按钮消失
$(".close").on("click", function () {
    $(".slogan").fadeOut();
    $("html,body").animate({"padding-top":"0"})
})
$(".downloading").on("click", function () {
    openApp()
    //安卓
    if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.cnaisin.axgy";
    }
    //苹果
//        if (u.indexOf("iPhone") > -1) {
//            window.location.href = "itms-apps://itunes.apple.com/app/id1190774356";
//        }
})