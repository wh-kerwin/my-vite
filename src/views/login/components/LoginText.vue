<template>
    <div class="typewriter-box">
        <div class="typewriter">
            <div class="text" @click="loginFn">
                点击，<span class="Chinese">登录</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { setToken } from "@/utils/auth";
const router = useRouter();

const loginFn = () => {
  setToken("3333");
  router.push({ path: "/dashboard" });
};
</script>
  
<style lang="scss" scoped>
.typewriter-box {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    // pointer-events: none;
}

.text {
    overflow: hidden;
    white-space: nowrap;
    animation: typeEffect 1s steps(70);
    font-size: 24px;
    background: linear-gradient(-60deg, #bdd62e 0, #e23232 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;

    cursor: pointer;
    @media (max-width: 900px) {
        font-size: 20px;
    }
    @media (max-width: 500px) {
        font-size: 16px;
    }
    font-weight: bold;
}

.Chinese {
    letter-spacing: 0.05em;
}

@keyframes typeEffect {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}
</style>