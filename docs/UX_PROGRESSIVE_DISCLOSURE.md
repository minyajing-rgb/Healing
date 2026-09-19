# Progressive Disclosure UX / 小白与高龄友好体验规范

## Audience / 用户

Earth Healing is designed for people who may be highly educated, experienced, or affluent but **do not already know the subject vocabulary**. It must also remain comfortable for older users.

The product must never assume that the user knows terms such as materia medica, Kampo, Unani, dosha, meridian, ethnobotany, hydrosol, vibroacoustics, etc.

## Core interaction: one tap → one story → optional depth

Every object follows five layers:

### L0 — See it / 看见
Large image or short video + name + place + era.

### L1 — Understand in 10 seconds / 10秒看懂
One plain-language sentence:
- 这是什么？
- 它在哪里？
- 为什么值得看？

No jargon without an inline explanation.

### L2 — Story / 故事
A 1–3 minute narrative:
- Who?
- Where?
- When?
- What did people actually do?
- What changed later?

### L3 — Explore / 展开
Tabs:
**Story · Map · Timeline · Objects/Plants · Media · Compare**

### L4 — Verify / 深入
Only for users who want depth:
**Primary Sources · Modern Evidence · Safety · Regulation · Cultural Context · References**

Default page never opens at L4.

---

## Age-friendly rules / 高龄友好规则

- desktop body text target: 18–20 px minimum;
- touch targets: 44–48 px minimum;
- no tiny timeline labels;
- strong text/background contrast;
- avoid hover-only interactions;
- every animation can be paused;
- map can switch to list view;
- video always has play/pause, captions and transcript;
- narration/audio mode may read Story cards aloud;
- Chinese/English toggle is persistent and one tap away;
- avoid unexplained icon-only navigation.

---

## Elite-beginner tone / 精英小白语气

Do:
> “Kampo is Japan’s system of herbal medicine that developed from Chinese medical traditions and later formed its own regulated practice.”

Do not:
> “Kampo utilizes Sho-based diagnosis and standardized formulas…” as the first sentence.

Depth is available, but not forced.

---

## Story Card contract

Every canonical entry should eventually expose:

```
[hero image/video]

薰衣草 / Lavender
Provence · 19th–21st century story thread

一句话看懂
花、香气、蒸馏和现代芳香文化在这里交汇。

Why it matters / 为什么值得看
This one plant connects farming, perfumery, pharmacy and modern wellness.

[Read Story]
[See on Map]
[Move Through Time]
[Watch]
```

---

## “I don’t know where to start” mode

Home provides only 4 starting actions:

1. **Pick a place / 选一个地方**
2. **Pick a time / 选一个年代**
3. **Pick a theme / 选一种疗愈方式**
4. **Surprise me / 随便带我看看**

Everything else is progressive disclosure.

---

## Memory model

Users can save:
- places;
- eras;
- plants;
- stories;
- journeys.

A saved item should preserve the exact timeline position so the user can return to the same historical world state.

---

## Accessibility QA gate

A page is not publishable if:
- the first screen contains unexplained specialist terms;
- text cannot be enlarged without breaking;
- timeline requires precise mouse control;
- essential information exists only in color;
- video lacks a text alternative;
- map content has no list/detail alternative.
