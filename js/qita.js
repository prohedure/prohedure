export { bondCarRoute }


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
function bondCarRoute(map) {

    $('#searchCarBtn').on('click', async () => {


        let poi1 = $('#home input').eq(0).val()
        let poi2 = $('#home input').eq(1).val()

        poi1 = await getJingwei(poi1)
        poi2 = await getJingwei(poi2)
        console.log(poi1, poi2)

        let r1 = new BMapGL.Point(poi1.lng, poi1.lat);
        let r2 = new BMapGL.Point(poi2.lng, poi2.lat);
        console.log(r1, r2);

        var driving = new BMapGL.DrivingRoute(map, { renderOptions: { map: map, autoViewport: true } });
        driving.search(r1, r2);

        // map.centerAndZoom(r1, 8);
    })

    $('#home .clear').on('click', () => {
        map.clearOverlays();

       $('#home input').eq(0).val('')
       $('#home input').eq(1).val('')
    })

}

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
