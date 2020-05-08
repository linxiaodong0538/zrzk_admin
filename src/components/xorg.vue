<template>
    <div>
        <div v-if="isFilterable" class="head-container">
            <el-button-group size="mini">
                <el-button
                    :type="{ 'area': 'info'}[category]"
                    :plain="category!=='area'"
                    @click="change({ category: 'category', data: 'area' })"
                    size="mini"
                >区域</el-button>
                <el-button
                    :type="{ 'organization': 'info'}[category]"
                    :plain="category!=='organization'"
                    @click="change({ category: 'category', data: 'organization' })"
                    size="mini"
                >分组</el-button>
            </el-button-group>
        </div>
        <div class="head-container" style="margin-top: 15px;">
            <el-tree
                :data="models"
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
        // data: {
        //     type: Array,
        //     required: true,
        //     default: () => []
        // },
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
            models: [],
            organizations: [],
            areas: [],
            category: "area",
            q: ""
        };
    },
    methods: {
        handleNodeClick(...args) {
            // console.log("trigger cell-click");
            let groupId =
                this.category === "organization" ? args[0].id : undefined;
            let areaId =
                this.category === "area" ? args[0].id : undefined;
            this.$emit("node-click", {
                category: this.$props.category,
                data: args[0],
                groupId,
                areaId
            });
        },
        change({ category, data }) {
            if (category === "category") {
                this.category = data;
                this.models =
                    this.category === "area" ? this.areas : this.organizations;
            }
        }
    },
    watch: {
        // 根据名称筛选部门树
        q(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {
        this.$area.treeselect().then(({ data }) => {
            this.areas = data;
            this.models =
                this.category === "area" ? this.areas : this.organizations;
            this.$forceUpdate();
        });
        this.$organization.treeselect().then(({ data }) => {
            this.organizations = data;
            this.models =
                this.category === "area" ? this.areas : this.organizations;
            this.$forceUpdate();
        });
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

