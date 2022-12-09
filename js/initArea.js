export { initAreaBegin, initBuffer, toInitBasemap, initResetPoint, bondDistance}
import {toInitPoint} from "./index.js";




//initarea重置
function initAreaBegin(map) {

    //重置按钮
    $('#initClear').on('click', (e) => {
        map.clearOverlays();
        $('#basicFunc .checkbox-inline input').attr("disabled", false);
        $('#basicFunc .checkbox-inline input').attr("checked", false);

        //恢复层级
        map.setZoom(8);
        map.setCenter(116.404, 39.915)
        //
        $('#bufferFunc input').val("");
    })



}



// ————————————————————————————————————经纬度
// 输入：地图，
//绑定事件，获取经纬度更新pointinit
function initResetPoint(pointInit, map ) {

    // 0 延时器id
    let timer = null;

    var nowJing, nowWei;

    // // 1 定义防抖
    // function yanshi(words, map) {
    //     timer = setTimeout(function () {

    //         if (!words) return
    //         if (!words.match(/^[\-\+]?(0(\.\d{1,8})?|([1-9](\d)?)(\.\d{1,8})?|1[0-7]\d{1}(\.\d{1,8})?|180(([.][0]{1,8})?))$/)) {
    //             return;
    //         }

    //         //解除之前绑定的点击事件
    //         $("#initBasemapForm1 button").unbind();

    //         //绑定本次点击事件 显示行政区域
    //         $("#initBasemapForm1 button").click(function (e) {

    //             nowJing = words
    //             console.log(nowJing,nowWei);

    //         });

    //     }, 600)
    // }



    // 1 定义防抖
    function yanshi(jing, wei, pointInit) {
        timer = setTimeout(() => {

            //数据不完整，不符合格式，打回
            if (!jing) return
            if (!jing.match(/^[\-\+]?(0(\.\d{1,8})?|([1-9](\d)?)(\.\d{1,8})?|1[0-7]\d{1}(\.\d{1,8})?|180(([.][0]{1,8})?))$/)) {
                return;
            }
            if (!wei) return
            if (!wei.match(/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/)) {
                return
            }

            $("#initBasemapForm1 button").click( (e) => {




                nowJing = jing
                nowWei = wei
                // return [nowJing, nowWei]
                console.log(nowJing, nowWei);
                getResetPointToDo( nowWei,nowJing, pointInit)
            })

        }, 700)



    }


    function getResetPointToDo(wei, jing, pointInit) {

        pointInit = new BMapGL.Point( jing,wei)
        // console.log(pointInit);

        //调用
        toInitPoint(pointInit)

        let marker = new BMapGL.Marker(pointInit);  

        //绑定缓冲
        initBuffer(map, pointInit, marker)

    }

    $('#exampleInputName3,#exampleInputName4').on('input', () => {

        // 2 清除防抖
        clearTimeout(timer);

        //即时获取输入框内容
        let jing = $('#initBasemapForm1 input[name="jing"]').val()
        let wei = $('#initBasemapForm1 input[name="wei"]').val()


        //调用  3 防抖的操作
        yanshi(jing, wei, pointInit)
    })

    $('#exampleInputName3').on('input', () => {

        // 2 清除防抖
        clearTimeout(timer);

        //即时获取输入框内容
        let jing = $('#initBasemapForm1 input[name="jing"]').val()
        let wei = $('#initBasemapForm1 input[name="wei"]').val()


        //调用  3 防抖的操作
        yanshi(jing, wei, pointInit)
    })





}


//输入：地图，点，标记
//绑定checkbox元素，添加初始点缓冲
function initBuffer(map, pointInit, marker) {
    for (let i = 1; i < 4; i++) {
        $(`#inlineCheckbox${i}`).each(function () {
            $(`#inlineCheckbox${i}`).click(function () {
                if ($(`#inlineCheckbox${i}`).prop("checked")) {
                    //调用
                    addBuffer(50000 * i, pointInit, map)
                    map.centerAndZoom(pointInit, 8);
                    // map.setZoom(16)
                    $(`#inlineCheckbox${i}`).attr("disabled", true);
                } else {
                    $('#basicFunc .checkbox-inline input').attr("checked", false);
                    // map.clearOverlays();
                    map.addOverlay(marker);

                }
            })
        })
    }
}

