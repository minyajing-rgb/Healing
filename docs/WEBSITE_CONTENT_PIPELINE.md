# Website Content Pipeline / 官网内容流水线

Earth Healing 网站与 GitHub 数据库并行生长。

## Canonical rule

**GitHub data is the source; the website is a curated reading layer.**

Do not manually copy large blocks of content into the website when a structured data record exists.

## Flow

```
Research / 搜集
  ↓
Canonical Entry / 核心知识实体
  ↓
Source + Safety + Cultural QA
  ↓
Beginner Story / 小白故事层
  ↓
Featured Content / 精选官网内容
  ↓
Map + Timeline + Atlas + Story page
```

## Publish tiers

### Tier A — Featured / 精选
Beautiful, source-ready, beginner-friendly records go to the homepage and featured journeys first.

### Tier B — Browseable / 可浏览
Structured records with adequate context can appear in Atlas / Map search but are not promoted on the homepage.

### Tier C — Researching / 研究中
Visible only in internal data / future admin. Not public-facing.

## Homepage content target

Keep the homepage curated:
- 4–8 featured journeys;
- 6–12 plant/material atlas cards;
- 6–12 timeline highlights;
- 3–6 media stories.

The homepage is not a dump of all 1,000+ nodes.

## Ongoing cadence

When a batch is upgraded from STRUCTURED → REVIEWED:
1. select the strongest human story;
2. write 10-second beginner intro;
3. add verified map/time binding;
4. attach best available image/video;
5. add to `data/site_featured_content_v1.json` if it deserves homepage promotion;
6. website can consume the updated data without redesigning the page.
