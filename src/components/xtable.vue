<template>
    <div>
        <el-table
            ref="xtable"
            :data="data"
            :max-height="maxHeight || undefined"
            :stripe="stripe || false"
            :border="border || false"
            v-loading="loading"
            :element-loading-text="loadingText"
            @selection-change="select"
            :size="size || 'small'"
            :height="height || undefined"
        >
            <template v-if="hasSecondTableHead===false">
                <el-table-column v-if="isSelectable" type="selection" width="55"></el-table-column>
                <template v-for="item in options">
                    <template v-if="item.type && item.type === 'slot'" :slot="item.prop"></template>
                    <el-table-column
                        v-else-if="item.click"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width"
                        :align="item.align"
                        :min-width="item.minWidth"
                        :formatter="item.formatter"
                    >
                        <template slot-scope="scope">
                            <a
                                id="aaa"
                                size="mini"
                                @click.prevent="callback(item.prop,{ category: item.prop, data: scope.row })"
                            >{{ scope.row[item.prop]==undefined?item.name:scope.row[item.prop] }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-else-if="item.image"
                        :label="item.label"
                        :prop="item.prop"
                        :key="item.prop"
                        :width="item.width"
                        :align="item.align"
                        :min-width="item.minWidth"
                        :formatter="item.formatter"
                    >
                        <template slot-scope="scope">
                            <el-avatar
                                v-if="!item.multiple"
                                shape="square"
                                :size="80"
                                fit="contain"
                                :src="scope.row[item.prop]"
                            ></el-avatar>
                            <!-- <img 
                                v-if="!item.multiple"
                                class="x-table-image"
                            :src="scope.row[item.prop]" />-->
                            <el-image
                                v-else
                                class="x-table-image"
                                :style="{ width: item.width || '50px', height: item.height || '50px' }"
                                :src="scope.row[item.prop][0]?  scope.row[item.prop][0] : ''"
                                :preview-src-list="scope.row[item.prop]"
                            ></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-else
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :align="item.align"
                        :width="item.width"
                        :min-width="item.minWidth"
                        :formatter="item.formatter"
                    ></el-table-column>
                </template>
            </template>

            <template v-else>
                <el-table-column v-if="isSelectable" type="selection" width="55"></el-table-column>
                <template v-for="(first,index) in options">
                    <template v-if="first.son ||typeof first.son === 'array'">
                        <el-table-column :label="first.label" align="center" :key="index">
                            <template v-for="second in first.son">
                                <el-table-column
                                    v-if="second.click"
                                    :label="second.label"
                                    :width="second.width"
                                    :align="item.align"
                                    :min-width="second.minWidth"
                                    :formatter="second.formatter"
                                    :key="second"
                                >
                                    <template slot-scope="scope">
                                        <a
                                            id="aaa"
                                            size="mini"
                                            @click.prevent="callback(second.prop,scope.row)"
                                        >{{ scope.row[second.prop]==undefined?second.name:scope.row[second.prop] }}</a>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    v-else-if="second.image"
                                    :label="second.label"
                                    :width="second.width"
                                    :min-width="second.minWidth"
                                    :key="second"
                                >
                                    <template slot-scope="scope">
                                        <img
                                            class="x-table-image"
                                            v-if="!second.multiple"
                                            :src="scope.row[second.prop]"
                                        />
                                        <el-image
                                            v-else
                                            class="x-table-image"
                                            :src="scope.row[second.prop][0]"
                                            :preview-src-list="scope.row[second.prop]"
                                        ></el-image>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    v-else
                                    :key="second.prop"
                                    :prop="second.prop"
                                    :label="second.label + '4'"
                                    :width="second.width"
                                    :min-width="second.minWidth"
                                    :formatter="second.formatter"
                                ></el-table-column>
                            </template>
                        </el-table-column>
                    </template>

                    <template v-else>
                        <el-table-column
                            :prop="first.prop"
                            :label="first.label"
                            :width="first.width"
                            :formatter="first.formatter"
                            :key="index"
                        ></el-table-column>
                    </template>
                </template>
            </template>

            <slot></slot>
        </el-table>
        <el-pagination
            v-if="isPaging"
            background
            :layout="layout"
            :total.sync="pagination.all"
            :page-sizes="pageSizes"
            :page-size.sync="pagination.size"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.index"
            :style="{ textAlign: 'right', marginTop: '10px'}"
        ></el-pagination>
    </div>
</template>
<script>
import { Loading } from "element-ui";
import { Paginator } from "../dtos/paginator";

export default {
    props: {
        name: {
            type: String,
            default: "xtable"
        },
        data: {
            type: Array,
            required: true,
            default: () => []
        },
        // data: [],
        options: {
            type: Array,
            required: true,
            default: () => []
        },
        // options: [],
        hasSecondTableHead: {
            type: Boolean,
            default: false
        },
        // hasSecondTableHead: false,
        loading: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        stripe: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: "small"
        },
        // loading: false,
        loadingText: {
            type: String,
            default: ""
        },
        // loadingText: "",
        height: {
            type: Number || String,
            default: undefined
        },
        maxHeight: {
            type: Number || String,
            default: undefined
        },
        // height: undefined,
        isPaging: {
            type: Boolean,
            default: false
        },
        isSelectable: {
            type: Boolean,
            default: false
        },
        pagination: {
            type: Paginator,
            default: new Paginator()
        }
    },
    data() {
        return {
            pageSizes: [5, 10, 20, 50, 100],
            layout: "total, sizes, prev, pager, next"
        };
    },
    // computed: {
    //     listeners: function() {
    //         var vm = this;
    //         // `Object.assign` 将所有的对象合并为一个新对象
    //         return Object.assign(
    //             {},
    //             // 我们从父级添加所有的监听器
    //             this.$listeners,
    //             // 然后我们添加自定义监听器，
    //             // 或覆写一些监听器的行为
    //             {
    //                 // 这里确保组件配合 `v-model` 的工作
    //                 input: function(event) {
    //                     vm.$emit("input", event.target.value);
    //                 }
    //             }
    //         );
    //     }
    // },
    methods: {
        callback(eventName, eventArg) {
            this.$emit(eventName, eventArg);
        },
        handleSizeChange(size) {
            if (!this.pagination) {
                this.pagination = new Paginator();
            }
            this.pagination.size = size;
            const count = Math.ceil(this.pagination.all / size);
            this.pagination.count = count;
            this.pagination.index = 1;

            this.$emit("page-change");
        },
        handleCurrentChange(index) {
            this.$emit("page-change");
        },
        handleCellClick({ row, column, category, data }) {
            this.$emit("cell-click", { row, column, category, data });
        },
        select(val) {
            this.$emit("selection-change", val);
        }
    },
    mounted() {
        // this.$listeners = this.$refs.xtable.$listeners;
        let keys = Object.keys(this.$refs.xtable).filter(
            x => !x.startsWith("$") && !x.startsWith("_")
        );
        for (const key of keys) {
            if (typeof this.$refs.xtable[key] === "function" && !this[key]) {
                this[key] = this.$refs.xtable[key];
            }
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
<style>
.x-table-image {
    max-width: 100%;
    max-height: 100%;
    border-radius: 5px;
}
</style>

<style lang="scss" scoped>
#aaa {
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
}
</style>

