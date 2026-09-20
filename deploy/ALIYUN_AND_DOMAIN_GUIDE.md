# Earth Healing：域名与阿里云部署指南

核对日期：2026-09-20。此文是配置指南，不表示已经创建阿里云资源、开通计费或绑定用户域名。

## 先区分三件事

- GitHub：保存源代码、内容、版本和发布工作流。
- 网站托管：现在是 GitHub Pages；以后可换成阿里云 OSS。
- 域名 / DNS：域名即使在阿里云购买，也可以指向 GitHub Pages，不要求在阿里云购买服务器。

**当前阶段建议：先保留 Pages 预览，确认视觉和域名；不必为 HTML、交互地图、搜索、时间轴购买 ECS 或数据库。**这些交互在浏览器运行；需要账号同步、AI 对话、私密数据、在线编辑或支付后端时，再增加后端服务。

## 方案 A：阿里云管域名，GitHub Pages 托管网站

假设最终域名为 healing.example.com（仅示例，尚未绑定）。

1. 先在 GitHub 个人 Settings → Pages 中验证主域名；按界面给出的内容添加 TXT 验证记录。不要猜测 TXT 验证值。
2. Healing 仓库 Settings → Pages → Custom domain 填 healing.example.com。当前发布源是 gh-pages /，不是旧的根目录原型。
3. 在阿里云 DNS 给 example.com 添加：

| 字段 | 值 |
|---|---|
| 主机记录 | healing |
| 类型 | CNAME |
| 记录值 | minyajing-rgb.github.io |
| TTL | 600 秒或控制台默认值 |

记录值**不加 https://，不加 /Healing/，不指向 github.com**。同一主机记录不要留下冲突的 A/AAAA/CNAME；不改无关的邮箱 MX 或其他子域名。

4. 等 GitHub 的 DNS 校验与证书签发完成后，启用 Enforce HTTPS。
5. 检查首页、map.html、故事深链接、语言切换、时间轴与视频。

注意：仅上传一个 CNAME 文件，不等于已经完成 GitHub 的域名设置。发布工作流会保留现有 gh-pages/CNAME；域名仍应通过 Pages 设置或有权限的 API 配置。

## 方案 B：真正把网站托管到阿里云

建议架构：GitHub → 检查/构建 → 公开静态站点包 → OSS → 自定义域名与 HTTPS。CDN 按用户地域与流量决定是否增加。

### 1. 创建专用 OSS Bucket

- 名称：例如 earth-healing-web-你的唯一后缀。
- 地域：国际版可考虑中国香港或新加坡；主要服务内地且已准备备案，则评估内地地域。
- 存储：标准存储即可作为起点。
- 简单直连静态站方案：专用 Bucket 公共读、私有写；绝不设为公共读写。
- 若默认“阻止公共访问”开启，仅对这个准备公开的站点 Bucket 按控制台流程调整，不对其他 Bucket 做全局放开。
- 生产版也可使用私有 Bucket + CDN 授权回源，这与简单公共读方案是两个不同配置，不要混用。

### 2. 上传发布产物，不上传整个仓库

在成功的 Publish Earth Healing 工作流中下载 earth-healing-site-and-preview artifact，**只上传其中 _site/ 里面的内容到 Bucket 根目录**。

正确根目录应当直接包含：

```text
index.html
map.html
story.html
library.html
404.html
site.js
site.css
map-experience.js
map-experience.css
release.json
assets/
vendor/
data/
```

不要在根目录多套 _site/ 一层。不要上传 .git/、密钥、后台凭证、未授权原片、内部合同或研究工作资料。发布后的前端代码、JSON 与图片能被访客下载；没有仓库链接并不等于数据私有。

### 3. 配置静态页面

| OSS 参数 | 本站值 |
|---|---|
| 默认首页 | index.html |
| 默认 404 页 | 404.html |
| 错误文档响应码 | 404 |
| 子目录首页 | 本版本不需要开启 |

本站使用真实 .html 页面与查询参数，不需要把所有 404 伪装成 200 的 SPA 回退。

使用 OSS 默认 Bucket 域名访问 HTML 可能会下载文件；应绑定自定义域名才能按官方方案正常浏览静态站。

### 4. 绑定域名与 HTTPS

在 OSS 的域名管理中绑定最终域名，完成所有权校验，在 DNS 添加控制台要求的 CNAME；若使用 CDN，则最终 DNS 指向 **CDN 分配的 CNAME**，不是再同时指向 Bucket 或 GitHub Pages。

