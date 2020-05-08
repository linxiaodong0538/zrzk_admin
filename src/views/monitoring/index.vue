<template>
    <div class="xny-header">
        <div class="header">
            <span
                class="main-page-span"
                style="font-size: 10px;width: 9rem;cursor: pointer;float: left;position: absolute;left: 95%;top: 5px;"
            >
                <a class="main-page-a" href="/index?from=monitor" style="color: #f2f2f2;">返回主页</a>
            </span>
            <div class="logo">中润智控</div>
            <div class="xny_weather">
                <!-- <iframe src="http://i.tianqi.com/index.php?c=code&id=48&color=%23FFFFFF&icon=1&num=3&site=12" width="440" height="45" frameborder="0" allowtransparency="true"  scrolling="no"></iframe> -->
                <iframe
                    allowtransparency="true"
                    frameborder="0"
                    width="500"
                    height="96"
                    scrolling="no"
                    src="//tianqi.2345.com/plugin/widget/index.htm?s=2&z=1&t=0&v=0&d=3&bd=0&k=000000&f=ffffff&ltf=009944&htf=cc0000&q=1&e=1&a=1&c=54511&w=385&h=96&align=center"
                ></iframe>
            </div>
            <div class="header_time">
                <p id="time" style="margin-top: 20px;"></p>
            </div>
        </div>
        <!-- 左边栏 -->
        <div class="left" style="box-sizing: border-box">
            <!-- 告警分析 -->
            <div id="analysis" class="alarmAnalysis"></div>
            <!--警情-->
            <div class="alarm_height">
                <div class="annual">
                    <button class="xny-btn1">2017</button>
                    <button class="xny-btn1">2018</button>
                    <button class="xny-btn1 annualHighlight">2019</button>
                </div>
                <div id="monthlyConsumption" class="monthlyConsumption"></div>
            </div>
        </div>
        <div class="xny_center">
            <!--地图信息-->
            <div style="height:100%;">
                <div style="height: 45vh; width: 100%; position: relative;">
                    <span id="mapdiv" class="title">路灯异常显示图</span>
                    <div id="sensors" class="sensor">
                        <div class="equipment" id="meterReading" @click="xnyReading">
                            <!-- <span class="iconfont equipment-list">&#xe639;</span> -->
                            <span>路灯异常 (1)台</span>
                        </div>
                        <div class="equipment" id="waterConsumption" @click="waterConsumption">
                            <!-- <span class="iconfont equipment-list">&#xe63a;</span> -->
                            <span>电表异常 (1)台</span>
                        </div>
                        <div class="equipment" id="waterUndervoltage" @click="waterUndervoltage">
                            <!-- <span class="iconfont equipment-list">&#xe637;</span> -->
                            <span>网关异常 (1)台</span>
                        </div>
                        <div class="equipment" id="waterleakage" @click="waterleakage">
                            <!-- <span class="iconfont equipment-list">&#xe63d;</span> -->
                            <span>网关通讯异常 (1)台</span>
                        </div>
                        <div class="equipment" id="equipment" @click="strategy">
                            <!-- <span class="iconfont equipment-list">&#xe63e;</span> -->
                            <span>策略执行异常 (3)台</span>
                        </div>
                    </div>
                    <div id="allmap" style="height: 45vh;"></div>
                </div>
            </div>
            <!--设备信息-->
            <div class="dvce">
                <div class="devinfo" style="width: 100%; height: 100%;">
                    <div class="Lighting" id="Lighting"></div>
                    <div id="street" style="height: 100%; width: 36%; float: right;"></div>
                </div>
            </div>
        </div>
        <div class="left">
            <div class="Bulletin">
                <div id="alarmtext" class="title">福州市各大区路灯亮灯指示</div>
                <div id="review_box" class="review_box">
                    <ul id="comment1" class="alarm_list">
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                        <li class="alarm_li">鼓楼区鼓东片区鼓东街道预计今天晚上4.30分亮灯</li>
                    </ul>
                    <ul id="comment2"></ul>
                </div>
            </div>
            <!--设备分组-->
            <div class="group">
                <div class="annualGroup">
                    <button value="2017" class="xny-btn2">2017</button>
                    <button value="2018" class="xny-btn2">2018</button>
                    <button value="2019" class="xny-btn2 annualHighlight">2019</button>
                </div>
                <div id="annualConsumption" class="annualConsumption"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { dataDisplay } from "@/api/dataCenter/dataCenter.js";
