// 列出 R2 中的文件脚本
// 使用方法: node scripts/list-r2-files.js [prefix]

const API_URL = process.env.API_URL || 'http://127.0.0.1:8787';
const prefix = process.argv[2] || '';

async function listFiles() {
  try {
    const url = `${API_URL}/api/admin/list-files${prefix ? `?prefix=${encodeURIComponent(prefix)}` : ''}`;
    console.log(`正在列出文件... (前缀: ${prefix || '无'})`);
    console.log(`API URL: ${url}`);

    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      console.log(`\n✅ 找到 ${data.data.total} 个文件:\n`);
      data.data.files.forEach((file, index) => {
        console.log(`${index + 1}. ${file.key} (${(file.size / 1024).toFixed(2)} KB)`);
      });
    } else {
      console.error('❌ 列出文件失败:', data.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 请求失败:', error);
    process.exit(1);
  }
}

listFiles();

