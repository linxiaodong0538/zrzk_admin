<template>
    <div id="x-map-box" style="width: 100%; height: 100vh;"></div>
</template>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=k1gYhyr8h8ksQN63Z1Mu0xNuhiZCr157"></script>
<script>
import { Loading } from "element-ui";
import { Paginator } from "../dtos/paginator";

export default {
    props: {
        data: {
            type: Object,
            required: true,
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
            q: ""
        };
    },
    methods: {
        handleNodeClick(...args) {
            // console.log("trigger cell-click");
            this.$emit("node-click", args[0]);
        }
    },
    watch: {
        // 根据名称筛选部门树
        q(val) {
            // this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.map = new BMap.Map("x-map-box");
        var point = new BMap.Point(116.404, 39.915);
        this.map.centerAndZoom(point, 15);
        this.map.addEventListener("click", e => {
            let point = e.point;
            let longitude = point.lng;
            let latitude = point.lat;
            // this.longitude = longitude;
            // this.latitude = latitude;
            this.$emit("click", { longitude, latitude });
        });
    }
};
</script>

<style >
.el-tree-node.is-current > .el-tree-node__content .el-tree-node__label {
    color: #1e88e5;
}
/* #aaa {
    cursor: pointer;
    color: #1e88e5 !important;
    &:hover {
        color: lightcoral !important;
    }
    &:visited {
        color: darkgoldenrod !important;
    }
    &:active {
        color: red !important;
    }
} */
</style>

