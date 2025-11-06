<template>
    <!-- 如果有配置多级表头的数据，则递归该组件 -->
    <template v-if="col.children?.length">
        <el-table-column :label="col.label" :width="col.width" :align="col.align">
            <TableColumn v-for="item in col.children" :key="item.prop" :col="item">
                <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                    <slot :name="slot" v-bind="scope" />
                </template>
            </TableColumn>
            <template #header="{ column, $index }">
                <component :is="col.headerRender" v-if="col.headerRender" :column="column" :index="$index" />
                <slot v-else-if="col.headerSlot" :name="col.headerSlot" :column="column" :index="$index"></slot>
                <span v-else>{{ column.label }}</span>
            </template>
        </el-table-column>
    </template>
    <!-- 如果没有配置多级表头的数据，则直接渲染该列的单元格内容 -->
    <el-table-column v-else v-bind="col">
        <template #header="{ column, $index }">
            <component :is="col.headerRender" v-if="col.headerRender" :column="column" :index="$index" />
            <slot v-else-if="col.headerSlot" :name="col.headerSlot" :column="column" :index="$index"></slot>
            <span v-else>{{ column.label }}</span>
        </template>
        <template #default="{ row, $index }">
            <!---图片 (START)-->
            <!-- 如需更改图片size，可自行配置参数 -->
            <el-image
                v-if="col.type === 'image'"
                preview-teleported
                :hide-on-click-modal="true"
                :preview-src-list="[row[col.prop]]"
                :src="row[col.prop]"
                fit="cover"
                class="w-9 h-9 rounded-lg" />
            <!---图片 (END)-->
            <!--- 格式化日期 (START)-->
            <template v-else-if="col.type === 'date'">
                <!---十位数时间戳-->
                <span v-if="String(row[col.prop])?.length <= 10">
                    {{ dayjs.unix(row[col.prop]).format(col.dateFormat ?? 'YYYY-MM-DD') }}
                </span>
                <!---十三位数时间戳-->
                <span v-else>{{ dayjs(row[col.prop]).format(col.dateFormat ?? 'YYYY-MM-DD') }}</span>
            </template>
            <!--- 格式化日期 (END)-->
            <!-- 如果传递按钮数组，就展示按钮组 START-->
            <el-button-group v-else-if="col.buttons?.length">
                <el-button
                    v-for="(btn, index) in col.buttons"
                    :key="index"
                    :size="btn.size || 'small'"
                    :type="btn.type || 'primary'"
                    @click="handleAction(btn.command, row, $index)"
                    >{{ btn.name }}</el-button
                >
            </el-button-group>
            <!-- 如果传递按钮数组，就展示按钮组 END-->
            <!-- render函数 (START) 使用内置的component组件可以支持h函数渲染和txs语法-->
            <component :is="col.render" v-else-if="col.render" :row="row" :index="$index" />
            <!-- render函数 (END) -->
            <!-- 自定义slot (START) -->
            <slot v-else-if="col.slot" :name="col.slot" :row="row" :index="$index"></slot>
            <!-- 自定义slot (END) -->
            <!-- 默认渲染 (START) -->
            <span v-else>{{ row[col.prop] }}</span>
            <!-- 默认渲染 (END) -->
        </template>
    </el-table-column>
</template>

<script setup>
import dayjs from "dayjs";
defineProps({
  col: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(["command"]);
// 按钮组事件
const handleAction = (command, row, index) => {
  emit("command", command, row, index);
};
</script>

<style lang="scss" scoped>

</style>