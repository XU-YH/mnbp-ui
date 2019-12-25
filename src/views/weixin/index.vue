<template>
  <div style="background-color: #eef1f6; width: 100%; height: 100%">
    <el-header id="head_top">
      <section class="title_head">
        <span class="title_text">承保信息查询</span>
      </section>
    </el-header>
    <el-form id="form" ref="form" :model="user" :rules="rules" label-width="68px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="user.name" placeholder="姓名"/>
      </el-form-item>
      <el-form-item label="证件号" prop="idNumber">
        <el-input v-model="user.idNumber" placeholder="证件号"/>
      </el-form-item>
      <el-button type="primary" style="font-weight: bold; width: 80%; margin: 20% 10%; font-size: medium" @click="submit"> 查  询</el-button>
    </el-form>
  </div>
</template>

<script>
  import { getInsuranceInfo } from '@/api/weixin/weixin'

  export default {
    data() {
      return {
        test: '1test',
        user: {
          name: undefined,
          idNumber: undefined
        },
        // 表单校验
        rules: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          idNumber: [
            { required: true, message: '证件号不能为空', trigger: 'blur' }
            // { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            // this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.push({ path: "/weixin/insuranceInfo" });
            // getInsuranceInfo(this.user.name, this.user.idNumber).then(
            //   response => {
            //     if (response.code === 200) {
            //       this.msgSuccess('修改成功')
            //     } else {
            //       this.msgError(response.msg)
            //     }
            //   }
            // )
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../style/mixin";

  #head_top {
    background-color: $blue;
    position: absolute;
    z-index: 100;
    left: 0;
    top: 0;
    @include wh(100%, 1.95rem);
  }

  .title_head {
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;

    .title_text {
      @include sc(1.2rem, #fff);
      text-align: center;
      font-weight: bold;
    }
  }

  #form {
    position: absolute;
    width: 100%;
    margin-top: 40%;
    padding: 5% 5%;

  }


</style>
