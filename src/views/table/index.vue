<template>
  <div class="table-wrapper">
    <div style="margin-bottom: 10px;">
      <el-button type="primary" @click="addPerson">新增</el-button>
    </div>
    <el-table v-loading="tableLoading" border :data="list || tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" show-overflow-tooltip />
      <el-table-column prop="phone" label="电话" show-overflow-tooltip />
      <el-table-column prop="address" label="Address" show-overflow-tooltip />
      <el-table-column prop="created_time" label="创建时间" show-overflow-tooltip/>
      <el-table-column prop="updated_time" label="更新时间" show-overflow-tooltip/>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="Edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delList(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      style="margin: 10px auto; justify-content: end;"
      :page-sizes="[10, 20, 30, 50]"
      :size="size"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totals"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog v-model="dialogVisible" custom-class="draggable-dialog" title="添加人员" width="30%">
      <template  #header>
        <div v-dragDialog class="dialog-title">{{ dialogTitle }}人员</div>
      </template>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
            <el-input v-model="ruleForm.address" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addOrEdit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getList, addList, deleteList, updateList, getPerson } from "@/api/table";
const list = ref([]);
const tableLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totals = ref(0);
const size = ref("small");
const dialogVisible = ref(false);
const dialogTitle = ref("添加");
const ruleFormRef = ref(null);
const ruleForm = reactive({
  id: "",
  name: "",
  phone: "",
  address: "",
});
const rules = reactive({
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "请输入电话", trigger: "blur" },
  ],
  address: [
    { required: true, message: "请输入地址", trigger: "blur" },
  ],
});


const getTableList = () => {
  tableLoading.value = true;
  getList({
    pageSize: pageSize.value,
    page: currentPage.value,
  }).then((res) => {
    tableLoading.value = false;
    const data = res.data;
    if(res.status !== 0) {return false;}
    totals.value = data.count;
    list.value = data.rows;
  });
};
const handleSizeChange = (val) => {
  pageSize.value = val;
  getTableList();
};
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getTableList();
};
const addPerson = () => {
  dialogTitle.value = "添加";
  dialogVisible.value = true;
};
const Edit = (row) => {
  dialogVisible.value = true;
  dialogTitle.value = "编辑";
  getPerson({
    id: row.id,
  }).then((res) => {
    if(res.status !== 0) {return false;}
    const data = res.data;
    ruleForm.id = data.id;
    ruleForm.name = data.name;
    ruleForm.phone = data.phone;
    ruleForm.address = data.address;
  });
};
const addOrEdit = () => {
  const formEl = ruleFormRef.value;
  if (!formEl) {return;}
  formEl.validate((valid) => {
    if (valid) {
      const { name, phone, address } = ruleForm;
      if(dialogTitle.value === "添加") {
        addList({
          name,
          phone,
          address,
        }).then((res) => {
          if(res.status !== 0) {return false;}
          ElMessage.success("添加成功");
          dialogVisible.value = false;
          getTableList();
        });
      } else {
        updateList({
          id: ruleForm.id,
          name,
          phone,
          address,
        }).then((res) => {
          if(res.status !== 0) {return false;}
          ElMessage.success("编辑成功");
          dialogVisible.value = false;
          getTableList();
        });
      }
    }
  });
};

const delList = (row)=> {
  deleteList({
    id: row.id,
  }).then((res) => {
    if(res.status !== 0) {
      ElMessage.error(res.message);
      return false;
    }
    ElMessage.success("删除成功");
    getTableList();
  });
};
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
];
onMounted(() => {
  getTableList();
});
</script>
