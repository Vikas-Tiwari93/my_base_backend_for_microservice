import { Request } from 'express';
import fileUpload from 'express-fileupload';
export const imageUploadConfig = fileUpload({
  useTempFiles: true,
  safeFileNames: true,
  preserveExtension: true,
});

export const handleImageUpload = (req: Request) => {
  let uploadFile = req?.files?.imageFile as fileUpload.UploadedFile;

  if (uploadFile) {
    const name = uploadFile?.name;
    const md5 = uploadFile?.md5;
    const saveAs = `${md5}_${name}`;
    return { uploadFile, saveAs };
  } else {
    return { uploadFile: undefined, saveAs: undefined };
  }
};

export const ImageDownloads = () => {};
