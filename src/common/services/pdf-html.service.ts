// src/common/services/pdf-html.service.ts
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class PdfHtmlService {
    async generarDesdeHtml(html: string, res: Response) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', bottom: '40px', left: '30px', right: '30px' },
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=reporte_actividades.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }
}

@Injectable()
export class PdfHtmlDonacionService {
  async generarDesdeHtmlConNombre(html: string, res: Response, filename: string) {
    const browser = await puppeteer.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 }); // o 'networkidle0', 'domcontentloaded'
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '40px', bottom: '40px', left: '30px', right: '30px' },
      });

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}