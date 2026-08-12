---
title: K8s 智能诊断 Agent
year: 2026
category: 开源项目
role: 全栈开发
techStack:
  - Python
  - LangGraph
  - Kubernetes
  - DeepSeek
  - ChromaDB
  - FastAPI
  - 飞书 SDK
description: 基于 LangGraph 的 Multi-Agent 系统，自动发现 K8s Pod 故障、LLM 诊断根因、自动修复恢复，飞书 Bot 提供群聊交互入口。
url: https://github.com/wuguangzhou/k8s-diagnostic-agent
---

K8s 智能诊断 Agent 是一个面向 Kubernetes 集群的自动化排障与自愈系统。覆盖 10 种常见 Pod 故障（OOMKilled、CrashLoopBackOff、ImagePullBackOff 等），通过 LangGraph 构建的 7 节点状态机实现非线性诊断流转，支持条件路由、分级重试和兜底升级。

项目采用两层诊断策略：硬规则匹配覆盖 90% 日常故障（毫秒级），LLM + Hybrid RAG 兜底处理未知故障（秒级）。Function Calling 自动选择回滚、重启、换镜像、调资源限制等修复策略，kubectl 命令白名单 + dry-run + 超时三层安全沙箱防护。后台 Watcher 每 30 秒巡检集群，飞书 Bot 提供群聊 @机器人 交互入口，Prometheus + Grafana 大盘监控诊断质量。
