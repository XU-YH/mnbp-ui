<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="方案代码" prop="schemeCode">
        <el-input
          v-model="queryParams.schemeCode"
          placeholder="请输入方案代码"
          clearable
          size="small"
          :disabled="true"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="条款名称" prop="clauseName">
        <el-input
          v-model="queryParams.clauseName"
          placeholder="请输入条款名称"
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
          v-hasPermi="['business:clause:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:clause:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:clause:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:clause:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="clauseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="ID" align="center" prop="id" />-->
      <el-table-column label="方案代码" align="center" prop="schemeCode" />
      <el-table-column label="条款名称" align="center" prop="clauseName" />
      <el-table-column label="赔偿限额" align="center" prop="compensationLimit" />
      <el-table-column label="条款内容" align="center" prop="clauseContent" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:clause:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:clause:remove']"
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

    <!-- 添加或修改方案条款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="方案id" v-show="false" >
          <el-input v-model="form.schemeId" />
        </el-form-item>
        <el-form-item label="方案代码">
          <el-input v-model="form.schemeCode" :disabled="true" />
        </el-form-item>
        <el-form-item label="条款名称" prop="clauseName">
          <el-input v-model="form.clauseName" placeholder="请输入条款名称" />
        </el-form-item>
        <el-form-item label="赔偿限额" prop="compensationLimit">
          <el-input v-model="form.compensationLimit" placeholder="请输入赔偿限额" />
        </el-form-item>
        <el-form-item label="条款内容" prop="clauseContent">
          <el-input v-model="form.clauseContent" type="textarea" placeholder="请输入条款内容" />
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
import { listClause, getClause, delClause, addClause, updateClause, exportClause } from "@/api/business/clause";
import { listInsuranceScheme, getInsuranceScheme } from "@/api/business/scheme"

export default {
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
      // 方案条款表格数据
      clauseList: [],
      // 默认方案id
      defaultSchemeId: "",
      // 默认方案code
      defaultSchemeCode: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        schemeCode: undefined,
        schemeId: undefined,
        clauseName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        clauseName: [
          { required: true, message: "条款名称不能为空", trigger: "blur" }
        ],        compensationLimit: [
          { required: true, message: "赔偿限额不能为空", trigger: "blur" }
        ],        clauseContent: [
          { required: true, message: "条款内容不能为空", trigger: "blur" }
        ],      }
    };
  },
  created() {
    const schemeId = this.$route.params && this.$route.params.id;
    this.getInsuranceScheme(schemeId);
  },
  methods: {
    /** 查询方案清单详细 */
    getInsuranceScheme(schemeId) {
      getInsuranceScheme(schemeId).then(response => {
        this.queryParams.schemeCode = response.data.schemeCode;
        this.defaultSchemeCode = response.data.schemeCode;
        this.defaultSchemeId = schemeId;
        this.getList();
      })
    },
    /** 查询方案条款列表 */
    getList() {
      this.loading = true;
      listClause(this.queryParams).then(response => {
        this.clauseList = response.rows;
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
        schemeId: undefined,
        clauseName: undefined,
        compensationLimit: undefined,
        clauseContent: undefined,
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
      this.queryParams.schemeCode = this.defaultSchemeCode;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加方案条款";
      this.form.schemeCode = this.defaultSchemeCode;
      this.form.schemeId = this.defaultSchemeId;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getClause(id).then(response => {
        this.form = response.data;
        this.form.schemeCode = this.defaultSchemeCode;
        this.open = true;
        this.title = "修改方案条款";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateClause(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addClause(this.form).then(response => {
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
      this.$confirm('是否确认删除方案条款编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delClause(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有方案条款数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportClause(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
