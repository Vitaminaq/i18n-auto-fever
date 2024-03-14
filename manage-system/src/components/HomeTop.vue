<script lang="ts" setup>
import { ref, computed } from "vue";
import {
  ElSelect,
  ElOption,
  ElButton,
  ElInput,
  ElHeader,
  ElCheckbox,
} from "element-plus";
import { store } from "@/utils/store";

const emits = defineEmits(["search"]);

const project = ref("");

const projectOptions = computed(() => {
  return store.projects.map((i) => {
    return {
      value: i,
      label: i,
    };
  });
});

const onReset = () => {
  project.value = "";
  store.fetchParams.filter_zh = "";
};

const onSearch = () => {
  emits("search", {
    project: project.value,
    filterZh: store.fetchParams.filter_zh,
  });
};

const handleEnter = () => {
  return onSearch();
};
</script>
<template>
  <div class="index-top">
    <ElHeader class="i18n-header"
      >欢迎来到翻译云系统，这是一个美妙的世界</ElHeader
    >
    <div class="search-contain">
      <el-select
        class="index-top-item"
        v-model="project"
        placeholder="选择要过滤的项目"
        clearable
        style="width: 240px"
      >
        <el-option
          v-for="item in projectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        class="index-top-item"
        v-model="store.fetchParams.filter_zh"
        style="width: 240px"
        placeholder="请输入要搜索的中文"
        clearable
        @keydown.enter="handleEnter"
      />
      <el-checkbox
        class="index-top-item"
        v-model="store.fetchParams.omit"
        :true-value="1"
        :false-value="0"
        label="只看漏翻"
        size="large"
      />
      <ElButton @click="onReset">重置</ElButton>
      <ElButton type="primary" @click="onSearch">搜索</ElButton>
    </div>
    <div class="top-tip">温馨提示: 红色背景代表该条目有漏翻风险</div>
  </div>
</template>
<style>
.i18n-header {
  padding: 32px 0;
  height: auto;
  font-size: 24px;
  font-weight: 600;
}

.search-contain {
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 20px;
}

.index-top-item {
  margin-right: 16px !important;
}

.top-tip {
  text-align: left;
  padding-left: 16px;
  font-size: 14px;
  color: red;
  padding-bottom: 10px;
}
</style>
