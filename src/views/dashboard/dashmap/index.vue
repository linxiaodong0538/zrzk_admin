<template>
    <div>
        <div @keydown.esc="quit" tabindex="0">
            <div class="x-map-nav">
                <div id="logo" style="display: inline-block;" @click="quit">
                    <i class="el-icon-monitor"></i>
                    管理系统
                </div>
            </div>
            <div
                id="x-map-box"
                style="width: 100%; height: 100vh;"
                @keydown.esc="quit"
                tabindex="0"
            ></div>
            <div class="x-map-pannel right">
                <el-radio-group v-model="current.period">
                    <el-radio label="today">今日</el-radio>
                    <el-radio label="yesterday">昨日</el-radio>
                    <el-radio label="month">本月</el-radio>
                    <el-radio label="year">本年</el-radio>
                </el-radio-group>
                <el-date-picker
                    v-model="current.dateRange"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%; margin: 15px 0 0 0;"
                    size="mini"
                ></el-date-picker>
                <div class="tip">水位排行</div>
                <el-divider></el-divider>
                <div class="x-map-card">
                    <ul>
                        <li>
                            <label>位置</label>
                            <label>平均水位</label>
                        </li>
                        <li>
                            <label>工业路52号</label>
                            <label>55cm</label>
                        </li>
                        <li>
                            <label>华林路76号</label>
                            <label>53cm</label>
                        </li>
                        <li>
                            <label>华林路76号</label>
                            <label>53cm</label>
                        </li>
                        <li>
                            <label>华林路76号</label>
                            <label>53cm</label>
                        </li>
                        <li>
                            <label>华林路76号</label>
                            <label>53cm</label>
                        </li>
                    </ul>
                </div>
                <div class="tip">进下水位变化</div>
                <el-divider></el-divider>
                <div id="water" style="width: 100%; height: 100px; padding: 0; margin: 0"></div>
                <div class="tip">路面积水</div>
                <el-divider></el-divider>
                <div id="seeper" :style="{width: '100%', height: '100px' }"></div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=k1gYhyr8h8ksQN63Z1Mu0xNuhiZCr157"></script>
