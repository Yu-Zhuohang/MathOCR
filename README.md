<div align="center">

# MathOCR

**离线数学公式OCR识别工具 — 截图即得 LaTeX/MathML，粘贴到 Word 即可编辑**

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version"/>
  <img src="https://img.shields.io/badge/platform-Windows%2010%2F11-blue?style=flat-square" alt="Platform"/>
  <img src="https://img.shields.io/badge/python-3.8%2B-blue?style=flat-square" alt="Python"/>
  <img src="https://img.shields.io/badge/build-electron-brightgreen?style=flat-square" alt="Electron"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs"/>
  <img src="https://img.shields.io/github/stars/Yu-Zhuohang/MathOCR?style=flat-square" alt="Stars"/>
  <img src="https://img.shields.io/github/release/Yu-Zhuohang/MathOCR?style=flat-square" alt="Release"/>
</p>

[功能](#核心功能) • [安装](#安装) • [使用](#使用指南) • [快捷操作](#快捷操作) • [技术栈](#技术栈) • [项目结构](#项目结构) • [常见问题](#常见问题) • [许可证](#许可证)

</div>

---

## 简介

**MathOCR** 是一款完全离线的桌面数学公式 OCR 识别工具。只需按下快捷键框选屏幕中的公式，即可自动识别生成 LaTeX 代码，并支持一键复制为 MathML 格式直接粘贴到 Word 中显示为可编辑公式对象。基于 pix2tex 深度学习模型，所有计算均在本地完成，无需连接网络，保护数据隐私。

> **为什么选择 MathOCR？**
> - 截图即识别 — 快捷键激活，框选即出结果
> - 完全离线 — 所有推理在本地完成，数据不外传
> - 复制到 Word — MathML 格式粘贴，即显示为可编辑公式
> - 高准确率 — 基于 pix2tex 深度学习模型
> - 完全免费 — MIT 开源协议

## 核心功能

| 功能 | 说明 |
|------|------|
| 截图识别 | 按下 Ctrl+Shift+Alt+F 框选屏幕任意区域，自动识别公式 |
| LaTeX 编辑 | 内置 LaTeX 编辑器，左侧写代码右侧实时预览 |
| MathML 复制 | 一键复制为 Word 可粘贴的公式格式 |
| 历史记录 | 自动保存识别历史，支持查阅和复用 |
| 系统托盘 | 后台常驻，一键呼出 |

## 安装

### 方式一：下载安装包（推荐）

从 [Releases](https://github.com/Yu-Zhuohang/MathOCR/releases) 页面下载最新版安装程序，双击运行即可。

### 方式二：从源码运行

```bash
# 1. 克隆仓库
git clone https://github.com/Yu-Zhuohang/MathOCR.git
cd MathOCR

# 2. 安装 Node.js 依赖
npm install

# 3. 安装 Python 依赖
cd engine
pip install -r requirements.txt
cd ..

# 4. 下载识别模型（首次运行）
python scripts/download-model.py

# 5. 启动
npm start
```

### 系统要求

| 项目 | 推荐配置 | 最低配置 |
|------|----------|----------|
| 操作系统 | Windows 10/11 (64-bit) | Windows 10 |
| CPU | Intel i5 及以上 | Intel i3 及以上 |
| 内存 | 8 GB 及以上 | 4 GB |
| 存储 | 500 MB 可用空间 | 100 MB 可用空间 |
| Python | 3.8 及以上 | 3.8 |

## 使用指南

### 首次使用

1. 启动软件后，等待底部引擎加载完成（首次约30-60秒）
2. 按下 **Ctrl+Shift+Alt+F** 激活截图模式
3. 鼠标拖拽选择公式区域
4. 释放鼠标，识别结果自动显示
5. 点击 Copy LaTeX 或 Copy MathML (Word) 复制公式

### 截图识别

1. 快捷键截图：按下 Ctrl+Shift+Alt+F
2. 框选公式：按住鼠标左键拖拽选择
3. 自动识别：松开后调用引擎识别
4. 复制结果：点击底部复制按钮

### LaTeX 编辑器

在 LaTeX Editor 页面中，左侧为代码输入区，右侧为实时预览区，支持手动编辑和修改公式。

### 复制到 Word

点击 **Copy MathML (Word)** 按钮，然后在 Word 中按 Ctrl+V 直接粘贴，公式将显示为可编辑的标准公式对象。

## 快捷操作

| 操作 | 快捷键 |
|------|--------|
| 截图识别 | Ctrl+Shift+Alt+F |
| 取消截图 | Escape / 鼠标右键 |
| 显示/隐藏窗口 | 左键点击托盘图标 |
| 退出程序 | 右键托盘图标 -> 退出 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | Electron 33 |
| 前端 | React 18 + TypeScript |
| 公式渲染 | KaTeX |
| 识别引擎 | pix2tex (LaTeX-OCR) |
| 后端 | Python 3.8+ |
| 通信协议 | JSON-RPC 2.0 |
| 数据存储 | electron-store |

## 项目结构

```
MathOCR/
|--- electron/               Electron 主进程
|   |--- main.ts            窗口管理、生命周期
|   |--- preload.ts         contextBridge API
|   |--- sidecar.ts         Python 引擎管理
|   |--- overlay.ts         截图覆盖层
|   |--- tray.ts            系统托盘
|   |--- ipc-handlers.ts    IPC 通信处理
|--- engine/                 Python 识别引擎
|   |--- server.py          JSON-RPC 服务端
|   |--- recognizer.py      pix2tex 封装
|   |--- requirements.txt   Python 依赖
|--- src/                     React 前端
|   |--- components/        UI 组件
|   |--- styles/            样式文件
|   |--- index.tsx          入口
|--- scripts/                工具脚本
|--- package.json
|--- tsconfig.json
|--- electron-builder.yml
```

## 常见问题

### 模型加载缓慢
首次启动时需要加载深度学习模型，耗时约30-60秒，属正常现象。后续启动使用缓存，速度会大幅提升。

### 识别准确率
模型的识别准确率取决于公式的清晰度和复杂度。建议在识别前确保公式区域清晰、无噪声干扰。

### Engine not ready
如果识别引擎状态显示 Engine not ready，请等待引擎加载完成后再尝试识别。若长时间无法就绪，可重启软件。

### 复制到 Word 无反应
请确保使用的是 Word 或 WPS 最新版本，支持 MathML 粘贴。建议使用 Office 2019 或 Microsoft 365。

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=Yu-Zhuohang/MathOCR&type=Date)](https://star-history.com/#Yu-Zhuohang/MathOCR&Date)

## 贡献

欢迎提交 Issue 和 Pull Request！请确保代码风格一致并添加相应的测试。

## 许可证

[MIT License](/LICENSE) (c) 2026 Yu Zhuohang

*** End of File
