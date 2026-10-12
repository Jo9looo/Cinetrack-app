import { z } from 'zod';

export const createWatchlistSchema = z.object({
  tmdbId: z.number({
    required_error: 'tmdbId is required',
    invalid_type_error: 'tmdbId must be a number',
  }).int().positive('tmdbId must be a positive integer'),
  
  title: z.string({
    required_error: 'title is required',
  }).min(1, 'title cannot be empty'),

  posterPath: z.string().nullable().optional(),
  releaseDate: z.string().nullable().optional(),
  rating: z.number().min(0).max(10).nullable().optional(),
  
  status: z.enum(['Want to Watch', 'Watching', 'Watched'], {
    invalid_type_error: 'status must be "Want to Watch", "Watching", or "Watched"',
  }).optional(),
});

export const updateWatchlistSchema = z.object({
  status: z.enum(['Want to Watch', 'Watching', 'Watched'], {
    required_error: 'status is required',
    invalid_type_error: 'status must be "Want to Watch", "Watching", or "Watched"',
  }),
});
