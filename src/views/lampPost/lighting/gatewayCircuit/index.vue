<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <x-org
          :filter-node-method="filterNode"
          :isFilterable="true"
          :default-expand-all="true"
          @node-click="handleNodeClick"
        ></x-org>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <x-form
          :options="formOptions"
          :form="formData"
          :rules="formRules"
          labelWidth="68px"
          @callback="search"
          @change="change"
        ></x-form>

        <el-row :gutter="10" class="mb8">
          <!-- <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            v-hasPermi="['system:user:add']"
                        >新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                            v-hasPermi="['system:user:edit']"
                        >修改</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            v-hasPermi="['system:user:remove']"
                        >删除</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="info"
                            icon="el-icon-upload2"
                            size="mini"
                            @click="handleImport"
                            v-hasPermi="['system:user:import']"
                        >导入</el-button>
          </el-col>-->
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
            >导出</el-button>
          </el-col>
        </el-row>

        <x-table
          ref="xtable"
          :options="tableOptions"
          :data="models"
          :loading="loading"
          :hasReset="true"
          :isSelectable="true"
          :isPaging="true"
          :pagination="pagination"
          @page-change="search"
          @selection-change="select"
          @deviceCode="view"
        >
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="view({ category: 'history', data: scope.row})"
              >历史数据</el-button>
              <!-- <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-search"
                                @click="handleView(scope.row)"
                                v-hasPermi="['system:sensor:view']"
                            >查看</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['system:user:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['system:user:remove']"
              >删除</el-button>-->
            </template>
          </el-table-column>
        </x-table>
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <x-dialog
      :title="title"
      :form="dialogForm"
      :options="dialogOptions"
      :rules="dialogRules"
      :visible.sync="dialogVisible"
      @callback="submitForm"
      @change="change"
      @focus="onListen"
    >
      <template>
        <el-col :span="24">
          <div>自定义：</div>
        </el-col>
        <template v-for="(f, idx) in fields">
          <el-col :span="12" :key="idx">
            <el-form-item
              :label="f.partsFieldNameCn"
              :prop="f.partsFieldName"
              :key="f.partsFieldName"
              size="mini"
            >
              <el-input v-model="dialogForm[f.partsFieldName]">
                <template slot="append">{{f.unit}}</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </template>
    </x-dialog>

    <el-dialog :visible.sync="isDetailVisible"></el-dialog>
    <el-dialog :visible.sync="isBaiduMapDialogVisible" :append-to-body="true">
      <template>
        <baidu-map
          class="bm-view"
          center="福州"
          :zoom="1"
          style="width: 100%; min-height: 50vh;"
          ak="k1gYhyr8h8ksQN63Z1Mu0xNuhiZCr157"
        ></baidu-map>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus
} from "@/api/system/user";
import { treeselect, region } from "@/api/system/dept";
import { listPost } from "@/api/system/post";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { XTable, XForm, XTree, XDialog, XOrg } from "@/components";
import { Paginator } from "@/dtos/paginator";
import moment from "moment";
import { DialogOptions, FormOptions } from "./options.data";
import BaiduMap from "vue-baidu-map/components/map/Map.vue";

