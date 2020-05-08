<template>
  <div>
    <div class="xny-title">
      <div class="title" @click="modify">
        <img src="../../../../../assets/LED/edit.png" alt />
        <p class="titleEdit">修改</p>
      </div>
      <div class="title" @click="equipment">
        <img src="../../../../../assets/LED/infor.png" alt />
        <p class="titleEdit">同步设备</p>
      </div>
      <div class="title" @click="brightness">
        <img src="../../../../../assets/LED/history.png" alt />
        <p class="titleEdit">自动亮度</p>
      </div>
      <div class="title" @click="terminal">
        <img src="../../../../../assets/LED/clownd.png" alt />
        <p class="titleEdit">终端操作</p>
      </div>
      <div class="title" @click="hardware">
        <img src="../../../../../assets/LED/clock.png" alt />
        <p class="titleEdit">硬件状态</p>
      </div>
      <div class="title" @click="handleDelete">
        <img src="../../../../../assets/LED/end.png" alt />
        <p class="titleEdit">删除</p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">关 闭</el-button>
    </div>
    <!-- 修改 -->
    <el-dialog :title="title" :visible.sync="ledModify" width="800px">
      <modify  :id="management.id" :label="management.label"  @cancel1="cancel1"></modify>
    </el-dialog>
    <!-- 同步设备 -->
    <el-dialog :title="title" :visible.sync="synchronous" width="800px">
      <equipment  :id="management.id" :label="management.label"  @cancel2="cancel2"></equipment>
    </el-dialog>
    <!-- 自动亮度 -->
    <el-dialog :title="title" :visible.sync="automatic" width="800px">
      <automatic  :id="management.id" :label="management.label"  @cancel3="cancel3"></automatic>
    </el-dialog>
    <!-- 终端操作 -->
    <el-dialog :title="title" :visible.sync="operation" width="800px">
      <terminalOperation  :id="management.id" :label="management.label"  @cancel4="cancel4"></terminalOperation>
    </el-dialog>
    <!-- 硬件状态 -->
    <el-dialog :title="title" :visible.sync="hardwareStatus" width="800px">
      <hardwareStatus  :id="management.id" :label="management.label"  @cancel5="cancel5"></hardwareStatus>
    </el-dialog>
  </div>
</template>
<script>
import modify from "./modify"; //修改
import equipment from "./equipment"; //同步设备
import automatic from "./automatic"; //自动亮度
import terminalOperation from "./terminalOperation"; //终端操作
import hardwareStatus from "./hardwareStatus"; //硬件状态
export default {
  components: {
    modify,
    equipment,
    automatic,
    terminalOperation,
    hardwareStatus
  },
  data() {
    return {
      // 关闭弹出框
      open: false,
      // 修改弹出框
      ledModify: false,
      // 同步设备弹出框
      synchronous : false,
      // 自动亮度弹出框
      automatic  : false,
      // 终端操作弹出框
      operation  : false,
      // 硬件状态弹出框
      hardwareStatus  : false,

      title:'',
      //新增区域传参
      management: {
        id: "",
        label: ""
      },
    };
  },
  mounted() {},
  methods: {
    // 修改
    modify() {
      this.ledModify = true;
      this.title = "修改";
    },
    cancel1(val) {
      this.ledModify = val;
    },
    // 同步设备
    equipment() {
      this.synchronous = true;
      this.title = "同步设备";
    },
    cancel2(val) {
      this.synchronous = val;
    },
    //  自动亮度
    brightness() {
      this.automatic = true;
      this.title = " 自动亮度";
    },
    cancel3(val) {
      this.automatic = val;
    },
    //  终端操作
    terminal() {
      this.operation = true;
      this.title = "终端操作";
    },
    cancel4(val) {
      this.operation = val;
    },
    //  硬件状态
    hardware() {
      this.hardwareStatus = true;
      this.title = "终端操作";
    },
    cancel5(val) {
      this.hardwareStatus = val;
    },
      /** 删除按钮操作 */
    handleDelete(row) {
      // const dictIds = row.dictId || this.ids;
      this.$confirm(
        // 确认要删除选中的1条数据吗?
        "确认要删除选中的条数据吗?",

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
    // 取消按钮
    cancel() {
      this.open = false;
      this.$emit("cancel1", this.open);
    },
    
  }
};
</script>
<style lang="scss" scoped>
.xny-title {
  overflow: hidden;
}
.title {
  width: 90px;
  text-align: center;
  float: left;
  cursor: pointer;
  img {
    width: 45px;
    height: 45px;
  }
  .titleEdit {
    margin: 0;
  }
}
.dialog-footer {
  // float: right;
  text-align: right;
}
</style>
<style>
.v-modal {
  z-index: 0 !important;
}
.el-input--medium .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.el-input--small .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.managementList.el-input--small .el-input__inner {
  border-right: 0;
  border-radius: 4px 0 0 4px;
}
.managementList.el-input--small .el-input__inner:focus {
  border: 1px solid #dcdfe6;
  border-right: 0;
}
.el-select > .el-input {
  width: 200px;
}
.el-table .el-table__header-wrapper th {
  text-align: center;
}
.el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
.el-dialog__body {
  padding-top: 15px;
}
.el-dialog {
  top: 15%;
}
</style>