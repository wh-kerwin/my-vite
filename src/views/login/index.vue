<template>
    <div class="login-container">
        <!-- 科技感背景 -->
        <div class="bg-effects">
            <canvas id="canvas"></canvas>
            <div class="grid-overlay"></div>
            <div class="glow-orb orb-1"></div>
            <div class="glow-orb orb-2"></div>
            <div class="floating-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
            </div>
        </div>
        
        <!-- 登录卡片 -->
        <div class="login-card">
            <div class="card-glow"></div>
            <div class="login-header">
                <div class="logo-wrapper">
                    <div class="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h1 class="title">My Vite</h1>
                </div>
                <p class="subtitle">企业级管理后台系统</p>
            </div>
            
            <el-form class="login-form" :model="form" @submit.prevent="handleLogin">
                <div class="form-group">
                    <el-input 
                        v-model="form.username" 
                        placeholder="用户名" 
                        size="large"
                        :prefix-icon="User"
                        class="tech-input"
                    />
                </div>
                <div class="form-group">
                    <el-input 
                        v-model="form.password" 
                        type="password" 
                        placeholder="密码" 
                        size="large"
                        :prefix-icon="Lock"
                        show-password
                        class="tech-input"
                    />
                </div>
                <div class="form-options">
                    <el-checkbox v-model="form.remember">记住我</el-checkbox>
                    <span class="forgot-link">忘记密码?</span>
                </div>
                <el-button 
                    type="primary" 
                    size="large" 
                    class="login-btn"
                    :loading="loading"
                    @click="handleLogin"
                >
                    <span v-if="!loading">立即登录</span>
                    <span v-else>登录中...</span>
                </el-button>
            </el-form>
        </div>
        
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
import { ref, onMounted } from "vue";
// import LoginForm from "./components/LoginForm.vue";
import LoginText from "./components/LoginText.vue";
// import { concurrencyRequest } from "@/utils/maxResquest";
import { renderCanvas } from "./mouseCanvas";
import { User, Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { setToken } from "@/utils/auth";

const router = useRouter();
const loading = ref(false);
const form = ref({
  username: "admin",
  password: "123456",
  remember: true
});

const handleLogin = async () => {
  loading.value = true;
  // 模拟登录
  setTimeout(() => {
    loading.value = false;
    setToken("3333");
    router.push("/");
  }, 1500);
};

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
    background: hsl(var(--background));
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

// 背景特效
.bg-effects {
    position: absolute;
    inset: 0;
    z-index: 0;
    
    canvas {
        display: block;
        position: absolute;
        inset: 0;
    }
    
    .grid-overlay {
        position: absolute;
        inset: 0;
        background-image: 
            linear-gradient(hsl(var(--primary) / 0.03) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        animation: gridMove 20s linear infinite;
    }
    
    @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
    }
    
    .glow-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        animation: float 8s ease-in-out infinite;
        
        &.orb-1 {
            width: 500px;
            height: 500px;
            background: hsl(var(--primary) / 0.25);
            top: -150px;
            left: -150px;
            animation-delay: 0s;
        }
        
        &.orb-2 {
            width: 400px;
            height: 400px;
            background: hsl(var(--success) / 0.2);
            bottom: -100px;
            right: -100px;
            animation-delay: -4s;
        }
    }
    
    @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(30px, -30px) scale(1.1); }
    }
    
    .floating-shapes {
        position: absolute;
        inset: 0;
        overflow: hidden;
        
        .shape {
            position: absolute;
            border: 1px solid hsl(var(--primary) / 0.2);
            animation: rotate 20s linear infinite;
            
            &.shape-1 {
                width: 200px;
                height: 200px;
                top: 10%;
                left: 10%;
                border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            }
            
            &.shape-2 {
                width: 150px;
                height: 150px;
                bottom: 20%;
                right: 15%;
                border-radius: 50%;
                animation-duration: 15s;
                animation-direction: reverse;
            }
            
            &.shape-3 {
                width: 100px;
                height: 100px;
                top: 60%;
                left: 60%;
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                animation-duration: 25s;
            }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    }
}

// 登录卡片
.login-card {
    position: relative;
    z-index: 10;
    width: 420px;
    padding: 48px 40px;
    background: hsl(var(--card) / 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius, 16px);
    box-shadow: 
        0 0 0 1px hsl(var(--primary) / 0.1),
        0 25px 50px -12px hsl(var(--primary) / 0.25);
    animation: cardAppear 0.6s ease-out;
    
    @keyframes cardAppear {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .card-glow {
        position: absolute;
        inset: -1px;
        border-radius: var(--radius, 16px);
        background: linear-gradient(135deg, hsl(var(--primary) / 0.15), transparent, hsl(var(--success) / 0.08));
        z-index: -1;
        filter: blur(20px);
        opacity: 0.6;
    }
}

.login-header {
    text-align: center;
    margin-bottom: 36px;
    
    .logo-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 12px;
        
        .logo-icon {
            width: 48px;
            height: 48px;
            color: hsl(var(--primary));
            animation: logoGlow 2s ease-in-out infinite;
            
            svg {
                width: 100%;
                height: 100%;
            }
        }
        
        @keyframes logoGlow {
            0%, 100% { filter: drop-shadow(0 0 8px hsl(var(--primary) / 0.5)); }
            50% { filter: drop-shadow(0 0 16px hsl(var(--primary) / 0.8)); }
        }
        
        .title {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--primary)));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
            letter-spacing: -0.5px;
        }
    }
    
    .subtitle {
        color: hsl(var(--muted-foreground));
        font-size: 14px;
        margin: 0;
    }
}

.login-form {
    .form-group {
        margin-bottom: 20px;
    }
    
    .tech-input {
        :deep(.el-input__wrapper) {
            background: hsl(var(--input));
            border: 1px solid hsl(var(--border));
            border-radius: var(--radius, 10px);
            padding: 4px 16px;
            box-shadow: none;
            transition: all 0.3s ease;
            
            &:hover {
                border-color: hsl(var(--primary) / 0.5);
            }
            
            &.is-focus {
                border-color: hsl(var(--primary));
                box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
            }
        }
        
        :deep(.el-input__inner) {
            color: hsl(var(--foreground));
            
            &::placeholder {
                color: hsl(var(--muted-foreground));
            }
        }
        
        :deep(.el-input__prefix) {
            color: hsl(var(--muted-foreground));
        }
    }
    
    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        
        :deep(.el-checkbox__label) {
            color: hsl(var(--muted-foreground));
        }
        
        .forgot-link {
            color: hsl(var(--primary));
            font-size: 14px;
            cursor: pointer;
            transition: color 0.2s;
            
            &:hover {
                color: hsl(var(--primary-hover));
            }
        }
    }
    
    .login-btn {
        width: 100%;
        height: 48px;
        border-radius: var(--radius, 10px);
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
        border: none;
        color: hsl(var(--primary-foreground));
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px -6px hsl(var(--primary));
        }
        
        &:active {
            transform: translateY(0);
        }
    }
}

// 响应式
@media screen and (max-width: 500px) {
    .login-card {
        width: calc(100% - 32px);
        padding: 32px 24px;
        margin: 16px;
    }
    
    .login-header .logo-wrapper .title {
        font-size: 24px;
    }
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
  