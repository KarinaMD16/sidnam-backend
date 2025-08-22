import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import type { PDFOptions, PuppeteerLifeCycleEvent, PaperFormat } from 'puppeteer';
import { Response } from 'express';

type Disposition = 'attachment' | 'inline';

export interface PdfGenOptions {
  filename?: string;
  waitUntil?: PuppeteerLifeCycleEvent;         
  timeout?: number;
  format?: PaperFormat;                        
  margin?: PDFOptions['margin'];                
  ensureAssets?: boolean;
  disposition?: Disposition;                    
}

@Injectable()
export class PdfHtmlService {
  async generarDesdeHtml(html: string, res: Response, options: PdfGenOptions = {}): Promise<void> {
    
    const defaultFormat: PaperFormat = 'A4';
    const defaultWait: PuppeteerLifeCycleEvent = 'domcontentloaded';

    const {
      filename = 'reporte_actividades.pdf',
      waitUntil = defaultWait,
      timeout = 30000,
      format = defaultFormat,
      margin = { top: '40px', bottom: '40px', left: '30px', right: '30px' } as PDFOptions['margin'],
      ensureAssets = false,
      disposition = 'attachment',
    } = options;

    const browser = await puppeteer.launch({ headless: true });
    try {
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil, timeout });

      if (ensureAssets) {
        
        await page.evaluateHandle('document.fonts?.ready').catch(() => {});
        await page.evaluate(async () => {
          const imgs = Array.from(document.images);
          await Promise.all(imgs.map(img => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))));
        });
      }

      const pdfBuffer = await page.pdf({
        format,                 
        printBackground: true,
        margin,                 
      });

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="${filename}"`,
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
      