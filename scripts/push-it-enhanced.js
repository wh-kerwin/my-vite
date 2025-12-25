#!/usr/bin/env node

import { execSync } from "child_process";

// ANSI 颜色代码
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
};

// 日志函数
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.gray}${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
};

// 执行命令
const exec = (command) => {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (error) {
    if (error.stdout) {
      return error.stdout.trim();
    }
    throw error;
  }
};

// 检查是否有待提交的更改
const checkChanges = () => {
  const status = exec('git status --porcelain');
  if (!status) {
    log.warn('没有需要提交的更改');
    return false;
  }
  return true;
};

// 显示更改的文件
const showChanges = () => {
  log.step('\n📝 检测到以下更改:');
  const status = exec('git status --short');
  console.log(status);
};

// 获取当前的分支名称
const getCurrentBranch = () => {
  return exec('git rev-parse --abbrev-ref HEAD');
};

// 添加指定文件或所有更改
const addChanges = (files) => {
  log.step('\n➕ 添加更改到暂存区...');
  if (files && files.length > 0) {
    files.forEach(file => {
      exec(`git add ${file}`);
      log.success(`已添加: ${file}`);
    });
  } else {
    exec('git add -A');
    log.success('已添加所有更改');
  }
};

// 提交更改
const commitChanges = (message) => {
  log.step('\n📦 创建提交...');

  const commitMessage = message || `chore: 自动提交 (${new Date().toLocaleString('zh-CN')})`;
  exec(`git commit -m "${commitMessage}"`);
  log.success(`提交消息: ${commitMessage}`);
};

// 推送到远程
const pushChanges = (remote, branch) => {
  log.step('\n🚀 推送到远程仓库...');
  exec(`git push ${remote} ${branch}`);
  log.success(`已推送至 ${remote}/${branch}`);
};

// 显示帮助信息
const showHelp = () => {
  console.log(`
${colors.cyan}用法:${colors.reset}
  pnpm push-it [选项] [文件...]

${colors.cyan}选项:${colors.reset}
  -m, --message <msg>    自定义提交消息
  -b, --branch <branch>  指定推送分支 (默认: 当前分支)
  -r, --remote <remote>  指定远程仓库 (默认: origin)
  -h, --help             显示帮助信息

${colors.cyan}示例:${colors.reset}
  pnpm push-it                           # 添加所有更改并推送
  pnpm push-it -m "fix: 修复bug"          # 使用自定义消息
  pnpm push-it src/                      # 只添加 src 目录
  pnpm push-it -m "feat: 新功能" src/    # 自定义消息 + 指定文件
  pnpm push-it -r upstream -b develop    # 指定远程和分支

${colors.cyan}快捷命令:${colors.reset}
  pnpm push-it:fix <msg>    # 使用 "fix: <msg>" 作为提交消息
  pnpm push-it:feat <msg>   # 使用 "feat: <msg>" 作为提交消息
  pnpm push-it:refactor <msg>  # 使用 "refactor: <msg>" 作为提交消息
`);
};

// 主函数
const main = async () => {
  const args = process.argv.slice(2);

  // 检查是否显示帮助
  if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    return;
  }

  console.log('\n' + '='.repeat(50));
  log.header('🎯 Git 自动提交推送工具 (增强版)');
  console.log('='.repeat(50) + '\n');

  try {
    // 解析参数
    let customMessage = null;
    let remote = 'origin';
    let branch = getCurrentBranch();
    let files = [];

    let i = 0;
    while (i < args.length) {
      const arg = args[i];

      if (arg === '-m' || arg === '--message') {
        customMessage = args[++i];
      } else if (arg === '-r' || arg === '--remote') {
        remote = args[++i];
      } else if (arg === '-b' || arg === '--branch') {
        branch = args[++i];
      } else if (!arg.startsWith('-')) {
        files.push(arg);
      }
      i++;
    }

    // 1. 检查更改
    if (!checkChanges()) {
      process.exit(0);
    }

    // 2. 显示更改
    showChanges();

    // 3. 添加更改
    addChanges(files.length > 0 ? files : null);

    // 4. 提交更改
    commitChanges(customMessage);

    // 5. 推送更改
    pushChanges(remote, branch);

    // 完成
    console.log('\n' + '='.repeat(50));
    log.success('✅ 所有操作已完成！');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.log('\n' + '='.repeat(50));
    log.error('❌ 操作失败！');
    log.error(error.message);
    console.log('='.repeat(50) + '\n');
    process.exit(1);
  }
};

main();
