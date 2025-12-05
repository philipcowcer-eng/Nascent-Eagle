import { describe, it, expect } from 'vitest';
import { processData } from './analyzer';

describe('processData', () => {
    it('should calculate total spend correctly (Standard Schema)', () => {
        const mockData = [
            { 'Order Date': '2023-01-01', 'Item Total': '$10.00' },
            { 'Order Date': '2023-01-02', 'Item Total': '$20.50' },
        ];
        const result = processData(mockData);
        expect(result.totalSpend).toBe(30.50);
    });

    it('should calculate total spend correctly (Privacy Request Schema)', () => {
        const mockData = [
            {
                'Order Date': '2023-01-01',
                'Product Name': 'Item A',
                'Unit Price': '10.00',
                'Quantity': '2',
                'Shipment Item Subtotal': '20.00'
            },
            {
                'Order Date': '2023-01-02',
                'Product Name': 'Item B',
                'Unit Price': '5.50',
                'Quantity': '1'
                // Missing Shipment Item Subtotal, should fallback to Unit Price * Quantity
            },
        ];
        const result = processData(mockData);
        expect(result.totalSpend).toBe(25.50); // 20.00 + 5.50
        expect(result.topItems[0].name).toBe('Item A');
    });

    it('should identify top categories', () => {
        const mockData = [
            { 'Order Date': '2023-01-01', 'Item Total': '$10.00', 'Category': 'Books' },
            { 'Order Date': '2023-01-02', 'Item Total': '$20.00', 'Category': 'Electronics' },
            { 'Order Date': '2023-01-03', 'Item Total': '$30.00', 'Category': 'Books' },
        ];
        const result = processData(mockData);
        expect(result.topCategories[0].name).toBe('Books');
        expect(result.topCategories[0].value).toBe(40.00);
    });

    it('should handle missing categories gracefully', () => {
        const mockData = [
            { 'Order Date': '2023-01-01', 'Item Total': '$10.00' }, // Missing Category
        ];
        const result = processData(mockData);
        expect(result.topCategories).toEqual([]);
    });
});
