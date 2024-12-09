import { useState, useEffect, useRef } from 'react';
import { FirebaseProperty, getProperties, deleteProperty, addProperty, updateProperty } from '../../services/properties.firebase';
import Loading from '../../components/reusables/loading';
import PageTransition from '../../components/reusables/page-transition';
import PropertyForm from '../../components/forms/property-form';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth-context';
import { useDataCache } from '../../hooks/useDataCache';
import { exportProperties, importProperties } from '../../services/properties.import-export';
import { toast } from 'react-hot-toast';

const AdminProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<FirebaseProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<FirebaseProperty | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurpose, setFilterPurpose] = useState<'all' | 'for-rent' | 'for-sale'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const cache = useDataCache();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const cachedProperties = cache.getProperties();
      
      if (cachedProperties.isValid) {
        setProperties(cachedProperties.data);
        setLoading(false);
        return;
      }

      const data = await getProperties();
      setProperties(data);
      cache.setProperties(data);
      setError('');
    } catch (err) {
      setError('Failed to load properties');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        // Optimistic update
        const updatedProperties = properties.filter(p => p.id !== id);
        setProperties(updatedProperties);
        cache.setProperties(updatedProperties);
        
        await deleteProperty(id);
      } catch (err) {
        setError('Failed to delete property');
        console.error('Error deleting property:', err);
        // Revert on error
        await loadProperties();
      }
    }
  };

  const handleAddProperty = async (formData: any, images: File[]) => {
    if (!user) {
      setError('You must be logged in to add properties');
      return;
    }

    try {
      setLoading(true);
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        purpose: formData.purpose,
        propertyType: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        features: formData.features.split(',').map((f: string) => f.trim()).filter(Boolean),
        contactInfo: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
        photos: images.map((image) => image.name),
      };

      await addProperty(propertyData, images);
      const newData = await getProperties();
      setProperties(newData);
      cache.setProperties(newData);
      setIsAddingProperty(false);
      setError('');
    } catch (err) {
      setError('Failed to add property');
      console.error('Error adding property:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProperty = async (formData: any, images: File[], removedImages: string[] = []) => {
    if (!editingProperty?.id || !user) {
      setError('Unable to update property');
      return;
    }

    try {
      setLoading(true);
      // Get existing photos that weren't removed
      const existingPhotos = editingProperty.photos.filter(photo => !removedImages.includes(photo));
      
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        purpose: formData.purpose,
        propertyType: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        features: formData.features.split(',').map((f: string) => f.trim()).filter(Boolean),
        contactInfo: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
        photos: [...existingPhotos, ...images.map(image => image.name)],
      };

      await updateProperty(editingProperty.id, propertyData, images, removedImages);
      const newData = await getProperties();
      setProperties(newData);
      cache.setProperties(newData);
      setEditingProperty(null);
      setError('');
    } catch (err) {
      setError('Failed to update property');
      console.error('Error updating property:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const downloadUrl = await exportProperties();
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `cho-homes-properties-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success('Properties exported successfully');
    } catch (error) {
      toast.error('Failed to export properties');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      await importProperties(file);
      const updatedProperties = await getProperties();
      setProperties(updatedProperties);
      toast.success('Properties imported successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import properties');
      console.error(error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filteredProperties = properties
    .filter(property => 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(property => 
      filterPurpose === 'all' ? true : property.purpose === filterPurpose
    );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <Loading />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Properties</h1>
          <div className="flex gap-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImport}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="px-4 py-2 bg-dark-90 text-white rounded-lg hover:bg-dark-80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Importing...
                </>
              ) : (
                'Import Excel'
              )}
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-dark-90 text-white rounded-lg hover:bg-dark-80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                'Export Excel'
              )}
            </button>
            <button
              onClick={() => setIsAddingProperty(true)}
              className="flex items-center gap-2 px-4 py-2 bg-btn-primary text-white rounded hover:bg-btn-primary-hover transition-colors"
            >
              <FiPlus /> Add Property
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-10" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-90 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-dark-10" />
            <select
              value={filterPurpose}
              onChange={(e) => setFilterPurpose(e.target.value as any)}
              className="px-4 py-2 bg-dark-90 border border-dark-80 rounded focus:outline-none focus:border-btn-primary"
            >
              <option value="all">All Properties</option>
              <option value="for-rent">For Rent</option>
              <option value="for-sale">For Sale</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-90 rounded-lg border border-dark-80 overflow-hidden group"
            >
              <div className="relative h-48">
                <img
                  src={property.photos[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => setEditingProperty(property)}
                    className="p-2 bg-btn-primary text-white rounded hover:bg-btn-primary-hover transition-colors"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property.id!)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-dark-10 mb-2">{property.location}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-btn-primary">
                    ${property.price.toLocaleString()}
                  </p>
                  <span className="text-sm px-2 py-1 rounded bg-dark-80">
                    {property.purpose === 'for-rent' ? 'For Rent' : 'For Sale'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === number
                    ? 'bg-btn-primary text-white'
                    : 'bg-dark-90 text-white hover:bg-dark-80'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        )}

        {isAddingProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-90 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Add New Property</h2>
              <PropertyForm
                onSubmit={handleAddProperty}
                onCancel={() => setIsAddingProperty(false)}
                submitLabel="Add Property"
              />
            </div>
          </div>
        )}

        {editingProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-90 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
              <PropertyForm
                initialData={editingProperty}
                onSubmit={handleUpdateProperty}
                onCancel={() => setEditingProperty(null)}
                submitLabel="Update Property"
              />
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminProperties;
