import PDFDocument from 'pdf-parse';
import fs from 'fs';

type PDFInput =
  | {
      filePath: string;
      file?: File;
    }
  | {
      filePath?: string;
      file: File;
    };

export async function extractTextFromPDF({ filePath, file }: PDFInput) {
  if (filePath && fs.existsSync(filePath)) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await PDFDocument(dataBuffer);
    return data.text;
  }
  if (file) {
    const dataBuffer = await file.arrayBuffer();
    // eslint-disable-next-line no-undef
    const data = await PDFDocument(Buffer.from(dataBuffer));
    return data.text;
  } else {
    throw Error('Provilde a valid path or a valid file');
  }
}