export default {
  components: { BaiduMap, Treeselect, XTable, XForm, XTree, XDialog, XOrg },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      areaOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      fieldOptions: [],
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      /** 区域选项 */
      areaOptions: [],
      /** 自定义字段 */
      fields: [],
      partsTypeOptions: [],
      products: [],
      productOptions: [],
      current: {
        groupId: undefined,
        areaId: undefined
      },
      cache: {
        categories: {},
        onlineStatus: {},
        runningState: {},
        alertStatus: {}
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      /** form ^ */
      /** 查询参数 */
      formData: {},
      formOptions: FormOptions,
      formRules: {},
      categories: [],
      /** form $ */
      /** table ^ */
      pagination: new Paginator(),
      options: [
        { prop: "productName", label: "产品名称" },
        { prop: "deviceCode", label: "设备编号", click: true },
        { prop: "partsCode", label: "部件编号" },
        { prop: "areaName", label: "所在区域" },
        {
          prop: "onlineStatus",
          label: "在线状态",
          formatter: this.mapping
        },
        {
          prop: "runningState",
          label: "运行状态",
          formatter: this.mapping
        },
        { prop: "createDate", label: "采集时间" }
      ],
      tableOptions: [],
      models: [],
      /** table $ */
      /** dialog ^ */
      dialogForm: {},
      dialogOptions: DialogOptions,
      dialogRules: {
        partsName: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        partsTypeId: [
          {
            required: true,
            message: "必选",
            trigger: "blur"
          }
        ],
        areaId: [
          {
            required: true,
            message: "必选",
            trigger: "blur"
          }
        ]
      },
      dialogVisible: false,
      /** dialog $ */
      // 表单校验
      rules: {
        userName: [
          {
            required: true,
            message: "用户名称不能为空",
            trigger: "blur"
          }
        ],
        nickName: [
          {
            required: true,
            message: "用户昵称不能为空",
            trigger: "blur"
          }
        ],
        areaId: [
          {
            required: true,
            message: "归属部门不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "用户密码不能为空",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },

      /** view detail ^ */
      isDetailVisible: false,
      isBaiduMapDialogVisible: false
      /** view detail $ */
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.tableOptions = this.options.slice();
    console.log(
      this.formOptions
        .map(x => {
          return `${x.prop}: ''`;
        })
        .join(",")
    );
    this.search();
    this.getTreeData();
    this.getDicts("sys_normal_disable").then(({ data }) => {
      this.statusOptions.push(
        ...data.map(x => ({
          label: x.dictLabel,
          value: x.dictValue
        }))
      );
      let node = this.formOptions.find(x => x.prop === "status");
      if (node) node.options = this.statusOptions;
      node = this.dialogOptions.find(x => x.prop === "status");
      if (node) node.options = this.statusOptions;
      // this.statusOptions = data.map(x => ({
      //     label: x.dictLabel,
      //     value: x.dictValue
      // }));
      // this.$forceUpdate();
    });
    this.getDicts("online_status").then(({ data }) => {
      const opts = data.map(x => ({ label: x.dictLabel, value: x.dictValue }));
      this.cache.onlineStatus = data.reduce(
        (p, c) => ((p[c.dictValue] = c.dictLabel), p),
        {}
      );
      let node = this.formOptions.find(x => x.prop === "onlineStatus");
      if (node) node.options = opts;
    });
    this.getDicts("running_state").then(({ data }) => {
      const opts = data.map(x => ({
        label: x.dictLabel,
        value: x.dictValue
      }));
      this.cache.runningState = data.reduce(
        (p, c) => ((p[c.dictValue] = c.dictLabel), p),
        {}
      );
      let node = this.formOptions.find(x => x.prop === "runningState");
      if (node) node.options = opts;
    });
    this.getDicts("alert_status").then(({ data }) => {
      const opts = data.map(x => ({
        label: x.dictLabel,
        value: x.dictValue
      }));
      this.cache.alertStatus = data.reduce(
        (p, c) => ((p[c.dictValue] = c.dictLabel), p),
        {}
      );
      let node = this.formOptions.find(x => x.prop === "alertStatus");
      if (node) node.options = opts;
    });
    this.$partstype.search({}).then(({ rows }) => {
      this.partsTypeOptions = rows.map(x => ({
        label: x.partsTypeName,
        value: x.partsTypeId
      }));
      let node = this.dialogOptions.find(x => x.prop === "partsTypeId");
      if (node) node.options = this.partsTypeOptions;
    });

    this.$lamp.getProducts({ productTypeId: 4 }).then(({ data }) => {
      this.products = data;
      this.productOptions = data.map(x => ({
        label: x.productName,
        value: x.productId
      }));
      let node = this.formOptions.find(x => x.prop === "productId");
      if (node) node.options = this.productOptions;
    });

    this.projects = (this.$store.state.app.projects || []).map(x => ({
      label: x.projectName,
      value: x.projectId
    }));
    let node = this.formOptions.find(x => x.prop == "projectId");
    if (node) node.options = this.projects;
    node = this.dialogOptions.find(x => x.prop === "projectIds");
    if (node) node.options = this.projects;
  },
  methods: {
    /** 查询用户列表 */
    search() {
      console.log("trigger search", this.formData);
      let params = Object.assign({}, this.formData, {
        pageNum: this.pagination.index,
        pageSize: this.pagination.size,
        page: this.pagination.index,
        areaId: this.current.areaId,
        groupId: this.current.groupId,
        productTypeId: 4
      });
      this.loading = true;
      this.$lamp.search(params).then(({ rows, total }) => {
        this.loading = false;
        this.models = rows.map(x => {
          x = (x.deviceFieldUploads || []).reduce(
            (p, c) => ((p[c.deviceFieldName] = c.deviceFieldValue), p),
            x
          );
          if (x.deviceFieldUploads && x.deviceFieldUploads.length) {
            x.createDate = x.deviceFieldUploads[0].createDate;
          }
          console.log(this.models);

          return x;
        });
        this.pagination.all = total;
      });
      window.reff = this.$refs;
    },
    /** 查询部门下拉树结构 */
    getTreeData() {
      this.$area.treeselect().then(response => {
        this.areaOptions = response.data;

        let node = this.dialogOptions.find(x => x.prop === "areaId");
        if (node) node.options = this.areaOptions;
        // let node = this..find(x => x.prop === "areaId");
        // if (node) node.options = this.areaOptions;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick({ category, areaId, groupId, data }) {
      this.current.areaId = areaId;
      this.current.groupId = groupId;
      this.search();
    },
    /** 查询岗位列表 */
    getPositions() {
      listPost().then(response => {
        this.postOptions = response.rows;
      });
    },
    /** 查询角色列表 */
    getRoles() {
      listRole().then(response => {
        this.roleOptions = response.rows;
      });
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    view({ category, data }) {
      if (category === "history") {
        this.$router.push({
          path: "/lightingHistory/",
          query: { deviceId: data.deviceId, deviceCode: data.deviceCode }
        });
      }
      if (category === "deviceCode") {
        this.$router.push({ path: "/deviceDetails/" + data.deviceId });
      }
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        areaId: 100,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.search();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.partsId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleView(data) {
      console.log();
      this.isDetailVisible = true;
      this.current.node = data;
    },
    /** 新增按钮操作 */
    handleAdd(t) {
      this.dialogForm = {
        areaId: this.current.areaId
      };
      this.dialogVisible = true;
      this.title = "新增";
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      let id = row && row.partsId ? row.partsId : this.ids[0];
      let node = this.models.find(x => x.partsId == id);
      let { rows } = await this.$partstype.getFields({
        id: node.partsTypeId
      });
      // for (let f of rows) {
      //     // if (!this.dialogForm.hasOwnProperty(f.partsFieldName)) {
      //     node[f.partsFieldName] = null;
      //     // }
      // }
      (node.partsFields || []).forEach(x => {
        node[x.partsFieldName] = x.partsFieldValue;
      });
      if (node.project && node.project.length) {
        node.projectIds = node.project.map(x => x.projectId);
      }
      console.log("d f", node);
      this.dialogForm = Object.assign({}, node);
      this.fields = rows;
      this.dialogVisible = true;
      this.title = "修改";
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log("submit", this.dialogForm);
      let params = Object.assign({}, this.dialogForm);
      let partsFields = (this.fields || []).map(x => {
        let f = this.dialogForm.partsFields.find(
          x => x.partsFieldName == x.partsFieldName
        );
        let node = {
          partsFieldRalId: f ? f.partsFieldRalId : undefined,
          partsTypeFieldId: x.partsTypeFieldId,
          partsTypeId: x.partsTypeId,
          partsId: this.dialogForm.partsId,
          partsFieldValue: params[x.partsFieldName]
        };
        delete params[x.partsFieldName];
        return node;
      });
      params.partsFields = partsFields;
      console.log("parameter", params);
      if (params.partsId != undefined) {
        this.$parts.update(params).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.dialogVisible = false;
            this.search();
          } else {
            this.msgError(response.msg);
          }
        });
      } else {
        this.$parts.create(params).then(response => {
          if (response.code === 200) {
            this.msgSuccess("新增成功");
            this.dialogVisible = false;
            this.search();
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = this.ids || [row.userId];
      this.$confirm("是否确认删除数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log("delete", userIds);
          return this.$parts.remove({ ids: userIds });
        })
        .then(() => {
          this.search();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;

      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    /** 导入按钮操作 */
    handleImport() {
      var a = document.createElement("input");
      a.type = "file";
      a.accept =
        "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      a.onchange = (g, e) => {
        var file = e.target.files[0];
        console.log("file", file);
      };
      a.click();
    },
    select(v) {
      console.log("select", v);
      this.handleSelectionChange(v);
    },
    change({ category, value }) {
      if (category === "productId") {
        this.$lamp.getFields({ productId: value, type: 1 }).then(({ data }) => {
          this.fields = data;
          let opts = [...this.options];
          let list = data.map(x => ({
            prop: x.productFieldName,
            label: x.productFieldNameCn
          }));
          this.fieldOptions = data.map(x => ({
            value: x.productFieldName,
            label: x.productFieldNameCn
          }));
          opts.splice(-1, 0, ...list);
          this.tableOptions = opts;
          let node = this.formOptions.find(x => x.prop === "dynamic");
          if (node) node.options = this.fieldOptions;
          this.search();
        });
      }
    },
    onListen({ category, value }) {
      if (["longitude", "latitude"].includes(category)) {
        console.log(category, "clicked");
        this.isBaiduMapDialogVisible = true;
      }
    },
    mapping(row, column, index) {
      let result = "";
      const property = column.property;
      if (property === "onlineStatus") {
        result =
          row[property] && this.cache.onlineStatus[row[property]]
            ? this.cache.onlineStatus[row[property]]
            : row[property] || "-";
      }
      if (property === "runningState") {
        result =
          row[property] && this.cache.onlineStatus[row[property]]
            ? this.cache.runningState[row[property]]
            : row[property] || "-";
      }
      if (property === "alertStatus") {
        result =
          row[property] && this.cache.alertStatus[row[property]]
            ? this.cache.alertStatus[row[property]]
            : row[property] || "-";
      }
      return result;
    }
  }
};
</script>