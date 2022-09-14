<template>
    <el-dialog
      :model-value="props.value"
      title="编辑"
      width="100%"
      @close="onClose"
    >
      <span>This is a message</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onClose">取消</el-button>
          <el-button type="primary" @click="onClose"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ElDialog, ElButton } from 'element-plus'

  const props = defineProps({
    value: {
        type: Boolean,
        default: false
    }
  });
  const emit = defineEmits(["update:modelValue"]);
  
  const onClose = () => emit('update:modelValue', false);
  
  </script>
  <style scoped>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  </style>
  