export default {
    data() {
        return {
            equipment: require("../../assets/monitoring/设备异常.gif"),
            meterReading: require("../../assets/monitoring/抄表异常.gif"),
            electricity: require("../../assets/monitoring/漏损.gif"),
            gateway: require("../../assets/monitoring/欠压.gif"),
            communication: require("../../assets/monitoring/流量.gif")
        };
    },
    mounted() {
        this.emergency(); //告警分析
        this.monthly(); //月度能耗
        this.map(); //地图
        this.deviceAlarm(); //设备故障报警
        this.lampAlarm(); //设备故障报警
        this.animation(); //动画
        this.lConsumption(); //动画
    },
    methods: {
        // 告警分析
        emergency() {
            var analysis = this.$echarts.init(
                document.getElementById("analysis")
            );
            analysis.setOption({
                title: {
                    text: "福州路灯是否在线率",
                    x: "left",
                    textStyle: {
                        color: "#fff"
                    },
                    padding: [20, 0, 0, 20]
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    left: "left",
                    data: ["离线", "在线"],
                    padding: [60, 0, 0, 50],
                    textStyle: {
                        color: "#fff"
                    }
                },
                series: [
                    {
                        name: "路灯",
                        type: "pie",
                        radius: ["50%", "70%"],
                        center: ["50%", "50%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: "center",
                                textStyle: {
                                    fontSize: "20",
                                    color: "#fff"
                                    // fontWeight: 'bold'
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: "30"
                                    // fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {
                                value: 2,
                                // name: '离线',
                                itemStyle: {
                                    color: "#FF0000"
                                } //红色
                            },
                            {
                                value: 98,
                                name: "在线率98%",
                                itemStyle: {
                                    color: "#00EE00"
                                } //绿色
                            }
                        ],

                        itemStyle: {
                            emphasis: {
                                shadowBlur: 0,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        }
                    }
                ]
            });
        },
        monthly() {
            //1月度能耗
            var monthlyConsumption = this.$echarts.init(
                document.getElementById("monthlyConsumption")
            );
            monthlyConsumption.setOption({
                color: ["#626C91"],
                title: {
                    text: "路灯月度能耗",
                    x: "left",
                    textStyle: {
                        color: "#fff"
                    }
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        data: [
                            "1月",
                            "2月",
                            "3月",
                            "4月",
                            "5月",
                            "6月",
                            "7月",
                            "8月",
                            "9月",
                            "10月",
                            "11月",
                            "12月"
                        ],
                        axisLine: {
                            lineStyle: {
                                color: "#fff"
                            }
                        },
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "单位 kw-h",
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#fff"
                            }
                        },
                        axisLabel: {
                            // formatter:'{value}kw-h',
                        }
                    }
                ],
                series: [
                    {
                        name: "能耗",
                        type: "bar",
                        barWidth: "60%",
                        data: [10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            });
        },
        map() {
            var map = new BMap.Map("allmap", { enableMapClick: false });
            map.centerAndZoom(new BMap.Point(119.3, 26.08), 12);
            changeMapStyle("midnight");

            function changeMapStyle(style) {
                var mapStyle = {
                    features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
                    style: style
                };
                map.setMapStyle(mapStyle);
            }
            var data_info = [];
            var groupList = [];
            var equipment = this.equipment;
            var myIcon = new BMap.Icon(equipment, new BMap.Size(30, 40));
            dataDisplay().then(res => {
                console.log(res);
                var dataObj = res.rows;
                for (var i = 0; i < dataObj.length; i++) {
                    // groupList[i] = dataObj[i].groupList;
                    // console.log(groupList);
                    //   for (let i = 0; i < groupList.length; i++) {
                    //     // console.log(groupList[i].groupName);
                    // }
                    data_info[i] = [
                        dataObj[i].longitude,
                        dataObj[i].latitude,
                        "设备编号：" +
                            dataObj[i].deviceCode +
                            "</br>产品名称：" +
                            dataObj[i].productName +
                            "</br>设备类型：" +
                            dataObj[i].deviceTypeName +
                            "</br>部件编号：" +
                            dataObj[i].partsCode +
                            "</br>所在区域：" +
                            dataObj[i].areaName +
                            "</br>项目：" +
                            dataObj[i].projectName
                        //  + "</br>分组：" + groupList[i].groupName
                    ];
                }
                for (var i = 0; i < data_info.length; i++) {
                    var marker = new BMap.Marker(
                        new BMap.Point(data_info[i][0], data_info[i][1]),
                        { icon: myIcon }
                    );
                    var content = data_info[i][2];
                    // var content =
                    //   "<div class='infoWindow'>" +
                    //   "<span style='margin:0 0 5px 0;padding:0.4em 0'>设备编号:665555</span>" +
                    //   "</br>" +
                    //   "<span style='margin:0 0 5px 0;padding:0.4em 0'>设备信息:665555</span>" +
                    //   "</br>" +
                    //   "</div>";
                    map.addOverlay(marker); // 将标注添加到地图中
                    addClickHandler(content, marker);
                    //  marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                }
            });
            var opts = {
                width: 250, // 信息窗口宽度
                title: "设备信息", // 信息窗口标题
                enableMessage: true //设置允许信息窗发送短息
            };
            function addClickHandler(content, marker) {
                marker.addEventListener("click", function(e) {
                    openInfo(content, e);
                });
            }
            function openInfo(content, e) {
                var p = e.target;
                var point = new BMap.Point(
                    p.getPosition().lng,
                    p.getPosition().lat
                );
                var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
                map.openInfoWindow(infoWindow, point); //开启信息窗口
            }
            //路灯异常
            var meterReading = this.meterReading;
            var myIcon1 = new BMap.Icon(meterReading, new BMap.Size(30, 40));
            var marker1 = new BMap.Marker(new BMap.Point(119.3, 26.12), {
                icon: myIcon1
            });
            map.addOverlay(marker1);
            //电表异常
            var electricity = this.electricity;
            var myIcon2 = new BMap.Icon(electricity, new BMap.Size(30, 40));
            var marker2 = new BMap.Marker(new BMap.Point(119.32, 26.06111), {
                icon: myIcon2
            });
            map.addOverlay(marker2);
            //网关异常
            var gateway = this.gateway;
            var myIcon2 = new BMap.Icon(gateway, new BMap.Size(30, 40));
            var marker2 = new BMap.Marker(new BMap.Point(119.3044, 26.10222), {
                icon: myIcon2
            });
            map.addOverlay(marker2);
            //网关通讯异常
            var communication = this.communication;
            var myIcon2 = new BMap.Icon(communication, new BMap.Size(30, 40));
            var marker2 = new BMap.Marker(new BMap.Point(119.27, 26.0322), {
                icon: myIcon2
            });
            map.addOverlay(marker2);
        },
        xnyReading() {
            var map = new BMap.Map("allmap", { enableMapClick: false });
            map.centerAndZoom(new BMap.Point(119.3, 26.08), 12);
            changeMapStyle("midnight");
            function changeMapStyle(style) {
                var mapStyle = {
                    features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
                    style: style
                };
                map.setMapStyle(mapStyle);
            }
            var meterReading = this.meterReading;
            var myIcon1 = new BMap.Icon(meterReading, new BMap.Size(30, 40));
            var marker1 = new BMap.Marker(new BMap.Point(119.3, 26.12), {
                icon: myIcon1
            });
            map.addOverlay(marker1);
        },
        waterConsumption() {
            var map = new BMap.Map("allmap", { enableMapClick: false });
            map.centerAndZoom(new BMap.Point(119.3, 26.08), 12);
            changeMapStyle("midnight");
            function changeMapStyle(style) {
                var mapStyle = {
                    features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
                    style: style
                };
                map.setMapStyle(mapStyle);
            }
            //电表异常
            var electricity = this.electricity;
            var myIcon2 = new BMap.Icon(electricity, new BMap.Size(30, 40));
            var marker2 = new BMap.Marker(new BMap.Point(119.32, 26.06111), {
                icon: myIcon2
            });
            map.addOverlay(marker2);
        },
        waterUndervoltage() {
            var map = new BMap.Map("allmap", { enableMapClick: false });
            map.centerAndZoom(new BMap.Point(119.3, 26.08), 12);
            changeMapStyle("midnight");
            function changeMapStyle(style) {
                var mapStyle = {
                    features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
                    style: style
                };
                map.setMapStyle(mapStyle);
            }
            //网关异常
            var gateway = this.gateway;
            var myIcon2 = new BMap.Icon(gateway, new BMap.Size(30, 40));
            var marker2 = new BMap.Marker(new BMap.Point(119.3044, 26.10222), {
                icon: myIcon2
            });
            map.addOverlay(marker2);
        },
        waterleakage() {
            var map = new BMap.Map("allmap", { enableMapClick: false });
            map.centerAndZoom(new BMap.Point(119.3, 26.08), 12);
            changeMapStyle("midnight");
            function changeMapStyle(style) {
                var mapStyle = {
                    features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
                    style: style
                };
                map.setMapStyle(mapStyle);
            }
            //网关通讯异常
            var communication = this.communication;
            var myIcon2 = new BMap.Icon(communication, new BMap.Size(30, 40));
            var marker2 = new BMap.Marker(new BMap.Point(119.27, 26.0322), {
                icon: myIcon2
            });
            map.addOverlay(marker2);
        },
        strategy() {
            var map = new BMap.Map("allmap", { enableMapClick: false });
            map.centerAndZoom(new BMap.Point(119.3, 26.08), 12);
            changeMapStyle("midnight");
            function changeMapStyle(style) {
                var mapStyle = {
                    features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
                    style: style
                };
                map.setMapStyle(mapStyle);
            }
            var data_info = [];
            var groupList = [];
            var equipment = this.equipment;
            var myIcon = new BMap.Icon(equipment, new BMap.Size(30, 40));
            dataDisplay().then(res => {
                console.log(res);
                var dataObj = res.rows;
                for (var i = 0; i < dataObj.length; i++) {
                    // groupList[i] = dataObj[i].groupList;
                    // console.log(groupList);
                    //   for (let i = 0; i < groupList.length; i++) {
                    //     // console.log(groupList[i].groupName);
                    // }
                    data_info[i] = [
                        dataObj[i].longitude,
                        dataObj[i].latitude,
                        "设备编号：" +
                            dataObj[i].deviceCode +
                            "</br>产品名称：" +
                            dataObj[i].productName +
                            "</br>设备类型：" +
                            dataObj[i].deviceTypeName +
                            "</br>部件编号：" +
                            dataObj[i].partsCode +
                            "</br>所在区域：" +
                            dataObj[i].areaName +
                            "</br>项目：" +
                            dataObj[i].projectName
                        //  + "</br>分组：" + groupList[i].groupName
                    ];
                }
                for (var i = 0; i < data_info.length; i++) {
                    var marker = new BMap.Marker(
                        new BMap.Point(data_info[i][0], data_info[i][1]),
                        { icon: myIcon }
                    );
                    var content = data_info[i][2];
                    // var content =
                    //   "<div class='infoWindow'>" +
                    //   "<span style='margin:0 0 5px 0;padding:0.4em 0'>设备编号:665555</span>" +
                    //   "</br>" +
                    //   "<span style='margin:0 0 5px 0;padding:0.4em 0'>设备信息:665555</span>" +
                    //   "</br>" +
                    //   "</div>";
                    map.addOverlay(marker); // 将标注添加到地图中
                    addClickHandler(content, marker);
                    //  marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                }
            });
            var opts = {
                width: 250, // 信息窗口宽度
                title: "设备信息", // 信息窗口标题
                enableMessage: true //设置允许信息窗发送短息
            };
            function addClickHandler(content, marker) {
                marker.addEventListener("click", function(e) {
                    openInfo(content, e);
                });
            }
            function openInfo(content, e) {
                var p = e.target;
                var point = new BMap.Point(
                    p.getPosition().lng,
                    p.getPosition().lat
                );
                var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
                map.openInfoWindow(infoWindow, point); //开启信息窗口
            }
        },
        deviceAlarm() {
            var Lighting = this.$echarts.init(
                document.getElementById("Lighting")
            );
            Lighting.setOption({
                title: {
                    text: "设备故障统计",
                    x: "left",
                    textStyle: {
                        color: "#fff"
                    },
                    padding: [0, 0, 0, 20]
                },
                legend: {
                    padding: [30, 0, 0, 50],
                    textStyle: {
                        color: "#8D98C9"
                    }
                },
                tooltip: {},
                xAxis: {
                    type: "category",
                    data: ["路灯", "电表", "网关"],
                    axisTick: {
                        //y轴刻度线
                        show: false
                    },
                    axisLine: {
                        show: true, // Y轴线
                        lineStyle: {
                            color: "#fff"
                        }
                    }
                },
                yAxis: {
                    type: "value",
                    name: "单位 %",
                    axisTick: {
                        //y轴刻度线
                        show: false
                    },
                    splitLine: {
                        //y轴里面的线
                        show: false
                    },
                    axisLine: {
                        show: true, // Y轴线
                        lineStyle: {
                            color: "#fff"
                        }
                    }
                },
                series: [
                    {
                        type: "bar",
                        data: [3.1, 2.5, 1.8],
                        itemStyle: {
                            color: "#3398DB"
                        } //红色
                    }
                ]
            });
        },
        lampAlarm() {
            var streetlamp = this.$echarts.init(
                document.getElementById("street")
            );
            streetlamp.setOption({
                title: {
                    text: "路灯报警统计:",
                    x: "left", //水平居中
                    textStyle: {
                        fontWeight: "normal",
                        color: "#fff"
                    },
                    padding: [15, 10, 0, 0] // 位置
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    x: "left",
                    data: ["路灯", "电表", "网关", "通讯", "策略"],
                    textStyle: {
                        color: "#fff"
                    },
                    padding: [40, 10, 0, 0] // 位置
                },
                series: [
                    {
                        type: "pie",
                        name: "单位 : 台",
                        radius: ["55%", "80%"],
                        center: ["60%", "60%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: "center",
                                textStyle: {
                                    fontSize: 15,
                                    color: "#fff"
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: 15,
                                    color: "#fff"
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        data: [
                            {
                                name: "路灯",
                                value: 10,
                                itemStyle: {
                                    color: "#FF71D0"
                                } //红色
                            },
                            {
                                name: "电表",
                                value: 15,
                                itemStyle: {
                                    color: "#00D2B6"
                                } //绿色
                            },
                            {
                                name: "网关",
                                value: 15,
                                itemStyle: {
                                    color: "#FFE133"
                                } //绿色
                            },
                            {
                                name: "通讯",
                                value: 15,
                                itemStyle: {
                                    color: "#26A349"
                                } //绿色
                            },
                            {
                                name: "策略",
                                value: 15,
                                itemStyle: {
                                    color: "#FF1919"
                                } //绿色
                            }
                        ]
                    }
                ]
            });
        },
        animation() {
            var timer = null;
            window.onload = roll(50);

            window.onbeforeunload = function() {
                console.log('timer', timer);
                if (timer) clearInterval(timer);
            };
            function roll(t) {
                var ul1 = document.getElementById("comment1");
                var ul2 = document.getElementById("comment2");
                var ulbox = document.getElementById("review_box");
                ul2.innerHTML = ul1.innerHTML;
                ulbox.scrollTop = 0; // 开始无滚动时设为0
                timer = setInterval(rollStart, t); // 设置定时器，参数t用在这为间隔时间（单位毫秒），参数t越小，滚动速度越快
                // 鼠标移入div时暂停滚动
                ulbox.onmouseover = function() {
                    clearInterval(timer);
                };
                // 鼠标移出div后继续滚动
                ulbox.onmouseout = function() {
                    timer = setInterval(rollStart, t);
                };
            }
            // 开始滚动函数
            function rollStart() {
                // 上面声明的DOM对象为局部对象需要再次声明
                var ul1 = document.getElementById("comment1");
                var ul2 = document.getElementById("comment2");
                var ulbox = document.getElementById("review_box");
                if(!ulbox) return;
                // 正常滚动不断给scrollTop的值+1,当滚动高度大于列表内容高度时恢复为0
                if (ulbox.scrollTop >= ul1.scrollHeight) {
                    ulbox.scrollTop = 0;
                } else {
                    ulbox.scrollTop++;
                }
            }
        },
        lConsumption() {
            var annualConsumption = this.$echarts.init(
                document.getElementById("annualConsumption")
            );
            annualConsumption.setOption({
                title: {
                    text: "电表年度能耗",
                    x: "left",
                    textStyle: {
                        color: "#fff"
                    }
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        data: ["2017", "2018", "2019"],
                        axisLine: {
                            lineStyle: {
                                color: "#fff"
                            }
                        },
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "单位 kw-h",
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#fff"
                            }
                        },
                        axisLabel: {
                            // formatter:'{value}kw-h',
                        }
                    }
                ],
                series: [
                    {
                        name: "2017",
                        type: "bar",
                        barWidth: "60%",
                        data: [100, 140, 150],
                        itemStyle: {
                            normal: {
                                color: "#3398DB"
                            }
                        }
                    }
                ]
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.xny-header {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #011226;
}
.inline {
    float: left;
    /* background-image: linear-gradient(rgba(81, 128, 199, 0.2), transparent); */
    background-color: transparent !important;
}

.header {
    display: block;
    /*margin:10px 0;*/
    /* padding: 1.4em 2%; */
    height: 74px;
    background-image: linear-gradient(175deg, #0a325c 30%, #011226 70%);
    box-shadow: 0 1em 3em rgba(0, 0, 0, 0.4);
    position: relative;
}

.logo {
    margin-left: 2%;
    float: left;
    width: auto;
    font-size: 2.2em;
    color: #fff;
    opacity: 0.6;
    line-height: 74px;
}

.title {
    line-height: 24px;
    font-size: 14px;
    color: #6fb0de;
}

.header_time {
    float: right;
    text-align: right;
    font-size: 1.2em;
    line-height: 1.5;

    color: #fff;
    opacity: 0.6;
}

.left {
    /*display: table-cell;*/
    float: left;
    width: 25%;
    height: 100%;
}
.alarmAnalysis {
    width: 100%;
    height: 45%;
    background-color: #011226;
}

.xny_center {
    float: left;
    width: 50%;
}

.alarm_li {
    width: 100%;
    font-size: 14px;
    color: #6fb0de;
    display: table;
    table-layout: fixed;
    height: 2.8em;
    line-height: 2.8em;
    vertical-align: middle;
    /*border-top: 1px dashed #6fb0de;*/
}

.alarm_height {
    position: relative;
    height: 250px;
    /*border-style: outset;*/
    overflow-x: hidden;
}

.group {
    height: 40%;
    position: relative;
    padding: 4px 1em 0;
    background-color: transparent !important;
    margin-bottom: 0px !important;
}

.treeskin {
    color: #6fb0de;
}

.layui-tree li i {
    color: #6fb0de;
}

.dvce {
    height: 36vh;
    display: block;
    border: none;
    border-radius: 0;
    margin-top: 15px;
    /* padding: 1em 1em 0 1em; */
    position: relative;
    box-shadow: 0 1em 2em rgba(0, 0, 0, 0.1);
    background-image: linear-gradient(rgba(81, 128, 199, 0.2), transparent);
    padding-top: 2vh;
    box-sizing: border-box;
}
.info_btn img {
    cursor: pointer;
    width: 1.06em;
    font-size: 1.8em;
}

.dialogbtns {
    /*position: absolute;*/
    right: 0;
    top: 0;
    width: 150px;
    float: left;
}

.dialogbtn h3 {
    border-radius: 5px;
    /*font-size: 12px;*/
    padding: 3px 5px;
    margin-top: 18px;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background-color: #2482fa;
}
.hidetext {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    /* 限制在一个块元素显示的文本的行数 */
    -webkit-box-orient: vertical;
    /* 垂直排列 */
    word-break: break-all;
}

body {
    /* overflow: hidden; */
}

ul {
    list-style: none;
}
/* 月度能耗 */
.monthlyConsumption {
    margin-top: 20px;
    height: calc(100% - 20px);
}
.annualConsumption {
    margin-top: 20px;
    height: calc(100% - 20px);
}
/* 按钮 */
.annual {
    position: absolute;
    top: 30px;
    right: 15px;
    z-index: 9999999;
    cursor: pointer;
}

button {
    background-color: #011226;
    color: #fff;
    border: none;
    cursor: pointer;
    outline: none;
    width: 50px;
    height: 30px;
    border-radius: 5px;
}
.annualHighlight {
    background-color: #009fcc;
}
.annualGroup {
    position: absolute;
    position: absolute;
    top: 30px;
    right: 15px;
    z-index: 9999999;
    cursor: pointer;
}

/* 路灯公告 */
.Bulletin {
    width: 100%;
    height: 45%;
}
.review_box {
    width: 100%;
    height: 100%;
    /* 必须 */
    overflow: hidden;
    /* 必须 */
}
.sensor {
    margin-top: 5px;
    display: inline-block;
    /* position: absolute; */
    height: 20px;
    vertical-align: middle;
    margin-bottom: 5px;
}
/* 路灯设备报警异常 */
.equipment {
    float: left;
    /* margin: 15px 0 15px 10px; */
    margin-left: 5px;
    left: 5px;
    height: 20px;
    padding: 0 5px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    background-color: #ff71d0;
}
/* 图标 */
.equipment span {
    font-size: 14px;
    line-height: 20px;
    color: #fff;
}
.equipment .equipment-list {
    vertical-align: middle;
}
#waterConsumption {
    background-color: #34b7ff;
}
#waterUndervoltage {
    background-color: #ffe133;
}

#waterleakage {
    background-color: #26a349;
}
#equipment {
    background-color: #ff1919;
}
/* 路灯设备 */
.Lighting {
    margin-top: 40px;
    float: left;
    width: 64%;
    height: 100%;
}
#street {
    margin-top: 30px;
}
/* 修改天气样式 */
.xny_weather {
    height: 100%;
    float: right;
    margin-right: 80px;
}
.has-all {
    margin-top: -28px;
}
</style>