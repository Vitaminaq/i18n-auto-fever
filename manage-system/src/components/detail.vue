<template>
  <el-dialog
    :v-model="value"
    title="编辑"
    width="60%"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onClose"
  >
    <div class="i18n-detail-content">
      <div class="i18n-info-item">
        <span>项目：</span>
        <div>{{ localItem.project }}</div>
      </div>
      <div class="i18n-info-item">
        <span>路径：</span>
        <div>{{ localItem.path }}</div>
      </div>
      <div class="i18n-info-item">
        <span>字段：</span>
        <div>{{ localItem.key }}</div>
      </div>
      <div class="i18n-form">
        <FormItem
          v-for="langItem in list"
          :key="langItem.lang"
          :item="langItem"
          :reference="localItem.zh_CN"
          :id="localItem._id"
          @change="onChange"
        />
      </div>
      <div class="i18n-info-item">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="查看关键词其他翻译，避免一词多译"
          placement="top"
        >
          <el-icon class="keyword-tip"><Warning /></el-icon>
        </el-tooltip>
        关键词推荐：
        <el-button v-for="kItem in keywords" :key="kItem.keyword" @click="toCheck(kItem.keyword)">{{
          kItem.keyword
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, PropType } from "vue";
import { ElDialog, ElButton, ElIcon, ElTooltip } from "element-plus";
import { Warning } from "@element-plus/icons-vue";
import FormItem from "./FormItem.vue";
import { langTextMap } from "@/utils/publics";
import { cloneDeep } from "lodash-es";
import { api } from "@/api";

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as PropType<API.I18n.List.DataItem>,
    default: () => {},
  },
});
const emit = defineEmits(["update:modelValue", "keywordCheck"]);

const localItem = ref<Record<string, any>>({});
const keywords = ref<API.I18n.Analysis.Participle.DataItem[]>([]);

const list = computed(() => {
  return Object.keys(localItem.value)
    .filter((k) => ["zh_CN", "en", "jp", "kr", "ru"].includes(k))
    .map((i) => {
      return {
        label: langTextMap[i],
        lang: i,
        value: localItem.value[i],
      };
    });
});

watch(
  () => props.item,
  (val) => {
    localItem.value = cloneDeep(val);
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => props.status,
  (val) => {
    if (!val) return;
    api
      .analysisParticiple({
        text: props.item.zh_CN,
        num: 10,
      })
      .then((res) => {
        if (res.code !== 0) return;
        keywords.value = res.data;
      });
  }
);

const onChange = (lang: string, value: string) => {
  localItem.value[lang] = value;
};

const onClose = () => {
  emit("update:modelValue", false);
  localItem.value = cloneDeep(props.item);
};

const toCheck = (val: string) => {
  emit("keywordCheck", val);
  onClose();
}
</script>
<style scoped>
.i18n-form {
  padding: 0 32px;
}

.i18n-detail-content {
  max-height: 65vh;
  overflow: auto;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.i18n-info-item {
  display: flex;
  align-items: center;
  padding: 8px 32px;
}

.i18n-info-item > div {
  color: #333;
}

.keyword-tip {
  margin-right: 4px;
}
</style>