<script type="text/javascript" src="/assets/maps/custom_map_config.json"></script>
<script>
import { Loading } from "element-ui";
import { mapstyles } from "./stylelist";
import { StyleFeatures } from "./custom_map_config";
import moment from "moment";
export default {
    props: {
        data: {
            type: Object,
            // required: true,
            default: () => ({})
        },
        // data: [],
        options: {
            type: Object,
            default: () => ({
                children: "children",
                label: "label"
            })
        },
        longitude: {
            type: Number,
            default: null
        },
        latitude: {
            type: Number,
            default: null
        },
        props: {
            type: Object,
            default: () => ({})
        },
        expandOnClickNode: {
            type: Boolean,
            default: false
        },
        isFilterable: {
            type: Boolean,
            default: false
        },
        filterNodeMethod: {
            type: Function,
            default: (value, data) => {
                console.log("fi", value, data);
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            }
        },
        // options: [],
        // hasSecondTableHead: false,
        loading: {
            type: Boolean,
            default: false
        },
        // loading: false,
        loadingText: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            map: null,
            convertor: new BMap.Convertor(),
            center: new BMap.Point(116.32715863448607, 39.990912172420714),
            autoFocus: true,
            timer: {
                focus: null
            },
            district: "福州",
            current: {
                period: "today",
                dateRange: []
            }
        };
    },
    methods: {
        quit() {
            this.$router.push({ path: "/" });
        },
        tranlate(coordinate) {
            this.convertor.translate(
                [coordinate],
                1,
                5,
                ({ status, points }) => {
                    console.log(...points);
                }
            );
        },
        addCover() {
            this.addIcon({
                coordinate: {
                    lng: 119.316477,
                    lat: 26.097627
                },
                imagePath: "http://localhost:90/assets/icons/svg/monitor.svg",
                size: { width: 300, height: 157 }
            });
        },
        addIcon({ coordinate, imagePath, size, offset }) {
            //"/jsdemo/img/fox.gif"; 116,39 ; 300,157
            var pt = new BMap.Point(coordinate.lng, coordinate.lat);
            var myIcon = new BMap.Icon(
                imagePath,
                new BMap.Size(size.width, size.height),
                {}
            );
            var marker2 = new BMap.Marker(pt, { icon: myIcon }); // 创建标注
            this.map.addOverlay(marker2);
        },
        panTo(marker) {
            this.map.panTo(
                (marker && marker.getPosition()) ||
                    new BMap.Point(
                        116 + Math.random() / 10,
                        39 + Math.random() / 10
                    ),
                { noAnimation: false, enableAnimation: true }
            );
        },
        setAnimation(marker) {
            marker.setAnimation("BMAP_ANIMATION_BOUNCE");
        },
        drawLine({ id, option }) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById(id));
            // 绘制图表
            myChart.setOption(
                option || {
                    title: {
                        show: false,
                        text: "折线图堆叠"
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    legend: {
                        show: false,
                        data: [
                            "邮件营销",
                            "联盟广告",
                            "视频广告",
                            "直接访问",
                            "搜索引擎"
                        ]
                    },
                    grid: {
                        top: "-0%",
                        left: "-0%",
                        right: "-0%",
                        bottom: "0%",
                        containLabel: false
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: [
                            "周一",
                            "周二",
                            "周三",
                            "周四",
                            "周五",
                            "周六",
                            "周日"
                        ]
                    },
                    yAxis: {
                        type: "value",
                        splitLine: {
                            lineStyle: {
                                type: "dotted",
                                width: 0.5,
                                color: "rgba(255, 255, 255, 0.2)"
                            }
                        }
                    },
                    series: [
                        {
                            name: "邮件营销",
                            type: "line",
                            stack: "总量",
                            data: [120, 132, 101, 134, 90, 230, 210],
                            smooth: true,
                            color: "#47d8be"
                        },
                        {
                            name: "联盟广告",
                            type: "line",
                            stack: "总量",
                            data: [220, 182, 191, 234, 290, 330, 310],
                            smooth: true,
                            color: "#f7b27f"
                        }
                        // {
                        //     name: "视频广告",
                        //     type: "line",
                        //     stack: "总量",
                        //     data: [150, 232, 201, 154, 190, 330, 410]
                        // },
                        // {
                        //     name: "直接访问",
                        //     type: "line",
                        //     stack: "总量",
                        //     data: [320, 332, 301, 334, 390, 330, 320]
                        // },
                        // {
                        //     name: "搜索引擎",
                        //     type: "line",
                        //     stack: "总量",
                        //     data: [820, 932, 901, 934, 1290, 1330, 1320]
                        // }
                    ]
                }
            );
        },
        trace() {}
    },
    watch: {
        autoFocus(v) {
            if (v)
                this.timer.focus = setInterval(() => {
                    this.panTo();
                }, 5000);
            else {
                if (this.timer.focus) clearInterval(this.timer.focus);
            }
        }
    },
    mounted() {
        this.map = new BMap.Map("x-map-box", { enableMapClick: false });

        this.map.setMapStyle({
            features: StyleFeatures,
            style: mapstyles.midnight.key
        }); //grayscale, bluish, midnight
        window.xmap = this.map;
        var point = new BMap.Point(116.404, 39.915);
        this.map.centerAndZoom(this.district, 15);
        this.map.addEventListener("click", e => {
            let point = e.point;
            let longitude = point.lng;
            let latitude = point.lat;
            // this.longitude = longitude;
            // this.latitude = latitude;
            this.$emit("click", { longitude, latitude });
        });

        this.map.addControl(new BMap.NavigationControl());
        this.map.enableScrollWheelZoom(true);

        this.addCover();
        this.drawLine({ id: "seeper" });
        this.drawLine({ id: "water" });

        let count = 10;
        this.timer.focus = setInterval(() => {
            if (count > 0) {
                count--;
                this.panTo();
            } else {
                this.autoFocus = false;
            }
        }, 5000);
    }
};
</script> 
<style>
@import "./style.css";

.x-map-toolbar {
    width: 335px;
    height: 80vh;
    padding: 20px;
    border: solid 1px rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    right: 40px;
    top: 8vh;
    /* z-index: 100000; */
}
.x-map-pannel {
    width: 335px;
    height: 80vh;
    padding: 20px;
    border: solid 1px rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    right: 40px;
    top: 8vh;
    /* z-index: 100000; */
    overflow-y: auto;
}
.x-map-pannel.right {
    right: 40px;
}
.x-map-pannel.left {
    left: 40px;
}
.x-map-pannel .el-radio {
    margin-right: 15px;
}
.x-map-pannel .el-radio__label {
    color: #fff;
}

.x-map-pannel .el-divider--horizontal {
    margin: 10px 0 15px 0;
}
.anchorBL {
    display: none;
}
</style>