import { FormatEnum } from 'sharp';

interface Config {
  database: {
    url: string;
    user: string;
    password: string;
  };
  token: {
    secret: string;
    token_lifetime: string;
  };
  image: {
    image_path: string;
    background: string;
    hash_grouping: number;
    hash: string;
    format: keyof FormatEnum;
    max_dimension: number;
  };
  auth: {
    refresh_token_length: number;
    salt_rounds: number;
  };
}

export { Config };
