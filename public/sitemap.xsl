<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>XML Sitemap</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style type="text/css">
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 40px;
      background-color: #f5f5f5;
    }
    .header {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    h1 {
      color: #333;
      margin: 0 0 10px 0;
    }
    .description {
      color: #666;
      font-size: 14px;
    }
    table {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
    }
    tr:hover {
      background-color: #f8f9fa;
    }
    .url {
      color: #0066cc;
      text-decoration: none;
    }
    .url:hover {
      text-decoration: underline;
    }
    .priority {
      text-align: center;
    }
    .date {
      font-size: 13px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>XML Sitemap</h1>
    <p class="description">
      This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs for Garage Floor Coatings DFW.
    </p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Priority</th>
        <th>Change Frequency</th>
        <th>Last Modified</th>
      </tr>
    </thead>
    <tbody>
      <xsl:for-each select="sitemap:urlset/sitemap:url">
        <tr>
          <td>
            <a href="{sitemap:loc}" class="url">
              <xsl:value-of select="sitemap:loc"/>
            </a>
          </td>
          <td class="priority">
            <xsl:value-of select="sitemap:priority"/>
          </td>
          <td>
            <xsl:value-of select="sitemap:changefreq"/>
          </td>
          <td class="date">
            <xsl:value-of select="sitemap:lastmod"/>
          </td>
        </tr>
      </xsl:for-each>
    </tbody>
  </table>
</body>
</html>
</xsl:template>
</xsl:stylesheet>