import { addProperty, getProperties } from './properties.firebase';
import * as XLSX from 'xlsx';

export const exportProperties = async (): Promise<string> => {
  try {
    const properties = await getProperties();
    
    const excelData = properties.map(property => ({
      Title: property.title,
      Description: property.description,
      Price: property.price,
      Location: property.location,
      Purpose: property.purpose,
      'Property Type': property.propertyType,
      'Number of Bedrooms': property.bedrooms,
      'Number of Bathrooms': property.bathrooms,
      Area: property.area,
      Features: property.features?.join(', ') || '',
      'Image URLs': property.photos?.join(', ') || '',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    const colWidths = [
      { wch: 30 }, // Title
      { wch: 50 }, // Description
      { wch: 15 }, // Price
      { wch: 30 }, // Location
      { wch: 15 }, // Purpose
      { wch: 20 }, // Property Type
      { wch: 10 }, // Bedrooms
      { wch: 10 }, // Bathrooms
      { wch: 15 }, // Area
      { wch: 50 }, // Features
      { wch: 100 }, // Image URLs
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Properties');

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error exporting properties:', error);
    throw new Error('Failed to export properties');
  }
};

export const importProperties = async (file: File): Promise<void> => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const properties = jsonData.map((row: any) => {
      if (!row.Title || !row.Price || !row.Location || !row.Purpose || !row['Property Type']) {
        throw new Error('Missing required fields in Excel file');
      }

      const photoUrls = row['Image URLs'] 
        ? row['Image URLs'].split(',').map((url: string) => url.trim()).filter((url: string) => url)
        : [];

      photoUrls.forEach((url: string) => {
        try {
          new URL(url);
        } catch (e) {
          throw new Error(`Invalid image URL found: ${url}`);
        }
      });

      return {
        title: row.Title,
        description: row.Description || '',
        price: Number(row.Price),
        location: row.Location,
        purpose: row.Purpose.toLowerCase(),
        propertyType: row['Property Type'].toLowerCase(),
        bedrooms: row['Number of Bedrooms'] ? Number(row['Number of Bedrooms']) : undefined,
        bathrooms: row['Number of Bathrooms'] ? Number(row['Number of Bathrooms']) : undefined,
        area: row.Area ? Number(row.Area) : undefined,
        features: row.Features ? row.Features.split(',').map((f: string) => f.trim()) : [],
        photos: [], // Initialize empty array for Firebase storage photos
        source: 'firebase' as const,
      };
    });

    for (const property of properties) {
      const row = jsonData.find((r: any) => r.Title === property.title);
      const imageUrls = row['Image URLs'] 
        ? row['Image URLs'].split(',').map((url: string) => url.trim()).filter((url: string) => url)
        : [];
      
      // Pass empty array for File uploads and image URLs separately
      await addProperty(property, [], imageUrls);
    }
  } catch (error) {
    console.error('Error importing properties:', error);
    throw error;
  }
};
