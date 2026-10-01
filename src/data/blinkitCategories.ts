export interface BlinkitCategory {
  id: string;
  name: string;
  department: 'Grocery & Kitchen' | 'Snacks & Drinks' | 'Beauty & Personal Care' | 'Other Essential Departments';
  images: string[]; // 2-3 product packshots inside the tile
  subcategories: string[];
  bannerHighlight?: string;
}

export interface BlinkitDepartment {
  title: string;
  description?: string;
  categories: BlinkitCategory[];
}

export const BLINKIT_DEPARTMENTS: BlinkitDepartment[] = [
  {
    title: 'Grocery & Kitchen',
    description: 'Fresh farm produce, staples, dairy & kitchen essentials',
    categories: [
      {
        id: 'cat-veg-fruits',
        name: 'Vegetables & Fruits',
        department: 'Grocery & Kitchen',
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop&q=80', // Tomato
          'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&auto=format&fit=crop&q=80', // Banana
        ],
        subcategories: ['Fresh Vegetables', 'Fresh Fruits', 'Leafy Greens', 'Hydroponics & Salads'],
      },
      {
        id: 'cat-atta-rice-dal',
        name: 'Atta, Rice & Dal',
        department: 'Grocery & Kitchen',
        images: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80', // Flour
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80', // Basmati Rice
        ],
        subcategories: ['Atta & Flour', 'Basmati Rice', 'Pulses & Lentils', 'Poha & Grains'],
      },
      {
        id: 'cat-oil-ghee-masala',
        name: 'Oil, Ghee & Masala',
        department: 'Grocery & Kitchen',
        images: [
          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80', // Oil bottle
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&auto=format&fit=crop&q=80', // Spices
        ],
        subcategories: ['Cooking Oils', 'Desi Ghee', 'Powdered Spices', 'Whole Spices & Seeds'],
      },
      {
        id: 'cat-dairy-bread-eggs',
        name: 'Dairy, Bread & Eggs',
        department: 'Grocery & Kitchen',
        images: [
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80', // Milk
          'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&auto=format&fit=crop&q=80', // Eggs
        ],
        subcategories: ['Milk', 'Bread & Pav', 'Eggs', 'Butter & Cheese', 'Paneer & Curd'],
      },
      {
        id: 'cat-bakery-biscuits',
        name: 'Bakery & Biscuits',
        department: 'Grocery & Kitchen',
        images: [
          'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&auto=format&fit=crop&q=80', // Bourbon
          'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&auto=format&fit=crop&q=80', // Cookies
        ],
        subcategories: ['Digestive Biscuits', 'Cookies & Rusk', 'Choco Fills', 'Whole Wheat Bread'],
      },
      {
        id: 'cat-dryfruits-cereals',
        name: 'Dry Fruits & Cereals',
        department: 'Grocery & Kitchen',
        images: [
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=80', // Cornflakes/cereal
          'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=300&auto=format&fit=crop&q=80', // Almonds & Cashews
        ],
        subcategories: ['Breakfast Cereals', 'Almonds & Cashews', 'Makhana & Fox Nuts', 'Raisins & Dates'],
      },
      {
        id: 'cat-meat-fish',
        name: 'Chicken, Meat & Fish',
        department: 'Grocery & Kitchen',
        images: [
          'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&auto=format&fit=crop&q=80', // Chicken breast
          'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&auto=format&fit=crop&q=80', // Prawns / Fish
        ],
        subcategories: ['Fresh Chicken', 'Tender Mutton', 'Fish & Seafood', 'Ready to Fry'],
      },
      {
        id: 'cat-kitchenware',
        name: 'Kitchenware & Appliances',
        department: 'Grocery & Kitchen',
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80', // Copper bottle
          'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&auto=format&fit=crop&q=80', // Mixer Grinder / Cookware
        ],
        subcategories: ['Water Bottles & Flasks', 'Mixer Grinders & Blenders', 'Cookware & Pans', 'Kitchen Cutlery'],
      },
    ],
  },
  {
    title: 'Snacks & Drinks',
    description: 'Crisp snacks, chocolates, carbonated colas & instant treats',
    categories: [
      {
        id: 'cat-chips-namkeen',
        name: 'Chips & Namkeen',
        department: 'Snacks & Drinks',
        images: [
          'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=80', // Lays
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80', // Bhujia
        ],
        subcategories: ['Potato Chips', 'Aloo Bhujia & Namkeen', 'Banana Chips', 'Corn Curls & Puffs'],
      },
      {
        id: 'cat-sweets-chocolates',
        name: 'Sweets & Chocolates',
        department: 'Snacks & Drinks',
        images: [
          'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300&auto=format&fit=crop&q=80', // Silk
          'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=300&auto=format&fit=crop&q=80', // Gulab Jamun
        ],
        subcategories: ['Milk & Dark Chocolates', 'Gulab Jamun & Rasgulla', 'Kaju Katli & Barfi', 'Gift Packs'],
      },
      {
        id: 'cat-drinks-juices',
        name: 'Drinks & Juices',
        department: 'Snacks & Drinks',
        images: [
          'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80', // Cola
          'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop&q=80', // Mango Juice
        ],
        subcategories: ['Fruit Juices & Nectars', 'Cold Drinks & Diet Soda', 'Tender Coconut Water', 'Energy & Electrolytes'],
      },
      {
        id: 'cat-tea-coffee',
        name: 'Tea, Coffee & Milk Drinks',
        department: 'Snacks & Drinks',
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80', // Nescafe
          'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80', // Tea
        ],
        subcategories: ['Instant Coffee', 'Chai & Leaf Tea', 'Green Tea', 'Bournvita & Milk Additives'],
      },
      {
        id: 'cat-instant-food',
        name: 'Instant Food',
        department: 'Snacks & Drinks',
        images: [
          'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80', // Maggi
          'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=80', // French Fries
        ],
        subcategories: ['2-Minute Noodles', 'Cup Noodles', 'Ready to Eat Curries', 'Frozen French Fries'],
      },
      {
        id: 'cat-sauces-spreads',
        name: 'Sauces & Spreads',
        department: 'Snacks & Drinks',
        images: [
          'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=300&auto=format&fit=crop&q=80', // Nutella
          'https://images.unsplash.com/photo-1589135233689-d562f4e75d04?w=300&auto=format&fit=crop&q=80', // Tomato Ketchup
        ],
        subcategories: ['Tomato Ketchup', 'Chocolate Hazelnut Spread', 'Peanut Butter', 'Mayonnaise & Dips'],
      },
      {
        id: 'cat-paan-corner',
        name: 'Paan Corner',
        department: 'Snacks & Drinks',
        images: [
          'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&auto=format&fit=crop&q=80', // Mints / Gum
          'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=300&auto=format&fit=crop&q=80', // Mouth freshener
        ],
        subcategories: ['Mouth Fresheners & Mukhwas', 'Chewing Gums & Mints', 'Scented Supari', 'Digestive Drops'],
      },
      {
        id: 'cat-ice-creams',
        name: 'Ice Creams & More',
        department: 'Snacks & Drinks',
        images: [
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&auto=format&fit=crop&q=80', // Ice Cream Tub
          'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=300&auto=format&fit=crop&q=80', // Chocobar
        ],
        subcategories: ['Family Tubs', 'Cornetto & Cones', 'Chocobar & Sticks', 'Kulfi & Desserts'],
      },
    ],
  },
  {
    title: 'Beauty & Personal Care',
    description: 'Skincare, haircare, makeup & daily bath wellness',
    categories: [
      {
        id: 'cat-bath-body',
        name: 'Bath & Body',
        department: 'Beauty & Personal Care',
        images: [
          'https://images.unsplash.com/photo-1608248597359-53e7d6928e46?w=300&auto=format&fit=crop&q=80', // Soap
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', // Toothpaste / Wash
        ],
        subcategories: ['Bathing Soaps & Bars', 'Body Washes & Shower Gels', 'Toothpastes & Brushes', 'Handwashes & Sanitizers'],
      },
      {
        id: 'cat-hair',
        name: 'Hair',
        department: 'Beauty & Personal Care',
        images: [
          'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80', // Shampoo
          'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&auto=format&fit=crop&q=80', // Hair Color
        ],
        subcategories: ['Shampoos & Conditioners', 'Hair Oils & Serums', 'Hair Color & Henna', 'Styling Gel'],
      },
      {
        id: 'cat-skin-face',
        name: 'Skin & Face',
        department: 'Beauty & Personal Care',
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80', // Cleanser
          'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&auto=format&fit=crop&q=80', // Sunscreen
        ],
        subcategories: ['Face Washes & Scrubs', 'Sunscreen & Matte Gels', 'Face Serums & Toners', 'Moisturizers'],
      },
      {
        id: 'cat-beauty-cosmetics',
        name: 'Beauty & Cosmetics',
        department: 'Beauty & Personal Care',
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&auto=format&fit=crop&q=80', // Lipstick
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80', // Makeup Brush
        ],
        subcategories: ['Liquid Lipsticks', 'Kajal & Eyeliner', 'Makeup Brushes & Sponges', 'Compact Powder'],
      },
    ],
  },
  {
    title: 'Other Essential Departments',
    description: 'Hygiene, baby care, health, home comfort & lifestyle',
    categories: [
      {
        id: 'cat-feminine-hygiene',
        name: 'Feminine Hygiene',
        department: 'Other Essential Departments',
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', // Whisper pads
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80', // Hair removal
        ],
        subcategories: ['Sanitary Pads & Liners', 'Hair Removal Creams', 'Intimate Washes', 'Tampons'],
      },
      {
        id: 'cat-baby-care',
        name: 'Baby Care',
        department: 'Other Essential Departments',
        images: [
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&auto=format&fit=crop&q=80', // Diapers
          'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300&auto=format&fit=crop&q=80', // Sipper cup
        ],
        subcategories: ['Diaper Pants & Wipes', 'Feeding Bottles & Sippers', 'Baby Wash & Shampoos', 'Baby Lotions'],
      },
      {
        id: 'cat-health-pharma',
        name: 'Health & Pharma',
        department: 'Other Essential Departments',
        images: [
          'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=300&auto=format&fit=crop&q=80', // Whey Protein
          'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=80', // Cough Syrup
        ],
        subcategories: ['Whey Protein & Supplements', 'Cough & Cold Relief', 'Pain Relief Sprays & Balms', 'First Aid & Bandages'],
      },
      {
        id: 'cat-sexual-wellness',
        name: 'Sexual Wellness',
        department: 'Other Essential Departments',
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', // Condoms
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80', // Massager / lube
        ],
        subcategories: ['Ultra-Thin Condoms', 'Massage & Lubricant Gels', 'Climax Delay Rings', 'Personal Wellness'],
      },
      {
        id: 'cat-home-lifestyle',
        name: 'Home & Lifestyle',
        department: 'Other Essential Departments',
        images: [
          'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80', // Bed sheet
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&auto=format&fit=crop&q=80', // Plant pot
        ],
        subcategories: ['Bedsheets & Pillow Covers', 'Live Indoor Air-Purifying Plants', 'Fragrance Diffusers', 'Storage Organizers'],
      },
      {
        id: 'cat-cleaners-repellents',
        name: 'Cleaners & Repellents',
        department: 'Other Essential Departments',
        images: [
          'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300&auto=format&fit=crop&q=80', // Surf Excel
          'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=300&auto=format&fit=crop&q=80', // Harpic
        ],
        subcategories: ['Liquid Detergent & Powder', 'Toilet Cleaners', 'Glass Cleaners', 'Mosquito Repellents & Vaporizers'],
      },
      {
        id: 'cat-electronics',
        name: 'Electronics',
        department: 'Other Essential Departments',
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80', // TWS Earbuds
          'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80', // Steam Iron / Cable
        ],
        subcategories: ['TWS Earbuds & Headphones', 'Steam Irons', 'Fast Charging USB-C Cables', 'Alkaline Batteries'],
      },
      {
        id: 'cat-stationery-games',
        name: 'Stationery & Games',
        department: 'Other Essential Departments',
        images: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80', // UNO cards
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80', // Notebook
        ],
        subcategories: ['Board & Card Games', 'Ruled Spiral Notebooks', 'Roller Ball Pens', 'Adhesives & Glues'],
      },
    ],
  },
];
