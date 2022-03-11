import { RatingType } from './model/ratingType.enum';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { RatingDTO } from './model/rating.model';
import { Injectable } from '@nestjs/common';
import {
  GetRatings,
  GetRelationRating,
  GetTextRating,
  RateRelation,
  RateText,
  UpdateRelationRating,
  UpdateTextRating
} from '@wikit/database';

@Injectable()
class RatingService {
  constructor(private readonly database: DatabaseConnection) {}

  async getRatings(uuid: string): Promise<RatingDTO[]> {
    const ratingsResult = await this.database.run(GetRatings, { uuid });

    return ratingsResult.records.map(record => ({
      type: record.type.toUpperCase() as RatingType,
      object: record.object,
      rating: record.rating / 20
    }));
  }

  async rateText(text: string, uuid: string, rating: number): Promise<boolean> {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5!');

    await this.database.run(RateText, { uuid, text, rating: rating * 20 });

    const textRatingResult = await this.database.run(GetTextRating, { text });
    const textRating = textRatingResult.records[0].rating;
    if (textRating == null) return false;

    await this.database.run(UpdateTextRating, { text, rating: textRating });

    return true;
  }

  async rateRelation(relation: string, uuid: string, rating: number): Promise<boolean> {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5!');

    await this.database.run(RateRelation, { uuid, relation, rating: rating * 20 });

    const relationRatingResult = await this.database.run(GetRelationRating, { relation });
    const relationRating = relationRatingResult.records[0].rating;
    if (relationRating == null) return false;

    await this.database.run(UpdateRelationRating, { relation, rating: relationRating });

    return true;
  }
}

export { RatingService };
