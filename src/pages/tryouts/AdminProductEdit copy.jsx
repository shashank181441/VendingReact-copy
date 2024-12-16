import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductDetails, updateProduct } from '../../api/api';

function EditProduct() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
  
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image_url: '',
        category: 'beverage',
        stock: '',
        productNumber: '',
        active: false,
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getProductDetails(productId);
                const product = response.data.data;
                console.log(product);
                setFormData({
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    category: product.category,
                    stock: product.stock,
                    productNumber: product.productNumber,
                    active: product.active,
                });
                setPreviewImage(product.image_url);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to fetch product details.');
                setLoading(false);
            }
        };
  
        fetchProduct();
    }, [productId]);
  
    const updateProductMutation = useMutation({
        mutationFn: async (updatedProduct) => {
            const formData = new FormData();
            formData.append('name', updatedProduct.name);
            formData.append('price', updatedProduct.price);
            formData.append('category', updatedProduct.category);
            formData.append('stock', updatedProduct.stock);
            formData.append('productNumber', updatedProduct.productNumber);
            formData.append('active', updatedProduct.active);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            console.log('FormData content:', Array.from(formData.entries()));

            return await updateProduct(productId, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['product', productId]);
            navigate('/admin/products');
        },
        onError: (err) => {
            console.error('Error updating product:', err);
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            active: e.target.checked,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProductMutation.mutate(formData);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter product name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter product price"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image_url">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image_url"
                        name="image_url"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        accept="image/*"
                    />
                    {previewImage && (
                        <img src={previewImage} alt="Preview" className="mt-4 w-full h-48 object-cover" />
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="beverage">Beverage</option>
                        <option value="snacks">Snacks</option>
                        <option value="chocolate">Chocolate</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                        Stock
                    </label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter stock quantity"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productNumber">
                        Product Number
                    </label>
                    <input
                        type="text"
                        id="productNumber"
                        name="productNumber"
                        value={formData.productNumber}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter product number"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="active">
                        Active
                    </label>
                    <input
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={formData.active}
                        onChange={handleCheckboxChange}
                        className="shadow border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;

