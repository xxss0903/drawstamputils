// 初始化公共模板脚本
// 使用方法: node scripts/init-from-r2.js

// 这个脚本通过调用 Workers API 来初始化公共模板
// 需要先部署 Workers，然后运行此脚本

const API_URL = process.env.API_URL || 'http://127.0.0.1:8787';

async function initPublicTemplates() {
  try {
    console.log('开始初始化公共模板...');
    console.log(`API URL: ${API_URL}`);

    const response = await fetch(`${API_URL}/api/admin/init-public-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ 初始化成功！');
      console.log(`处理结果: ${data.message}`);
      
      if (data.data.results) {
        console.log('\n成功处理的模板:');
        data.data.results.forEach((result) => {
          console.log(`  - ${result.name}: ${result.status} (ID: ${result.id})`);
        });
      }

      if (data.data.errors && data.data.errors.length > 0) {
        console.log('\n错误:');
        data.data.errors.forEach((error) => {
          console.log(`  - ${error}`);
        });
      }
    } else {
      console.error('❌ 初始化失败:', data.error);
      if (data.message) {
        console.error('提示:', data.message);
      }
      if (data.data) {
        console.error('调试信息:', JSON.stringify(data.data, null, 2));
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 请求失败:', error);
    process.exit(1);
  }
}

initPublicTemplates();

