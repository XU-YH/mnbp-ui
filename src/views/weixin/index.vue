<template>
    <div style="background-color: #eef1f6; width: 100%; height: 100%">
        <el-header id="head_top">
            <section class="title_head">
                承保信息查询
            </section>
        </el-header>
        <el-form id="form" ref="form" :model="queryParams" :rules="rules" label-width="68px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入姓名"/>
            </el-form-item>
            <el-form-item label="证件号" prop="idNumber">
                <el-input v-model="queryParams.idNumber" placeholder="请输入证件号"/>
            </el-form-item>
            <el-button type="primary" style="font-weight: bold; width: 80%; margin: 8rem 10% 0 10%; font-size: medium"
                       @click="submit"> 查 询
            </el-button>
        </el-form>
    </div>
</template>

<script>
  import { getInsuranceInfo } from '@/api/weixin/weixin'

  export default {
    data() {
      return {
        queryParams: {
          name: undefined,
          idNumber: undefined
        },
        // 表单校验
        rules: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { max: 30, message: '长度不能超过30个字符', trigger: 'change'}
          ],
          idNumber: [
            { required: true, message: '证件号不能为空', trigger: 'blur' },
            { max: 20, message: '长度不能超过20 个字符', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$router.push({
              path: '/weixin/insuranceInfo',
              query: { customerName: this.queryParams.name, idNumber: this.queryParams.idNumber }
            })
          }
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

    #form {
        margin-top: 8rem;
        width: 100%;
        padding: 0 5% 0 5%;
    }


</style>
