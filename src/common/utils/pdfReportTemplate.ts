import * as fs from 'fs';
import * as path from 'path';

export function escapePdfHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function capitalizePdfText(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getPdfLogoBase64(): string {
  const logoPath = path.join(process.cwd(), 'assets', 'hogar-san-blas.png');
  const logoBuffer = fs.readFileSync(logoPath);
  return `data:image/png;base64,${logoBuffer.toString('base64')}`;
}

export function buildStandardPdfHtml(params: {
  title: string;
  metaLines?: string[];
  bodyHtml: string;
  extraStyles?: string;
}): string {
  const { title, metaLines = [], bodyHtml, extraStyles = '' } = params;
  const metaHtml = metaLines
    .filter((line) => line.trim().length > 0)
    .map((line) => `<div class="meta">${line}</div>`)
    .join('');

  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    :root {
      --accent: #A7074D;
      --text: #111111;
      --muted: #555555;
      --border: #d5d5d5;
      --bg-alt: #f7f7f7;
    }

    * { box-sizing: border-box; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: var(--text);
      margin: 0;
      padding: 24px;
    }

    h1, h2, h3, h4, p {
      margin: 0;
    }

    h1 {
      font-size: 28px;
      color: var(--text);
      margin-bottom: 6px;
    }

    h2 {
      font-size: 18px;
      color: var(--text);
      margin-bottom: 8px;
    }

    h3 {
      font-size: 14px;
      color: var(--text);
      margin-bottom: 8px;
    }

    .heading {
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: 16px;
      align-items: center;
      margin-bottom: 18px;
    }

    .logo {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }

    .meta {
      color: var(--muted);
      margin-top: 4px;
    }

    .section {
      margin-top: 20px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .box {
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      background: #fff;
    }

    .two-col {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th, td {
      border: 1px solid var(--border);
      padding: 7px 9px;
      vertical-align: top;
      text-align: left;
    }

    th {
      background: var(--accent);
      color: #ffffff;
    }

    tbody tr:nth-child(even) {
      background: var(--bg-alt);
    }

    .right { text-align: right; }
    .center { text-align: center; }

    .info-list {
      display: grid;
      gap: 6px;
    }

    .info-row {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    .info-label {
      min-width: 150px;
      font-weight: 700;
    }

    hr {
      border: 0;
      border-top: 1px solid var(--border);
      margin: 10px 0 14px;
    }

    tr {
      page-break-inside: avoid;
    }

    @media print {
      .two-col {
        grid-template-columns: 1fr 1fr;
      }
    }

    @page {
      margin: 40px 30px;
    }

    ${extraStyles}
  </style>
</head>
<body>
  <div class="heading">
    <img class="logo" src="${getPdfLogoBase64()}" alt="logo"/>
    <div>
      <h1>${escapePdfHtml(title)}</h1>
      ${metaHtml}
    </div>
  </div>

  ${bodyHtml}
</body>
</html>`.trim();
}
