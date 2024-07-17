import { Ingredient } from './Ingredient';
import { Step } from './Step';

export interface Recipe {
  title: string;
  defaultTitle?: string;
  titleKeywords?: string[];
  difficulty: number;
  mainImage: string;
  mainImagePath?: string;
  ingredients: Ingredient[];
  steps: Step[];
  comment: string;
  authorId: string;
  authorName?: string;
  recipeId?: string;
  createTime?: Date;
  fullTime?: number;
}
