<template>
    <div>
        <div v-if="isFilterable" class="head-container">
            <el-input
                v-model="q"
                placeholder="请输入"
                clearable
                size="mini"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
            />
        </div>
        <div class="head-container">
            <el-tree
                :data="data"
                :props="props"
                :expand-on-click-node="expandOnClickNode"
                :filter-node-method="filterNodeMethod"
                ref="tree"
                v-loading="loading"
                :default-expand-all="defaultExpandAll"
                @node-click="handleNodeClick"
            />
        </div>
    </div>
</template>
<script>
import { Loading } from "element-ui";
import { Paginator } from "../dtos/paginator";

export default {
    props: {
        data: {
            type: Array,
            required: true,
            default: () => []
        },
        // data: [],
        options: {
            type: Object,
            default: () => ({
                children: "children",
                label: "label"
            })
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
        },
        defaultExpandAll: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            q: ""
        };
    },
    methods: {
        handleNodeClick(...args) {
            // console.log("trigger cell-click");
            this.$emit("node-click", { category: "tree", data: args[0] });
        }
    },
    watch: {
        // 根据名称筛选部门树
        q(val) {
            this.$refs.tree.filter(val);
        }
    }
};

/**
 *  示例
 */
// 一级
// options = [
//   { label: "日期", prop: "date" },
//   { label: "用户ID", prop: "uuid" },
//   { label: "渠道名称", prop: "channel" },
//   { label: "注册时间", prop: "createTime" },
//   { label: "充值总额", prop: "totalRechargeMoney" },
//   { label: "玩家昵称", prop: "nickname",  onclick: true },
//    一旦有绑定onclick为true，改字段变为可点击，且点击时候会以row为参数发出事件，在父组件监听 @nickname="callBack" 即可接收
// ];

// 二级
// options = [
//   { label: "日期", prop: "date" ,minWidth: "120px"},// 最小长度
//   {label:用户信息,son:[
//     { label: "用户ID", prop: "uuid",width: "150px" },// 定长
//     { label: "昵称", prop: "nick" },
//   ]}
// ];
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

