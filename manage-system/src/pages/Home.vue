<template>
  <div class="common-layout">
    <HomeTop @search="onSearch" />
    <el-table
      :data="list"
      height="70vh"
      :default-sort="{ prop: 'create_time', order }"
      :row-class-name="tableRowClassName"
      @sort-change="onSortChange"
    >
      <el-table-column v-for="item in tableHeader" v-bind="{ ...item }" />
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="i18n-pagination"
      background
      layout="prev, pager, next"
      :page-size="store.fetchParams.limit"
      :total="total"
      @change="onPageChange"
    />
    <Detail v-model="visible" :item="current" :status="visible" @keywordCheck="onKeywordCheck" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, h } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
} from "element-plus";
import HomeTop from "@/components/HomeTop.vue";
import Detail from "@/components/detail.vue";
import { api } from "@/api";
import { formatDate } from "@/utils/publics";
import { store } from "@/utils/store";

const visible = ref(false);
const current = ref<any>(null);

const list = computed(() => store.list);
const total = computed(() => store.total);
const order = computed(() =>
  store.fetchParams.sort === -1 ? "descending" : "ascending"
);

const tableHeader = computed(() => [
  {
    prop: "create_time",
    label: "创建时间",
    width: 180,
    sortable: "custom",
    formatter: (row: API.I18n.List.DataItem) => {
      return formatDate("YYYY-MM-DD hh:mm:ss", row.create_time);
    },
  },
  {
    prop: "project",
    label: "项目",
    width: 180,
  },
  {
    prop: "key",
    label: "字段",
    width: 180,
  },
  {
    prop: "zh_CN",
    label: "中文",
    formatter: (row: API.I18n.List.DataItem) => {
      const { filter_zh } = store.fetchParams;
      const { zh_CN } = row;
      if (!filter_zh) return zh_CN;
      return h("p", {
        innerHTML: zh_CN.replaceAll(
          filter_zh,
          `<span class="i18n-search-word">${filter_zh}</span>`
        ),
      });
    },
  },
  {
    prop: "en",
    label: "英语",
  },
  {
    prop: "jp",
    label: "日语",
  },
  {
    prop: "kr",
    label: "韩语",
  },
  {
    prop: "ru",
    label: "俄语",
  },
  {
    prop: "update_time",
    label: "更新时间",
    width: 180,
    formatter: (row: API.I18n.List.DataItem) => {
      return formatDate("YYYY-MM-DD hh:mm:ss", row.update_time);
    },
  },
]);

const tableRowClassName = ({ row }: { row: API.I18n.List.DataItem; }) => {
  const { en, jp, kr, ru } = row;

  if (en && jp && kr && ru) return;
  return 'warning-row';
}

const getData = async () => {
  const r = await api.getList(store.fetchParams);

  if (r.code !== 0) return;

  const { list, total } = r.data;

  store.list = list;
  store.total = total;
};

onMounted(() => {
  getData();
  api.getProjects().then((res) => {
    if (res.code !== 0) return;
    store.projects = res.data;
  });
});

const handleEdit = (index: number, row: any) => {
  console.log(index, row);
  visible.value = true;
  current.value = row;
};

const onPageChange = (currentPage: number) => {
  store.fetchParams.page = currentPage - 1;
  getData();
};

const onSortChange = ({
  order,
}: {
  order: "ascending" | "descending";
  prop: string;
}) => {
  store.fetchParams.sort = order === "ascending" ? 1 : -1;
  getData();
};

const onSearch = ({
  project,
  filterZh,
}: {
  project: string;
  filterZh: string;
}) => {
  store.fetchParams.project = project;
  store.fetchParams.filter_zh = filterZh;
  getData();
};

const onKeywordCheck = (keyword: string) => {
  store.fetchParams.filter_zh = keyword;
  getData();
}
</script>
<style lang="less" scoped>
.common-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.i18n-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
<style>
.i18n-search-word {
  color: #409eff;
}
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-error-light-7);
}
</style>
