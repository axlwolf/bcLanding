// lib/utils/pdf-client.ts

/**
 * Extract text content from a PDF file (client-side only)
 * @param file PDF file to extract text from
 * @returns Extracted text content
 */
// IMPORTANT: Before using this utility, copy node_modules/pdfjs-dist/build/pdf.worker.js to your public/ directory:
// cp node_modules/pdfjs-dist/build/pdf.worker.js public/pdf.worker.js

export async function extractTextFromPdfFile(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('extractTextFromPdfFile can only be used in the browser')
  }

  const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs')

  if (pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'
  }

  const arrayBuffer = await file.arrayBuffer()
  const pdfDataArray = new Uint8Array(arrayBuffer)
  const pdfDocument = await pdfjsLib.getDocument({ data: pdfDataArray }).promise
  let extractedText = ''
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i)
    const textContent = await page.getTextContent()
    // Import type { TextItem } from 'pdfjs-dist/types/src/display/api' at the top for type safety
    const pageText = textContent.items
      .map((item: import('pdfjs-dist/types/src/display/api').TextItem) => item.str)
      .join(' ')
    extractedText += pageText + '\n'
  }
  return extractedText
}
