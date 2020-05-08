<template>
  <div class="xny-xinzeng">
    <el-table :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="版本" align="center" prop="lanternsName" />
      <el-table-column label="湿度" align="center" prop="lanternsName" />
      <el-table-column label="温度" align="center" prop="lanternsName" />
      <el-table-column label="卡电压" align="center" prop="lanternsName" />
      <el-table-column label="外部电压1" align="center" prop="lanternsName" />
      <el-table-column label="外部电压2" align="center" prop="lanternsName" />
      <el-table-column label="门被打开" align="center" prop="lanternsName" />
      <el-table-column label="有烟雾" align="center" prop="lanternsName" />
      <!-- fixed="right" -->
    </el-table>
    <div slot="footer" class="dialog-footer layui-layer-btn">
      <el-button type="primary" size="mini">确 定</el-button>
      <el-button @click="cancel" size="mini">关 闭</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["id", "label"],
  data() {
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 表单参数
      typeList: [
        {
          lanternsName: "1", //灯具名称
          controllerAddress: "-" //灯控制器地址
        },
        {
          lanternsName: "2", //灯具名称
          controllerAddress: "-" //灯控制器地址
        }
      ],
      // 是否显示弹出层
      open: true,
      // 添加
      fla: false,
      title: "",
      //回路名称
      xnyloopName: ""
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.$emit("cancel5", this.open);
    },
    //添加
    loopName() {
      this.fla = true;
      this.title = "添加回路";
    },
    //关闭
    cancelAdd() {
      this.fla = false;
    },
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      this.$confirm(
        // 确认要删除选中的1条数据吗?
        "确认要删除选中的" + dictIds.length + "条数据吗?",

        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delType(aa);
        })
        .then(() => {
          dictIds;
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
  }
};
</script>

<style lang="scss" scoped>
.layui-layer-btn {
  padding-right: 20px;
  margin-top: 20px;
}
.dialog-footer {
  // float: right;
  text-align: right;
}
.delete {
  cursor: pointer;
  color: #ed5565;
}
.Manhole {
  width: 500px;
  height: 30px;
}
.xny_lopp {
  text-align: center;
}
</style>
<style>
.v-modal {
  z-index: 0 !important;
}
.el-table .el-table__header-wrapper th {
  text-align: center;
}
.el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
</style>