---
title: Monitor Tool Commercial
year: 2025
category: 开源项目
role: 全栈开发
techStack:
  - Go
  - Vue 3
  - Gin
  - MySQL
  - Redis
  - Element Plus
description: 前后端分离的网站可用性监控与告警系统，支持 HTTP/HTTPS 定时探测、Redis FSM 告警降噪、邮箱/钉钉通知。
url: https://github.com/wuguangzhou/monitor_tool_commercial
---

Monitor Tool Commercial 是一个前后端分离的网站可用性监控与告警系统。支持 HTTP/HTTPS 定时探测（Cron），记录响应耗时与历史数据，通过仪表盘直观展示监控项状态和告警统计。

项目核心亮点在于告警降噪体系：基于 Redis FSM 实现宕机确认阈值与抖动压制窗口，incident 管理事件生命周期，alert_send_task + SELECT FOR UPDATE 原子领取实现发送去重。后端采用 Go + Gin 分层架构（Handler/Service/DAO），JWT + Redis 会话校验支持主动踢下线；前端使用 Vue 3 + Element Plus 构建 SPA 管理界面。
