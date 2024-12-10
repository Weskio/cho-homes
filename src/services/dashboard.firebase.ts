import { getProperties } from './properties.firebase';
import { FirebaseProperty } from './properties.firebase';

export interface DashboardStats {
  totalProperties: number;
  forSaleProperties: number;
  forRentProperties: number;
  totalMessages: number;
  recentProperties: FirebaseProperty[];
  recentMessages: any[];
  propertyTypeDistribution: {
    [key: string]: number;
  };
  averagePrice: {
    sale: number;
    rent: number;
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetch properties
    const properties = await getProperties();

    // Calculate property stats
    const forSaleProperties = properties.filter((p: FirebaseProperty) => p.purpose === 'for-sale');
    const forRentProperties = properties.filter((p: FirebaseProperty) => p.purpose === 'for-rent');

    // Calculate property type distribution
    const propertyTypeDistribution = properties.reduce((acc: { [key: string]: number }, property: FirebaseProperty) => {
      const type = property.propertyType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Calculate average prices
    const averageSalePrice = forSaleProperties.length > 0
      ? forSaleProperties.reduce((sum: number, p: FirebaseProperty) => sum + p.price, 0) / forSaleProperties.length
      : 0;

    const averageRentPrice = forRentProperties.length > 0
      ? forRentProperties.reduce((sum: number, p: FirebaseProperty) => sum + p.price, 0) / forRentProperties.length
      : 0;

    // Get recent properties
    const recentProperties = [...properties]
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);

    return {
      totalProperties: properties.length,
      forSaleProperties: forSaleProperties.length,
      forRentProperties: forRentProperties.length,
      totalMessages: 0, // We'll implement this when we add messaging
      recentProperties,
      recentMessages: [], // We'll implement this when we add messaging
      propertyTypeDistribution,
      averagePrice: {
        sale: averageSalePrice,
        rent: averageRentPrice
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
