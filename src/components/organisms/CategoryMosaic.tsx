import { api } from '@/lib/api';
import { AllProductsTile, CategoryTile } from '@/components/molecules';
import type { Category } from '@/lib/types';

export function CategoryMosaic({ categories }: { categories: Category[] }) {
  return (
    <div className="cat-mosaic">
      {categories.slice(0, 5).map((c) => (
        <CategoryTile key={c.id} category={c} count={api.catalog.categoryCount(c.id)} />
      ))}
      <AllProductsTile />
    </div>
  );
}
