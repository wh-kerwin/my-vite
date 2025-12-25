# Git 自动提交推送工具

一组便捷的 npm 脚本，用于快速执行 git 提交和推送操作。

## 基础命令

### `pnpm push-it`
一键提交并推送所有更改到 GitHub。

```bash
pnpm push-it
```

**功能：**
- ✅ 自动添加所有更改的文件
- ✅ 自动生成提交消息（包含时间戳）
- ✅ 自动推送到远程仓库
- ✅ 显示详细的操作日志

---

## 增强版命令

### `pnpm push-it:enhanced`
增强版，支持更多自定义选项。

```bash
# 基本用法（同 push-it）
pnpm push-it:enhanced

# 自定义提交消息
pnpm push-it:enhanced -m "feat: 添加新功能"

# 只提交指定文件
pnpm push-it:enhanced src/views/

# 指定远程仓库和分支
pnpm push-it:enhanced -r upstream -b develop

# 组合使用
pnpm push-it:enhanced -m "fix: 修复bug" src/components/
```

**选项：**
- `-m, --message <msg>` - 自定义提交消息
- `-b, --branch <branch>` - 指定推送分支（默认：当前分支）
- `-r, --remote <remote>` - 指定远程仓库（默认：origin）
- `-h, --help` - 显示帮助信息

---

## 快捷命令

### `pnpm push-it:fix`
快速提交修复。

```bash
pnpm push-it:fix "修复登录问题"
# 提交消息: "fix: 修复登录问题"
```

### `pnpm push-it:feat`
快速提交新功能。

```bash
pnpm push-it:feat "添加暗黑模式"
# 提交消息: "feat: 添加暗黑模式"
```

### `pnpm push-it:refactor`
快速提交重构。

```bash
pnpm push-it:refactor "优化组件结构"
# 提交消息: "refactor: 优化组件结构"
```

---

## 使用示例

### 场景 1：日常开发
完成工作后，一键提交推送：
```bash
pnpm push-it
```

### 场景 2：修复 Bug
```bash
pnpm push-it:fix "修复首页加载失败问题"
```

### 场景 3：添加新功能
```bash
pnpm push-it:feat "添加用户头像上传功能"
```

### 场景 4：只提交特定文件
```bash
pnpm push-it:enhanced -m "更新文档" README.md
```

### 场景 5：推送到特定分支
```bash
pnpm push-it:enhanced -m "测试环境更新" -b test-branch
```

---

## 注意事项

1. **自动提交消息**：如果不指定消息，会自动生成包含时间戳的提交消息
2. **文件添加**：默认添加所有更改（`git add -A`），可以通过指定文件路径来限制
3. **远程推送**：默认推送到 `origin/main`，可以通过选项修改
4. **权限**：确保已配置 SSH 密钥或已登录 GitHub

---

## 输出示例

```
==================================================
🎯 Git 自动提交推送工具
==================================================

[INFO] 📝 检测到以下更改:
M src/App.vue
A src/components/NewFeature.vue

ℹ️ ➕ 添加所有更改到暂存区...
✅ 已添加所有更改

ℹ️ 📦 创建提交...
✅ 提交消息: chore: 自动提交 (2025-12-25 14:30:25)

ℹ️ 🚀 推送到远程仓库...
✅ 已推送至 origin/main

==================================================
✅ 所有操作已完成！
==================================================
```
