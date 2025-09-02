import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { Category } from '../types/Category';

const CategoryManager: React.FC = () => {
  const { 
    categories, 
    loading, 
    error, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    refetch 
  } = useCategories({ includeChildren: true });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const success = await createCategory({
      name: newCategoryName.trim(),
      slug,
      description: `Description for ${newCategoryName}`,
    });

    if (success) {
      setNewCategoryName('');
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    if (!editingCategory) return;

    const success = await updateCategory(category.id, {
      name: editingCategory.name,
      description: editingCategory.description || undefined,
    });

    if (success) {
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  const renderCategory = (category: Category, level: number = 0) => (
    <div key={category.id} style={{ marginLeft: level * 20 }}>
      <div className="border p-4 mb-2 rounded">
        {editingCategory?.id === category.id ? (
          <div>
            <input
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({
                ...editingCategory,
                name: e.target.value
              })}
              className="border p-2 mr-2"
            />
            <button 
              onClick={() => handleUpdateCategory(category)}
              className="bg-green-500 text-white px-3 py-1 rounded mr-2"
            >
              Save
            </button>
            <button 
              onClick={() => setEditingCategory(null)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <h3 className="font-bold">{category.name}</h3>
            <p className="text-gray-600">{category.description}</p>
            <p className="text-sm text-gray-500">Slug: {category.slug}</p>
            <div className="mt-2">
              <button 
                onClick={() => setEditingCategory(category)}
                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteCategory(category.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      {category.children && category.children.map(child => 
        renderCategory(child, level + 1)
      )}
    </div>
  );

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
        <button 
          onClick={refetch}
          className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Category Manager</h1>
      
      {/* Add new category form */}
      <form onSubmit={handleCreateCategory} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="border p-2 flex-1"
          />
          <button 
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Category
          </button>
        </div>
      </form>

      {/* Categories list */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          categories.map(category => renderCategory(category))
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
