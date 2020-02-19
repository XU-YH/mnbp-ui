<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="客户姓名" prop="customerName">
                <el-input
                        v-model="queryParams.customerName"
                        placeholder="请输入客户姓名"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="证件号" prop="idNumber">
                <el-input
                        v-model="queryParams.idNumber"
                        placeholder="请输入证件号"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="城市" prop="city">
                <el-input
                        v-model="queryParams.city"
                        placeholder="请输入城市"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="分公司名" prop="branchName">
                <el-input
                        v-model="queryParams.branchName"
                        placeholder="请输入分公司名称"
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
                        v-hasPermi="['business:customer:add']"
                >新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="success"
                        icon="el-icon-edit"
                        size="mini"
                        :disabled="single"
                        @click="handleUpdate"
                        v-hasPermi="['business:customer:edit']"
                >修改
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['business:customer:remove']"
                >删除
                </el-button>
            </el-col>
            <el-col :span="1.5" v-show="false">
                <el-button
                        type="warning"
                        icon="el-icon-download"
                        size="mini"
                        @click="handleExport"
                        v-hasPermi="['business:customer:export']"
                >导出
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="info"
                        icon="el-icon-upload2"
                        size="mini"
                        @click="handleImport"
                        v-hasPermi="['business:customer:import']"
                >导入
                </el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column label="序号" type="index" />
            <!--<el-table-column label="ID" align="center" prop="id" />-->
            <el-table-column label="客户姓名" align="center" prop="customerName"/>
            <el-table-column label="方案代码" align="center" prop="schemeCode" width="130"/>
            <el-table-column label="证件类型" align="center" prop="idType" :formatter="idTypeFormat" width="100"/>
            <el-table-column label="证件号" align="center" prop="idNumber" width="180"/>
            <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" width="50"/>
            <el-table-column label="出生日期" align="center" prop="birthdate" width="100">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.birthdate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系电话" align="center" prop="phonenumber" width="110"/>
            <el-table-column label="到检日期" align="center" prop="examinatidonDate" width="100">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.examinatidonDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="省份" align="center" prop="province"/>
            <el-table-column label="城市" align="center" prop="city"/>
            <el-table-column label="分公司名" align="center" prop="branchName" :show-overflow-tooltip="true"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['business:customer:edit']"
                    >修改
                    </el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['business:customer:remove']"
                    >删除
                    </el-button>
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

        <!-- 添加或修改客户对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="客户姓名" prop="customerName">
                    <el-input v-model="form.customerName" placeholder="请输入客户姓名"/>
                </el-form-item>
                <el-form-item label="证件类型" prop="idType">
                    <el-select v-model="form.idType" placeholder="请选择证件类型">
                        <el-option
                                v-for="dict in idTypeOptions"
                                :key="dict.dictValue"
                                :label="dict.dictLabel"
                                :value="dict.dictValue"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号" prop="idNumber">
                    <el-input v-model="form.idNumber" placeholder="请输入证件号"/>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.sex" placeholder="请选择性别">
                        <el-option
                                v-for="dict in sexOptions"
                                :key="dict.dictValue"
                                :label="dict.dictLabel"
                                :value="dict.dictValue"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthdate">
                    <el-date-picker clearable size="small" style="width: 200px"
                                    v-model="form.birthdate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择出生日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="联系电话" prop="phonenumber">
                    <el-input v-model="form.phonenumber" placeholder="请输入联系电话"/>
                </el-form-item>
                <el-form-item label="到检日期" prop="examinatidonDate">
                    <el-date-picker clearable size="small" style="width: 200px"
                                    v-model="form.examinatidonDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择到检日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-input v-model="form.province" placeholder="请输入省份"/>
                </el-form-item>
                <el-form-item label="城市" prop="city">
                    <el-input v-model="form.city" placeholder="请输入城市"/>
                </el-form-item>
                <el-form-item label="分公司名" prop="branchName">
                    <el-input v-model="form.branchName" placeholder="请输入分公司名称"/>
                </el-form-item>
                <el-form-item label="方案代码" prop="schemeCode">
                    <el-input v-model="form.schemeCode" placeholder="请输入方案代码" style="width: 200px"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 人员导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
            <el-upload
                    ref="upload"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :headers="upload.headers"
                    :action="upload.url + '?updateSupport=' + upload.updateSupport"
                    :disabled="upload.isUploading"
                    :on-progress="handleFileUploadProgress"
                    :on-success="handleFileSuccess"
                    :auto-upload="false"
                    drag
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    <!--<el-checkbox v-model="upload.updateSupport"/>-->
                    <!--是否更新已经存在的用户数据-->
                    <el-link type="primary" :underline="true" style="font-size:16px; float: right" @click="importTemplate">下载模板</el-link>
                </div>
                <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 人员导入结果对话框 -->
        <el-dialog :title="uploadResult.title" :visible.sync="uploadResult.open" width="30%">
            <el-row>
                此次导入新增 <span>{{uploadResultData.insertCount}}</span> 条数据，修改
                <span>{{uploadResultData.updateCount}}</span> 条数据，错误数据有 <span>{{uploadResultData.wrongCount}}</span> 条。
            </el-row>
            <el-row v-if="uploadResultData.fileName !== undefined && uploadResultData.fileName !== 'null' && uploadResultData.fileName !== ''">
                <el-link type="warning" style="font-size:12px"
                         @click="importWrongDataDownload(uploadResultData.fileName)">点击下载错误数据
                </el-link>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="uploadResult.open = false">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
  import {
    listCustomer,
    getCustomer,
    delCustomer,
    addCustomer,
    updateCustomer,
    exportCustomer,
    importTemplate
  } from '@/api/business/customer'
  import { getToken } from '@/utils/auth'

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
        // 客户表格数据
        customerList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 证件类型，数据字典字典
        idTypeOptions: [],
        // 性别，字典
        sexOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          customerName: undefined,
          idNumber: undefined,
          city: undefined,
          branchName: undefined
        },
        // 表单参数
        form: {},
        // 人员导入参数
        upload: {
          // 是否显示弹出层（人员导入）
          open: false,
          // 弹出层标题（人员导入）
          title: '',
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: 'Bearer ' + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + '/business/customer/importData'
        },
        uploadResult: {
          open: false,
          title: '导入结果'
        },
        // 导入结果
        uploadResultData: {
          insertCount: 0,
          updateCount: 0,
          wrongCount: 0,
          fileName: undefined
        },
        // 表单校验
        rules: {
          customerName: [
            { required: true, message: '客户姓名不能为空', trigger: 'blur' },
            { max: 30, message: '长度不能超过30个字符', trigger: 'change'}
          ], idType: [
            { required: true, message: '证件类型不能为空', trigger: 'change' }
          ], idNumber: [
            { required: true, message: '证件号不能为空', trigger: 'blur' }
          ], birthdate:[
            { required: true, message: '出生日期不能为空', trigger: 'blur' }
          ], examinatidonDate: [
            { required: true, message: '到检日期（体检）不能为空', trigger: 'blur' }
          ], province: [
            { required: true, message: '省份不能为空', trigger: 'blur' },
            { max: 10, message: '长度不能超过10个字符', trigger: 'change'}
          ], city: [
            { required: true, message: '城市不能为空', trigger: 'blur' },
            { max: 10, message: '长度不能超过10个字符', trigger: 'change'}
          ], branchName: [
            { required: true, message: '分公司名称不能为空', trigger: 'blur' },
            { max: 15, message: '长度不能超过15个字符', trigger: 'change'}
          ], schemeCode: [
            { required: true, message: '方案代码不能为空', trigger: 'blur' },
            {
              pattern: /^[a-zA-Z0-9]{8}$/,
              message: "方案代码由字母和数字组成，且固定8位长度",
              trigger: "blur"
            }
          ]
        }
      }
    },
    created() {
      this.getList()
      this.getDicts('id_type').then(response => {
        this.idTypeOptions = response.data
      })
      this.getDicts('sys_user_sex').then(response => {
        this.sexOptions = response.data
      })
    },
    methods: {
      /** 查询客户列表 */
      getList() {
        this.loading = true
        listCustomer(this.queryParams).then(response => {
          this.customerList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 证件类型，数据字典字典翻译
      idTypeFormat(row, column) {
        return this.selectDictLabel(this.idTypeOptions, row.idType)
      },
      // 性别，字典翻译
      sexFormat(row, column) {
        return this.selectDictLabel(this.sexOptions, row.sex)
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          customerName: undefined,
          idType: undefined,
          idNumber: undefined,
          sex: undefined,
          birthdate: undefined,
          phonenumber: undefined,
          examinatidonDate: undefined,
          province: undefined,
          city: undefined,
          branchName: undefined,
          delFlag: undefined,
          schemeCode: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.customerNames = selection.map(item => item.customerName)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加客户'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getCustomer(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改客户'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateCustomer(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addCustomer(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        const customerNames = row.customerName || this.customerNames
        this.$confirm('是否确认删除客户姓名为"' + customerNames + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delCustomer(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有客户数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportCustomer(queryParams)
        }).then(response => {
          this.download(response.msg, true)
        }).catch(function() {
        })
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = '人员导入'
        this.upload.open = true
      },
      /** 下载模板操作 */
      importTemplate() {
        importTemplate().then(response => {
          this.download(response.msg, false)
        })
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.$loading({
          lock: true,
          text: '导入中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.upload.isUploading = true
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.$loading().close();
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        if (response.code === 200) {
          this.uploadResultData = response.data
          this.uploadResult.open = true
        } else {
          this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true, type: 'error' });
        }
        this.getList()
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit()
      },
      // 导入错误数据下载
      importWrongDataDownload(fileName) {
        this.download(fileName, true)
      }
    }
  }
</script>
