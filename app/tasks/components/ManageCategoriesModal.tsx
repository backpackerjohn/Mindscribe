import React, { useState, useEffect } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import type { Category } from '../../../types';
import { PencilIcon, TrashIcon } from '../../../components/icons';
import ColorPicker, { CATEGORY_COLORS } from '../../../components/ColorPicker';

interface ManageCategoriesModalProps {
  onClose: () => void;
  onCategoryDelete: (categoryId: string) => void;
}

const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({ onClose, onCategoryDelete }) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setIsDeleting(null);
  };

  const handleAddNewClick = () => {
    setEditingCategory(null);
    setName('');
    setColor(CATEGORY_COLORS[0]);
    setIsDeleting(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateCategory({ ...editingCategory, name, color });
    } else {
      addCategory({ name, color });
    }
    handleAddNewClick(); // Reset form
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category? Tasks in this category will be un-categorized.")) {
        deleteCategory(categoryId);
        onCategoryDelete(categoryId);
        setIsDeleting(null);
        if (editingCategory?.id === categoryId) {
            handleAddNewClick();
        }
    }
  }

  return (
    <div className="fixed inset-0 bg-brand-background/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-categories-title"
    >
      <div className="bg-brand-surface border border-brand-primary rounded-lg shadow-2xl w-full max-w-2xl relative max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-brand-primary flex items-center justify-between flex-shrink-0">
            <h2 id="manage-categories-title" className="text-xl font-bold text-brand-text-primary">Manage Categories</h2>
            <button onClick={onClose} className="absolute top-3 right-3 text-brand-text-secondary hover:text-white text-2xl leading-none z-10" aria-label="Close modal">&times;</button>
        </header>

        <div className="flex-grow overflow-y-auto p-6 grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-semibold text-brand-text-primary mb-3">Your Categories</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {categories.length > 0 ? categories.map(cat => (
                        <div key={cat.id} className={`p-2 rounded-md flex items-center justify-between ${editingCategory?.id === cat.id ? 'bg-brand-primary' : 'bg-brand-background'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{backgroundColor: cat.color}}></div>
                                <span className="text-brand-text-primary truncate" title={cat.name}>{cat.name}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => handleEditClick(cat)} className="text-brand-text-secondary hover:text-white" aria-label={`Edit category ${cat.name}`}><PencilIcon className="w-4 h-4"/></button>
                                {isDeleting === cat.id ? (
                                    <>
                                        <button onClick={() => handleDelete(cat.id)} className="text-red-500 text-xs hover:underline">Confirm</button>
                                        <button onClick={() => setIsDeleting(null)} className="text-brand-text-secondary text-xs hover:underline">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsDeleting(cat.id)} className="text-brand-text-secondary hover:text-red-500" aria-label={`Delete category ${cat.name}`}><TrashIcon className="w-4 h-4"/></button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-brand-text-secondary text-sm italic">No categories yet. Add one!</p>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-brand-text-primary mb-3">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4 bg-brand-background p-4 rounded-lg">
                    <div>
                        <label htmlFor="cat-name" className="block text-sm font-medium text-brand-text-secondary mb-1">Name</label>
                        <input id="cat-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-brand-surface border border-brand-primary rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Color</label>
                        <ColorPicker selectedColor={color} onChange={setColor} />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-md font-semibold hover:bg-red-500 disabled:opacity-50" disabled={!name.trim()}>
                            {editingCategory ? 'Save Changes' : 'Add Category'}
                        </button>
                        {editingCategory && (
                             <button type="button" onClick={handleAddNewClick} className="px-4 py-2 bg-brand-primary text-white rounded-md font-semibold hover:bg-brand-secondary">
                                New
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesModal;