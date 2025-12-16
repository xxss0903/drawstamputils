// 字体名称映射：英文字体名称 -> 中文显示名称
export function getFontDisplayName(fontName: string): string {
  const fontNameMap: Record<string, string> = {
    // GB2312 国标字体
    'SimSun': '宋体 (GB2312)',
    'SimHei': '黑体 (GB2312)',
    'KaiTi_GB2312': '楷体 (GB2312)',
    'FangSong_GB2312': '仿宋 (GB2312)',
    'SimLi': '隶书 (GB2312)',
    'NSimSun': '新宋体 (GB2312)',
    
    // 常用中文字体
    'Microsoft YaHei': '微软雅黑',
    'KaiTi': '楷体',
    'FangSong': '仿宋',
    'LiSu': '隶书',
    'YouYuan': '幼圆',
    
    // 华文字体系列
    'STHeiti': '华文黑体',
    'STKaiti': '华文楷体',
    'STSong': '华文宋体',
    'STFangsong': '华文仿宋',
    'STZhongsong': '华文中宋',
    'STXihei': '华文细黑',
    'STHupo': '华文琥珀',
    'STLiti': '华文隶书',
    'STXingkai': '华文行楷 (书法)',
    'STXinwei': '华文新魏 (书法)',
    'STCaiyun': '华文彩云',
    'STLiti': '华文隶书 (书法)',
    'LiSu': '隶书 (书法)',
    'SimLi': '隶书 (GB2312) (书法)',
    // 篆书字体（如果系统已安装）
    'FZZhuan': '方正篆书',
    'HYZhuan': '汉仪篆书',
    'STZhuan': '华文篆书',
    'ZhuanShu': '篆书',
    
    // 方正字体系列
    'FZShuTi': '方正舒体',
    'FZYaoti': '方正姚体',
    'FZHei-B01S': '方正黑体',
    'FZKai-Z03S': '方正楷体',
    'FZSong': '方正宋体',
    
    // 其他中文字体
    'PMingLiU': '新细明体',
    'MingLiU': '细明体',
    'DFKai-SB': '标楷体',
    'BiauKai': '标楷体',
    'Microsoft JhengHei': '微软正黑体',
    'Microsoft JhengHei UI': '微软正黑体 UI',
    'Microsoft YaHei UI': '微软雅黑 UI',
    'STSongti-SC-Regular': '华文宋体-简',
    'STHeiti-SC-Regular': '华文黑体-简',
    'STKaiti-SC-Regular': '华文楷体-简',
    'STFangsong-SC-Regular': '华文仿宋-简',
    'Songti SC': '宋体-简',
    'Kaiti SC': '楷体-简',
    'Heiti SC': '黑体-简',
    'STSongti-SC-Light': '华文宋体-简-细',
    'STHeiti-SC-Light': '华文黑体-简-细',
    'STKaiti-SC-Light': '华文楷体-简-细',
    'PingFang SC': '苹方-简',
    'Hiragino Sans GB': '冬青黑体简体中文',
    'WenQuanYi Micro Hei': '文泉驿微米黑',
    'WenQuanYi Zen Hei': '文泉驿正黑',
    'Noto Sans CJK SC': '思源黑体-简',
    'Source Han Sans SC': '思源黑体-简',
    'Source Han Serif SC': '思源宋体-简',
    'DengXian': '等线',
    'DengXian Light': '等线 Light',
    'Microsoft YaHei Light': '微软雅黑 Light',
    'Microsoft YaHei Bold': '微软雅黑 Bold',
    'SimSun-ExtB': '宋体-扩展B',
    
    // 常用英文字体（保持英文名称）
    'Arial': 'Arial',
    'Times New Roman': 'Times New Roman',
    'Helvetica': 'Helvetica',
    'Courier New': 'Courier New',
    'Verdana': 'Verdana',
    'Georgia': 'Georgia',
    'Tahoma': 'Tahoma',
    'Trebuchet MS': 'Trebuchet MS',
    'Comic Sans MS': 'Comic Sans MS',
    'Impact': 'Impact',
    'Lucida Console': 'Lucida Console',
    'Lucida Sans Unicode': 'Lucida Sans Unicode',
    'Palatino Linotype': 'Palatino Linotype',
    'Garamond': 'Garamond',
    'Bookman Old Style': 'Bookman Old Style',
    'Century Gothic': 'Century Gothic',
    'Franklin Gothic Medium': 'Franklin Gothic Medium'
  };
  
  return fontNameMap[fontName] || fontName;
}

