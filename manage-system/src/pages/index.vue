<template>
  <div class="common-layout">
    <ElContainer>
      <ElHeader>欢迎来到翻译云系统，这是一个美妙的世界</ElHeader>
      <el-table :data="list">
        <el-table-column prop="key" label="key" width="180">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>{{ scope.row.key }}</div>
              </template>
              <template #reference>
                {{ scope.row.key }}
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="zh_CN" label="中文" width="180" />
        <el-table-column prop="en_US.value" label="英语" width="180" />
        <el-table-column prop="zh_TW.value" label="中国台湾" width="180" />
        <el-table-column prop="zh_HK.value" label="中国香港" width="180" />
        <el-table-column prop="ja_JP.value" label="日语" width="180" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </ElContainer>
    <Detail v-model="visible" :item="current" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  ElContainer,
  ElHeader,
  ElTable,
  ElTableColumn,
  ElPopover,
  ElButton
} from "element-plus";
import Detail from '@/components/detail.vue';
import { api } from "@/api";

const list = ref([]);
const visible = ref(false);
const current = ref<any>(null);

onMounted(async () => {
  const r = await api.getList();

  list.value = r.data;
});

const handleEdit = (index: number, row: any) => {
  console.log(index, row);
  visible.value = true;
  current.value = row;
};
</script>
<style lang="less" scoped>
.common-layout {
  height: 100vh;
}
</style>
