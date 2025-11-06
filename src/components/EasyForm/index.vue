<template>
    <div class="easy-from">
        <el-form
          v-bind="_options"
          ref="formRef"
          :model="model"
          @submit.prevent
        >
          <el-row :gutter="20">
            <el-col v-for="(item, index) in filedList" v-show="!item.notShow" :key="index"  :span="item.span || 24" :class="{'is-inline':_options.inline}">
              <el-form-item v-bind="item" :label="item.label" :rules="item.rules">
                <!-- 输入框 -->
                <el-input
                  v-if="item.type == 'input'"
                  v-model="model[item.prop]" 
                  :placeholder="item.placeholder || '请输入'"
                  :type="item.inputType || 'text'"
                  :disabled="item.disabled"
                  :clearable="item.clearable || true"
                  @keyup.enter="handleKeyup(item.enterable)"
                />
                <!-- 文本框 -->
                <el-input
                  v-if="item.type == 'textarea'"
                  v-model="model[item.prop]" 
                  :readonly="item.readonly" 
                  :placeholder="item.placeholder || '请输入'"
                  :type="item.type || 'text'"
                  :disabled="item.disabled"
                  :clearable="item.clearable || true"
                />
                <!-- 选择框 -->
                <el-select
                  v-if="item.type == 'select'"
                  v-model="model[item.prop]" 
                  :placeholder="item.placeholder || '请选择'"
                  :disabled="item.disabled"
                  :clearable="item.clearable || true"
                  style="min-width: 150px;"
                >
                  <el-option
                    v-for="(option, sindex) in item.options"
                    :key="sindex"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <!-- 复选框 -->
                <el-checkbox-group
                    v-if="item.type == 'checkbox'"
                    v-model="model[item.prop]"
                    :placeholder="item.placeholder || '请选择'"
                    :disabled="item.disabled"
                    :clearable="item.clearable || true"
                >
                  <el-checkbox
                    v-for="(checkbox, cindex) in item.checkboxList"
                    :key="cindex"
                    :value="checkbox.value"
                    :disabled="checkbox.disabled"
                  >{{ checkbox.label }}</el-checkbox>
                </el-checkbox-group>
                <!-- 日期选择框 -->
                <el-date-picker
                  v-if="item.type == 'date'"
                  v-model="model[item.prop]" 
                  :placeholder="item.placeholder || '请选择'"
                  :disabled="item.disabled"
                  :clearable="item.clearable || true"
                  :type="item.dateType || 'date'"
                  :format="item.format || 'YYYY-MM-DD HH:mm:ss'"
                  :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
                  :style="{ 'width': item.width || '100%'}"
                />
                <!-- 日期范围选择框 -->
                <el-date-picker
                  v-if="item.type == 'daterange'"
                  v-model="model[item.prop]" 
                  :placeholder="item.placeholder || '请选择'"
                  :disabled="item.disabled"
                  :clearable="item.clearable || true"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :format="item.format || 'YYYY-MM-DD HH:mm:ss'"
                  :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
                />
                <!-- 单选框 -->
                <el-radio-group
                  v-if="item.type == 'radio'"
                  v-model="model[item.prop]"
                  :placeholder="item.placeholder || '请选择'"
                  :disabled="item.disabled"
                  :clearable="item.clearable || true"
                >
                  <el-radio
                    v-for="(radio, rindex) in item.radioList"
                    :key="rindex"
                    :value="radio.value"
                    :disabled="radio.disabled"
                  >{{ radio.label }}</el-radio>
                </el-radio-group>
                <!-- 富文本编辑器 -->
                <wang-editor v-if="item.type == 'wangeditor'" :valuehtml="model[item.prop]" :self-disabled="item.disabled" @update:value-html="editorChange($event, item.prop)" />
              </el-form-item>
            </el-col>
            <!-- 按钮块 -->
            <el-form-item>
              <el-button type="primary" @click="onSubmit(formRef)">{{ _options.submitButtonText }}</el-button>
              <el-button v-if="_options.showResetButton" type="info" @click="resetForm(formRef)">
                {{ _options.resetButtonText }}
              </el-button>
              <el-button v-if="_options.showCancelButton" @click="emit('cancel')">
                {{ _options.cancelButtonText }}
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import WangEditor from "../WangEditor/index.vue";

const props = defineProps({
  filedList: {
    type: Array,
    default: () => []
  },
  formData: {
    type: Object,
    default: () => {return {};}
  },
  options: {
    type: Object,
    default: () => { return {};}
  }
});
const formRef = ref(null);
const emit = defineEmits(["submit", "reset", "cancel"]);

// 表单配置

const _options = computed(() => {
  const option = {
    labelPosition: "left",
    labelWidth: "80px",
    showResetButton: true,
    showCancelButton: true,
    inline: false,
    submitButtonText: "提交",
    resetButtonText: "重置",
    cancelButtonText: "取消"
  };
  return Object.assign(option, props?.options);
});

const model = computed({
  get() {
    return new Proxy(props.formData, {
      get(target, key, receiver) {
        return Reflect.get(target, key, receiver);
      },
      set(target, key, value, receiver) {
        return Reflect.set(target, key, value, receiver);
      }
    });
  }
});

const editorChange = (value, name) => {
  model.value[name] = value;
};

// 提交按钮
const onSubmit = (formEl) => {
  if (!formEl) {return;}
  formEl.validate((valid) => {
    if (valid) {
      emit("submit", props.formData);
    } else {
      return false;
    }
  });
};
// 输入框回车事件
const handleKeyup = (enterable) => {
  if (!enterable) {return;}
  onSubmit(formRef.value);
};
// 重置
const resetForm = (formEl) => {
  if (!formEl) {return;}
  formEl.resetFields();
};


</script>

<style lang="scss" scoped>
.is-inline {
  flex: none !important;
}
:deep(.el-form-item__label) {
  font-weight: 700;
}
</style>