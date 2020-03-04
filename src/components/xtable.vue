<template>
    <div>
        <el-table
            :data="data"
            :max-height="height"
            stripe
            :border="false"
            v-loading="loading"
            :element-loading-text="loadingText"
            @selection-change="select"
            size="small"
        >
            <template v-if="hasSecondTableHead===false">
                <el-table-column v-if="isSelectable" type="selection" width="55"></el-table-column>
                <template v-for="item in options">
                    <el-table-column
                        v-if="item.click"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width"
                        :min-width="item.minWidth"
                        :formatter="item.formatter"
                    >
                        <template slot-scope="scope">
                            <a
                                id="aaa"
                                size="mini"
                                @click.prevent="callback(item.prop,scope.row)"
                            >{{ scope.row[item.prop]==undefined?item.name:scope.row[item.prop] }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-else-if="item.image"
                        :label="item.label"
                        :prop="item.prop"
                        :key="item.prop"
                        :width="item.width"
                        :min-width="item.minWidth"
                        :formatter="item.formatter"
                    >
                        <template slot-scope="scope">
                            <img
                                :src="scope.row[item.prop]?mapping({ category: 'url', data: scope.row[item.prop] }):scope.row[item.prop]"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-else
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
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
                        <el-table-column :label="first.label" align="center">
                            <template v-for="second in first.son">
                                <el-table-column
                                    v-if="second.click"
                                    :label="second.label"
                                    :width="second.width"
                                    :min-width="second.minWidth"
                                    :formatter="second.formatter"
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
                                >
                                    <template slot-scope="scope">
                                        <img
                                            :src="scope.row[second.prop]?mapping({ category: 'url', data: scope.row[second.prop] }):scope.row[second.prop]"
                                        />
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
        // loading: false,
        loadingText: {
            type: String,
            default: ""
        },
        // loadingText: "",
        height: {
            //     type: Number || String,
            //     default: 700
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
        },
        mapping({ category, data }) {
            let result = data;
            if (category === "url") {
                result = process.env.VUE_APP_BASE_API + result;
            }
            return result;
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

