/**
 * Andhra Avakaya - Products Data
 * 
 * NOTE FOR OWNER:
 * Products are grouped into two categories: "veg" and "non-veg".
 * To add a new product in the future, simply add an object to the PRODUCTS array
 * with `category: "veg"` or `category: "non-veg"`.
 * 
 * Fields like `image` point to `/images/<your-filename>.jpg`.
 */

export const PRODUCTS = [
  // ==========================================
  // VEGETARIAN PICKLES (category: "veg")
  // ==========================================
  {
    id: "andhra-avakaya",
    category: "veg",
    name: "Traditional Andhra Avakaya",
    teluguName: "ఆవకాయ",
    badge: "Signature Classic",
    image: "/images/avakaya_mango.jpg",
    shortDescription: "The crown jewel of Andhra kitchens — raw sour mango pieces infused with fiery Guntur red chilli and aromatic stone-ground mustard paste.",
    fullDescription: "Our flagship Andhra Avakaya is prepared strictly adhering to age-old family traditions. Hand-cut raw sour mango pieces (with kernel shell intact for crunch) are bathed in pure cold-pressed sesame oil, pungent mustard powder (aava pindi), rock salt, and sun-dried Guntur chillies. Left to mature naturally in glazed ceramic jaadis, this pickle delivers an explosive burst of authentic spice, sourness, and oil-tempered warmth with hot steamed rice and ghee.",
    spiceLevel: "Fiery / High",
    keyIngredients: ["Raw Mango Chunks", "Stone-ground Mustard Seeds", "Guntur Red Chilli Powder", "Cold-Pressed Sesame Oil", "Garlic Cloves", "Fenugreek", "Sea Salt"],
    servingSuggestion: "Best enjoyed with piping hot steamed rice, a generous dollop of pure desi ghee, and roasted papad.",
    availableWeights: ["250g", "500g", "1kg"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹220 onwards",
    inStock: true
  },
  {
    id: "bellam-avakaya",
    category: "veg",
    name: "Bellam Avakaya (Sweet & Spicy)",
    teluguName: "బెల్లం ఆవకాయ",
    badge: "Sweet & Tangy",
    image: "/images/bellam_avakaya.jpg",
    shortDescription: "A luxurious harmony of tart raw mangoes, golden organic jaggery, mustard seeds, and gentle chilli warmth.",
    fullDescription: "Bellam Avakaya brings together the best of both worlds — the distinct tartness of unripened mangoes and the caramel sweetness of artisanal Andhra jaggery. The resulting thick, glossy relish is gently spiced with fenugreek and mustard, creating an irresistible side that pairs equally well with rice, rotis, or morning dosas.",
    spiceLevel: "Mild-Medium Spicy & Sweet",
    keyIngredients: ["Raw Mango", "Organic Jaggery (Bellam)", "Red Chilli Powder", "Mustard Seed Powder", "Fenugreek Seeds", "Pure Sesame Oil", "Salt"],
    servingSuggestion: "Divine pairing with curd rice, parathas, poori, or alongside traditional festival meals.",
    availableWeights: ["250g", "500g", "1kg"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹240 onwards",
    inStock: true
  },
  {
    id: "gongura-pachadi",
    category: "veg",
    name: "Andhra Gongura Pachadi",
    teluguName: "గోంగూర పచ్చడి",
    badge: "Andhra Icon",
    image: "/images/gongura_pachadi.jpg",
    shortDescription: "The legendary taste of Andhra — tart red sorrel leaves slow-cooked and tempered with roasted chillies and garlic.",
    fullDescription: "Known as the soul of Andhra cuisine, Gongura (Sorrel leaves) pachadi offers an unmistakable tangy zing. Our Gongura is plucked fresh, slow-roasted, and pounded with whole dry red chillies, coriander seeds, garlic, and golden mustard tempering. Every spoonful delivers a rustic, earthy punch that is deeply nostalgic and deeply satisfying.",
    spiceLevel: "Medium-High Spicy",
    keyIngredients: ["Fresh Gongura (Sorrel Leaves)", "Roasted Guntur Dry Chillies", "Garlic", "Coriander Seeds", "Cumin", "Cold-Pressed Oil", "Salt"],
    servingSuggestion: "Pair with hot rice, sliced raw onions, and melted ghee for the quintessential Andhra experience.",
    availableWeights: ["250g", "500g"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹190 onwards",
    inStock: true
  },
  {
    id: "pandu-mirapa",
    category: "veg",
    name: "Pandu Mirapakaya Pachadi",
    teluguName: "పండు మిరపకాయ పచ్చడి",
    badge: "Heritage Favourite",
    image: "/images/pandu_mirapa.jpg",
    shortDescription: "Vibrant ripe red chillies stone-pounded with country tamarind and aromatic tempering for an intense flavour kick.",
    fullDescription: "Prepared only during the seasonal peak of fresh red ripe chillies, Pandu Mirapakaya Pachadi is a spicy food lover's dream. Ripe red chillies are carefully destemmed, stone-pounded with tangy tamarind and rock salt, then matured before receiving a fragrant tempering of garlic, mustard, and curry leaves. Its brilliant red hue and smoky zest elevate any simple meal.",
    spiceLevel: "High Spicy",
    keyIngredients: ["Fresh Ripe Red Chillies (Pandu Mirapa)", "Sour Tamarind", "Crushed Garlic", "Mustard Seeds", "Curry Leaves", "Sesame Oil", "Sea Salt"],
    servingSuggestion: "Incredible accompaniment for idlis, dosas, upma, and hot rice with ghee.",
    availableWeights: ["250g", "500g"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹210 onwards",
    inStock: true
  },
  {
    id: "tomato-nilava-pachadi",
    category: "veg",
    name: "Tomato Nilava Pachadi",
    teluguName: "టమాటా పచ్చడి",
    badge: "Everyday Delight",
    image: "/images/tomato_pachadi.jpg",
    shortDescription: "Country tomatoes slow-cooked to a luscious preserve with sun-dried tamarind, garlic slivers, and fragrant spices.",
    fullDescription: "Tomato Nilava Pachadi is a beloved staple made with ripe, juicy country tomatoes that are cooked down with tangy tamarind pulp until thick and glossy. Generously infused with roasted garlic pods, fenugreek powder, and mustard-chilli oil, this pickle provides a rounded tanginess that brightens up breakfast tiffins and dinner plates alike.",
    spiceLevel: "Medium Spicy",
    keyIngredients: ["Country Tomatoes", "Tamarind Pulp", "Red Chilli Powder", "Roasted Garlic", "Fenugreek Powder", "Mustard Seeds", "Groundnut Oil", "Salt"],
    servingSuggestion: "Perfect with crispy dosas, steaming hot pesarattu, or mixed in rice with papad.",
    availableWeights: ["250g", "500g", "1kg"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹180 onwards",
    inStock: true
  },
  {
    id: "allam-pachadi",
    category: "veg",
    name: "Andhra Allam Pachadi (Ginger)",
    teluguName: "అల్లం పచ్చడి",
    badge: "Zesty & Digestive",
    image: "/images/allam_pachadi.jpg",
    shortDescription: "Fresh pungent ginger root simmered with tamarind, jaggery, and spices into a thick, sweet-and-sour pickle.",
    fullDescription: "Allam Pachadi holds a special place in Andhra households both for its irresistible sweet-spicy-tangy profile and its traditional digestive qualities. Freshly peeled ginger is ground with aged tamarind and golden jaggery, balanced with red chillies and mustard oil. The result is a velvety, rich relish that will transform any simple meal into a feast.",
    spiceLevel: "Medium Spicy, Sweet & Tangy",
    keyIngredients: ["Fresh Ginger Root", "Artisanal Jaggery", "Aged Tamarind", "Dry Red Chillies", "Mustard Seeds", "Cumin", "Cold-Pressed Oil", "Salt"],
    servingSuggestion: "The undisputed best companion for hot Andhra MLA Pesarattu, vada, idli, or warm curd rice.",
    availableWeights: ["250g", "500g"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹200 onwards",
    inStock: true
  },
  {
    id: "andhra-lemon-pickle",
    category: "veg",
    name: "Traditional Lemon Pickle (Nimmakaya)",
    teluguName: "నిమ్మకాయ పచ్చడి",
    badge: "Zesty Classic",
    image: "/images/lemon_pickle.jpg",
    shortDescription: "Sun-cured juicy yellow lemons seasoned with fragrant fenugreek, roasted mustard, and vibrant red chilli powder.",
    fullDescription: "Our classic Nimmakaya Pachadi is made from handpicked, thin-skinned country lemons cured naturally in rock salt under the warm Andhra sun until the rinds soften to perfection. Blended with roasted fenugreek powder (methi pindi), mustard, and fiery red chillies, this time-honoured digestif pickle delivers an invigorating burst of sour, spicy, and tangy zest.",
    spiceLevel: "Medium Spicy & Tangy",
    keyIngredients: ["Sun-Cured Country Lemons", "Roasted Fenugreek Powder", "Mustard Seed Powder", "Guntur Chilli Powder", "Pure Sesame Oil", "Sea Salt"],
    servingSuggestion: "The ultimate digestive companion for curd rice (perugannam), upma, dal rice, or khichdi.",
    availableWeights: ["250g", "500g", "1kg"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹180 onwards",
    inStock: true
  },

  // ==========================================
  // NON-VEGETARIAN PICKLES (category: "non-veg")
  // ==========================================
  {
    id: "andhra-chicken-pickle",
    category: "non-veg",
    name: "Andhra Chicken Pickle (Boneless)",
    teluguName: "కోడి మాంసం పచ్చడి",
    badge: "Non-Veg Bestseller",
    image: "/images/chicken_pickle.jpg",
    shortDescription: "Tender boneless chicken morsels flash-fried and steeped in fiery red Guntur chilli masala, ginger, garlic, and aromatic sesame oil.",
    fullDescription: "Prepared with succulent, country-style boneless chicken pieces that are marinated, lightly crisp-fried, and blended into an intensely flavourful masala made of roasted coriander, cumin, cloves, cardamom, ginger-garlic paste, and crushed Guntur red chillies. Matured in cold-pressed sesame oil, this Andhra speciality delivers an unforgettable spicy crunch with hot rice and ghee.",
    spiceLevel: "Fiery / High",
    keyIngredients: ["Tender Boneless Chicken", "Guntur Red Chilli Powder", "Ginger-Garlic Paste", "Stone-ground Garam Masala", "Curry Leaves", "Cold-Pressed Sesame Oil", "Sea Salt"],
    servingSuggestion: "Delicious with hot steamed rice, rasam, biryani, or rolled into warm rotis.",
    availableWeights: ["250g", "500g", "1kg"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹350 onwards",
    inStock: true
  },
  {
    id: "andhra-mutton-pickle",
    category: "non-veg",
    name: "Traditional Andhra Mutton Pickle",
    teluguName: "మటన్ పచ్చడి / మాంసం పచ్చడి",
    badge: "Royal Heritage",
    image: "/images/mutton_pickle.jpg",
    shortDescription: "Slow-cooked tender cuts of prime mutton spiced with artisanal whole masalas and aged in fragrant spiced oil.",
    fullDescription: "A royal Andhra delicacy crafted using select tender cuts of fresh mutton. The meat is slow-cooked to seal in juices, then gently roasted in aromatic oil before being tossed with stone-pounded spices, tart lemon/tamarind balance, and fiery red chillies. Made without artificial preservatives, ensuring every bite is rich, tender, and deeply savoury.",
    spiceLevel: "High Spicy",
    keyIngredients: ["Prime Mutton Cuts", "Stone-Ground Whole Spices", "Kashmiri & Guntur Red Chillies", "Fresh Ginger & Garlic", "Roasted Cumin", "Pure Sesame Oil", "Sea Salt"],
    servingSuggestion: "Pairs majestically with bagara rice, hot steamed rice with ghee, or soft rumali rotis.",
    availableWeights: ["250g", "500g", "1kg"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹450 onwards",
    inStock: true
  },
  {
    id: "andhra-prawn-pickle",
    category: "non-veg",
    name: "Andhra Prawn Pickle (Royyalu)",
    teluguName: "రొయ్యల పచ్చడి",
    badge: "Coastal Special",
    image: "/images/prawn_pickle.jpg",
    shortDescription: "Juicy sea prawns roasted to a golden crisp and pickled in tangy, fiery coastal Andhra spices.",
    fullDescription: "Hailing from the coastal belts of Andhra Pradesh, our Royyala Pachadi features fresh, plump prawns deveined and golden-fried to retain their firm, succulent bite. They are then simmered with roasted mustard, fenugreek, garlic cloves, fresh curry leaves, and sour tamarind juice in cold-pressed oil, yielding a tantalising seafood preserve that melts in the mouth.",
    spiceLevel: "Medium-High Spicy",
    keyIngredients: ["Fresh Cleaned Sea Prawns", "Guntur Red Chilli Powder", "Crushed Garlic", "Fenugreek Seeds", "Tamarind Extract", "Curry Leaves", "Cold-Pressed Oil", "Salt"],
    servingSuggestion: "Heavenly when mixed into hot steamed rice with melted butter or ghee.",
    availableWeights: ["250g", "500g", "1kg"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹420 onwards",
    inStock: true
  },
  {
    id: "andhra-fish-pickle",
    category: "non-veg",
    name: "Andhra Fish Pickle (Chepala Pachadi)",
    teluguName: "చేపల పచ్చడి",
    badge: "Coastal Authentic",
    image: "/images/fish_pickle.jpg",
    shortDescription: "Boneless cubes of fresh fish crisp-fried and preserved in a zesty, garlic-infused mustard & chilli gravy.",
    fullDescription: "Prepared using boneless fillets of premium fresh fish cut into bite-sized cubes. The fish pieces are spiced with turmeric and chilli, crisp-fried until golden, and married with an aged tempering of mustard seeds, fenugreek, sliced garlic pods, and lemon-tamarind reduction. A unique coastal delicacy bursting with rich umami flavour.",
    spiceLevel: "Medium Spicy",
    keyIngredients: ["Boneless Fresh Fish Cubes", "Crushed Mustard & Fenugreek", "Guntur Red Chilli", "Garlic Pods", "Curry Leaves", "Lemon Juice", "Cold-Pressed Oil", "Salt"],
    servingSuggestion: "Best savoured with warm rice, dal, curd rice, or as a savoury side with South Indian meals.",
    availableWeights: ["250g", "500g"],
    priceDisplay: "Available on Enquiry",
    approxPrice: "₹380 onwards",
    inStock: true
  }
];
