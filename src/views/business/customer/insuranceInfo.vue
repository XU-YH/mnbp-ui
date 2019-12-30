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
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="customerInsuranceInfoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <!--<el-table-column label="ID" align="center" prop="id" />-->
            <el-table-column label="姓名" align="center" prop="customerName" />
            <el-table-column label="证件号" align="center" prop="idNumber" width="200" />
            <el-table-column label="分公司名" align="center" prop="branchName" />
            <el-table-column label="方案名称" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/scheme/clause/' + scope.row.schemeId" class="link-type">
                        <span>{{ scope.row.schemeName }}</span>
                    </router-link>
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
    </div>
</template>

<script>
  import { listCustomerInsuranceInfo } from "@/api/business/customer";

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
        customerInsuranceInfoList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          customerName: undefined,
          idNumber: undefined,
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询客户承保信息列表 */
      getList() {
        this.loading = true;
        listCustomerInsuranceInfo(this.queryParams).then(response => {
          this.customerInsuranceInfoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
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
        this.single = selection.length!=1
        this.multiple = !selection.length
      }
    }
  };
</script>
