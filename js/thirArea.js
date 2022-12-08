import { map } from "./index.js";

// 绑定图层事件
bondMoreFunc(map)





// ————————————————————————————————————函数
// 绑定图层事件
function bondMoreFunc(map) {

    // 绑定自定义视角动画
    selfAnim(map)

    // 绑定轨迹动画
    trackAnim(map)
}



// ————————————————————————————————————自定义动画

// 绑定自定义视角动画
function selfAnim(map) {
    //绑定交通页面
    var addAnim = false
    var animation

    $('#animLayer input:radio[name="anim"]').click(() => {

        if (addAnim) {
            $('#animLayer input:radio[name="anim"]').attr("checked", false);
            addAnim = false

            // 取消按钮 执行
            // console.log(animation);
            map.cancelViewAnimation(animation)
            //恢复层级
            map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 8)

            return
        }

        if ($('#animLayer input:radio[name="anim"]').prop("checked")) {

            addAnim = true


            // 选中按钮 执行
            animation = animAct(map)

        }

    });
}
// 选中按钮 执行
function animAct(map) {

    // 定义关键帧
    var keyFrames = [
        {
            center: new BMapGL.Point(116.307092, 40.054922),
            zoom: 20,
            tilt: 50,
            heading: 0,
            percentage: 0
        },
        {
            center: new BMapGL.Point(116.307631, 40.055391),
            zoom: 21,
            tilt: 70,
            heading: 0,
            percentage: 0.1
        },
        {
            center: new BMapGL.Point(116.306858, 40.057887),
            zoom: 21,
            tilt: 70,
            heading: 0,
            percentage: 0.25
        },
        {
            center: new BMapGL.Point(116.306858, 40.057887),
            zoom: 21,
            tilt: 70,
            heading: -90,
            percentage: 0.35
        },
        {
            center: new BMapGL.Point(116.307904, 40.058118),
            zoom: 21,
            tilt: 70,
            heading: -90,
            percentage: 0.45
        },
        {
            center: new BMapGL.Point(116.307904, 40.058118),
            zoom: 21,
            tilt: 70,
            heading: -180,
            percentage: 0.55
        },
        {
            center: new BMapGL.Point(116.308902, 40.055954),
            zoom: 21,
            tilt: 70,
            heading: -180,
            percentage: 0.75
        },
        {
            center: new BMapGL.Point(116.308902, 40.055954),
            zoom: 21,
            tilt: 70,
            heading: -270,
            percentage: 0.85
        },
        {
            center: new BMapGL.Point(116.307779, 40.055754),
            zoom: 21,
            tilt: 70,
            heading: -360,
            percentage: 0.95
        },
        {
            center: new BMapGL.Point(116.307092, 40.054922),
            zoom: 20,
            tilt: 50,
            heading: -360,
            percentage: 1
        },
    ];

    var opts = {
        duration: 10000,
        delay: 0,
        interation: 'INFINITE'
    };

    // 声明动画对象
    var animation = new BMapGL.ViewAnimation(keyFrames, opts);

    // 开始播放动画
    setTimeout(map.startViewAnimation(animation), 0);

    return animation
}



// 绑定轨迹动画
function trackAnim(map) {
    //绑定交通页面
    var addAnim = false

    var trackAnimBack

    $('#animGuijiLayer input:radio[name="animGuiji"]').click(() => {

        if (addAnim) {
            $('#animGuijiLayer input:radio[name="animGuiji"]').attr("checked", false);
            addAnim = false

            // 取消按钮 执行
            trackAnimBack.then(r => r.cancel())
            // trackAnimBack.cancel();     

            //恢复层级
            map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 8)
            return
        }

        if ($('#animGuijiLayer input:radio[name="animGuiji"]').prop("checked")) {

            addAnim = true


            // 选中按钮 执行
            trackAnimBack = animGuijiAct(map)

        }

    });
}

//运行轨迹动画
function animGuijiAct(map) {
    var path = [{
        'lng': 116.297611,
        'lat': 40.047363
    }, {
        'lng': 116.302839,
        'lat': 40.048219
    }, {
        'lng': 116.308301,
        'lat': 40.050566
    }, {
        'lng': 116.305732,
        'lat': 40.054957
    }, {
        'lng': 116.304754,
        'lat': 40.057953
    }, {
        'lng': 116.306487,
        'lat': 40.058312
    }, {
        'lng': 116.307223,
        'lat': 40.056379
    }];
    var point = [];
    for (var i = 0; i < path.length; i++) {
        point.push(new BMapGL.Point(path[i].lng, path[i].lat));
    }
    var pl = new BMapGL.Polyline(point);


    // setTimeout( start(), 3000);
    // function start() {
    //     const trackAni = new BMapGLLib.TrackAnimation(map, pl, {
    //         overallView: true,
    //         tilt: 30,
    //         duration: 20000,
    //         delay: 300
    //     });
    //     trackAni.start();

    //     resolve(trackAni) 
    // }

    let promise = new Promise((resolve) => {


        setTimeout(start(), 3000);
        function start() {
            const trackAni = new BMapGLLib.TrackAnimation(map, pl, {
                overallView: true,
                tilt: 30,
                duration: 20000,
                delay: 300
            });
            trackAni.start();

            resolve(trackAni)
        }


    }).catch(
        err => alert(err)
    );
    

    return promise


}