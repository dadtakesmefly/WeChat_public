/**
 * Created by cnaisin06 on 2017/7/31.
 */

/**
 * 闭包的方式封装urls
 * urls.js使用方法：
 * １．在需要的页面引入urls.js
 * 2. currentEvn变量用于配置当前环境
 * 3．调用方法：　urls.sendCodesMsgUrl
 *
 *
 */
!(function(){

    //当前环境
    var currentEvn = 'dev'

    var ctxPath = "${!(ctxPath)}"  || '';
    //环境配置
    var env = {
        dev : "http://192.168.31.248:8080/backend/",//开发环境
        test : "http://192.168.31.139:18080/backend/",//测试环境　
        production : "https://restapi.cnaisin.com:7443/backend/",//生产环境
        inside : "http://localhost:8080/backend/",//服务器内部相对地址
    }
    var baseurl = currentEvn == undefined ? env.dev : env[currentEvn]

    //地址配置
    var urls = {}

    urls.baseurl = baseurl;

    urls.sendCodesMsgUrl  = build("sendCodesMsg") //发送验证码

    urls.checkCodesUrl = build("checkCodes") //检查验证码

    urls.checkExists = build("weixin/checkPhoneExists")//检查手机号是否是爱信账号

    urls.registerUrl = build("v1b04/user/register")//注册爱信账户

    urls.commonUpload = build("commonUpload")//富文本编辑器图片上传至七牛

    urls.uploadImage = build("uploadImage")// 活动封面图裁剪 base64 接口 有点小问题 必须要写在html文件中

    urls.create = build("/v1b09/proposal/createFromWeb") //创建活动提议

    urls.login = build("v1b04/user/login")  //用户手机号密码登陆

    urls.list = build("v1b09/proposal/list")  //个人活动提议列表

    urls.detail = build("v1b09/proposal/detail") //活动提议详情

    urls.actLsit= build("v1b09/act/list") //查询我参与的活动列表

    //组装url
    function  build( linkname) {
        return baseurl  +　linkname;
    }

    window.urls = urls;

}());
