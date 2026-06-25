// 获取书签栏文件夹 ID (兼容中英文环境)
async function getBookmarksBarId() {
  // 优先使用固定 ID “1”（99% 的情况）
  try {
    const [node] = await chrome.bookmarks.get('1');
    if (node && node.parentId === '0') return '1';
  } catch (_) {}

  // 回退：从根目录的直接子文件夹中匹配标题
  const roots = await chrome.bookmarks.getChildren('0');
  for (const folder of roots) {
    if (folder.title === 'Bookmarks bar' || folder.title === '书签栏') {
      return folder.id;
    }
  }
  throw new Error('未找到书签栏文件夹');
}

// 点击扩展图标：切换收藏状态（全收藏夹搜索）
async function toggleBookmark(tab) {
  // 忽略 chrome:// 等不可收藏页面
  if (!tab.url || /^(chrome|edge|about):/.test(tab.url)) return;

  const barId = await getBookmarksBarId();

  // 在整个书签树中搜索该 URL（已存在则全部删除，不存在则添加到书签栏开头）
  const existing = await chrome.bookmarks.search({ url: tab.url });
  if (existing.length) {
    await Promise.all(existing.map(b => chrome.bookmarks.remove(b.id)));
  } else {
    await chrome.bookmarks.create({
      parentId: barId,
      index: 0,
      title: tab.title,
      url: tab.url
    });
  }
}

// 监听点击事件
chrome.action.onClicked.addListener(tab => {
  toggleBookmark(tab).catch(err => console.error('操作失败:', err));
});