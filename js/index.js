import { initAreaBegin, initBuffer, toInitBasemap, initResetPoint } from "./initArea.js";
export { toInitPoint , map}


var map = new BMapGL.Map('container', {
    // 禁止地图旋转和倾斜可以通过配置项进行设置
    // enableRotate: false,
    // enableTilt: false
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




// ————————————————————————————————————initArea的函数调用
//初始化区域
initAreaBegin(map)

//绑定事件，获取经纬度更新pointinit, 添加初始点缓冲
initResetPoint(pointInit, map);

//绑定checkbox元素，添加初始点缓冲
// initBuffer(map, pointInit, marker)

//绑定显示底图事件
toInitBasemap(map)







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

    $('#main .list-group .list-group-item').next().hide();
    $('#basicFunc').show()
    $('#basicFunc').addClass('now');

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
function zuobiaoShow(){
    map.addEventListener('mousemove', function(e) {

        $('#zuobiao span').empty()
        $('#zuobiao span').append( e.latlng.lng.toFixed(6)+ ', ' + e.latlng.lat.toFixed(6) )
});
}