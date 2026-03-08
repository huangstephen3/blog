---
title: 为什么这里默认用 Magic Link 登录
description: 为了尽量保持免费和轻量，同时避免在静态托管上直接处理密码，Magic Link 是很合适的折中。
pubDate: 2026-03-06
draft: false
premium: false
category: 登录系统
tags:
  - Supabase
  - 登录
  - Magic Link
heroImage: ../../assets/blog-placeholder-3.jpg
---

如果站点部署在 GitHub Pages 上，那么让用户直接输入密码并不是最稳妥的路线。

这次我默认接入的是 Supabase 的 Magic Link 邮件登录：

- 用户只输入邮箱
- 点击邮件里的链接完成登录
- 浏览器保存会话

这样做的好处是实现快、成本低，也更适合个人博客和会员入口的第一版。

等你未来真的需要更成熟的账号系统，再升级到更完整的权限体系也不迟。
