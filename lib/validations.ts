import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email"),
  phone: z.string().max(50).optional(),
  productName: z.string().max(255).optional(),
  productSku: z.string().max(100).optional(),
  message: z.string().min(1, "Message is required"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const categorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  parentId: z.number().nullable().optional(),
  description: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  sku: z.string().min(1).max(100),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  categoryId: z.number().nullable().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  salePrice: z.number().positive().nullable().optional(),
  itemNumber: z.string().max(100).optional(),
  material: z.string().max(255).optional(),
  finish: z.string().max(255).optional(),
  dimensions: z.string().max(255).optional(),
  stockStatus: z.enum(["in_stock", "out_of_stock", "made_to_order"]).default("in_stock"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
});

export const homepageSlideSchema = z.object({
  title: z.string().max(255).optional(),
  subtitle: z.string().max(500).optional(),
  imageUrl: z.string().min(1),
  linkUrl: z.string().max(500).optional(),
  buttonText: z.string().max(100).optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const pageSchema = z.object({
  slug: z.string().min(1).max(255),
  title: z.string().min(1).max(255),
  content: z.string(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
});

export const siteSettingsSchema = z.record(z.string(), z.string());

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type HomepageSlideInput = z.infer<typeof homepageSlideSchema>;
export type PageInput = z.infer<typeof pageSchema>;
