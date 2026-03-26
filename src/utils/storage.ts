import Taro from "@tarojs/taro";
export const storage = {
  get: (key: string): any => { try { const v = Taro.getStorageSync(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (key: string, val: any): void => { try { Taro.setStorageSync(key, JSON.stringify(val)); } catch {} },
};
export function generateId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
export function formatTime(iso: string): string { const d = new Date(iso); return d.getMonth()+1+"月"+d.getDate()+"日 "+d.getHours()+":"+String(d.getMinutes()).padStart(2,"0"); }
export function getRiskInfo(score: number) {
  const list = [
    {max:20,level:"safe",emoji:"✅",color:"#22c55e",bg:"#f0fdf4",desc:"你的职场环境相对健康"},
    {max:40,level:"mild",emoji:"🔆",color:"#84cc16",bg:"#f7fdf0",desc:"存在轻度压力信号"},
    {max:60,level:"moderate",emoji:"⚠️",color:"#f59e0b",bg:"#fffbeb",desc:"有明确的PUA行为，建议重视"},
    {max:80,level:"severe",emoji:"🚨",color:"#f97316",bg:"#fff7ed",desc:"处境比较危险，请务必重视"},
    {max:101,level:"danger",emoji:"🆘",color:"#ef4444",bg:"#fef2f2",desc:"建议立即寻求外部支持"},
  ];
  return list.find(r => score < (r as any).max) || list[list.length-1];
}
