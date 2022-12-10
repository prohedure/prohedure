export { bondCarRoute, bondBusRoute }


updown()

// ——————————————————————————————————————置顶底部按钮
function updown() {

    $('.iconfont.icon-xiangshangzhanhang').on('click', () => {

        $(".list-group").finish().animate({ "scrollTop": "0px" }, 500);
    })

    $('.iconfont.icon-xiangxiazhanhang').on('click', () => {

        var scrollHeight = $('.list-group').prop("scrollHeight");
        $('.list-group').animate({ scrollTop: scrollHeight }, 500);

    })
}

// ——————————————————————————————————————驾车导航
// 点击驾车路线按钮，监听
function bondCarRoute(mapBaidu) {

    $('#searchCarBtn').on('click', async () => {



        $('#gaodeCar, #gaodeContainer, .searchBox').children().remove()

        $('#gaodeCar, #gaodeContainer').removeClass()


        $("gaodeContainer").attr("style", "");

        let poi1 = $('#home input').eq(0).val()
        let poi2 = $('#home input').eq(1).val()

        let poi11 = await getJingwei(poi1)
        let poi22 = await getJingwei(poi2)
        // console.log(poi1, poi2)

        let r1 = new BMapGL.Point(poi11.lng, poi11.lat);
        let r2 = new BMapGL.Point(poi22.lng, poi22.lat);
        // console.log(r1, r2);
        //  百度

        var outputbaidu = '<div class="resultTitle"><h4>   ' + poi1 + "    到    " + poi2 + "<h4/><h5>   驾车需   ";
        var searchCompleteBaidu = function (results) {
            if (drivingBaidu.getStatus() != BMAP_STATUS_SUCCESS) {
                return;
            }
            var plan = results.getPlan(0);
            outputbaidu += plan.getDuration(true) + "\n";                //获取时间
            outputbaidu += "<h5/><h5>总路程为   ";
            outputbaidu += plan.getDistance(true) + "\n<h5/><div/>";             //获取距离
        }

        var drivingBaidu = new BMapGL.DrivingRoute(mapBaidu, {
            renderOptions: { map: mapBaidu, autoViewport: true },
            onSearchComplete: searchCompleteBaidu,
            onPolylinesSet: function () {
                setTimeout(function () {
                    $('#home .searchBox').html(outputbaidu)
                    // alert(output)
                }, 0);


            }
        });
        drivingBaidu.search(r1, r2);

        // 高德
        var mapGaode = new AMap.Map("gaodeContainer", {
            center: [116.397559, 39.89621],
            zoom: 14
        });
        var drivingOptionGaode = {
            policy: AMap.DrivingPolicy.LEAST_TIME, // 其它policy参数请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
            ferry: 1, // 是否可以使用轮渡

            map: mapGaode,
            panel: 'gaodeCar'
        }
        // 构造路线导航类
        var drivingGaode = new AMap.Driving(drivingOptionGaode)
        // 根据起终点经纬度规划驾车导航路线
        drivingGaode.search(new AMap.LngLat(poi11.lng, poi11.lat), new AMap.LngLat(poi22.lng, poi22.lat), function (status, result) {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {
                log.success('获取高德驾车路线完成')
            } else {
                log.error('获取驾车数据失败：' + result)
            }
        });
        // mapGaode.destroy()



    })

    $('#home .clear').on('click', () => {
        mapBaidu.clearOverlays();

        $('#home input').eq(0).val('')
        $('#home input').eq(1).val('')

        $('#gaodeCar, #gaodeContainer, .searchBox').children().remove()

        $('#gaodeCar, #gaodeContainer').removeClass()


        $("gaodeContainer").attr("style", "");

    })



}

// 输入：地址
// 输出：经纬度
async function getJingwei(searchTxt) {
    let poi = await new Promise(result => {
        //创建地址解析器实例
        var myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(searchTxt, (point) => {
            if (point) {



                result(point)

            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, searchTxt)

    })

    return poi

}

// ——————————————————————————————————————公交导航
function bondBusRoute(map) {
    
    $('#driving_way select').addClass('btn-sm')


    $('#searchBusBtn').on('click', async () => {

        let poi1 = $('#profile input').eq(0).val()
        let poi2 = $('#profile input').eq(1).val()

        let poi11 = await getJingwei(poi1)
        let poi22 = await getJingwei(poi2)
        console.log(poi1, poi2)

        let start = new BMapGL.Point(poi11.lng, poi11.lat);
        let end = new BMapGL.Point(poi22.lng, poi22.lat);
        // console.log(r1, r2);

        // 百度公交查询
           //"北京邮电大学西门";
        var routePolicy = [BMAP_TRANSIT_POLICY_RECOMMEND, BMAP_TRANSIT_POLICY_LEAST_TIME, BMAP_TRANSIT_POLICY_LEAST_TRANSFER, BMAP_TRANSIT_POLICY_LEAST_WALKING, BMAP_TRANSIT_POLICY_AVOID_SUBWAYS, BMAP_TRANSIT_POLICY_FIRST_SUBWAYS];
        var transit = new BMapGL.TransitRoute(map, {
            renderOptions: { map: map, panel: 'result' },
            policy: 0,

        });

        // 初始选择
        map.clearOverlays();
        var i = $("#driving_way select").val();
        search(start, end, routePolicy[i]);
        function search(start, end, route) {
            transit.setPolicy(route);
            transit.search(start, end);
        }
        $("#driving_way select").change(function () {

            map.clearOverlays();
            var i = $("#driving_way select").val();
            search(start, end, routePolicy[i]);
            function search(start, end, route) {
                transit.setPolicy(route);
                transit.search(start, end);
            }

            $('#driving_way result').css("padding","0")
        });


    })

    $('#profile .clear').on('click', () => {
        map.clearOverlays();

        $('#profile input').eq(0).val('')
        $('#profile input').eq(1).val('')

        $('#profile #result').children().remove()

        // $('#gaodeCar, #gaodeContainer').removeClass()


        // $("gaodeContainer").attr("style","");

    })



}