import { initAreaBegin, initBuffer, toInitBasemap, initResetPoint, bondDistance } from "./initArea.js";
import { bondCarRoute } from "./qita.js"
export { toInitPoint, map }


var map = new BMapGL.Map('container', {
    displayOptions: {
        poi: false,

    }
}); // 创建Map实例



var pointInit = new BMapGL.Point(116.404, 39.915)
var marker = new BMapGL.Marker(pointInit);        // 创建标注 
//输入：点   添加点、点标注、点击弹窗
toInitPoint(pointInit)

// map.centerAndZoom(pointInit, 9); // 初始化地图,设置中心点坐标和地图级别
map.centerAndZoom(pointInit, 8); // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放



// map.setHeading(64.5);   //设置地图旋转角度
map.setTilt(53);       //设置地图的倾斜角度

var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
map.addControl(scaleCtrl);
var zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
map.addControl(zoomCtrl);
var cityCtrl = new BMapGL.CityListControl();  // 添加城市列表控件
map.addControl(cityCtrl);


// 3508e072d1f2f73cbc21be82df6ab6bb 改变样式
map.setMapStyleV2({
    styleId: '3508e072d1f2f73cbc21be82df6ab6bb'
});


//测距功能
var myDis = new BMapGLLib.DistanceTool(map);

// 点击显示省市区
map.addEventListener('click', function (e) {
    var point = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
    var gc = new BMapGL.Geocoder();
    gc.getLocation(point, function (rs) {
        var opts = {
            title: '行政区划归属',
            width: 220,
            height: 92
        };
        var infoStr = '<div>省：' + rs.addressComponents.province + '</div>'
            + '<div>市：' + rs.addressComponents.city + '</div>'
            + '<div>区：' + rs.addressComponents.district + '</div>';
        var infoWindow = new BMapGL.InfoWindow(infoStr, opts);
        map.openInfoWindow(infoWindow, point);
    });
});





// ————————————————————————————————————主文件的函数调用

//调用
// 地图类型切换
changeMapType();

//调用
//实现列表交互效果
listInteract()

//调用
//绑定地图坐标显示
zuobiaoShow()


// 右键菜单显示
rightMenu(map)

//我的定位
myLocation(map)

//搜索定位
searchLocation(map)


// ————————————————————————————————————initArea的函数调用
//初始化区域
initAreaBegin(map)

//绑定事件，获取经纬度更新pointinit, 添加初始点缓冲
initResetPoint(pointInit, map);

//绑定checkbox元素，添加初始点缓冲
// initBuffer(map, pointInit, marker)

//绑定显示底图事件
toInitBasemap(map)

//绑定测距
bondDistance(myDis)



// ————————————————————————————————————qita的函数调用
// 驾车导航
bondCarRoute(map)





// ————————————————————————————————————主文件的函数
//地图类型切换
function changeMapType() {
    $('#map2').on('click', () => {
        $('#mapType li').removeClass('active');
        $('#map2').addClass('active');

        map.setHeading(0);   //设置地图旋转角度
        map.setTilt(70);       //设置地图的倾斜角度

        map.setMapType(BMAP_NORMAL_MAP);
    })

    $('#satellite').on('click', () => {
        $('#mapType li').removeClass('active');
        $('#satellite').addClass('active');
        //    map.setZoom(3)

        map.setHeading(0);   //设置地图旋转角度
        map.setTilt(0);       //设置地图的倾斜角度

        map.setMapType(BMAP_SATELLITE_MAP);
    })

    $('#map3').on('click', () => {
        $('#mapType li').removeClass('active');
        $('#map3').addClass('active');


        //    map.setZoom(3)

        map.setHeading(0);   //设置地图旋转角度
        map.setTilt(70);       //设置地图的倾斜角度

        map.setMapType(BMAP_EARTH_MAP);
    })

    // 隐藏导航和查找功能
    $('#carInfo,#findInfo').hide()

    $('#carNav').on('click', (e) => {
        // 切换导航的功能区域
        $('#mapType2 li').removeClass('active');
        e.target.parentNode.classList.add("active")
        var scrollHeight = $('.list-group').prop("scrollHeight");
        $('.list-group').animate({ scrollTop: scrollHeight }, 500);

        //隐藏information所有内容
        $('#infomation #infoUl>li').hide()

        $('#carInfo').show()

    })
    $('#findNav').on('click', (e) => {
        $('#mapType2 li').removeClass('active');
        e.target.parentNode.classList.add("active")
        var scrollHeight = $('.list-group').prop("scrollHeight");
        $('.list-group').animate({ scrollTop: scrollHeight }, 500);

        $('#infomation #infoUl>li').hide()

        $('#findInfo').show()



    })

}

