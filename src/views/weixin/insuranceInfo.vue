<template>
  <div style="background-color: #eef1f6; width: 100%; height: 100%">
    <el-header id="head_top">
      <section class="title_head">
        <span class="title_text">承保信息</span>
      </section>
    </el-header>
    <el-main id="el_main">
      <div >
        用户承保信息<br>
        .........<br>
        .............<br>
        ....................<br>
        .............................
      </div>
    </el-main>
  </div>
</template>

<script>
  import { getInsuranceInfo } from '@/api/weixin/weixin'

  export default {
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

  #el_main {
    position: absolute;
    width: 100%;
    margin-top: 40%;
    padding: 5% 5%;


  }
</style>
