/**
 * @description: 控制并发请求
 * @param {*} urls
 * @param {*} maxNum
 * @return {*}
 */
export function concurrencyRequest(urls, maxNum) {
  let results = new Array(urls.length);
  let current = 0;
  let index = 0;

  function processUrl(url) {
    current++;
    const i = index++;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        results[i] = data;
        current--;
        if (current < maxNum && index < urls.length) {
          processUrl(urls[index]);
        }
      })
      .catch((error) => {
        results[i] = error;
        current--;
        if (current < maxNum && index < urls.length) {
          processUrl(urls[index]);
        }
      });
  }

  while (current < maxNum && index < urls.length) {
    processUrl(urls[index]);
    // index++;
  }

  return results;
}
/**
 * @description: 并发任务控制
 * @return {*}
 */
// eslint-disable-next-line no-unused-vars
function task(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`任务${id}完成`);
      resolve();
    }, Math.random() * 1000);
  });
}

const taskQuene = []; // 任务队列
const maxNum = 3; // 最大并发数
const priority = {
  low: 1,
  middle: 2,
  high: 3,
}; // 优先级队列

class TaskManager {
  constructor() {
    this.runningTasks = 0;
    this.taskQueue = taskQuene;
    this.maxNum = maxNum;
    this.priority = priority;
  }

  addTask(task, priority) {
    this.taskQueue.add({task, priority});
    this.runTask();
  }

  runTask() {
    while (this.runningTasks < this.maxNum && this.taskQueue.size > 0) {
      this.taskQueue.sort((a, b) => b.priority - a.priority); // 按优先级排序
      const currentTask = this.taskQueue.shift(); // 出队
      this.runningTasks++;
      currentTask.task()
        .then(() => {
          this.runningTasks--;
          this.runTask();
        })
        .catch(() => {
          this.runningTasks--;
          this.runTask();
        });
    }
  }
}

export default TaskManager;

// const taskManager = new TaskManager();

// // 添加任务到任务队列
// for (let i = 0; i < 10; i++) {
//   taskManager.addTask(task(i), priority.middle);
// }

// // 添加高优先级任务到任务队列
// for (let i = 0; i < 5; i++) {
//   taskManager.addTask(task(i + 10), priority.high);
// }

// // 添加低优先级任务到任务队列
// for (let i = 0; i < 15; i++) {
//   taskManager.addTask(task(i + 20), priority.low);
// }