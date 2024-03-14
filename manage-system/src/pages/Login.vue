<script lang="ts" setup>
import { ref } from "vue";
import { ElInput, ElButton, ElMessage } from "element-plus";
import { api } from "@/api";
import { useRouter } from "vue-router";
import { RouterNames } from "@/router";
import { store } from "@/utils/store";

const router = useRouter();

const loading = ref(false);

const onLogin = async () => {
  if (loading.value) return;
  loading.value = true;
  const r = await api
    .login({
      token: store.token,
    })
    .finally(() => {
      loading.value = false;
    });

  if (r.code !== 0)
    return ElMessage.error({
      message: "登录失败, 请检查令牌是否正确",
      duration: 2000,
    });
  ElMessage.success({
    message: "登录成功，即将进入云系统...",
    duration: 1500,
  });
  return router.push({
    name: RouterNames.Home,
  });
};
</script>
<template>
  <div class="login">
    <h1>Pixso 翻译云系统</h1>
    <el-input
      size="large"
      style="width: 50vw"
      v-model="store.token"
      placeholder="请输入登录令牌"
      clearable
    />
    <ElButton
      class="login-btn"
      size="large"
      style="width: 300px"
      type="primary"
      @click="onLogin"
      >登录</ElButton
    >
  </div>
</template>
<style>
.login {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.login h1 {
  margin-bottom: 200px;
  font-size: 48px;
}
.login-btn {
  margin-top: 20px;
  margin-bottom: 200px;
}
</style>