在实际终止 HTTPS 的 OSS 或 CDN 位置绑定该域名的有效证书，启用 HTTPS；证书有效后再强制 HTTPS。不要把只有 HTTP 的地址当作上线验收。

### 5. 内地、香港与 CDN 的区别

- 中国内地 OSS Bucket 绑定域名按阿里云要求完成 ICP 备案。
- CDN 选择“仅中国内地”或“全球”均需要备案。
- CDN 选择“全球（不包含中国内地）”不要求该项工信部备案，流量使用非内地节点；这不是所有法律义务的豁免。
- 不要认为把源站选在香港，就能自动绕过内地 CDN 的备案要求。
- 面向内地公开运营时，另行核查网站内容、地图展示与业务适用要求；托管地域不是全部合规判断。

### 6. 推荐初始交付设置

- HTML、release.json、故事 JSON：Cache-Control: no-cache 或短缓存（例如 300 秒）。
- 本版未指纹化 JS/CSS：短缓存；更新时刷新 CDN，不设置一年不可变缓存。
- 图片、视频、地图资源：可适当延长缓存；长期不可变缓存只用于带内容哈希的新文件名。
- 确认 HTML 是 text/html、JS 是 application/javascript、CSS 是 text/css、JSON 是 application/json、AVIF 是 image/avif、WebM 是 video/webm。
- 同域部署目前不需要通配符 CORS；增加跨域 API/素材域时，只放行需要的站点和方法。
- 增加预算提醒、流量告警、访问日志和版本管理；预算提醒不等于硬性费用封顶。

## 更新方式

现有 GitHub 工作流自动发布到 Pages。迁移到阿里云后，可继续使用同一构建产物；只需添加发布到指定 OSS Bucket 的阶段。

阿里云自动上传**尚未启用**。首次自动化必须先明确 Bucket、地域、域名及权限；使用最小权限 RAM 身份或短期凭证，密钥放在 GitHub Secrets/受控凭证系统，不写在 HTML、JS、JSON 或 GitHub 仓库里，也不用在聊天中粘贴 AccessKey Secret。

## 地图引擎与费用边界

本轮使用 **MapLibre GL JS**，不是 Google Maps。

- “花园图谱”：本站加载的 Natural Earth 地理数据，MapLibre 负责拖拽、缩放、标记聚合和地区镜头。不需要 Google API Key。
- “地理细节”：用户主动点击后访问 OpenFreeMap 的现代地理服务；保留 OpenMapTiles / OpenStreetMap 等署名。此服务无 SLA，网络异常时回到本站图谱。
- 两者只随时间筛选故事记录，不伪造历史国界，也不把现代道路当作古代地图。
- 官方地图 SDK 可做产品级缩放与主题设计；不需要为了同样交互硬接 Google iframe。

如果未来明确切 Google Maps：需创建 Google Cloud 项目、启用 Maps JavaScript API、开通生产使用所需计费、配置只允许本站域名使用的浏览器 API Key，并给 Cloud-based maps styling 配置 Map ID / Map Style。还需实现并测试 Google SDK 适配、隐私与条款说明、署名与错误回退；**本轮没有调用或启用 Google 付费服务，不是填写 Key 就已完成 Google 集成**。

## 官方配置依据

- GitHub 自定义域名：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub 发布源与 CNAME：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- OSS 静态网站：https://help.aliyun.com/zh/oss/user-guide/hosting-static-websites
- OSS 自定义域名：https://help.aliyun.com/zh/oss/user-guide/access-buckets-via-custom-domain-names
- OSS HTTPS：https://help.aliyun.com/zh/oss/user-guide/access-oss-by-https-protocol
- CDN 加速区域与备案：https://help.aliyun.com/zh/cdn/user-guide/change-the-accelerated-region
- ossutil 上传：https://help.aliyun.com/zh/oss/developer-reference/upload-objects-6
- Google Maps 配置：https://developers.google.com/maps/documentation/javascript/get-api-key
- Google Key 限制：https://developers.google.com/maps/api-security-best-practices
- Google 地图样式：https://developers.google.com/maps/documentation/javascript/cloud-customization
- MapLibre：https://maplibre.org/maplibre-gl-js/docs/
- OpenFreeMap：https://openfreemap.org/quick_start/
