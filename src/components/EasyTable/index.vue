<!--
 * @description: 自定义表格
-->
<template>
    <div class="easy-table">
        <el-table
            ref="tableRef" 
            v-loading="loading"
            :data="tableData"
            v-bind="_options"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            @cell-click="handleCellClick"
            @sort-change="handleSortChange"
        >
            <template v-for="(col, index) in columns" :key="index">
                <!---复选框, 序号 (START)-->
                <el-table-column
                    v-if="col.type === 'selection' || col.type === 'index' || col.type === 'expand'"
                    :index="indexMethod"
                    v-bind="col"
                >
                    <!-- 当type等于expand时， 配置通过h函数渲染、txs语法或者插槽自定义内容 -->
                    <template #default="{ row, $index }">
                        <!-- render函数 (START) : 使用内置的component组件可以支持h函数渲染和txs语法 -->
                        <component :is="col.render" v-if="col.render" :row="row" :index="$index" />
                        <!-- render函数 (END) -->
                        <!-- 自定义slot (START) -->
                        <slot v-else-if="col.slot" name="expand" :row="row" :index="$index"></slot>
                        <!-- 自定义slot (END) -->
                    </template>
                </el-table-column>
                <!---复选框, 序号 (END)-->
                <!-- 渲染插槽 START -->
                <TableColumn v-else :col="col" @command="handleAction">
                    <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                        <slot :name="slot" v-bind="scope" />
                    </template>
                </TableColumn>
                <!-- 渲染插槽 END -->
            </template>
        </el-table>
        <!-- 分页器 -->
        <div v-if="_options.showPagination" class="mt20">
            <el-pagination
                v-bind="_paginationConfig"
                @size-change="pageSizeChange"
                @current-change="currentPageChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TableColumn from "./TableColumn.vue";

const tableRef = ref();
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  tableData: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => {return {};}
  },
  pagination: {
    type: Object,
    default: () => {return {};}
  }
});

// 合并配置项
const _options = computed (() => {
  const option = {
    stripe: false,
    fit: true,
    border: true,
    highlightCurrentRow: true, // 是否要高亮当前行
    tooltipEffect: "dark",
    showHeader: true,
    showPagination: true,
    paginationConfig: {
      pageSizes: [ 20, 50, 100],
    },
    rowStyle: () => "cursor:pointer" // 行样式
  };
  return Object.assign(option, props?.options);
});

// 合并分页配置
const _paginationConfig = computed(() => {
  const config = {
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 30, 40, 50, 100],
    layout: "total, sizes, prev, pager, next, jumper"
  };
  return Object.assign(config, _options.value.paginationConfig);
});

// 表格行点击事件

const emits = defineEmits([
  "selection-change", // 当选择项发生变化时会触发该事件
  "row-click", // 当某一行被点击时会触发该事件
  "cell-click", // 当某个单元格被点击时会触发该事件
  "command", // 按钮组事件
  "size-change", // pageSize事件
  "current-change", // currentPage按钮组事件
  "pagination-change", // currentPage或者pageSize改变触发 
  "sort-change", // 列排序发生改变触发 
]);

// 自定义索引
const indexMethod = (index) => {
  const tabIndex = index + (_paginationConfig.value.currentPage - 1) * _paginationConfig.value.pageSize + 1;
  return tabIndex;
};

// 切换pageSize
const pageSizeChange = (pageSize) => {
  emits("size-change", pageSize);
  emits("pagination-change", 1, pageSize);
};
// 切换currentPage
const currentPageChange = (currentPage) => {
  emits("current-change", currentPage);
  emits("pagination-change", currentPage, _paginationConfig.value.pageSize);
};
// 按钮组事件
const handleAction = (command, row, index) => {
  emits("command", command, row, index);
};
// 多选事件
const handleSelectionChange = (val) => {
  emits("selection-change", val);
};
// 当某一行被点击时会触发该事件
const handleRowClick = (row, column, event) => {
  emits("row-click", row, column, event);
};
// 当某个单元格被点击时会触发该事件
const handleCellClick = (row, column, cell, event) => {
  emits("cell-click", row, column, cell, event);
};
/**
	*  当表格的排序条件发生变化的时候会触发该事件
	 * 在列中设置 sortable 属性即可实现以该列为基准的排序， 接受一个 Boolean，默认为 false。
	 * 可以通过 Table 的 default-sort 属性设置默认的排序列和排序顺序。 
	 * 如果需要后端排序，需将 sortable 设置为 custom，同时在 Table 上监听 sort-change 事件，
	 * 在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
 	*/
const handleSortChange = ({ column, prop, order }) => {
  emits("sort-change", { column, prop, order });
};
// 暴露给父组件参数和方法，如果外部需要更多的参数或者方法，都可以从这里暴露出去。
defineExpose({ element: tableRef });
</script>

<style lang="scss" scoped>
:deep(.el-image__inner) {
    transition: all 0.3s;
    cursor: pointer;
    
    &:hover {
        transform: scale(1.2);
    }
}
.mt20 {
  margin-top: 20px;
}
</style>