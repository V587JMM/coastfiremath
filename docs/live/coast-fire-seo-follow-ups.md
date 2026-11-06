# Coast FIRE Math SEO 后续待办

开始条件：正式站首页和指南允许抓取并输出自指 canonical，sitemap 已在 Search Console 提交，且首页已被 Google 收录。

- [ ] **把相关工具和指南放到计算结果附近。** 在结果下方添加指向 `/coast-fire-calculator-by-age/` 和 `/what-is-coast-fire/` 的文字链接。首页下方已有入口，调整位置时避免堆叠重复链接。完成后检查桌面与手机端的跳转，并观察这两个入口的点击及后续页面访问。
- [ ] **检查三个相关搜索词对应的页面。** 在 Search Console 按查询和着陆页查看 `coast fire`、`what is coast fire` 和 `coast fire number`。先检查现有指南和计算器是否已经回答相关问题，优先补充缺失内容。只有发现现有页面无法独立满足的搜索需求时，再考虑新建页面。记录修改前后的查询曝光、点击和对应页面。
- [ ] **决定是否开放 AI 搜索抓取。** 收录稳定后，再检查 Cloudflare 的爬虫规则。分别决定是否允许搜索或用户请求触发的访问，以及是否允许用于训练的数据抓取。改动后核对线上 `robots.txt` 和 Cloudflare 的访问规则。
