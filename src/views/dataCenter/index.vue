<template>
    <div>
        <div id="allmap"></div>
        <map-info ref="info" v-if="isShowInfo" v-model="current.node" @refresh="refresh"></map-info>
    </div>
</template>
<script>
import { dataDisplay } from "@/api/dataCenter/dataCenter.js";
import Vue from "vue";
import { renderVNodesToString, renderVNode, renderer } from "vue";
import MapInfo from "./info.vue";
import { MapStyles } from "./data";
export default {
    components: { MapInfo },
    data() {
        return {
            map: null,
            icons: {
                /** 警告 */
                caution: {
                    cover: require("@/assets/maps/devices/caution/cover.png")
                },
                /** 在线 */
                online: {
                    cover: require("@/assets/maps/devices/online/cover.png")
                },
                /** 离线 */
                offline: {
                    cover: require("@/assets/maps/devices/offline/cover.png")
                }
            },
            opts: {
                width: 450, // 信息窗口宽
                // title: "设备信息", // 信息窗口标题
                enableAutoPan: true,
                enableMessage: true //设置允许信息窗发送短息
            },
            current: {
                node: null,
                html: null
            },
            layout: {
                info: null
            },
            isShowInfo: false
        };
    },
    mounted() {
        this.init();

        window.setInterval(() => {
            this.load();
        }, 15000);
    },
    methods: {
        init() {
            // 百度地图API功能
            this.maper = new BMap.Map("allmap", { enableMapClick: false });
            this.maper.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            this.maper.centerAndZoom(new BMap.Point(119.28, 26.08), 14);
            this.maper.setMapStyleV2({ styleJson: MapStyles });
            // this.maper.centerAndZoom(new BMap.Point(119.28, 26.08), 1);
            this.load();
        },
        load() {
            const h = this.$createElement;

            const template = ``;
            dataDisplay().then(({ rows }) => {
                const markers = [];
                rows.forEach(x => {
                    if (!(x.longitude && x.latitude)) return true;
                    let marker = new BMap.Marker(
                        new BMap.Point(x.longitude, x.latitude),
                        {
                            data: x,
                            icon: new BMap.Icon(
                                this.icons[
                                    x.isAlert
                                        ? "caution"
                                        : x.onlineStatus == 1
                                        ? "online"
                                        : "offline"
                                ].cover,
                                new BMap.Size(30, 30),
                                {
                                    imageSize: new BMap.Size(30, 30)
                                }
                            )
                        }
                    );

                    marker.data = x;
                    marker.addEventListener("click", e => {
                        var data = e.target.data;
                        this.current.node = data;
                        this.isShowInfo = true;
                        setTimeout(() => {
                            this.bind(e);
                        }, 300);
                    });
                    markers.push(marker);
                });
                markers.forEach(x => this.maper.addOverlay(x));
            });
        },
        bind(e) {
            var p = e.target;
            var point = new BMap.Point(
                p.getPosition().lng,
                p.getPosition().lat
            );
            // var infoWindow = new BMap.InfoWindow(this.$refs.info, this.opts); // 创建信息窗口对象
            if (this.$refs.info.$el) {
                this.layout.info = new BMap.InfoWindow(
                    this.$refs.info.$el,
                    Object.assign({}, this.opts, {})
                );
                this.maper.openInfoWindow(this.layout.info, point); //开启信息窗口
            }
        },
        refresh() {}
    }
};
</script>
<style lang="scss" scoped>
#allmap {
    width: 100%;
    height: calc(100vh - 85px);
}
</style>