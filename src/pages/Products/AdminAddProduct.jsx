import React, { useState } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/Input';
import { createProduct } from '../../api/api';
import { categories } from '../../api/category';

// Zod schema definition
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  stock: z.preprocess((val) => Number(val), z.number().min(1, 'Stock is required').max(50, 'Stock cannot exceed 50')),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  productNumber: z.string().min(1, 'Product number is required'),
  image_url: z.any().optional(),
  active: z.boolean(),
});

function AdminProductAdd() {
  const [loading, setLoading] = useState(false);
  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: 'Cococola',
      price: '1',
      image_url: '',
      productNumber: '',
      active: true,
      stock: 1,
    },
  });

  function getProductsForSlot(productNumber) {
    const slotNumber = parseInt(productNumber, 10);
    if (slotNumber >= 1 && slotNumber <= 5) {
      return 3;
    } else if (slotNumber >= 6 && slotNumber <= 10) {
      return 11;
    } else if (slotNumber >= 11 && slotNumber <= 20) {
      return 14;
    } else if (slotNumber >= 21 && slotNumber <= 30) {
      return 11;
    } else if (slotNumber >= 31 && slotNumber <= 40) {
      return 7;
    } else if (slotNumber >= 41 && slotNumber <= 50) {
      return 6;
    } else {
      return 0; // Invalid slot number, no stock limit
    }
  }

  const navigate = useNavigate();
  const { machineId } = useParams();
  const productNumber = useWatch({
    control: methods.control,
    name: 'productNumber',
    defaultValue: '',
  });

  const stockLimit = getProductsForSlot(productNumber);

  // Validate the image format and size
  const validateImage = (image) => {
    if (!image) return null;
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeInMB = 2;
    const fileSizeMB = image.size / (1024 * 1024);

    if (!validFormats.includes(image.type)) {
      return 'Invalid image format. Only JPG, PNG, and WebP are allowed.';
    }

    if (fileSizeMB > maxSizeInMB) {
      return 'Image size exceeds 2 MB. Please choose a smaller image.';
    }

    return null;
  };

  const onSubmit = async (formData) => {
    if (formData.stock > stockLimit) {
      alert(`Stock cannot exceed the stock limit of ${stockLimit}`);
      return;
    }

    const imageFile = formData.image_url && formData.image_url[0];
    const imageError = validateImage(imageFile);

    if (imageError) {
      alert(imageError);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('price', formData.price);
    data.append('productNumber', formData.productNumber);
    data.append('stockLimit', stockLimit);
    data.append('active', formData.active ? 'true' : 'false');
    if (imageFile) {
      data.append('image_url', imageFile);
    }
    data.append('machineId', machineId);

    setLoading(true);
    const response = await createProduct(data);
    setLoading(false);
    navigate(`/admin/products/${machineId}`);
  };



  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Product Add</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <Input label="Name" name="name" required />
          <div>
            <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
              Category
            </label>
            <div className="mt-2">
              <select
                id="category"
                {...methods.register('category')}
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {categories.map((cat)=>(
                <option value={cat.slug} key={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Stock"
            name="stock"
            type="number"
            disabled={!productNumber}
            rules={{
              max: {
                value: stockLimit,
                message: `Stock cannot exceed ${stockLimit}`,
              },
            }}
          />

          <Input label="Price" name="price" type="text" />
          <Input label="Product Number" name="productNumber" type="text" />

          <p>Stock capacity: {stockLimit}</p>

          <div>
            <label htmlFor="active" className="block text-sm font-medium leading-6 text-gray-900">
              Active
            </label>
            <div className="mt-2 flex items-center">
              <input
                id="active"
                type="checkbox"
                {...methods.register('active')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
          </div>
          <Input label="Image" name="image_url" type="file" />

          <button
            type="submit"
            disabled={loading}
            className="disabled:bg-indigo-200 w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

export default AdminProductAdd;
