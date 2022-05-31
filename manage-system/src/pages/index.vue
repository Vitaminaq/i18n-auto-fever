<template>
  <div class="common-layout">
    <ElContainer>
      <ElHeader>Header</ElHeader>
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="key" label="key" width="180" />
        <el-table-column prop="ZH_CN" label="中文" width="180" />
        <el-table-column prop="EN_US.value" label="英语" width="180" />
        <el-table-column prop="ZH_TW.value" label="中国台湾" width="180" />
        <el-table-column prop="ZH_HK.value" label="中国香港" width="180" />
        <el-table-column prop="JA_JP.value" label="日语" width="180" />
      </el-table>
      <ElMain>Main</ElMain>
    </ElContainer>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElContainer, ElHeader, ElMain, ElTable, ElTableColumn } from 'element-plus';
import { api } from '@/api';

const list = ref([]);

onMounted(async () => {
  const r = await api.getList();

  list.value = r.data;
  console.log(r, 'yyyyyyyyyyyyyyyyyyyyyyyy')
})
</script>
<style lang="less" scoped>
.common-layout {
  height: 100vh;
}
</style>
