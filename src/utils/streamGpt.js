export class TypeWriter {
  constructor(onConsume) {
    this.queue = [];
    this.comsuming = false;
    this.timer = null;
    this.onConsume = onConsume;
  }

  dynamicSpeed() {
    const speed =  2000 / this.queue.length;
    return speed > 200 ? 200 : speed;
  }

  add(str) {
    if(!str) {return;}
    this.queue.push(str);
  }

  comsume() {
    if(this.queue.length > 0) {
      const str = this.queue.shift();
      str && this.onConsume(str);
    }
  }

  next() {
    this.onConsume();
    this.timer = setTimeout(() => {
      this.comsume();
      if(this.comsuming) {
        this.next();
      }
    }, this.dynamicSpeed());
  }

  start() {
    this.comsuming = true;
    this.next();
  }

  stop() {
    this.comsuming = false;
    clearTimeout(this.timer);
    this.onConsume(this.queue.push(""));
    this.queue = [];
  }
}

const parsePack = (str) => {
  const regex = /data:\s*({.*?})\s*\n/g;
  const result = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    const data = match[1];
    try {
      const json = JSON.parse(data);
      result.push(json);
    } catch (error) {
      console.error("Invalid JSON:", data);
    }
  }
  return result;
};
export class StreamGpt {
  constructor(model, options) {
    this.model = model;
    const { onStart, onCreated, onDone, onPatch } = options;
    this.onStart = onStart;
    this.onCreated = onCreated;
    this.onPatch = onPatch;
    this.onDone = onDone;
  }

  async stream(prompt, history = [], preset = []) {
    let finish = false;
    let count = 0;
    const _history = history ? [...history] : [];
    this.onStart(prompt);
    const res = await this.fetch([...preset, ..._history, { role: "user", content: prompt }]);
    if(!res.body) {return;}
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    while(!finish) {
      const { done, value } = await reader.read();
      if(done) {
        finish = true;
        this.onDone();
        break;
      }
      count++;
      const jsonArray = parsePack(decoder.decode(value));
      if(count === 1) {this.onCreated();}
      jsonArray.forEach((json) => {
        if(json.choices && json.choices.length > 0) {
          const content = json.choices[0].delta.content;
          if(content) {
            this.onPatch(content);
          }
        }
      });
    }
  }

  async fetch(messages) {
    return await fetch(this.model.url, {
      method: "POST",
      body: JSON.stringify({
        model: this.model.model,
        messages,
        stream: true
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${this.model.key}`
      }
    });
  }
}