import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { getProperties } from './properties.firebase';
import { getMessages } from './messages.firebase';

export interface DashboardStats {
  totalProperties: number;
  forSaleProperties: number;
  forRentProperties: number;
  totalMessages: number;
  recentProperties: any[];
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
    // Fetch all required data in parallel
    const [properties, messages] = await Promise.all([
      getProperties(),
      getMessages()
    ]);

    // Calculate property stats
    const forSaleProperties = properties.filter(p => p.purpose === 'for-sale');
    const forRentProperties = properties.filter(p => p.purpose === 'for-rent');

    // Calculate property type distribution
    const propertyTypeDistribution = properties.reduce((acc: { [key: string]: number }, property) => {
      const type = property.propertyType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Calculate average prices
    const averageSalePrice = forSaleProperties.length > 0
      ? forSaleProperties.reduce((sum, p) => sum + p.price, 0) / forSaleProperties.length
      : 0;

    const averageRentPrice = forRentProperties.length > 0
      ? forRentProperties.reduce((sum, p) => sum + p.price, 0) / forRentProperties.length
      : 0;

    // Get recent properties and messages
    const recentProperties = [...properties]
      .sort((a, b) => {
        // Handle cases where createdAt might be undefined or not a Firebase timestamp
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
        return dateB - dateA;
      })
      .slice(0, 5);

    const recentMessages = [...messages]
      .sort((a, b) => {
        // Handle cases where timestamp might be undefined or not a Firebase timestamp
        const dateA = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : 0;
        const dateB = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : 0;
        return dateB - dateA;
      })
      .slice(0, 5);

    return {
      totalProperties: properties.length,
      forSaleProperties: forSaleProperties.length,
      forRentProperties: forRentProperties.length,
      totalMessages: messages.length,
      recentProperties,
      recentMessages,
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
