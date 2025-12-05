import Papa from 'papaparse';

export const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    console.warn("CSV Parsing errors:", results.errors);
                }
                resolve(processData(results.data));
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};

const parseCurrency = (value) => {
    if (!value) return 0;
    // Remove currency symbols and commas
    const clean = value.toString().replace(/[^0-9.-]+/g, "");
    return parseFloat(clean) || 0;
};

// Infer category from product name using keyword matching
const inferCategory = (productName) => {
    if (!productName) return 'Other';
    const name = productName.toLowerCase();

    // Groceries - produce, food items
    const groceryKeywords = [
        'organic', 'broccoli', 'shallot', 'lemon', 'avocado', 'blueberr', 'strawberr',
        'banana', 'apple', 'orange', 'tomato', 'onion', 'garlic', 'pepper', 'lettuce',
        'spinach', 'carrot', 'potato', 'chicken', 'beef', 'pork', 'salmon', 'fish',
        'milk', 'cheese', 'yogurt', 'butter', 'egg', 'bread', 'rice', 'pasta',
        'cereal', 'coffee', 'tea', 'juice', 'water', 'soda', 'snack', 'cookie',
        'chip', 'cracker', 'nut', 'fruit', 'vegetable', 'meat', 'seafood', 'frozen',
        'grocery', 'food', 'produce', 'fresh', 'whole foods', 'amazon fresh',
        'paper bag fee', '1 each', 'pint', 'bunch', 'lb', 'oz'
    ];
    if (groceryKeywords.some(kw => name.includes(kw))) return 'Groceries';

    // Electronics & Tech
    const electronicsKeywords = [
        'cable', 'charger', 'adapter', 'usb', 'hdmi', 'phone', 'case', 'screen',
        'battery', 'headphone', 'earphone', 'earbud', 'speaker', 'bluetooth',
        'kindle', 'echo', 'alexa', 'fire tv', 'roku', 'tablet', 'laptop',
        'keyboard', 'mouse', 'monitor', 'computer', 'hard drive', 'ssd', 'memory',
        'electronic', 'tech', 'gaming', 'controller', 'nintendo', 'playstation', 'xbox'
    ];
    if (electronicsKeywords.some(kw => name.includes(kw))) return 'Electronics';

    // Home & Household
    const homeKeywords = [
        'towel', 'sheet', 'pillow', 'blanket', 'curtain', 'rug', 'mat',
        'storage', 'container', 'basket', 'organizer', 'hook', 'hanger',
        'cleaning', 'soap', 'detergent', 'sponge', 'brush', 'mop', 'vacuum',
        'trash', 'bag', 'tissue', 'paper towel', 'toilet paper', 'napkin',
        'kitchen', 'bathroom', 'bedroom', 'living', 'home', 'house', 'furniture'
    ];
    if (homeKeywords.some(kw => name.includes(kw))) return 'Home & Household';

    // Health & Beauty
    const beautyKeywords = [
        'shampoo', 'conditioner', 'lotion', 'cream', 'moisturizer', 'sunscreen',
        'makeup', 'cosmetic', 'lipstick', 'mascara', 'foundation', 'brush',
        'razor', 'shaving', 'toothpaste', 'toothbrush', 'floss', 'mouthwash',
        'vitamin', 'supplement', 'medicine', 'bandage', 'first aid', 'health',
        'beauty', 'skincare', 'haircare', 'personal care', 'deodorant', 'perfume'
    ];
    if (beautyKeywords.some(kw => name.includes(kw))) return 'Health & Beauty';

    // Books & Media
    const booksKeywords = [
        'book', 'novel', 'paperback', 'hardcover', 'kindle edition', 'ebook',
        'magazine', 'comic', 'manga', 'audiobook', 'dvd', 'blu-ray', 'cd', 'vinyl'
    ];
    if (booksKeywords.some(kw => name.includes(kw))) return 'Books & Media';

    // Clothing & Accessories
    const clothingKeywords = [
        'shirt', 'pants', 'jeans', 'dress', 'skirt', 'jacket', 'coat', 'sweater',
        'sock', 'underwear', 'bra', 'shoe', 'boot', 'sandal', 'sneaker',
        'hat', 'cap', 'scarf', 'glove', 'belt', 'watch', 'jewelry', 'sunglasses',
        'clothing', 'apparel', 'wear', 'fashion'
    ];
    if (clothingKeywords.some(kw => name.includes(kw))) return 'Clothing';

    // Baby & Kids
    const babyKeywords = [
        'baby', 'diaper', 'formula', 'pacifier', 'bottle', 'stroller', 'crib',
        'toy', 'game', 'puzzle', 'lego', 'doll', 'action figure', 'kids', 'children'
    ];
    if (babyKeywords.some(kw => name.includes(kw))) return 'Baby & Kids';

    // Pet Supplies
    const petKeywords = [
        'dog', 'cat', 'pet', 'food', 'treat', 'leash', 'collar', 'toy', 'bed',
        'litter', 'aquarium', 'fish', 'bird'
    ];
    if (petKeywords.some(kw => name.includes(kw))) return 'Pet Supplies';

    // Office & School
    const officeKeywords = [
        'pen', 'pencil', 'marker', 'notebook', 'paper', 'folder', 'binder',
        'tape', 'stapler', 'scissors', 'glue', 'envelope', 'label', 'office',
        'desk', 'chair', 'lamp', 'calendar', 'planner'
    ];
    if (officeKeywords.some(kw => name.includes(kw))) return 'Office & School';

    return 'Other';
};

