<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="logo">DRAWSTAMP</div>
      <div class="nav-links">
        <a href="#about">About us</a>
        <a href="#tokenomics">Tokenomics</a>
        <a href="#roadmap">Roadmap</a>
        <a href="#hangout">Hang out with us</a>
      </div>
      <div class="social-icons">
        <a href="#" class="icon instagram">
          <div class="icon-bg"></div>
        </a>
        <a href="#" class="icon twitter">
          <div class="icon-bg"></div>
        </a>
        <a href="#" class="icon discord">
          <div class="icon-bg"></div>
        </a>
      </div>
    </nav>

    <main class="main-content">
      <h1 class="title">LET'S DRAW YOUR STAMP</h1>
      <div class="stamp-container">
        <div class="stamp-layer-container"></div>
        <div class="stamp-canvas-container">
          <canvas ref="stampCanvas" class="stamp-canvas"></canvas>
        </div>
        <div class="stamp-settings-container"></div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  flex: 1;
  border-radius: 24px;
  border: 1px solid #000;
  background-color: #E69964;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 12px 4px #333333;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 60px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #000;
  text-decoration: none;
  font-weight: 500;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.icon {
  width: 40px;
  height: 40px;
  background: #B4D7E5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem 2rem 2rem;
}

.title {
  font-weight: bold;
  color: #FFF;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  margin: 2rem 0;
  text-align: center;
}

.btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn:hover {
  transform: scale(1.05);
}

.airdrop {
  background-color: #E15B5B;
  color: white;
}

.who-am-i {
  background-color: #F5F5F5;
  color: #000;
}

/* 场景样式 */
.scene {
  position: relative;
  width: 100%;
  height: 50vh;
  margin-top: 2rem;
}

.mountains {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

.mountain {
  width: 200px;
  height: 300px;
  background-color: #B4D7E5;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.house {
  position: absolute;
  left: 50%;
  bottom: 20%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
}

.house .roof {
  width: 100%;
  height: 80px;
  background-color: #E15B5B;
  clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
}

.house .body {
  width: 100%;
  height: 120px;
  background-color: #E15B5B;
  position: relative;
}

.window {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: #F5F5F5;
  top: 20px;
}

.window:first-child {
  left: 30px;
}

.window:nth-child(2) {
  right: 30px;
}

.door {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 60px;
  background-color: #4A4A4A;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .mountain {
    width: 150px;
    height: 200px;
  }
  
  .house {
    width: 150px;
    height: 150px;
  }
}
</style>

<script setup lang="ts">
// 可以在这里添加交互逻辑
</script>