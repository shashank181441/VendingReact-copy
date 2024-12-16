import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { getProductDetails, updateProduct } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import Input from '../../components/Input'; // Adjust the import based on your file structure
import LoadingComp from '../../components/LoadingComp';
import { categories } from '../../api/category';

// Zod schema definition
const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    stock: z.preprocess((val) => Number(val), z.number().min(1, 'Stock is required').max(15, 'Stock cannot exceed 15    ')), // Coerce string to number
    price: z.preprocess((val) => Number(val), z.number().min(1, 'price is required').max(1000, 'Price cannot exceed 1000')), // Make optional for touch validation
    productNumber: z.preprocess((val) => Number(val), z.number().min(1, 'Stock is required').max(50, 'Product Number cannot exceed 50')), // Make optional for touch validation
    active: z.boolean(),
});

function AdminProductEditcopy() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { productId } = useParams();

    const { data: product, isLoading, error, isSuccess } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await getProductDetails(productId);
            return response.data.data;
        }
    });

    const methods = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            category: 'beverages',
            stock: 0,
            price: '', // Keep this as an empty string initially
            productNumber: '', // Keep this as an empty string initially
            active: false,
        },
    });

    const { mutate } = useMutation({
        mutationFn: async (formData) => {
            const response = await updateProduct(productId, formData);
            return response.data.data;
        },
        onSuccess: () => {
            navigate(`/admin/products/${product?.machine}`);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    useEffect(() => {
        if (isSuccess && product) {
            methods.reset({
                name: product.name || '',
                category: product.category || 'snack',
                stock: product.stock || 0,
                price: product.price || '', // Ensure this is set to an empty string if not provided
                productNumber: product.productNumber || '', // Ensure this is set to an empty string if not provided
                active: product.active || false,
            });
        }
    }, [isSuccess, product, methods]);

    const getStockLimit = (productNumber) => {
        const slotNumber = parseInt(productNumber, 10);
        if (slotNumber >= 1 && slotNumber <= 5) return 3;
        if (slotNumber >= 6 && slotNumber <= 10) return 11;
        if (slotNumber >= 11 && slotNumber <= 20) return 14;
        if (slotNumber >= 21 && slotNumber <= 30) return 11;
        if (slotNumber >= 31 && slotNumber <= 40) return 7;
        if (slotNumber >= 41 && slotNumber <= 50) return 6;
        return 0; // Invalid slot number
    };

    const productNumber = useWatch({
        control: methods.control,
        name: 'productNumber',
        defaultValue: '',
    });

    const stockLimit = getStockLimit(productNumber);

    const onSubmit = (formData) => {
        // Automatically set stock to stockLimit if it exceeds
        if (formData.stock > stockLimit) {
            formData.stock = stockLimit;
        }

        mutate(formData);
    };

    if (isLoading) return <LoadingComp />;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Product Edit</h1>
            <FormProvider {...methods}>
                <form
                    method="post"
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Input
                        id="name"
                        label="Name"
                        placeholder="Name"
                        type="text"
                        {...methods.register('name')}
                    />
                    {/* <Input
                        id="category"
                        label="Category"
                        placeholder="Category"
                        type="select"
                        options={[
                            { value: 'beverages', label: 'Beverages' },
                            { value: 'snacks', label: 'Snacks' },
                            { value: 'chocolate', label: 'Chocolate' },
                            { value: 'basics', label: 'Basics' },
                        ]}
                        {...methods.register('category')}
                    /> */}

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
                        id="stock"
                        label="Stock"
                        placeholder="Stock"
                        type="number"
                        {...methods.register('stock')}
                    />
                    <Input
                        id="price"
                        label="Price"
                        placeholder="Price"
                        type="number"
                        {...methods.register('price')}
                    />
                    <Input
                        id="productNumber"
                        label="Product Number"
                        placeholder="Product Number"
                        type="number"
                        {...methods.register('productNumber')}
                    />
                    <p>Stock capacity: {stockLimit}</p>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="active" className="text-sm font-medium text-gray-700">
                            Active
                        </label>
                        <input
                            type="checkbox"
                            id="active"
                            {...methods.register('active')}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </form>
            </FormProvider>
        </div>
    );
}

export default AdminProductEditcopy;
