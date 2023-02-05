import { SearchService } from './search.service';
import * as DataLoader from 'dataloader';

// This loader has to do extra batching by query, since (very unlikely, but possible)
// one request may have multiple searches with different queries
function createImageLoader(searchService: SearchService): DataLoader<string, string | null> {
  return new DataLoader(async ids => {
    const batches: Record<string, string[]> = {} as any;

    for (const id of ids) {
      const split = id.split(':');

      const query = split.slice(1).join(':');
      const wikit = split[0];

      if (batches[query] == null) batches[query] = [];
      batches[query].push(wikit);
    }

    const images: Record<string, string> = {} as any;

    for (const query in batches) {
      const batchImages = await searchService.searchImages(query, batches[query]);
      for (const wikit in batchImages) images[`${wikit}:${query}`] = batchImages[wikit];
    }

    return ids.map(id => images[id] ?? null);
  });
}

export { createImageLoader };
