import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface TravelPackageFormData {
  packageName: string;
  companyName: string;
  venue: string;
  price: string;
  duration: string;
  packageDescription: string;
  inclusion: string[];
  exclusion: string[];
  dayDescriptions: string[];
  maxPersons: number;
  minPersons: number;
  maxDuration: number;
  PackageType: string;
}

const TravelPackageForm: React.FC = () => {
  const vendorId = useSelector((state: RootState) => state.vendor.vendor?._id);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TravelPackageFormData>({
    defaultValues: {
      packageName: '',
      companyName: '',
      venue: '',
      price: '',
      duration: '',
      packageDescription: '',
      inclusion: [''],
      exclusion: [''],
      dayDescriptions: [''],
      maxPersons: 1,
      minPersons: 1,
      maxDuration: 1,
      PackageType: '',
    },
  });

  const watchInclusion = watch('inclusion');
  const watchExclusion = watch('exclusion');
  const watchDayDescriptions = watch('dayDescriptions');

  // Dropdown options for package types
  const packageTypeOptions = [
    'Domestic Trip',
    'International Trip',
    'Budget-Friendly Trip',
    'Adventure Trip',
    'Family Trip',
    'Honeymoon Trip',
    'Couple-Friendly Trip',
  ];

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);

      // Limit to 3 files
      const newFiles = [...images, ...fileArray].slice(0, 3);

      setImages(newFiles);
      setImagePreviews(newFiles.map((file) => URL.createObjectURL(file)));
    }
  };

  // Delete an image
  const handleImageDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  // Dynamic Field Handlers
  const addField = (fieldName: string, value: string) => {
    const currentValues = watch(fieldName as keyof TravelPackageFormData) as string[];
    setValue(fieldName as keyof TravelPackageFormData, [...currentValues, value]);
  };

  const removeField = (fieldName: string, index: number) => {
    const currentValues = watch(fieldName as keyof TravelPackageFormData) as string[];
    const updatedValues = currentValues.filter((_, i) => i !== index);
    setValue(fieldName as keyof TravelPackageFormData, updatedValues);
  };

  // Form submission
  const onSubmit = async (data: TravelPackageFormData) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        'packageData',
        JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          duration: data.duration,
          vendorId,
        })
      );

      // Append images
      images.forEach((file, index) => {
        formData.append(`image${index + 1}`, file);
      });

      const response = await axios.post('http://localhost:5000/vendor/registerPackage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status === 'success') {
        alert('Package uploaded successfully!');
        reset();
        setImages([]);
        setImagePreviews([]);
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Travel Package</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Package Name */}
          <Controller
            name="packageName"
            control={control}
            rules={{ required: 'Package name is required' }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  placeholder="Package Name"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.packageName && <p className="text-red-500 text-sm">{errors.packageName.message}</p>}
              </div>
            )}
          />

          {/* Company Name */}
          <Controller
            name="companyName"
            control={control}
            rules={{ required: 'Company name is required' }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  placeholder="Company Name"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Package Description */}
        <Controller
          name="packageDescription"
          control={control}
          rules={{
            required: 'Package description is required',
            validate: (value) => value.split(' ').length >= 25 || 'Description must have at least 25 words',
          }}
          render={({ field }) => (
            <div>
              <textarea
                {...field}
                placeholder="Package Description"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.packageDescription && <p className="text-red-500 text-sm">{errors.packageDescription.message}</p>}
            </div>
          )}
        />

        {/* Venue */}
        <Controller
          name="venue"
          control={control}
          rules={{ required: 'Venue is required' }}
          render={({ field }) => (
            <div>
              <input
                {...field}
                placeholder="Venue"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.venue && <p className="text-red-500 text-sm">{errors.venue.message}</p>}
            </div>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          {/* Price */}
          <Controller
            name="price"
            control={control}
            rules={{
              required: 'Price is required',
              validate: (value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0 || 'Price must be a positive number',
            }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="Price"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
            )}
          />

          {/* Duration */}
          <Controller
            name="duration"
            control={control}
            rules={{
              required: 'Duration is required',
              validate: (value) => parseInt(value) > 0 || 'Duration must be greater than 0',
            }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="Duration (in days)"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Package Type Dropdown */}
        <Controller
          name="PackageType"
          control={control}
          rules={{ required: 'Please select a package type' }}
          render={({ field }) => (
            <div>
              <select
                {...field}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Package Type</option>
                {packageTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.PackageType && <p className="text-red-500 text-sm">{errors.PackageType.message}</p>}
            </div>
          )}
        />

        {/* Max & Min Persons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Controller
            name="maxPersons"
            control={control}
            rules={{
              required: 'Max persons is required',
              validate: (value) => value > 0 || 'Max persons must be greater than 0',
            }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="number"
                  placeholder="Max Persons"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.maxPersons && <p className="text-red-500 text-sm">{errors.maxPersons.message}</p>}
              </div>
            )}
          />

          <Controller
            name="minPersons"
            control={control}
            rules={{
              required: 'Min persons is required',
              validate: (value) => value > 0 || 'Min persons must be greater than 0',
            }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="number"
                  placeholder="Min Persons"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.minPersons && <p className="text-red-500 text-sm">{errors.minPersons.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Max Duration */}
        <Controller
          name="maxDuration"
          control={control}
          rules={{
            required: 'Max duration is required',
            validate: (value) => value > 0 || 'Max duration must be greater than 0',
          }}
          render={({ field }) => (
            <div>
              <input
                {...field}
                type="number"
                placeholder="Max Duration (in days)"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.maxDuration && <p className="text-red-500 text-sm">{errors.maxDuration.message}</p>}
            </div>
          )}
        />

        {/* Dynamic Fields */}
        {[{ name: 'inclusion', label: 'Inclusion' }, { name: 'exclusion', label: 'Exclusion' }, { name: 'dayDescriptions', label: 'Day Descriptions' }].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-gray-700 mb-2">{label}</label>
            {(watch(name as keyof TravelPackageFormData) as string[]).map((value, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  value={value}
                  onChange={(e) => {
                    const updatedValues = [...(watch(name as keyof TravelPackageFormData) as string[])];
                    updatedValues[index] = e.target.value;
                    setValue(name as keyof TravelPackageFormData, updatedValues);
                  }}
                  placeholder={`Enter ${label}`}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => removeField(name, index)}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField(name, '')}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Add {label}
            </button>
          </div>
        ))}

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload Package Images (Max 3)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-300"
        >
          {loading ? 'Uploading...' : 'Upload Package'}
        </button>
      </form>
    </div>
  );
};

export default TravelPackageForm;