export const processData = (data) => {
    let totalSpend = 0;
    const categoryMap = {};
    const itemMap = {};
    const itemSpendMap = {}; // Track spending per item
    const monthlySpend = {};
    const weekdaySpend = {}; // 0-6
    const orderIds = new Set(); // Track unique Order IDs
    let earliestDate = new Date();
    let latestDate = new Date(0);

    data.forEach((row) => {
        // Amazon Privacy Request columns:
        // "Order Date", "Product Name", "Unit Price", "Quantity", "Shipment Item Subtotal"

        const dateStr = row['Order Date'] || row['OrderDate'];
        const title = row['Title'] || row['Item Name'] || row['Product Name'];
        const orderId = row['Order ID'];

        // CRITICAL: Use "Total Owed" column which is the actual amount paid per item
        // Do NOT use "Shipment Item Subtotal" as it's shared across multiple items in the same order
        let amount = parseCurrency(row['Total Owed']);

        // Fallback chain if Total Owed is missing
        if (amount === 0) {
            amount = parseCurrency(row['Item Total'] || row['ItemTotal']);
        }

        // Final fallback: Unit Price * Quantity
        if (amount === 0) {
            const price = parseCurrency(row['Purchase Price Per Unit'] || row['Price'] || row['Unit Price']);
            const qty = parseInt(row['Quantity'] || 1, 10);
            amount = price * qty;
        }

        if (!dateStr || amount === 0) return;

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;

        // Filter: Only include orders from 2025
        if (date.getFullYear() !== 2025) return;

        // Track unique Order ID for accurate order count
        if (orderId) {
            orderIds.add(orderId);
        }

        // Update date range
        if (date < earliestDate) earliestDate = date;
        if (date > latestDate) latestDate = date;

        // Total Spend
        totalSpend += amount;

        // Category Analysis - infer from product name if not in CSV
        const category = row['Category'] || inferCategory(title);
        if (category && category !== 'Uncategorized' && category !== 'Other') {
            categoryMap[category] = (categoryMap[category] || 0) + amount;
        }

        // Item Analysis (Frequency)
        if (title) {
            // Simple title cleaning
            const cleanTitle = title.length > 50 ? title.substring(0, 50) + '...' : title;
            itemMap[cleanTitle] = (itemMap[cleanTitle] || 0) + 1;
            // Also track spending per item
            itemSpendMap[cleanTitle] = (itemSpendMap[cleanTitle] || 0) + amount;
        }

        // Monthly Trend (YYYY-MM)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlySpend[monthKey] = (monthlySpend[monthKey] || 0) + amount;

        // Weekday Analysis
        const day = date.getDay();
        weekdaySpend[day] = (weekdaySpend[day] || 0) + 1;
    });

    // Convert maps to sorted arrays
    const topCategories = Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const topItems = Object.entries(itemMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Get top 10 for flexibility

    const topItemsBySpend = Object.entries(itemSpendMap)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10); // Get top 10 for flexibility

    const monthlyTrend = Object.entries(monthlySpend)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Find peak month
    const peakMonth = monthlyTrend.length > 0
        ? monthlyTrend.reduce((max, curr) => curr.amount > max.amount ? curr : max)
        : null;

    return {
        totalSpend,
        topCategories,
        topItems,
        topItemsBySpend,
        monthlyTrend,
        weekdaySpend,
        earliestDate,
        latestDate,
        peakMonth,
        totalOrders: orderIds.size // Count unique Order IDs
    };
};
