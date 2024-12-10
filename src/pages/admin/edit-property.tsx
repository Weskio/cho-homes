import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FirebaseProperty, getProperty, updateProperty } from '../../services/properties.firebase';
import Loading from '../../components/reusables/loading';
import PageTransition from '../../components/reusables/page-transition';
import PropertyForm from '../../components/forms/property-form';

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<FirebaseProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    if (!id) return;
    try {
      const data = await getProperty(id);
      setProperty(data);
    } catch (err) {
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProperty = async (formData: any, images: File[], removedImages?: string[]) => {
    if (!id) return;

    try {
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        features: formData.features.split(',').map((f: string) => f.trim()),
        contactInfo: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
      };

      await updateProperty(id, propertyData, images, removedImages);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to update property');
    }
  };

  if (loading) return <Loading />;
  if (!property) return <div>Property not found</div>;

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Property</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <PropertyForm
          initialData={property}
          onSubmit={handleUpdateProperty}
          onCancel={() => navigate('/admin/dashboard')}
          submitLabel="Update Property"
        />
      </div>
    </PageTransition>
  );
};

export default EditProperty;
