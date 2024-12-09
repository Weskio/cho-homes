import React from 'react';
import { FirebaseProperty } from '../../services/properties.firebase';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';

interface PropertyAdminCardProps {
  property: FirebaseProperty;
  onEdit: (property: FirebaseProperty) => void;
  onDelete: (id: string) => void;
}

const PropertyAdminCard: React.FC<PropertyAdminCardProps> = ({
  property,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-dark-90 rounded-lg border border-dark-80 p-4 relative group">
      <img
        src={property.photos[0]}
        alt={property.title}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
      <p className="text-dark-10 mb-2">{property.location}</p>
      <p className="text-xl font-bold text-btn-primary">
        ${property.price.toLocaleString()}
      </p>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(property)}
          className="px-3 py-1 bg-btn-primary text-white rounded mr-2 hover:bg-btn-primary-hover transition-colors"
        >
          <FaPencilAlt className="inline-block mr-1" /> Edit
        </button>
        <button
          onClick={() => onDelete(property.id!)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          <FaTrash className="inline-block mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};

export default PropertyAdminCard;
