<template>
    <div class="aimate-card">
        <div v-for="(item,idx) in props.val" :key="idx" class="card-group" :style="{'font-size': props.size+'px'}">
            <transition-group enter-active-class="animate__animated animate__bounceIn" leave-active-class="animate__animated animate__fadeOutDown">
                <!-- <transition-group enter-active-class="animate__animated animate__flipInX" leave-active-class="animate__animated animate__zoomOutDown"> -->
                <div v-for="num in 10" v-show="item== num-1" :key="num" class="card-item" :class="{'disabled': props.selfDisabled}">{{num-1}}</div>
            </transition-group>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
  val: {
    type: Array,
    default: () => ["0", "0"],
  },
  size: {
    type: Number,
    default: 16,
  },
  selfDisabled: {
    type: Boolean,
    default: false,
  }
});

</script>

<style lang="scss" scoped>
.aimate-card {
    width: auto;
    display: inline-block;
    height: 100%;
    .card-group {
        display: inline-block;
        position: relative;
        width: 40px;
        padding: 5px;
        height: 100%;
        vertical-align: middle;
        .card-item {
            position: absolute;
            background: #3a7fe4;
            color: #fff;
            width: 30px;
            height: 40px;
            top: -20px;
            line-height: 40px;
        }
        .disabled {
            background: #ccc !important;
        }
    }
}
</style>
