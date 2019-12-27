<template>
    <div style="background-color: #eef1f6; width: 100%; height: 100%">
        <el-header id="head_top">
            <section class="title_head">
                <span class="title_text">承保信息</span>
            </section>
        </el-header>
        <el-main id="el_main">
            <div>
                <h4>您已获得由美年大健康赠送的保险权益</h4>
                由PICC人保财险承保

                <h4 align="center" style="margin-top: 20%">保障内容</h4>
                <el-row :gutter="10">
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                        <div class="grid-content">被保险人</div>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="right">
                        <div class="grid-content">张三</div>
                    </el-col>
                    <el-divider></el-divider>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                        <div class="grid-content">保障期限</div>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="right">
                        <div class="grid-content">2019-12-12</div>
                    </el-col>
                    <el-divider></el-divider>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                        <div class="grid-content">体检过程中发生的意外身故或残疾赔偿</div>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="right">
                        <div class="grid-content">20000</div>
                    </el-col>
                    <el-divider></el-divider>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                        <div class="grid-content">体检指标异常复查费用补偿（报销型）</div>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="right">
                        <div class="grid-content">20000</div>
                    </el-col>
                    <el-divider></el-divider>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                        <div class="grid-content">检后重大疾病保险</div>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="right">
                        <div class="grid-content">20000</div>
                    </el-col>
                    <el-divider></el-divider>
                </el-row>
            </div>
        </el-main>
    </div>
</template>

<script>
  import { getInsuranceInfo } from '@/api/weixin/weixin'

  export default {}
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
        margin-top: 20%;
        padding: 5% 5%;
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
