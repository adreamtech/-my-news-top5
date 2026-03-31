const hotVideos = [
  {
    platform: "抖音",
    title: "清明小长假热门旅游地实时热度榜",
    desc: "旅行、城市夜景、特种兵旅游玩法相关视频持续上升。",
    heat: "热度 986w",
    link: "https://www.douyin.com/hot"
  },
  {
    platform: "B站",
    title: "AI Agent 实战项目 24 小时冲榜",
    desc: "技术区与知识区高播放内容，评论区讨论活跃。",
    heat: "播放 412w",
    link: "https://www.bilibili.com/v/popular/all"
  },
  {
    platform: "快手",
    title: "春耕与乡村生活短视频热榜",
    desc: "三农题材增长明显，本地生活内容互动高。",
    heat: "热榜 TOP 3",
    link: "https://www.kuaishou.com/hot"
  },
  {
    platform: "微博",
    title: "#电视剧名场面二创#",
    desc: "热门综艺和影视剪辑话题占据视频榜单前列。",
    heat: "话题阅读 12.3亿",
    link: "https://s.weibo.com/top/summary"
  },
  {
    platform: "小红书",
    title: "通勤穿搭与春日妆容趋势",
    desc: "女性生活方式与种草类短视频集中上榜。",
    heat: "热搜持续上升",
    link: "https://www.xiaohongshu.com/explore"
  }
];

const platformFilter = document.querySelector("#platformFilter");
const feed = document.querySelector("#feed");
const updatedAt = document.querySelector("#updatedAt");
const keywordInput = document.querySelector("#keywordInput");
const searchButton = document.querySelector("#searchButton");
const installButton = document.querySelector("#installButton");

const platforms = ["全部", ...new Set(hotVideos.map(item => item.platform))];
let activePlatform = "全部";
let deferredPrompt = null;

function renderChips() {
  platformFilter.innerHTML = "";
  platforms.forEach(platform => {
    const chip = document.createElement("button");
    chip.className = `platform-chip ${platform === activePlatform ? "active" : ""}`;
    chip.textContent = platform;
    chip.onclick = () => {
      activePlatform = platform;
      renderChips();
      renderFeed();
    };
    platformFilter.appendChild(chip);
  });
}

function getFilteredData() {
  if (activePlatform === "全部") {
    return hotVideos;
  }
  return hotVideos.filter(item => item.platform === activePlatform);
}

function renderFeed() {
  feed.innerHTML = "";
  getFilteredData().forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "video-card";
    card.innerHTML = `
      <div class="meta">
        <span>${item.platform}</span>
        <span>#${String(index + 1).padStart(2, "0")} · ${item.heat}</span>
      </div>
      <h2>${item.title}</h2>
      <p>${item.desc}</p>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer">查看原平台</a>
    `;
    feed.appendChild(card);
  });
}

function openAllSearch(keyword) {
  const encoded = encodeURIComponent(keyword);
  const urls = [
    `https://www.douyin.com/search/${encoded}`,
    `https://search.bilibili.com/all?keyword=${encoded}`,
    `https://www.kuaishou.com/search/video?searchKey=${encoded}`,
    `https://s.weibo.com/weibo?q=${encoded}`,
    `https://www.xiaohongshu.com/search_result/${encoded}`
  ];

  urls.forEach((url, idx) => {
    setTimeout(() => window.open(url, "_blank"), idx * 120);
  });
}

searchButton.addEventListener("click", () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    alert("请输入关键词后再搜索");
    return;
  }
  openAllSearch(keyword);
});

keywordInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

updatedAt.textContent = `最后更新：${new Date().toLocaleString("zh-CN", { hour12: false })}`;
renderChips();
renderFeed();
