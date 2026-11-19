import type { MetadataRoute } from "next";

// 站点地图：只有首页一个页面。每次构建时把"最后修改时间"更新成当天，搜索引擎就知道页面变过了
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://www.mnemoflow.com/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
