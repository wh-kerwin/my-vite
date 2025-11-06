<template>
    <div class="login-container">
        <canvas id="canvas"></canvas>
        <login-text />
        <!-- <div class="login-box">
            <SwitchDark class="dark" />
            <div class="login-left">
                <img class="login-left-img" src="@/assets/images/login_left.png" alt="login" />
            </div>
            <div class="login-form">
                <div class="login-logo">
                    <img class="login-icon" src="@/assets/images/logo.svg" alt="" />
                    <h2 class="logo-text">Vue3-Admin</h2>
                </div>
                <LoginForm />
            </div>
        </div> -->
    </div>
</template>
  
<script setup>
import { onMounted } from "vue";
// import LoginForm from "./components/LoginForm.vue";
import LoginText from "./components/LoginText.vue";
// import { concurrencyRequest } from "@/utils/maxResquest";
import { renderCanvas } from "./mouseCanvas";

// Example usage:
// const urls = [
// "https://api.example.com/data10",
// "https://api.example.com/data11",
// "https://api.example.com/data12",
// "https://api.example.com/data13",
// "https://api.example.com/data14",
// "https://api.example.com/data15",
// "https://api.example.com/data16",
// "https://api.example.com/data17",
// "https://api.example.com/data18",
// "https://api.example.com/data19",
// "https://api.example.com/data20",
// "https://api.example.com/data21",
// "https://api.example.com/data22",
// "https://api.example.com/data23",
// "https://api.example.com/data24",
// "https://api.example.com/data25",
// ];

// const maxConcurrent = 5;

// const results = concurrencyRequest(urls, maxConcurrent);
// console.log(results);

onMounted(() => {
  renderCanvas();
});
</script>

<style lang="scss" scoped>
// @import "./index.scss";
.login-container {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #1e1e20;
}
canvas {
    display: block;
}
.login-box {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-left {
        width: 800px;
        margin-right: 10px;
        .login-left-img {
            width: 100%;
            height: 100%;
        }
    }
    .login-form {
        width: 420px;
        padding: 50px 40px 45px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;
        .login-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 45px;
            .login-icon {
                width: 60px;
                height: 52px;
            }
            .logo-text {
                padding: 0 0 0 25px;
                margin: 0;
                font-size: 42px;
                font-weight: bold;
                color: #94c0eb;
                white-space: nowrap;
            }
        }
        .el-form-item {
            margin-bottom: 40px;
        }
        .login-btn {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 40px;
            white-space: nowrap;
            .el-button {
            width: 185px;
            }
        }
        
    }
    
}
@media screen and (width <= 1250px) {
  .login-left {
    display: none;
  }
}

@media screen and (width <= 600px) {
  .login-form {
    width: 97% !important;
  }
}

</style>
  