//  输入：点  
//  添加点、点击弹窗
function toInitPoint(pointInit) {
    marker = new BMapGL.Marker(pointInit)
    // console.log(pointInit);
    //全局变量
    map.addOverlay(marker);

    map.centerAndZoom(pointInit, 8)

    var opts = {
        width: 200,     // 信息窗口宽度
        height: 100,     // 信息窗口高度
        title: "坐标：" + `${pointInit.lng},${pointInit.lat}`, // 信息窗口标题
        message: "选中点"
    }

    // 创建地理编码实例      
    var myGeo = new BMapGL.Geocoder();
    // 根据坐标得到地址描述    
    myGeo.getLocation(pointInit, function (result) {
        if (result) {
            var infoWindow = new BMapGL.InfoWindow(result.address, opts);  // 创建信息窗口对象 
            marker.addEventListener("click", function () {
                map.openInfoWindow(infoWindow, pointInit); //开启信息窗口
            });
        }
    });

    // marker.addEventListener("click", function () {
    //     // console.log(pointInit.lat, pointInit.lng);
    //     alert("标注坐标：" + pointInit.lat + ',' + pointInit.lng);
    // });
}

//实现列表交互效果
function listInteract() {

    $('#basicFunc,#basicFunc1,#basicFunc2').show()
    // $('#main .list-group .list-group-item').next().hide();
    // $('#basicFunc').show()
    $('#basicFunc,#basicFunc1,#basicFunc2').addClass('now');

    //给列表绑定弹出事件
    $('#main .list-group .list-group-item').on('click', (e) => {

        if ($(e.target).next().hasClass('now')) {
            $(e.target).next().hide()
            $(e.target).next().removeClass('now')
            // $(e.target).next().removeClass('now')
            return;

        }

        //隐藏所有列表内容区域，消除所有类
        $('#basicFunc, #basicFunc1, #basicFunc2').hide();
        $('#basicFunc, #basicFunc1, #basicFunc2').removeClass('now')

        $(e.target).next().show()
        $(e.target).next().addClass('now');
    })
}

//显示实时坐标
function zuobiaoShow() {
    map.addEventListener('mousemove', function (e) {

        $('#zuobiao span').empty()
        $('#zuobiao span').append(e.latlng.lng.toFixed(6) + ', ' + e.latlng.lat.toFixed(6))
    });
}

// 右键菜单显示
function rightMenu(map) {
    var menu = new BMapGL.ContextMenu();
    var txtMenuItem = [
        {
            text: '放大一级',
            callback: function () {
                map.zoomIn();
            }
        }, {
            text: '缩小一级',
            callback: function () {
                map.zoomOut();
            }
        },
        {
            text: '全屏',
            callback: function () {


                var element = document.documentElement;		// 返回 html dom 中的root 节点 <html>
                if (!$('body').hasClass('full-screen')) {
                    $('body').addClass('full-screen');
                    $('#alarm-fullscreen-toggler').addClass('active');
                    // 判断浏览器设备类型
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {	// 兼容火狐
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {	// 兼容谷歌
                        element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) {	// 兼容IE
                        element.msRequestFullscreen();
                    }
                } else {			// 退出全屏
                    console.log(document);
                    $('body').removeClass('full-screen');
                    $('#alarm-fullscreen-toggler').removeClass('active');
                    //	退出全屏
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }

            }
        }
    ];
    for (var i = 0; i < txtMenuItem.length; i++) {
        menu.addItem(new BMapGL.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
    }
    map.addContextMenu(menu);
}

//定位
function myLocation(map) {

    $('#myLocationbox').on('click', () => {

        var localcity = new BMapGL.LocalCity();
        localcity.get(e => {

            map.setCenter(e.center, 8); // 初始化地图,设置中心点坐标和地图级别

            let poi = new BMapGL.Point(e.center.lng.toFixed(3), e.center.lat.toFixed(3))


            toInitPoint2(poi)


        })
    })
}
//  输入：点  
//  添加点、瞬间弹窗
function toInitPoint2(pointInit) {
    marker = new BMapGL.Marker(pointInit)
    // console.log(pointInit);
    //全局变量
    map.addOverlay(marker);

    // map.centerAndZoom(pointInit, 8)

    var opts = {
        width: 200,     // 信息窗口宽度
        height: 100,     // 信息窗口高度
        title: "坐标：" + `${pointInit.lng},${pointInit.lat}`, // 信息窗口标题
        message: "选中点"
    }

    // 创建地理编码实例      
    var myGeo = new BMapGL.Geocoder();
    // 根据坐标得到地址描述    
    myGeo.getLocation(pointInit, function (result) {
        if (result) {
            var infoWindow = new BMapGL.InfoWindow(result.address, opts);  // 创建信息窗口对象 

            map.openInfoWindow(infoWindow, pointInit); //开启信息窗口
        }
    });

}

// 搜索地址功能
function searchLocation(map) {


    $('#searchLocationbox').on('click', () => {

        var searchTxt = $("#searchTxt").val();

        // console.log(searchTxt);
        //创建地址解析器实例
        var myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(searchTxt, (point) => {
            if (point) {

                map.setCenter(point, 8); // 初始化地图,设置中心点坐标和地图级别

                let poi = new BMapGL.Point(point.lng.toFixed(3), point.lat.toFixed(3))


                toInitPoint2(poi)

            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, searchTxt)


    })

    // $('#searchLocationbox').on('click', () => {

    //     var localcity = new BMapGL.LocalCity();
    //     localcity.get(e => {

    //         map.setCenter(e.center, 8); // 初始化地图,设置中心点坐标和地图级别

    //         let poi = new BMapGL.Point(e.center.lng.toFixed(3), e.center.lat.toFixed(3))


    //         toInitPoint2(poi)


    //     })
    // })
}