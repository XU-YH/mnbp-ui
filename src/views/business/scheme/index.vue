<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="方案代码" prop="schemeCode">
        <el-input
          v-model="queryParams.schemeCode"
          placeholder="请输入方案代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="方案名称" prop="schemeName">
        <el-input
          v-model="queryParams.schemeName"
          placeholder="请输入方案名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:insuranceScheme:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:insuranceScheme:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:insuranceScheme:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5" v-show="false">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:insuranceScheme:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="insuranceSchemeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="序号" type="index" />
      <!--<el-table-column label="ID" align="center" prop="id" />-->
      <el-table-column label="方案代码" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <router-link :to="'/scheme/clause/' + scope.row.id" class="link-type">
                  <span style="font-weight: bold">{{ scope.row.schemeCode }}</span>
              </router-link>
          </template>
      </el-table-column>
      <el-table-column label="方案名称" align="center" prop="schemeName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:insuranceScheme:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:insuranceScheme:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改方案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="方案代码" prop="schemeCode">
          <el-input v-model="form.schemeCode" placeholder="请输入方案代码" />
        </el-form-item>
        <el-form-item label="方案名称" prop="schemeName">
          <el-input v-model="form.schemeName" placeholder="请输入方案名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInsuranceScheme, getInsuranceScheme, delInsuranceScheme, addInsuranceScheme, updateInsuranceScheme, exportInsuranceScheme, selectBySchemeCode } from "@/api/business/scheme";

export default {
  data() {
    // 校验方案代码是否已存在
    let verifySchemeCode = (rule, value, callback) => {
      var scheme = {id: this.form.id, schemeCode: value};
      selectBySchemeCode(scheme).then(response => {
        if (response.data !== undefined) {
          callback('方案代码已存在');
        }
        callback();
      });
    }
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      schemeNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 方案表格数据
      insuranceSchemeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        schemeCode: undefined,
        schemeName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        schemeCode: [
          { required: true, message: "方案代码不能为空", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{8}$/,
            message: "方案代码由字母和数字组成，且固定8位长度",
            trigger: "blur"
          },
          { validator: verifySchemeCode, trigger: 'blur' }
        ],
        schemeName: [
          { required: true, message: "方案名称不能为空", trigger: "blur" },
          { max: 20, message: "长度不能超过20个字符", trigger: "change"}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询方案列表 */
    getList() {
      this.loading = true;
      listInsuranceScheme(this.queryParams).then(response => {
        this.insuranceSchemeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        schemeCode: undefined,
        schemeName: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.schemeNames = selection.map(item => item.schemeName)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加方案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInsuranceScheme(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改方案";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateInsuranceScheme(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addInsuranceScheme(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const schemeNames = row.schemeName || this.schemeNames;
      this.$confirm('是否确认删除方案名称为"' + schemeNames + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInsuranceScheme(ids);
        }).then(response => {
          this.getList();
          this.msgSuccess(response.msg);
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有方案数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInsuranceScheme(queryParams);
        }).then(response => {
          this.download(response.msg, true);
        }).catch(function() {});
    }
  }
};
</script>
