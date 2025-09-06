import { lisbonHostels } from '../../lib/mockData';

describe('Mock Data', () => {
  it('exports lisbonHostels array', () => {
    expect(Array.isArray(lisbonHostels)).toBe(true);
    expect(lisbonHostels.length).toBeGreaterThan(0);
  });

  it('each hostel has required properties', () => {
    lisbonHostels.forEach((hostel) => {
      expect(hostel).toHaveProperty('id');
      expect(hostel).toHaveProperty('name');
      expect(hostel).toHaveProperty('location');
      expect(hostel).toHaveProperty('price');
      expect(hostel).toHaveProperty('rating');
      expect(hostel).toHaveProperty('reviews');
      expect(hostel).toHaveProperty('images');
      expect(hostel).toHaveProperty('description');
      expect(hostel).toHaveProperty('amenities');
      expect(hostel).toHaveProperty('rooms');
    });
  });

  it('hostel properties have correct types', () => {
    const hostel = lisbonHostels[0];

    expect(typeof hostel.id).toBe('number');
    expect(typeof hostel.name).toBe('string');
    expect(typeof hostel.location).toBe('string');
    expect(typeof hostel.price).toBe('number');
    expect(typeof hostel.rating).toBe('number');
    expect(typeof hostel.reviews).toBe('number');
    expect(Array.isArray(hostel.images)).toBe(true);
    expect(typeof hostel.description).toBe('string');
    expect(Array.isArray(hostel.amenities)).toBe(true);
    expect(Array.isArray(hostel.rooms)).toBe(true);
  });

  it('hostel images are valid URLs', () => {
    lisbonHostels.forEach((hostel) => {
      hostel.images.forEach((image) => {
        expect(typeof image).toBe('string');
        expect(image.startsWith('http')).toBe(true);
      });
    });
  });

  it('hostel ratings are within valid range', () => {
    lisbonHostels.forEach((hostel) => {
      expect(hostel.rating).toBeGreaterThanOrEqual(0);
      expect(hostel.rating).toBeLessThanOrEqual(5);
    });
  });

  it('each hostel has at least one room', () => {
    lisbonHostels.forEach((hostel) => {
      expect(hostel.rooms.length).toBeGreaterThan(0);
    });
  });

  it('room objects have required properties', () => {
    lisbonHostels.forEach((hostel) => {
      hostel.rooms.forEach((room) => {
        expect(room).toHaveProperty('type');
        expect(room).toHaveProperty('beds');
        expect(room).toHaveProperty('price');
      });
    });
  });
});