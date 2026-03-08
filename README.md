# 个人资源博客

这是一个尽可能免费、外网可访问、支持登录的个人博客基础版。

## 当前技术方案

- `Astro`：静态站点
- `GitHub Pages`：自动部署和公开访问
- `Supabase Auth`：无密码 Magic Link 登录

## 为什么登录不用密码

这里默认采用 Magic Link 邮件登录，而不是网页输入密码。

原因是 GitHub 官方关于 GitHub Pages 的说明提到，GitHub Pages 不适合用来做“发送密码或信用卡号”这类敏感交易页面，所以当前实现刻意避开密码表单，改为无密码邮箱登录。

参考：

- [GitHub Pages 限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Supabase Auth OTP / Magic Link 文档](https://supabase.com/docs/reference/javascript/auth-signinwithotp)
- [Supabase Billing 文档](https://supabase.com/docs/guides/platform/billing-on-supabase)

## 本地开发

```bash
npm install
npm run dev
```

Windows PowerShell 可先复制环境变量模板：

```powershell
Copy-Item .env.example .env
```

## 环境变量

在 `.env` 里填：

```bash
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
```

## Supabase 配置步骤

1. 在 Supabase 创建一个项目。
2. 打开认证设置。
3. 配置 `Site URL`：
   - 本地开发：`http://localhost:4321`
   - 生产环境：你的 GitHub Pages 地址
4. 把 `Redirect URLs` 里加入：
   - `http://localhost:4321/member/`
   - `https://你的域名/member/`
   - 如果是项目页部署，再加 `https://用户名.github.io/仓库名/member/`
5. 在项目设置里复制 Project URL 和 public anon key。

## 自动部署

项目已内置 GitHub Actions 工作流：

`.github/workflows/deploy.yml`

你需要在 GitHub 仓库里添加这些 `Actions Variables`：

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SITE_URL`
- `BASE_PATH`

常见取值：

- 用户站：`SITE_URL=https://用户名.github.io`，`BASE_PATH=/`
- 项目站：`SITE_URL=https://用户名.github.io`，`BASE_PATH=/仓库名/`

然后在 GitHub 的 `Settings > Pages` 中把 `Source` 设为 `GitHub Actions`。

## 网页后台 `/admin/`

项目现在已经带了一个基于 `Decap CMS` 的网页后台入口：

- 生产地址：`https://你的域名/admin/`
- 当前项目地址：`https://huangstephen3.github.io/blog/admin/`

它可以直接编辑：

- `src/content/blog` 下的 Markdown 文章
- 标题、描述、分类、标签、语言、封面图和正文

### `/admin/` 要能真正登录，还差什么

因为当前站点部署在 `GitHub Pages`，`Decap CMS` 的 `GitHub backend` 还需要一个 GitHub OAuth 授权回调服务。

也就是说：

- `/admin/` 页面和编辑表单已经在项目里
- 但如果要在生产环境直接用 GitHub 登录并提交内容，还需要你配置一个 OAuth client / proxy

最常见做法有两种：

1. 接一个 GitHub OAuth proxy
2. 或者继续用 GitHub 网页直接编辑仓库文件

在没有 OAuth proxy 之前：

- 本地开发可以配 `local_backend`
- 线上 `/admin/` 的真正登录能力还不能完全代替 GitHub 网页编辑

## 常用命令

- `npm run dev`
- `npm run build`
- `npm run check`
- `npm run new-post -- 文章标题`

## 当前已经做好的页面

- 首页：资源站式双栏布局
- 免费资源页：文章归档
- 文章详情页：卡片化内容页
- 会员专区页：展示型 VIP 页面
- 登录页：Magic Link 登录
- 会员中心页：登录后访问

## 现阶段的边界

当前版本已经实现“可访问、可登录、可自动部署”。

但如果你接下来要做真正的私密资源下载、会员等级权限和付费系统，还需要继续加：

- Supabase Storage
- 数据表与 Row Level Security
- 受保护资源的动态请求
- 支付系统
