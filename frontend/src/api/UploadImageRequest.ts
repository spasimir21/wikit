import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface UploadImageResult {
  hash: string;
}

interface UploadImageArgs {
  token: string;
  image: File;
}

interface UploadImageError {
  message: string;
}

const UploadImageRequest: RequestFactory<UploadImageResult, UploadImageArgs, UploadImageError> = args => {
  const formData = new FormData();
  formData.append('image', args.image);

  return {
    url: `//${Service.IMAGE}.${DOMAIN}/upload`,
    request: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${args.token}`
      },
      body: formData
    }
  };
};

export { UploadImageRequest };
