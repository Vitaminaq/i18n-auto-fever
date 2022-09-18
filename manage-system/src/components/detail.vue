<template>
  <el-dialog
    :model-value="props.value"
    title="编辑"
    width="80%"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item v-for="item in list" :key="item._id" :label="item.label" prop="pass">
        <el-input v-model="ruleForm.pass" type="text" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { ElDialog, ElButton, ElForm, ElFormItem, ElInput } from "element-plus";
import type { FormInstance } from "element-plus";
import { langTextMap } from '@/utils/publics';

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["update:modelValue"]);

const ruleFormRef = ref<FormInstance>();

const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("Please input the age"));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("Please input digits"));
    } else {
      if (value < 18) {
        callback(new Error("Age must be greater than 18"));
      } else {
        callback();
      }
    }
  }, 1000);
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (ruleForm.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  pass: "",
  checkPass: "",
  age: "",
});

const rules = reactive({
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
  age: [{ validator: checkAge, trigger: "blur" }],
});

const list = computed(() => {
  const { item } = props;
  return Object.keys(item)
    .filter((k) => ["zh_CN", "en_US", "ja_JP", "zh_HK", "zh_TW"].includes(k))
    .map((i) => {
      return typeof item[i] === "string"
        ? {
            lock: "true",
            label: langTextMap[i],
            value: item[i],
            _id: 1,
          }
        : {
            ...item[i],
            label: langTextMap[i],
        };
    });
});

const onClose = () => emit("update:modelValue", false);

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
      onClose();
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