//输入：缓冲大小, 点, 地图
//添加初始点缓冲
function addBuffer(num, pointInit, map) {
    var circle = new BMapGL.Circle(pointInit, num, { strokeColor: "black", strokeWeight: 2, strokeOpacity: 0.5 }); //创建圆
    map.addOverlay(circle);
}






// ————————————————————————————————————展示矢量省份
//绑定显示底图事件
function toInitBasemap(map) {

    // 0 延时器id
    let timer = null;

    var nowCity;

    // 1 定义防抖
    function yanshi(words, map) {
        timer = setTimeout(function () {

            //解除之前绑定的点击事件
            $("#initBasemapForm button").unbind();

            //绑定本次点击事件 显示行政区域
            $("#initBasemapForm button").click(function (e) {


                if (!words) return
                if (!words.match(/^[\u4E00-\u9FA5]+$/)) return;

                nowCity = words

                //调用 
                // 展示城市的范围，可点击
                showOneProvince(nowCity, map)

                //调用 根据地址获取经纬度
                let [poi,mkr] = getGeoInfo(nowCity, nowCity, map)

                console.log(poi, mkr);

            

            });

        }, 600)
    }

    $('#exampleInputName2').on('input', () => {

        // 2 清除防抖
        clearTimeout(timer);

        //即时获取输入框内容
        var city = $('#initBasemapForm input[name="cityInput"]').val()


        //调用  3 防抖的操作
        yanshi(city, map)
    })


}


//输入：地名
// 根据地址获取经纬度 定位到点
function getGeoInfo(address, city, map) {
    let point,marker
    //创建地址解析器实例
    var myGeo = new BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(address, function (point) {
        if (point) {
            map.centerAndZoom(point, 8);
            map.addOverlay(new BMapGL.Marker(point, { title: address }))

            console.log(point);

            point = point
            marker = marker

        } else {
            alert('您选择的地址没有解析到结果！');
        }
    }, city)

    return [point,marker]

}

// 输入：城市名 
//  展示城市的范围，可点击
function showOneProvince(cityName, map) {

    var bd1 = new BMapGL.Boundary();
    bd1.get(cityName, function (rs) {

        // console.log(rs);
        let count = rs.boundaries.length;
        for (let i = 0; i < count; i++) {
            let path = [];
            let str = rs.boundaries[i].replace(' ', '');
            let points = str.split(';');
            for (let j = 0; j < points.length; j++) {
                let lng = points[j].split(',')[0];
                let lat = points[j].split(',')[1];
                path.push(new BMapGL.Point(lng, lat));
            }
            let prism = new BMapGL.Prism(path, 5000, {
                topFillColor: '#5679ea',
                topFillOpacity: 0.3,
                sideFillColor: '#5679ea',
                sideFillOpacity: 0.9
            });
            map.addOverlay(prism);

            // 绑定鼠标事件
            var events = ['click', 'mouseover', 'mouseout'];
            for (let i = 0; i < events.length; i++) {
                prism.addEventListener(events[i], e => {
                    switch (events[i]) {
                        case 'click':
                            alert(cityName);
                            break;
                        case 'mouseover':
                            e.target.setTopFillColor('#475fab');
                            e.target.setTopFillOpacity(0.7);
                            break;
                        case 'mouseout':
                            e.target.setTopFillColor('#5679ea');
                            e.target.setTopFillOpacity(0.5);
                            break;
                    }
                });
            }
        }



    });
}





// ————————————————————————————————————测距功能
function bondDistance(myDis) {
    $('#openDis').on('click', () => {
        myDis.open()
    })
}