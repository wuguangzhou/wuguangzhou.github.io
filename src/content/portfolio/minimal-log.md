---
title: Minimal Log
year: 2023
category: 独立开发
techStack: [Go, HTMX, SQLite]
description: 极简风格的日志聚合与可视化工具。单个二进制文件，零配置启动。
---

Minimal Log 是一个极简的日志聚合工具。目标是让开发者在本地用一条命令就能看到所有服务的日志。

单个二进制文件，零配置，启动后自动发现同一网络内的服务并开始收集日志。使用 HTMX 做前端交互，后端用 Go 实现高性能日志解析。
