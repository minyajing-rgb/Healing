# Media Integration Spec / 图片视频网站集成规范

## Principle
Media is part of the knowledge graph, not decoration.

Every image/video should be attachable to:
`place · era · story · plant/material · modality · person · institution`.

## Dynamic behavior
When the timeline changes, the right-side media rail changes with it. A 19th-century map state should not surface a modern asset as if it were historical evidence; modern reenactment/visualization assets must be labeled as such.

## User flow
**Map node → 10-second explainer → visual Story Card → expand media → return to map/timeline.**

## Media fields
- media_id
- type
- title_zh / title_en
- source/provenance
- rights
- repository_path
- master_status
- web_proxy_status
- related_entity_ids[]
- related_story_ids[]
- valid/display era
- historical_evidence vs modern_visualization flag
- caption_zh / caption_en
- transcript for video
- accessibility alt text
- beginner_mode priority

## Older/beginner users
- no autoplay with sound;
- large play controls;
- captions + transcript;
- one-sentence context before play;
- “这段视频在讲什么？” always visible;
- video can be expanded but never blocks basic text reading.

## Current user-provided reference set
See:
- `assets/REFERENCE_ASSET_REGISTER.md`
- `data/media_manifest_wave1.json`
