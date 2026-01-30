import { DataTable } from '@/components/common/DataTable';
import React from 'react';

const categories = [
  {
    id: '1',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'All kinds of smartphones from top brands',
    is_active: true
  },
  {
    id: '2',
    name: 'Laptops',
    slug: 'laptops',
    description: 'High performance laptops for work and gaming',
    is_active: true
  },
  {
    id: '3',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Men and women clothing, shoes, and accessories',
    is_active: false
  },
  {
    id: '4',
    name: 'Books',
    slug: 'books',
    description: 'All genres of books including fiction and non-fiction',
    is_active: true
  },
  {
    id: '5',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Appliances, furniture, and home essentials',
    is_active: true
  }
];

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'is_active', header: 'Active' }
];
const AdminCategoryTable = () => {
  
  return (
    <>
    
    <DataTable
      columns={columns}
      data={categories}
      renderRowActions={(row) => <button>Edit</button>}
      selectable
    />
    </>
  );
};

export default AdminCategoryTable;
