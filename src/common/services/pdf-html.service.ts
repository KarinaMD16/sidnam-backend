import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import type { Browser, PDFOptions, PuppeteerLifeCycleEvent, PaperFormat } from 'puppeteer';
import { Response } from 'express';

type Disposition = 'attachment' | 'inline';

export interface PdfGenOptions {
  filename?: string;
  waitUntil?: PuppeteerLifeCycleEvent;
  timeout?: number;
  format?: PaperFormat;
  landscape?: boolean;
  margin?: PDFOptions['margin'];
  ensureAssets?: boolean;
  disposition?: Disposition;
}

@Injectable()
export class PdfHtmlService implements OnApplicationShutdown {
  private browser: Browser | null = null;
  private browserPromise: Promise<Browser> | null = null;

  private async getBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    if (!this.browserPromise) {
      this.browserPromise = puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
        ],
      });

      this.browser = await this.browserPromise;
      this.browserPromise = null;
      return this.browser;
    }

    this.browser = await this.browserPromise;
    this.browserPromise = null;
    return this.browser;
  }

  async generarDesdeHtml(
    html: string,
    res: Response,
    options: PdfGenOptions = {},
  ): Promise<void> {
    const defaultFormat: PaperFormat = 'A4';
    const defaultWait: PuppeteerLifeCycleEvent = 'domcontentloaded';

    const {
      filename = 'reporte_actividades.pdf',
      waitUntil = defaultWait,
      timeout = 30000,
      format = defaultFormat,
      landscape = false,
      margin = { top: '40px', bottom: '40px', left: '30px', right: '30px' } as PDFOptions['margin'],
      ensureAssets = false,
      disposition = 'attachment',
    } = options;

    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      await page.setContent(html, { waitUntil, timeout });

      if (ensureAssets) {
        await page.evaluateHandle('document.fonts?.ready').catch(() => {});
        await page.evaluate(async () => {
          const imgs = Array.from(document.images);
          await Promise.all(
            imgs.map((img) =>
              img.complete ? Promise.resolve() : img.decode().catch(() => {}),
            ),
          );
        });
      }

      const pdfBuffer = await page.pdf({
        format,
        landscape,
        printBackground: true,
        margin,
      });

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
      });

      res.send(pdfBuffer);
    } finally {
      await page.close().catch(() => {});
    }
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
    }
  }
}
