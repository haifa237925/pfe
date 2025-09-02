import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryCreateInput, CategoryUpdateInput } from '../types/Category';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCategory: (category: CategoryCreateInput) => Promise<Category | null>;
  updateCategory: (id: string, category: CategoryUpdateInput) => Promise<Category | null>;
  deleteCategory: (id: string, force?: boolean) => Promise<boolean>;
  getCategoryById: (id: string) => Promise<Category | null>;
  getCategoryBySlug: (slug: string) => Promise<Category | null>;
  reorderCategories: (categories: { id: string; display_order: number }[]) => Promise<boolean>;
}

interface UseCategoriesOptions {
  parentId?: string | null;
  includeChildren?: boolean;
  autoFetch?: boolean;
}

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useCategories = (options: UseCategoriesOptions = {}): UseCategoriesReturn => {
  const { parentId, includeChildren = false, autoFetch = true } = options;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (parentId !== undefined) {
        if (parentId === null) {
          params.append('parent_id', 'null');
        } else {
          params.append('parent_id', parentId);
        }
      }
      
      if (includeChildren) {
        params.append('include_children', 'true');
      }
      
      const queryString = params.toString();
      const url = `${API_BASE_URL}/categories${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, [parentId, includeChildren]);

  const createCategory = useCallback(async (categoryData: CategoryCreateInput): Promise<Category | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Refresh categories after creation
      await fetchCategories();
      
      return data.category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      console.error('Error creating category:', err);
      return null;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, categoryData: CategoryUpdateInput): Promise<Category | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Refresh categories after update
      await fetchCategories();
      
      return data.category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      console.error('Error updating category:', err);
      return null;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string, force: boolean = false): Promise<boolean> => {
    try {
      const params = new URLSearchParams();
      if (force) {
        params.append('force', 'true');
      }
      
      const queryString = params.toString();
      const url = `${API_BASE_URL}/categories/${id}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // Refresh categories after deletion
      await fetchCategories();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      console.error('Error deleting category:', err);
      return false;
    }
  }, []);

  const getCategoryById = useCallback(async (id: string): Promise<Category | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category';
      setError(errorMessage);
      console.error('Error fetching category by ID:', err);
      return null;
    }
  }, []);

  const getCategoryBySlug = useCallback(async (slug: string): Promise<Category | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/slug/${slug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category';
      setError(errorMessage);
      console.error('Error fetching category by slug:', err);
      return null;
    }
  }, []);

  const reorderCategories = useCallback(async (categoriesOrder: { id: string; display_order: number }[]): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: categoriesOrder }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // Refresh categories after reordering
      await fetchCategories();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder categories';
      setError(errorMessage);
      console.error('Error reordering categories:', err);
      return false;
    }
  }, []);

  // Auto-fetch categories on mount or when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryBySlug,
    reorderCategories,
  };
};

export default useCategories;