// 获取常用中文字体列表（包含GB2312等国标字体）
function getChineseFonts(): string[] {
  return [
    // GB2312 国标字体
    'SimSun', // 宋体 (GB2312)
    'SimHei', // 黑体 (GB2312)
    'KaiTi_GB2312', // 楷体_GB2312
    'FangSong_GB2312', // 仿宋_GB2312
    'SimLi', // 隶书 (GB2312)
    'NSimSun', // 新宋体 (GB2312)
    
    // 常用中文字体
    'Microsoft YaHei', // 微软雅黑
    'KaiTi', // 楷体
    'FangSong', // 仿宋
    'LiSu', // 隶书
    'YouYuan', // 幼圆
    
    // 华文字体系列
    'STHeiti', // 华文黑体
    'STKaiti', // 华文楷体
    'STSong', // 华文宋体
    'STFangsong', // 华文仿宋
    'STZhongsong', // 华文中宋
    'STXihei', // 华文细黑
    'STHupo', // 华文琥珀
    'STLiti', // 华文隶书
    'STXingkai', // 华文行楷
    'STXinwei', // 华文新魏
    'STCaiyun', // 华文彩云
    // 篆书字体（如果系统已安装）
    'FZZhuan', // 方正篆书
    'HYZhuan', // 汉仪篆书
    'STZhuan', // 华文篆书
    'ZhuanShu', // 篆书
    
    // 方正字体系列
    'FZShuTi', // 方正舒体
    'FZYaoti', // 方正姚体
    'FZHei-B01S', // 方正黑体
    'FZKai-Z03S', // 方正楷体
    'FZSong', // 方正宋体
    
    // 其他中文字体
    'PMingLiU', // 新细明体
    'MingLiU', // 细明体
    'DFKai-SB', // 标楷体
    'BiauKai', // 标楷体
    'Microsoft JhengHei', // 微软正黑体
    'Microsoft JhengHei UI', // 微软正黑体 UI
    'Microsoft YaHei UI', // 微软雅黑 UI
    'STSongti-SC-Regular', // 华文宋体-简
    'STHeiti-SC-Regular', // 华文黑体-简
    'STKaiti-SC-Regular', // 华文楷体-简
    'STFangsong-SC-Regular', // 华文仿宋-简
    'Songti SC', // 宋体-简
    'Kaiti SC', // 楷体-简
    'Heiti SC', // 黑体-简
    'STSongti-SC-Light', // 华文宋体-简-细
    'STHeiti-SC-Light', // 华文黑体-简-细
    'STKaiti-SC-Light', // 华文楷体-简-细
    'PingFang SC', // 苹方-简
    'Hiragino Sans GB', // 冬青黑体简体中文
    'WenQuanYi Micro Hei', // 文泉驿微米黑
    'WenQuanYi Zen Hei', // 文泉驿正黑
    'Noto Sans CJK SC', // 思源黑体-简
    'Source Han Sans SC', // 思源黑体-简
    'Source Han Serif SC', // 思源宋体-简
    'DengXian', // 等线
    'DengXian Light', // 等线 Light
    'Microsoft YaHei Light', // 微软雅黑 Light
    'Microsoft YaHei Bold', // 微软雅黑 Bold
    'SimSun-ExtB' // 宋体-扩展B
  ];
}

export async function getSystemFonts(): Promise<string[]> {
  try {
    // 获取常用中文字体列表
    const chineseFonts = getChineseFonts();
    
    // 使用 FontFace API 获取可用字体
    // @ts-ignore
    if (window.queryLocalFonts) {
      // @ts-ignore
      const availableFonts = await window.queryLocalFonts();
      const systemFonts: string[] = Array.from(new Set(availableFonts.map((font: any) => String(font.family))));
      // 合并系统字体和常用中文字体，确保中文字体可用
      const allFonts: string[] = Array.from(new Set([...chineseFonts, ...systemFonts]));
      return allFonts.sort();
    } else {
      // 降级方案：返回常用中文字体列表 + 常用英文字体
      return [
        ...chineseFonts,
        // 常用英文字体
        'Arial',
        'Times New Roman',
        'Helvetica',
        'Courier New',
        'Verdana',
        'Georgia',
        'Tahoma',
        'Trebuchet MS',
        'Comic Sans MS',
        'Impact',
        'Lucida Console',
        'Lucida Sans Unicode',
        'Palatino Linotype',
        'Garamond',
        'Bookman Old Style',
        'Century Gothic',
        'Franklin Gothic Medium'
      ];
    }
  } catch (error) {
    console.error('获取系统字体失败:', error);
    // 返回最常用的中文字体和英文字体
    return [
      // GB2312 国标字体
      'SimSun', // 宋体 (GB2312)
      'SimHei', // 黑体 (GB2312)
      'KaiTi_GB2312', // 楷体_GB2312
      'FangSong_GB2312', // 仿宋_GB2312
      // 常用中文字体
      'Microsoft YaHei', // 微软雅黑
      'KaiTi', // 楷体
      'FangSong', // 仿宋
      'STHeiti', // 华文黑体
      'STKaiti', // 华文楷体
      'STSong', // 华文宋体
      // 常用英文字体
      'Arial',
      'Times New Roman',
      'Helvetica'
    ];
  }
} 