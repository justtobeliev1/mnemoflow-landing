import type { MetadataRoute } from "next";

// 允许所有搜索引擎抓取，并指出站点地图的位置
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://www.mnemoflow.com/sitemap.xml" };
}
