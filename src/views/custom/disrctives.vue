<template>
  <div v-waterMarker="waterMarkerStr"  class="form-wrapper">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
    >
    <el-form-item label="Activity name" prop="name">
        <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="Activity zone" prop="region">
        <el-select v-model="ruleForm.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
        </el-select>
    </el-form-item>
    <el-form-item label="Activity count" prop="count">
        <el-select-v2
        v-model="ruleForm.count"
        placeholder="Activity count"
        :options="options"
        />
    </el-form-item>
    <el-form-item label="Activity time" required>
        <el-col :span="11">
        <el-form-item prop="date1">
            <el-date-picker
            v-model="ruleForm.date1"
            type="date"
            label="Pick a date"
            placeholder="Pick a date"
            style="width: 100%"
            />
        </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">
        <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
        <el-form-item prop="date2">
            <el-time-picker
            v-model="ruleForm.date2"
            label="Pick a time"
            placeholder="Pick a time"
            style="width: 100%"
            />
        </el-form-item>
        </el-col>
    </el-form-item>
    <el-form-item label="Instant delivery" prop="delivery">
        <el-switch v-model="ruleForm.delivery" />
    </el-form-item>
    <el-form-item label="Activity type" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
        <el-checkbox value="Online activities" name="type">
            Online activities
        </el-checkbox>
        <el-checkbox value="Promotion activities" name="type">
            Promotion activities
        </el-checkbox>
        <el-checkbox value="Offline activities" name="type">
            Offline activities
        </el-checkbox>
        <el-checkbox value="Simple brand exposure" name="type">
            Simple brand exposure
        </el-checkbox>
        </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
        <el-radio value="Sponsorship">Sponsorship</el-radio>
        <el-radio value="Venue">Venue</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="Activity form" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
        Create
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">拖拽弹窗</el-button>
        <el-button @click="waterMarker">开启水印</el-button>
        <el-input v-model="copyData" placeholder="请输入内容" style="width: 300px">
          <template #append>
            <el-button v-copy="copyData"> 复制 </el-button>
          </template>
        </el-input>
        <el-button v-debounce="debounceFn">防抖</el-button>
        <el-button v-throttle="throttleFn">节流</el-button>
    </el-form-item>
    </el-form>
    <el-dialog v-model="dialogVisible" custom-class="draggable-dialog" title="可拖拽的 Dialog" width="30%">
      <template  #header>
        <div v-dragDialog class="dialog-title">拖拽我</div>
      </template>
      <span>This is a message</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">
              Confirm
            </el-button>
          </div>
        </template>
    </el-dialog>
  </div>
  
</template>
  
<script setup>
import { reactive, ref, getCurrentInstance  } from "vue";
  
const formSize = ref("default");
const ruleFormRef = ref();
const ruleForm = reactive({
  name: "Hello",
  region: "",
  count: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
const waterMarkerStr = reactive({});
const copyData = ref("我是被复制的内容 🍒 🍉 🍊");
const dialogVisible = ref(false);
const internalInstance = getCurrentInstance();
  
const rules = reactive({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  region: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
  count: [
    {
      required: true,
      message: "Please select Activity count",
      trigger: "change",
    },
  ],
  date1: [
    {
      type: "date",
      required: true,
      message: "Please pick a date",
      trigger: "change",
    },
  ],
  date2: [
    {
      type: "date",
      required: true,
      message: "Please pick a time",
      trigger: "change",
    },
  ],
  type: [
    {
      type: "array",
      required: true,
      message: "Please select at least one activity type",
      trigger: "change",
    },
  ],
  resource: [
    {
      required: true,
      message: "Please select activity resource",
      trigger: "change",
    },
  ],
  desc: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
});
  
const submitForm = async (formEl) => {
  if (!formEl) {return;}
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
  
const resetForm = (formEl) => {
  dialogVisible.value = true;
  if (!formEl) {return;}
  formEl.resetFields();
};

  
const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));

  
// const copyThis = () => {
//   console.log(1);
// };

const waterMarker = () => {
  waterMarkerStr.value = {
    content: "水印内容",
    font: "18px 微软雅黑",
    textColor: "rgba(184, 184, 184, 0.3)",
  };
  // 操作数据后更新视图
	  internalInstance.ctx.$forceUpdate();
};

const debounceFn = () => {
  console.log(2);
};

const throttleFn = () => {
  console.log(1);
};
</script>
  