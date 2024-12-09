import React, { useEffect, useState } from 'react';
import { FirebaseProperty } from '../../services/properties.firebase';
import { FaTrash } from 'react-icons/fa';

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  purpose: 'for-rent' | 'for-sale';
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  features: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface PropertyFormProps {
  initialData?: Partial<FirebaseProperty>;
  onSubmit: (data: PropertyFormData, images: File[], currentImages: string[], removedImages?: string[]) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    location: initialData?.location || '',
    purpose: initialData?.purpose || 'for-rent',
    propertyType: initialData?.propertyType || '',
    bedrooms: initialData?.bedrooms?.toString() || '',
    bathrooms: initialData?.bathrooms?.toString() || '',
    area: initialData?.area?.toString() || '',
    features: Array.isArray(initialData?.features) ? initialData.features.join(', ') : '',
    contactName: initialData?.contactInfo?.name || '',
    contactEmail: initialData?.contactInfo?.email || '',
    contactPhone: initialData?.contactInfo?.phone || '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>(
    Array.isArray(initialData?.photos) ? initialData.photos : []
  );
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urls = images.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveCurrentImage = (imageUrl: string) => {
    if (!currentImages.length) return;
    setCurrentImages(currentImages.filter(url => url !== imageUrl));
    setRemovedImages([...removedImages, imageUrl]);
  };

  const handleRemoveNewImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData, images, currentImages, removedImages);
    } catch (err) {
      setError('Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
      </div>

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary h-32"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
        <select
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value as 'for-rent' | 'for-sale' })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        >
          <option value="for-rent">For Rent</option>
          <option value="for-sale">For Sale</option>
        </select>
        <input
          type="text"
          placeholder="Property Type"
          value={formData.propertyType}
          onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Bedrooms"
          value={formData.bedrooms}
          onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
        <input
          type="number"
          placeholder="Bathrooms"
          value={formData.bathrooms}
          onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
        <input
          type="number"
          placeholder="Area (sq ft)"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
      </div>

      <input
        type="text"
        placeholder="Features (comma-separated)"
        value={formData.features}
        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
        className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Contact Name"
          value={formData.contactName}
          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={formData.contactEmail}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
        <input
          type="tel"
          placeholder="Contact Phone"
          value={formData.contactPhone}
          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          className="w-full px-4 py-2 bg-dark-100 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
            id="property-images"
          />
          <label
            htmlFor="property-images"
            className="px-4 py-2 bg-dark-80 hover:bg-dark-70 rounded cursor-pointer transition-colors"
          >
            Add Images
          </label>
        </div>

        {/* Current Images */}
        {currentImages.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Current Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentImages.map((url, index) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCurrentImage(url)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        {previewUrls.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">New Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={`New ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-dark-80 hover:bg-dark-70 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-btn-primary hover:bg-btn-primary-hover text-white rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
