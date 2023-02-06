import { Image, MatchImage, MatchImages, CreateImage } from '@wikit/database';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { Inject, Injectable } from '@nestjs/common';
import { ImageDTO } from './model/image.model';
import { CONFIG, Config } from '@wikit/config';

const HASH_LENGTH = {
  md5: 16,
  sha1: 20,
  sha256: 32,
  sha512: 64
} as const;

@Injectable()
class ImageService {
  constructor(@Inject(CONFIG) private readonly config: Config, private readonly database: DatabaseConnection) {}

  async getImage(uuid: string): Promise<ImageDTO | null> {
    const result = await this.database.run(MatchImage, { uuid });
    if (result.records.length == 0) return null;
    const { image, user, wikit } = result.records[0];
    return {
      uuid: image.uuid,
      wikit_id: wikit.uuid,
      wikit_title: wikit.title,
      description: image.description,
      hash: image.hash,
      rating: image.rating * 4 + 1,
      created_by: { uuid: user.uuid, username: user.username }
    };
  }

  async getImages(uuids: string[]): Promise<ImageDTO[]> {
    const result = await this.database.run(MatchImages, { uuids });
    return result.records.map(({ image, user, wikit }) => ({
      uuid: image.uuid,
      wikit_id: wikit.uuid,
      wikit_title: wikit.title,
      description: image.description,
      hash: image.hash,
      rating: image.rating * 4 + 1,
      created_by: { uuid: user.uuid, username: user.username }
    }));
  }

  async createImage(uuid: string, wikit: string, description: string, hash: string): Promise<string | null> {
    if (description.length < 10 || description.length > 200) throw new Error('Description too long or too short!');
    // Hash length is * 2 because it's hex encoded
    if (hash.length != HASH_LENGTH[this.config.image.hash] * 2) throw new Error("Hash isn't the correct length!");

    const image = Image.create({ description, hash });

    const result = await this.database.run(CreateImage, { uuid, wikit, image });
    if (result.records.length == 0) return null;

    return image.uuid;
  }
}

export { ImageService };
