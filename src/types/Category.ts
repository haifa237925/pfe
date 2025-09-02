export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_category_id: string | null;
  display_order: number;
  children?: Category[];
}

export interface CategoryCreateInput {
  name: string;
  slug: string;
  description?: string;
  parent_category_id?: string;
  display_order?: number;
}

export interface CategoryUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  parent_category_id?: string;
  display_order?: number;
}

export interface CategoryWithHierarchy extends Category {
  level: number;
  parentName?: string;
  childrenCount: number;
}
