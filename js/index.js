// 创建页面基地址
var host = "http://www.bufantec.com";
var api = {
        // 正在热映的地址接口
        in_theaters: host + "/api/douban/movie/in_theaters?start=1&limit=12",
        // 即将上映的地址接口
        coming_soon: host + "/api/douban/movie/coming_soon?start=1&limit=12",
        // top250的地址接口
        top250: host + "/api/douban/movie/top250?start=1&limit=12",
        // 电影明细
        subject: host + "/api/douban/movie/subject?mId="
    }
    // AJAX请求数据

function get(url, callback = render, beforeSend, complete) {
    // 1.创建异步请求对象
    var xhr = new XMLHttpRequest();
    // 2.指定响应的数据格式
    xhr.responseType = "json";
    xhr.onload = function() {
        if (xhr.status == 200) {
            complete && complete();
            callback && callback(xhr.response.data);
        }
    }
    xhr.open("GET", url, true);
    beforeSend && beforeSend();
    // 5.发送请求
    xhr.send(null);
}

function render(res) {
    var totalPageNum = res.totalPage;
    var buttonStr = "";
    for (var i = 0; i < totalPageNum; i++) {
        // 获取page-button
        buttonStr += `<button data-index="${i+1}"class="${res.pageNumber===i+1?"act":""}">${i+1}</button>`
        $(".page-button").html(buttonStr);
    }
    //detail 插入详情内容
    var detailStr = `<h1>${res.title}</h1>
        <p>${res.summary}</p>`
    $(".detail .wrapper-detail").html(detailStr);
    //  如果xhr.response.data.list存在的话下面才执行
    // 插入content内容
    var listArr = res.list;
    if (listArr) {
        var divStr = "";
        for (var i = 0; i < listArr.length; i++) {
            divStr += ` <div class="layui-col-lg3 layui-col-md4 layui-col-sm6 layui-col-xs12">
                            <div class="list wow animate__fadeInDown" data-mid="${res.list[i].mId}">
                                <img src="${listArr[i].small}" onerror="defaultImg(this)" alt="">       
                                <p class="title">名称:${listArr[i].title}</p>
                                <p class="longtime">时长:${listArr[i].longtime}</p>
                                <p class="genres">类型:${listArr[i].genres}</p>
                                <p class="rating-average">平均分:${listArr[i].rating_average}</p>
                                <p class="director">导演:${listArr[i].director}</p>
                                <p class="scriptwriter">编剧:${listArr[i].scriptwriter}</p>                          
                            </div>
                        </div>`
            $(".content .layui-row").html(divStr);
        }
    }
}
// 4.设置open方法
// 如果获取不到时设置的图片
function defaultImg(ele) {
    // console.log(ele);
    ele.src = "./img/暂无此图.jpg"
    $(ele).addClass("default")
}

function loadContent() {
    $(".wrapper").hide();
    $(".scene").show();
    // $(".scene").css({
    //     width: "100%",
    //     height: "100%"
    // })
};

function completeLoadContent() {
    $(".wrapper").fadeIn(100);
    $(".scene").hide();
}
// 进入页面获取电影
//  console.log(api[$(".top button.act").attr("data-type")]);
get(api[$(".top button.act").attr("data-type")], render, loadContent, completeLoadContent);
// 给每一个page-button里的button绑定点击事件 事件委托
$(".page-button").on("click", "button", function() {
    var type = $(".top button.act").attr("data-type");
    get(api[type].replace("1", this.innerText), render, loadContent, completeLoadContent);
});

// 获取top 然后委托事件
$(".top").on("click", "button", function() {
    $(".top button.act").removeClass("act");
    $(this).addClass("act");
    // console.log(this.innerText);
    get(api[this.dataset.type], render, loadContent, completeLoadContent);
});
// 给每一个div-list绑定点击事件
//  console.log($(".content"));
$(".content").on("click", "div.list", function() {
    // 显示详情
    get(api.subject + this.dataset["mid"], render, function() {
        $(".detail").fadeIn(100).find(".wrapper-detail").hide().prev().show();
    }, function() {
        $(".detail .spinner-box").hide().next().show();
    });
});
//获取.detail 刚开始隐藏
$(".detail").css("display", "none");
$(".detail").click(function() {
    $(this).fadeOut(100);
    // return false;
})
$(".detail .wrapper-detail").on("click", function(e) {
    e.stopPropagation();
    // return false;
});