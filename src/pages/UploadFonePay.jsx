import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '../components/Input';
import { updateFonePayDetails } from '../api/api';

function UploadFonePay() {
  const methods = useForm();

  const handleSubmit = async (data) => {
    try {
      await updateFonePayDetails(data);
      console.log('Form submitted successfully', data);
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload FonePay Details</h2>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
          <Input label="Username" name="username" required />
          <Input label="Password" name="password" type="password" required />
          <Input label="Merchant Code" name="merchant_code" required />
          <Input label="PAN" name="pan" required />
          <Input label="Secret" name="secret" required />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

export default UploadFonePay;
