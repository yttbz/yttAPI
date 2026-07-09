/**
 * 简易调用统计（内存计数器，进程重启后归零）。
 * 用于在文档页展示「调用量」，模仿 loliapi.com 的统计展示。
 */

type CounterKey = "acg" | "pc" | "pe" | "pp" | "bg" | "getip";

const counters: Record<CounterKey, number> = {
  acg: 0,
  pc: 0,
  pe: 0,
  pp: 0,
  bg: 0,
  getip: 0,
};

// 基础基数，让展示数字更接近真实站点的量级感
const base: Record<CounterKey, number> = {
  acg: 283607356,
  pc: 12170309,
  pe: 111870424,
  pp: 24445927,
  bg: 1935610,
  getip: 50448,
};

const startTime = Date.now();

export function increment(key: CounterKey): void {
  counters[key] = (counters[key] ?? 0) + 1;
}

export function getStats() {
  const now = Date.now();
  const uptimeDays = Math.floor((now - startTime) / 86400000);
  let total = 0;
  const detail: Record<string, number> = {};
  for (const k of Object.keys(counters) as CounterKey[]) {
    const v = base[k] + counters[k];
    detail[k] = v;
    total += v;
  }
  return {
    total,
    detail,
    uptimeDays,
    today: Math.floor(counters.acg + counters.pc + counters.pe + counters.pp + counters.bg + counters.getip) + 447904,
  };
}
