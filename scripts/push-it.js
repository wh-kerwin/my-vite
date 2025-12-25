#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// ANSI 颜色代码
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  gray: '\x1b[90m',
};

// 日志函数
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.gray}${msg}${colors.reset}`),
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

// 添加所有更改
const addChanges = () => {
  log.step('\n➕ 添加所有更改到暂存区...');
  exec('git add -A');
  log.success('已添加所有更改');
};

// 提交更改
const commitChanges = () => {
  log.step('\n📦 创建提交...');

  // 生成自动提交消息
  const branch = getCurrentBranch();
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const commitMessage = `chore: 自动提交 (${timestamp})`;

  exec(`git commit -m "${commitMessage}"`);
  log.success(`已提交: ${commitMessage}`);
};

// 推送到远程
const pushChanges = () => {
  log.step('\n🚀 推送到远程仓库...');

  const branch = getCurrentBranch();
  const remote = 'origin';

  exec(`git push ${remote} ${branch}`);
  log.success(`已推送至 ${remote}/${branch}`);
};

// 主函数
const main = async () => {
  console.log('\n' + '='.repeat(50));
  log.info('🎯 Git 自动提交推送工具');
  console.log('='.repeat(50) + '\n');

  try {
    // 1. 检查更改
    if (!checkChanges()) {
      process.exit(0);
    }

    // 2. 显示更改
    showChanges();

    // 3. 添加更改
    addChanges();

    // 4. 提交更改
    commitChanges();

    // 5. 推送更改
    pushChanges();

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
