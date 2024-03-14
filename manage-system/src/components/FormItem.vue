<script lang="ts" setup>
import { ref, computed } from "vue";
import { ElSwitch, ElInput, ElButton } from "element-plus";
import { api } from "@/api";
import { langTranslateMap } from "@/utils/publics";
import { updateLangContent } from "@/utils/store";
import { ElMessage } from "element-plus";

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  reference: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["change"]);

const content = computed({
  get() {
    return props.item.value;
  },
  set(val) {
    emits("change", props.item.lang, val);
  },
});

const value = ref(false);
const loading = ref(false);
const saveOneLoading = ref(false);

const onTranslate = () => {
  if (loading.value) return;
  loading.value = true;

  return api
    .translateOne({
      text: props.reference,
      to: langTranslateMap[props.item.lang],
    })
    .then((res) => {
      content.value = res.data.dst;
      ElMessage.success({
        message: "翻译成功，请记得保存哦~",
        duration: 2000,
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const onSaveOne = () => {
  if (saveOneLoading.value) return;
  saveOneLoading.value = true;

  const { lang, value } = props.item;

  return api
    .updateOne({
      id: props.id,
      content: {
        [lang]: value,
      },
    })
    .then((res) => {
      updateLangContent(res.data);
      ElMessage.success({
        message: "保存成功!!!",
        duration: 2000,
      });
    })
    .finally(() => {
      saveOneLoading.value = false;
    });
};
</script>
<template>
  <div class="form-item">
    <div class="form-item-top">
      <span class="form-item-label">{{ item.label }}</span>
      <el-switch
        class="form-switch"
        v-model="value"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="锁住"
        inactive-text="解锁"
      />
      <el-button
        v-if="reference !== item.value"
        class="translate-btn"
        type="primary"
        size="small"
        :loading="loading"
        round
        @click="onTranslate"
        >机翻</el-button
      >
      <el-button
        class="translate-btn"
        type="success"
        size="small"
        :loading="saveOneLoading"
        round
        @click="onSaveOne"
        >保存</el-button
      >
    </div>
    <el-input
      v-model="content"
      :disabled="!value"
      style="width: 100%"
      autosize
      type="textarea"
      placeholder="请输入对应翻译"
    />
  </div>
</template>
<style scoped>
.form-item {
  font-size: 14px;
  color: #606266;
  display: flex;
  flex-direction: column;
  margin: 8px 0;
}
.form-item-top {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.form-item-label {
  padding-right: 12px;
}

.form-switch {
  margin-right: 12px;
}

.translate-btn {
  padding: 4px 10px;
  line-height: 22px;
  --el-button-size: 22px;
}
</style>
