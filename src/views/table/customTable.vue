<template>
    <div class="customTable-container">
        <el-card>
            <template #header> <span>基本表格</span></template>
            <EasyTable
                :columns="tableColumn"
                :table-data="tableData1"
                :options="tableOption"
                @selection-change="handleSelection"
                @command="handleAction"
                @sort-change="handleSortChange"
                @size-change="SizeChange"
                @current-change="CurrentChange"
            >
            </EasyTable>
        </el-card>
        <el-card>
            <template #header> <span>自定义表头表格</span></template>
            <EasyTable
                :columns="tableColumn2"
                :table-data="tableData2"
                :options="tableOption"
            >
                <!-- 插槽自定义表头 -->
                <template #deliveryHeader="{ column }">
                    <p style="background-color: brown; color: #fff">{{ column.label }}(插槽自定义表头)</p>
                </template>
                <template #stateHeader="{ column }">
                    <p style="background-color: green; color: #fff">{{ column.label }}(插槽自定义表头)</p>
                </template>
            </EasyTable>
        </el-card>
        <el-card>
            <template #header> <span>表格展开</span></template>
            <EasyTable
                :columns="tableColumn3"
                :table-data="tableData1"
                :options="tableOption"
            ></EasyTable>
        </el-card>
        <el-card>
            <template #header> <span>Render 函数自定义列、自定义表头</span></template>
            <EasyTable
                :columns="tableColumn4"
                :table-data="tableData1"
                :options="tableOption"
            >
                <template #address="{ row }">
                    <span>演示slot使用--->{{ row.address }}</span>
                </template>
            </EasyTable>
        </el-card>
    </div>
</template>

<script setup>
import EasyTable from "@/components/EasyTable/index.vue";
import { useTable } from "@/hooks/useTable.js";
import { tableColumn1, tableColumn2, tableColumn3, tableColumn4 } from "./customTable";
import { ref, onMounted } from "vue";

const { searchParam, pagination, tableData,  search, reset, loading } = useTable("/api/v1/table/list");

const tableOption = {
  showPagination: true,
  defaultSort: { prop: "name", order: "ascending" }
};

const tableColumn = ref(tableColumn1);
// 基本表格数据
const tableData1 = ref([]);
const tableData2 = ref([
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-08",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-06",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-07",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
]);
onMounted(() => {
  tableData1.value = [
    {
      id: 1,
      date: 1660737564000,
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    },
    {
      id: 2,
      date: 1660737564000,
      name: "王小帅",
      address: "上海市普陀区金沙江路 1517 弄"
    },
    {
      id: 3,
      date: 1660737564000,
      name: "佘太君",
      address: "上海市普陀区金沙江路 1516 弄"
    },
    {
      id: 4,
      date: 1462291200000,
      name: "王小虎",
      address: "上海市普陀区金沙江路 1517 弄"
    },
    {
      id: 5,
      date: 1462032000000,
      name: "王小帅",
      address: "上海市普陀区金沙江路 1519 弄"
    },
    {
      id: 6,
      date: 1462204800000,
      name: "王小呆",
      address: "上海市普陀区金沙江路 1516 弄"
    }
  ];
});
/**
    * 排序
    * 在列中设置 sortable 属性即可实现以该列为基准的排序， 接受一个 Boolean，默认为 false。
    * 可以通过 Table 的 default-sort 属性设置默认的排序列和排序顺序。 
    * 如果需要后端排序，需将 sortable 设置为 custom，同时在 Table 上监听 sort-change 事件，
    * 在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
    */
const SizeChange = (val) => {
  console.log(`每页 ${val} 条`);
  pagination.value.pageSize = val;
  console.log(loading.value, searchParam.value, tableData.value);
  tableData1.value = tableData.value;
  search();
  return;
  reset();
};
const CurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  pagination.currentPage = val;
  search();
};

const handleSortChange = ({ column, prop, order }) => {
  console.log(column, order);
  if (prop) {
    ElMessage.success(`点击了【${prop}】排序`);
  }
};
const handleSelection = (val) => {
  console.log("父组件接收的多选数据", val);
};
const handleAction = (command, row, index) => {
  switch (command) {
  case "edit":
    alert("点击了编辑");
    tableData1.value.push({
      id: 7,
      date: 1660737564000,
      name: "王小虎2",
      address: "上海市普陀区金沙江路 1518 弄"
    });
    break;
  case "delete":
    console.log("row", row);
    console.log("index", index);
    // ElMessageBox.confirm("确认删除吗？", "提示").then(() => {
    //   ElMessage(JSON.stringify(row));
    // }).catch(() => null);
    break;
  default:
    break;
  }
};

</script>

<style lang="scss" scoped>
.el-card {
    margin-bottom: 20px;
}
</style>