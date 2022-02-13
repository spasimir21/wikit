import { writeFile, mkdir, stat } from 'fs/promises';
import { Inject, Injectable } from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import { Config, CONFIG } from '@wikit/config';
import { createHash } from 'crypto';
import * as sharp from 'sharp';
import * as path from 'path';

@Injectable()
class ImageService {
  constructor(@Inject(CONFIG) private readonly config: Config) {}

  private getImagePath(hash: string): string {
    return path.join(
      this.config.image.image_path,
      `${hash.substring(0, this.config.image.hash_grouping)}/${hash}.${this.config.image.format}`
    );
  }

  async getImage(hash: string): Promise<ReadStream | null> {
    try {
      const filePath = this.getImagePath(hash);
      await stat(filePath); // Make sure file exists
      return createReadStream(filePath);
    } catch (err) {
      return null;
    }
  }

  async saveImage(file: Buffer): Promise<string> {
    const image = sharp(file);

    const metadata = await image.metadata();
    if (metadata.width > this.config.image.max_dimension || metadata.height > this.config.image.max_dimension)
      image.resize({ width: this.config.image.max_dimension, height: this.config.image.max_dimension, fit: 'inside' });

    const buffer = await image
      .flatten({ background: this.config.image.background })
      .toFormat(this.config.image.format)
      .toBuffer();

    const hash = createHash(this.config.image.hash).update(buffer).digest('hex');
    const imagePath = this.getImagePath(hash);

    // Only write the file if it doesn't exist
    try {
      await stat(imagePath);
    } catch (err) {
      // prettier-ignore
      await mkdir(path.join(this.config.image.image_path, hash.substring(0, this.config.image.hash_grouping)), { recursive: true });
      await writeFile(imagePath, buffer);
    }

    return hash;
  }
}

export { ImageService };
