export async function getSystemFonts(): Promise<string[]> {
  try {
    // 使用 FontFace API 获取可用字体
    // @ts-ignore
    if (window.queryLocalFonts) {
      // @ts-ignore
      const availableFonts = await window.queryLocalFonts();
      return [...new Set(availableFonts.map((font: any) => font.family))];
    } else {
      // 降级方案：返回常用中文字体列表
      return [
        'SimSun', // 宋体
        'SimHei', // 黑体
        'Microsoft YaHei', // 微软雅黑
        'KaiTi', // 楷体
        'FangSong', // 仿宋
        'STHeiti', // 华文黑体
        'STKaiti', // 华文楷体
        'STSong', // 华文宋体
        'STFangsong', // 华文仿宋
        'LiSu', // 隶书
        'YouYuan', // 幼圆
        'STZhongsong', // 华文中宋
        'STXihei', // 华文细黑
        'Arial',
        'Times New Roman',
        'Helvetica'
      ];
    }
  } catch (error) {
    console.error('获取系统字体失败:', error);
    return ['SimSun', 'SimHei', 'Microsoft YaHei', 'KaiTi'];
  }
} 