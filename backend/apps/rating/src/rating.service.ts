import { RatingType } from './model/ratingType.enum';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { RatingDTO } from './model/rating.model';
import { Injectable } from '@nestjs/common';
import {
  GetRatings,
  GetRelationRating,
  GetTextDifficulty,
  GetTextRating,
  RateRelation,
  RateText,
  RateTextDifficulty,
  UpdateRelationRating,
  UpdateTextDifficulty,
  UpdateTextRating,
  RateImage,
  GetImageRating,
  UpdateImageRating
} from '@wikit/database';

@Injectable()
class RatingService {
  constructor(private readonly database: DatabaseConnection) {}

  async getRatings(uuid: string): Promise<RatingDTO[]> {
    const ratingsResult = await this.database.run(GetRatings, { uuid });

    return ratingsResult.records.map(record => ({
      type: record.type.toUpperCase() as RatingType,
      object: record.object,
      rating: record.rating * 4 + 1
    }));
  }

  async rateText(text: string, uuid: string, rating: number): Promise<boolean> {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5!');

    await this.database.run(RateText, { uuid, text, rating: (rating - 1) / 4 });

    const textRatingResult = await this.database.run(GetTextRating, { text });
    const textRating = textRatingResult.records[0].rating;
    if (textRating == null) return false;

    await this.database.run(UpdateTextRating, { text, rating: textRating });

    return true;
  }

  async rateTextDifficulty(text: string, uuid: string, difficulty: number): Promise<boolean> {
    if (difficulty < 1 || difficulty > 5) throw new Error('Difficulty must be between 1 and 5!');

    await this.database.run(RateTextDifficulty, { uuid, text, difficulty: (difficulty - 1) / 4 });

    const textDifficultyResult = await this.database.run(GetTextDifficulty, { text });
    const textDifficulty = textDifficultyResult.records[0].difficulty;
    if (textDifficulty == null) return false;

    await this.database.run(UpdateTextDifficulty, { text, difficulty: textDifficulty });

    return true;
  }

  async rateRelation(relation: string, uuid: string, rating: number): Promise<boolean> {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5!');

    await this.database.run(RateRelation, { uuid, relation, rating: (rating - 1) / 4 });

    const relationRatingResult = await this.database.run(GetRelationRating, { relation });
    const relationRating = relationRatingResult.records[0].rating;
    if (relationRating == null) return false;

    await this.database.run(UpdateRelationRating, { relation, rating: relationRating });

    return true;
  }

  async rateImage(image: string, uuid: string, rating: number): Promise<boolean> {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5!');

    await this.database.run(RateImage, { uuid, image, rating: (rating - 1) / 4 });

    const imageRatingResult = await this.database.run(GetImageRating, { image });
    const imageRating = imageRatingResult.records[0].rating;
    if (imageRating == null) return false;

    await this.database.run(UpdateImageRating, { image, rating: imageRating });

    return true;
  }
}

export { RatingService };
