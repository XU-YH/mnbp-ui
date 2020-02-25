<template>
    <div style="background-color: #eef1f6; width: 100%; height: 100%">
        <el-header id="head_top">
            <section class="title_head">
                承保信息
            </section>
        </el-header>
        <el-main id="el_main" v-loading="loading">
            <template v-if="insuranceInfo !== undefined">
                <h4 style="text-indent:2em;">尊敬的【{{queryParams.idNumber}}】，您已获得由美年大健康赠送的保险权益</h4>
                <span style="font-size: 0.9rem;">由PICC人保财险承保</span>

                <h4 align="center" style="margin: 4rem 0 3rem 0">保障内容</h4>
                <el-row :gutter="10">
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                        <div class="grid-content">被保险人</div>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="right">
                        <div class="grid-content" v-text="insuranceInfo.customerName"></div>
                    </el-col>
                    <el-divider/>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                        <div class="grid-content">保障期限</div>
                    </el-col>
                    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14" align="right">
                        <div class="grid-content"
                             v-text="parseTime(insuranceInfo.exminatidonDate, '{y}-{m}-{d}') + '至' + parseTime(addYearSubOneDay(insuranceInfo.exminatidonDate, 1), '{y}-{m}-{d}')"></div>
                    </el-col>
                    <el-divider/>
                </el-row>
                <el-row :gutter="10" v-for="schemeClause in insuranceInfo.schemeClauseList" :key="schemeClause.id">
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                        <div class="grid-content" v-text="schemeClause.clauseName"></div>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="right">
                        <div class="grid-content" v-text="schemeClause.compensationLimit"></div>
                    </el-col>
                    <el-divider/>
                </el-row>
            </template>
            <template v-else>
                <el-row>
                    <h4 style="text-indent:2em;">尊敬的【{{queryParams.idNumber}}】，您尚未在PICC承保相关权益</h4>
                </el-row>
            </template>
        </el-main>
    </div>
</template>
<script>
  import { getInsuranceInfo } from '@/api/weixin/weixin'

  export default {
    data() {
      return {
        // 遮罩层
        loading: true,
        insuranceInfo: undefined,
        queryParams: {
          name: undefined,
          idNumber: undefined
        }
      }
    },
    created() {
      this.queryParams = this.$route.query
      this.getInsuranceInfo(this.queryParams)
    },
    methods: {
      /** 查询微信承保信息 */
      getInsuranceInfo(queryParams) {
        getInsuranceInfo(queryParams).then(response => {
          this.insuranceInfo = response.data
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
    #head_top {
        background-color: #3190e8;
        z-index: 100;
        width: 100%;
        height: 1.95rem;
        display: table;
    }

    .title_head {
        color: #fff;
        height: 100%;
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
    }

    #el_main {
        width: 100%;
        margin-top: 2rem;
        padding: 0 5% 0 5%;
    }

    .el-col {
        border-radius: 4px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
        font-size: small;
    }
</style>
