/**
 * Andhra Avakaya - Updated Authentic Pickle Catalog
 * 
 * Strictly replaces all previous catalog items with the exact 20 products
 * from the two official Andhra Avakaya menu price cards.
 * 
 * Non-Veg (11 products, menu base price per 500g):
 * - Chicken Pickle (₹450)
 * - Prawns Pickle (₹650)
 * - Mutton Pickle (₹900)
 * - Fish Pickle (₹750)
 * - Gongura Chicken Bone Pickle (₹650)
 * - Gongura Chicken Boneless Pickle (₹800)
 * - Gongura Prawns Pickle (₹850)
 * - Gongura Mutton Pickle (₹950)
 * - Gongura Mutton Boneless Pickle (₹1,200)
 * - Country Chicken Pickle (₹900)
 * - Crab Pickle (₹800)
 * 
 * Veg (9 products, menu base price per 1kg):
 * - Avakaya Pickle (₹600)
 * - Menthi Avakaya Pickle (₹800)
 * - Maagaya Pickle (₹600)
 * - Usirikaya Pickle (₹650)
 * - Allam Pachadi (₹1,000)
 * - Gongura Pachadi (₹600)
 * - Tomato Pachadi (₹600)
 * - Nalleru Kada Pachadi (₹600)
 * - Cauliflower Pachadi (₹500)
 */

export const QUANTITY_SIZES = ['250 g', '500 g', '1 kg'];

export const formatRupee = (num) => {
  if (typeof num !== 'number') return num;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const PRODUCTS = [
  // ==========================================
  // VEGETARIAN PICKLES (category: 'veg')
  // Menu reference price is strictly per 1 kg
  // ==========================================
  {
    id: 'avakaya-pickle',
    category: 'veg',
    name: 'Avakaya Pickle',
    teluguName: 'ఆవకాయ పచ్చడి',
    badge: 'Signature Classic',
    image: '/images/pickles/veg/avakaya_pickle.jpg',
    shortDescription: 'The iconic Andhra raw mango pickle made with hand-cut mango chunks, fiery Guntur red chilli powder, stone-ground mustard paste, and cold-pressed sesame oil.',
    fullDescription: 'Our flagship Andhra Avakaya adheres strictly to century-old Godavari family traditions. Hand-cut raw sour mango pieces (with kernel shell intact for crunch) are bathed in pure cold-pressed sesame oil, pungent mustard powder (aava pindi), rock salt, and sun-dried Guntur chillies. Left to mature naturally in glazed ceramic jaadis, this pickle delivers an explosive burst of authentic spice, sourness, and oil-tempered warmth.',
    spiceLevel: 'Fiery / High',
    keyIngredients: ['Raw Sour Mango Chunks', 'Stone-ground Mustard (Aava Pindi)', 'Guntur Red Chilli Powder', 'Cold-Pressed Sesame Oil', 'Garlic Cloves', 'Fenugreek', 'Sea Salt'],
    servingSuggestion: 'Best enjoyed with piping hot steamed rice, a generous dollop of pure desi ghee, and roasted papad.',
    menuReferencePrice: 600,
    pricingBasis: '1 kg',
    defaultWeight: '1 kg',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 150,
      '500 g': 300,
      '1 kg': 600
    },
    inStock: true
  },
  {
    id: 'menthi-avakaya-pickle',
    category: 'veg',
    name: 'Menthi Avakaya Pickle',
    teluguName: 'మెంతి ఆవకాయ',
    badge: 'Aromatic Heritage',
    image: '/images/pickles/veg/menthi_avakaya_pickle.jpg',
    shortDescription: 'Tender raw mango cubes infused with freshly roasted fenugreek powder, giving a fragrant, subtly warm and digestive Andhra flavour.',
    fullDescription: 'Menthi Avakaya is celebrated for its warm, intoxicating aroma and balanced spice profile. Fresh raw mango cubes are seasoned with roasted fenugreek (menthi pindi), bright turmeric, whole mustard seeds, and rich sesame oil. The subtle herbal bitterness of roasted fenugreek blends gracefully with the tartness of raw mango for a memorable taste.',
    spiceLevel: 'Medium-High Spicy',
    keyIngredients: ['Raw Mango Cuts', 'Roasted Fenugreek Powder', 'Guntur Red Chillies', 'Pure Sesame Oil', 'Mustard Seeds', 'Turmeric', 'Rock Salt'],
    servingSuggestion: 'Superb with hot rice and melted ghee, curd rice, or stuffed parathas.',
    menuReferencePrice: 800,
    pricingBasis: '1 kg',
    defaultWeight: '1 kg',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 200,
      '500 g': 400,
      '1 kg': 800
    },
    inStock: true
  },
  {
    id: 'maagaya-pickle',
    category: 'veg',
    name: 'Maagaya Pickle',
    teluguName: 'మాగాయ పచ్చడి',
    badge: 'Sun-Dried Special',
    image: '/images/pickles/veg/maagaya_pickle.jpg',
    shortDescription: 'Sun-dried peeled raw mango strips preserved with roasted fenugreek, mustard, and fragrant spices in pure cold-pressed oil.',
    fullDescription: 'Maagaya is crafted through a laborious traditional curing method. Fresh raw mangoes are peeled, sliced into thin fingers, cured in brine, and sun-dried until chewy. Re-immersed into seasoned sour mango extract with roasted spices, garlic tempering, and cold-pressed oil, Maagaya yields an intense sweet-sour-spicy concentration of real mango flavour.',
    spiceLevel: 'Medium Spicy',
    keyIngredients: ['Sun-Dried Raw Mango Strips', 'Roasted Methi Powder', 'Red Chilli Powder', 'Mustard Tempering', 'Cold-Pressed Sesame Oil', 'Rock Salt'],
    servingSuggestion: 'The classic combination with hot rice, ghee, mudda pappu, or soft idlis.',
    menuReferencePrice: 600,
    pricingBasis: '1 kg',
    defaultWeight: '1 kg',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 150,
      '500 g': 300,
      '1 kg': 600
    },
    inStock: true
  },
  {
    id: 'usirikaya-pickle',
    category: 'veg',
    name: 'Usirikaya Pickle',
    teluguName: 'ఉసిరికాయ పచ్చడి',
    badge: 'Immunity & Tang',
    image: '/images/pickles/veg/usirikaya_pickle.jpg',
    shortDescription: 'Whole plump Indian gooseberries (amla) lightly fried in oil and steeped in sour tamarind, mustard, and fiery red chillies.',
    fullDescription: 'Usirikaya Pachadi is both a royal Andhra winter favourite and a nutrient-rich delicacy. Handpicked whole Indian gooseberries (Amla) are gently oil-poached to seal their natural tartness, then mixed with stone-ground mustard, fenugreek, tamarind reduction, and crushed red chillies. The result is a zesty, vitamin-C rich explosion in every mouthful.',
    spiceLevel: 'Medium-High Spicy',
    keyIngredients: ['Fresh Indian Gooseberries (Usirikaya)', 'Tamarind Pulp', 'Red Chilli Powder', 'Mustard & Methi Powder', 'Curry Leaves', 'Cold-Pressed Oil', 'Salt'],
    servingSuggestion: 'Pairs wonderfully with warm curd rice, upma, or mixed with steamed rice and ghee.',
    menuReferencePrice: 650,
    pricingBasis: '1 kg',
    defaultWeight: '1 kg',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 163,
      '500 g': 325,
      '1 kg': 650
    },
    inStock: true
  },
  {
    id: 'allam-pachadi',
    category: 'veg',
    name: 'Allam Pachadi',
    teluguName: 'అల్లం పచ్చడి',
    badge: 'Zesty & Digestive',
    image: '/images/pickles/veg/allam_pachadi.jpg',
    shortDescription: 'Fresh aromatic ginger root slow-simmered with tamarind pulp, golden jaggery, red chillies, and mustard into a luscious spicy-sweet relish.',
    fullDescription: 'Allam Pachadi holds a legendary spot in Andhra cuisine. Freshly peeled pungent ginger is ground with aged tamarind and golden jaggery, perfectly balanced by fiery chillies and mustard oil tempering. Its multi-layered sweet-sour-spicy profile aids digestion and elevates every South Indian breakfast and meal.',
    spiceLevel: 'Medium Spicy, Sweet & Tangy',
    keyIngredients: ['Fresh Ginger Root', 'Organic Jaggery (Bellam)', 'Aged Tamarind Pulp', 'Guntur Red Chillies', 'Mustard Seeds', 'Cumin', 'Cold-Pressed Oil', 'Salt'],
    servingSuggestion: 'The undisputed supreme accompaniment for MLA Pesarattu, idli, crispy dosa, vada, and hot curd rice.',
    menuReferencePrice: 1000,
    pricingBasis: '1 kg',
    defaultWeight: '1 kg',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 250,
      '500 g': 500,
      '1 kg': 1000
    },
    inStock: true
  },
  {
    id: 'gongura-pachadi',
    category: 'veg',
    name: 'Gongura Pachadi',
    teluguName: 'గోంగూర పచ్చడి',
    badge: 'Andhra Cultural Icon',
    image: '/images/pickles/veg/gongura_pachadi.jpg',
    shortDescription: 'Handpicked red sorrel (gongura) leaves cooked to velvety perfection with roasted red chillies, garlic, and cold-pressed oil.',
    fullDescription: 'Known worldwide as the pride of Andhra, Gongura Pachadi embodies the soul of regional cuisine. Farm-fresh sour sorrel leaves are washed, dried, sauteed, and hand-pounded with dry red chillies, roasted coriander seeds, fenugreek, and lots of garlic cloves. Its sour-spicy complexity is unmatched.',
    spiceLevel: 'High Tangy & Fiery',
    keyIngredients: ['Fresh Red Stem Gongura Leaves', 'Guntur Red Chillies', 'Crushed Garlic', 'Roasted Coriander & Cumin', 'Fenugreek', 'Cold-Pressed Oil', 'Salt'],
    servingSuggestion: 'Mix with piping hot rice and melted ghee, accompanied by raw sliced onions and appadalu.',
    menuReferencePrice: 600,
    pricingBasis: '1 kg',
    defaultWeight: '1 kg',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 150,
      '500 g': 300,
      '1 kg': 600
    },
    inStock: true
  },
  {
    id: 'tomato-pachadi',
    category: 'veg',
    name: 'Tomato Pachadi',
    teluguName: 'టమోటా పచ్చడి',
    badge: 'Home Style Favorite',
    image: '/images/pickles/veg/tomato_pachadi.jpg',
    shortDescription: 'Sun-ripe country tomatoes slow-cooked with tamarind, fragrant roasted garlic, mustard tempering, and vibrant red chilli masala.',
    fullDescription: 'Prepared using juicy, naturally ripened country tomatoes simmered until the water evaporates and the flavours concentrate into a thick, glossy relish. Tempered with mustard seeds, whole cumin, crispy curry leaves, garlic pods, and pure oil, this pickle is an everyday comfort classic in every Telugu home.',
    spiceLevel: 'Medium Spicy & Savory',
    keyIngredients: ['Country Tomatoes (Natu Tamata)', 'Tamarind Reduction', 'Guntur Red Chilli Powder', 'Fried Garlic Pods', 'Mustard Seeds', 'Curry Leaves', 'Groundnut Oil', 'Salt'],
    servingSuggestion: 'Irresistible with hot steamed rice, dosa, pesarattu, idli, or warm rotis.',
    menuReferencePrice: 600,
    pricingBasis: '1 kg',
    defaultWeight: '1 kg',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 150,
      '500 g': 300,
      '1 kg': 600
    },
    inStock: true
  },
  {
    id: 'nalleru-kada-pachadi',
    category: 'veg',
    name: 'Nalleru Kada Pachadi',
    teluguName: 'నల్లేరు కాడ పచ్చడి',
    badge: 'Rare & Medicinal',
    image: '/images/pickles/veg/nalleru_kada_pachadi.jpg',
    shortDescription: 'Nutritious tender Nalleru (Veldt Grape / Cissus quadrangularis) stems roasted and pickled with tangy tamarind, garlic, and roasted Andhra spices.',
    fullDescription: 'An ancient, treasured Andhra recipe celebrated in Ayurveda for bone strength and gut wellness. Tender fresh Nalleru stems are carefully cleaned, slow-roasted in sesame oil to eliminate roughness, and blended with aged tamarind, roasted dry chillies, and garlic pods. A rare, wholesome culinary preserve packed with wellness.',
    spiceLevel: 'Medium Spicy & Herbal',
    keyIngredients: ['Tender Nalleru Stems', 'Tamarind Pulp', 'Red Chilli Powder', 'Garlic Pods', 'Cumin & Mustard', 'Pure Sesame Oil', 'Rock Salt'],
    servingSuggestion: 'Best savoured as the very first morsel of your meal with hot steamed rice and cow ghee.',
    menuReferencePrice: 600,
    pricingBasis: '1 kg',
    defaultWeight: '1 kg',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 150,
      '500 g': 300,
      '1 kg': 600
    },
    inStock: true
  },
  {
    id: 'cauliflower-pachadi',
    category: 'veg',
    name: 'Cauliflower Pachadi',
    teluguName: 'క్యాలీఫ్లవర్ పచ్చడి',
    badge: 'Crunchy Seasonal',
    image: '/images/pickles/veg/cauliflower_pachadi.jpg',
    shortDescription: 'Fresh crispy cauliflower florets pickled Andhra-style with stone-ground mustard powder, lemon-tamarind balance, and vibrant red chilli oil.',
    fullDescription: 'Cauliflower Pachadi is an exciting seasonal delicacy. Fresh, firm cauliflower florets are blanched, dried, and tossed in cold-pressed sesame oil, pungent mustard powder (aava pindi), and fiery red chillies. The crunchy texture of the florets combined with the sharp mustard tang makes every bite exceptionally appetizing.',
    spiceLevel: 'Medium-High Spicy',
    keyIngredients: ['Fresh Crisp Cauliflower Florets', 'Stone-ground Mustard', 'Red Chilli Powder', 'Lemon & Tamarind Juice', 'Cold-Pressed Sesame Oil', 'Salt'],
    servingSuggestion: 'Delicious with hot rice, dal, rasam, curd rice, or stuffed parathas.',
    menuReferencePrice: 500,
    pricingBasis: '1 kg',
    defaultWeight: '1 kg',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 125,
      '500 g': 250,
      '1 kg': 500
    },
    inStock: true
  },

  // ==========================================
  // NON-VEGETARIAN PICKLES (category: 'non-veg')
  // Menu reference price is strictly per 500 grams
  // ==========================================
  {
    id: 'chicken-pickle',
    category: 'non-veg',
    name: 'Chicken Pickle',
    teluguName: 'చికెన్ పచ్చడి',
    badge: 'Bestseller Non-Veg',
    image: '/images/pickles/non-veg/chicken_pickle.jpg',
    shortDescription: 'Succulent boneless chicken chunks marinated, crisp-fried, and blended with roasted garam masala, ginger, garlic, and fiery Guntur red chilli oil.',
    fullDescription: 'Prepared using premium, succulent chicken pieces lightly flash-fried to seal in moisture and tenderness. Married with an intensely aromatic masala made from roasted coriander, cumin, cloves, cardamom, stone-ground ginger-garlic paste, and crushed red chillies in pure oil. A rich, spicy treat that transforms simple rice into a royal feast.',
    spiceLevel: 'Fiery / High',
    keyIngredients: ['Fresh Boneless Chicken', 'Guntur Red Chilli Powder', 'Fresh Ginger-Garlic Paste', 'Whole Garam Masala', 'Curry Leaves', 'Cold-Pressed Oil', 'Sea Salt'],
    servingSuggestion: 'Irresistible with hot steamed rice and ghee, biryani, bagara rice, or rolled into rumali rotis.',
    menuReferencePrice: 450,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 225,
      '500 g': 450,
      '1 kg': 900
    },
    inStock: true
  },
  {
    id: 'prawns-pickle',
    category: 'non-veg',
    name: 'Prawns Pickle',
    teluguName: 'రొయ్యల పచ్చడి',
    badge: 'Coastal Andhra Special',
    image: '/images/pickles/non-veg/prawns_pickle.jpg',
    shortDescription: 'Plump sea prawns cleaned, golden-fried, and pickled with roasted coastal spices, garlic cloves, tamarind tang, and rich spiced oil.',
    fullDescription: 'Hailing from coastal Andhra, our Royyala Pachadi features fresh sea prawns deveined and golden-fried to retain their firm, succulent bite. Infused with roasted mustard, fenugreek, whole garlic cloves, crispy curry leaves, and a touch of lemon-tamarind balance in cold-pressed oil for an authentic seafood burst.',
    spiceLevel: 'Medium-High Spicy',
    keyIngredients: ['Fresh Sea Prawns (Royyalu)', 'Guntur Red Chilli', 'Roasted Garlic', 'Fenugreek & Mustard', 'Tamarind Extract', 'Curry Leaves', 'Pure Oil', 'Salt'],
    servingSuggestion: 'Heavenly when mixed into hot steamed rice with a dollop of melted ghee or alongside dal rice.',
    menuReferencePrice: 650,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 325,
      '500 g': 650,
      '1 kg': 1300
    },
    inStock: true
  },
  {
    id: 'mutton-pickle',
    category: 'non-veg',
    name: 'Mutton Pickle',
    teluguName: 'మటన్ పచ్చడి',
    badge: 'Royal Heritage',
    image: '/images/pickles/non-veg/mutton_pickle.jpg',
    shortDescription: 'Prime tender cuts of fresh mutton slow-cooked, gently roasted, and preserved in fragrant stone-pounded masalas and spiced sesame oil.',
    fullDescription: 'A royal Andhra delicacy crafted using select tender cuts of prime meat. The mutton is slow-braised to seal in natural juices, lightly roasted in fragrant oil, and seasoned with heirloom garam masala, crushed red chillies, and citrus-tamarind harmony. Aged naturally for incredible deep savoury depth.',
    spiceLevel: 'High Spicy',
    keyIngredients: ['Prime Mutton Cuts', 'Stone-Ground Spices', 'Guntur Red Chilli Powder', 'Fresh Ginger-Garlic Paste', 'Roasted Cumin', 'Pure Sesame Oil', 'Sea Salt'],
    servingSuggestion: 'Pairs majestically with bagara rice, hot steamed rice with ghee, or soft rumali rotis.',
    menuReferencePrice: 900,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 450,
      '500 g': 900,
      '1 kg': 1800
    },
    inStock: true
  },
  {
    id: 'fish-pickle',
    category: 'non-veg',
    name: 'Fish Pickle',
    teluguName: 'చేపల పచ్చడి',
    badge: 'Coastal Authentic',
    image: '/images/pickles/non-veg/fish_pickle.jpg',
    shortDescription: 'Boneless cubes of fresh sea fish crisp-fried and preserved in a zesty, garlic-infused mustard, lemon, and chilli pickle gravy.',
    fullDescription: 'Prepared using boneless fillets of premium fresh fish cut into bite-sized cubes. Spiced with turmeric and chilli, crisp-fried until golden, and married with an aged tempering of mustard seeds, fenugreek, sliced garlic pods, and lemon-tamarind reduction. A unique coastal delicacy bursting with rich umami flavour.',
    spiceLevel: 'Medium Spicy & Zesty',
    keyIngredients: ['Boneless Fresh Fish Fillets', 'Crushed Mustard & Fenugreek', 'Guntur Red Chilli', 'Garlic Pods', 'Curry Leaves', 'Lemon Juice', 'Cold-Pressed Oil', 'Salt'],
    servingSuggestion: 'Best savoured with warm rice, dal, curd rice, or as a savoury side with South Indian meals.',
    menuReferencePrice: 750,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 375,
      '500 g': 750,
      '1 kg': 1500
    },
    inStock: true
  },
  {
    id: 'gongura-chicken-bone-pickle',
    category: 'non-veg',
    name: 'Gongura Chicken Bone Pickle',
    teluguName: 'గోంగూర చికెన్ (విత్ బోన్) పచ్చడి',
    badge: 'Traditional Bone-In',
    image: '/images/pickles/non-veg/gongura_chicken_bone_pickle.jpg',
    shortDescription: 'Classic bone-in country style chicken pieces slow-cooked with sour gongura leaves, stone-ground spices, and red chilli oil.',
    fullDescription: 'Bone-in cuts impart a richer, deeper marrow flavour to this beloved Andhra speciality. Juicy chicken pieces cooked with tang-rich red gongura leaf reduction, roasted coriander, cloves, and ginger-garlic paste create a harmonious marriage of sourness and heat.',
    spiceLevel: 'High Spicy & Tangy',
    keyIngredients: ['Bone-In Chicken Cuts', 'Red Gongura Leaves', 'Guntur Red Chilli', 'Ginger-Garlic Paste', 'Garam Masala', 'Cold-Pressed Oil', 'Salt'],
    servingSuggestion: 'Superb with piping hot rice and melted ghee, or alongside biryani.',
    menuReferencePrice: 650,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 325,
      '500 g': 650,
      '1 kg': 1300
    },
    inStock: true
  },
  {
    id: 'gongura-chicken-boneless-pickle',
    category: 'non-veg',
    name: 'Gongura Chicken Boneless Pickle',
    teluguName: 'గోంగూర చికెన్ (బోన్ లెస్) పచ్చడి',
    badge: 'Boneless Special',
    image: '/images/pickles/non-veg/gongura_chicken_boneless_pickle.jpg',
    shortDescription: 'Tender succulent boneless chicken cubes simmered in authentic sour gongura leaf masala, garlic, and fiery chilli oil.',
    fullDescription: 'For those who prefer effortless indulgence, succulent bite-sized boneless chicken pieces are crisp-fried and tossed into rich, velvety gongura paste tempered with whole spices and fragrant garlic. Every spoonful delivers juicy tender chicken with the signature tang of gongura.',
    spiceLevel: 'High Spicy & Tangy',
    keyIngredients: ['Boneless Chicken Cubes', 'Farm-fresh Gongura Leaves', 'Red Chilli Powder', 'Crushed Garlic', 'Whole Spices', 'Pure Oil', 'Salt'],
    servingSuggestion: 'Perfect for mixing into hot rice, spreading on rotis, or pairing with South Indian thali.',
    menuReferencePrice: 800,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 400,
      '500 g': 800,
      '1 kg': 1600
    },
    inStock: true
  },
  {
    id: 'gongura-prawns-pickle',
    category: 'non-veg',
    name: 'Gongura Prawns Pickle',
    teluguName: 'గోంగూర రొయ్యల పచ్చడి',
    badge: 'Seafood Sensation',
    image: '/images/pickles/non-veg/gongura_prawns_pickle.jpg',
    shortDescription: 'Golden crisp-fried sea prawns combined with the tangy punch of sauteed gongura leaves, garlic pods, and Andhra masalas.',
    fullDescription: 'The meeting of sea prawns and sorrel leaves is an acclaimed Andhra culinary treasure. Juicy deveined prawns are crisped and folded into aromatic gongura leaf chutney, roasted coriander seeds, and fiery chillies, creating an irresistible balance of sweet prawn meat and tangy herbal sauce.',
    spiceLevel: 'Medium-High Spicy',
    keyIngredients: ['Crisp Sea Prawns', 'Gongura Leaf Paste', 'Guntur Red Chilli', 'Garlic Pods', 'Roasted Cumin', 'Cold-Pressed Oil', 'Salt'],
    servingSuggestion: 'Exceptional with steamed rice, ghee, and roasted papad.',
    menuReferencePrice: 850,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 425,
      '500 g': 850,
      '1 kg': 1700
    },
    inStock: true
  },
  {
    id: 'gongura-mutton-pickle',
    category: 'non-veg',
    name: 'Gongura Mutton Pickle',
    teluguName: 'గోంగూర మటన్ పచ్చడి',
    badge: 'Heritage Feast',
    image: '/images/pickles/non-veg/gongura_mutton_pickle.jpg',
    shortDescription: 'Tender select mutton cuts slow-cooked with fresh sour gongura leaves, aromatic stone-ground spices, and rich spiced oil.',
    fullDescription: 'An aristocratic feast hailing from traditional kitchens. Prime cuts of tender mutton are slow-cooked to tender perfection and infused with authentic gongura leaf reduction, stone-pounded garam masala, and garlic cloves in pure sesame oil.',
    spiceLevel: 'High Spicy & Tangy',
    keyIngredients: ['Select Mutton Cuts', 'Fresh Gongura Leaves', 'Guntur Red Chilli', 'Roasted Garam Masala', 'Ginger-Garlic Paste', 'Pure Sesame Oil', 'Salt'],
    servingSuggestion: 'A royal pairing with bagara rice, plain steamed rice with ghee, or parottas.',
    menuReferencePrice: 950,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 475,
      '500 g': 950,
      '1 kg': 1900
    },
    inStock: true
  },
  {
    id: 'gongura-mutton-boneless-pickle',
    category: 'non-veg',
    name: 'Gongura Mutton Boneless Pickle',
    teluguName: 'గోంగూర మటన్ (బోన్ లెస్) పచ్చడి',
    badge: 'Premium Boneless',
    image: '/images/pickles/non-veg/gongura_mutton_boneless_pickle.jpg',
    shortDescription: 'Prime boneless mutton pieces slow-roasted and steeped in rich sour gongura reduction, roasted whole masalas, and sesame oil.',
    fullDescription: 'Our most luxurious non-veg offering. Only tender boneless mutton morsels are marinated, slow-roasted, and united with handpicked gongura leaf relish, cloves, cardamom, and pure cold-pressed sesame oil. Melt-in-the-mouth meat meets intense Andhra tang.',
    spiceLevel: 'High Spicy & Rich',
    keyIngredients: ['Prime Boneless Mutton Morsels', 'Red Stem Gongura', 'Guntur Red Chillies', 'Artisanal Garam Masala', 'Cold-Pressed Sesame Oil', 'Sea Salt'],
    servingSuggestion: 'Enjoy with hot steamed rice, melted ghee, or artisanal flatbreads.',
    menuReferencePrice: 1200,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 600,
      '500 g': 1200,
      '1 kg': 2400
    },
    inStock: true
  },
  {
    id: 'country-chicken-pickle',
    category: 'non-veg',
    name: 'Country Chicken Pickle',
    teluguName: 'నాటుకోడి పచ్చడి',
    badge: 'Natu Kodi Authentic',
    image: '/images/pickles/non-veg/country_chicken_pickle.jpg',
    shortDescription: 'Authentic Andhra Natu Kodi (country chicken) morsels seasoned with rustic spices, curry leaves, crushed garlic, and fiery oil.',
    fullDescription: 'Prepared with genuine free-range country chicken (Natu Kodi) renowned for its lean, flavourful, and firm bite. Marinated with stone-pounded country spices, sun-dried Guntur chillies, crushed garlic, and curry leaves, this pickle delivers an unmatched rustic Andhra dining experience.',
    spiceLevel: 'Very High / Fiery',
    keyIngredients: ['Authentic Country Chicken (Natu Kodi)', 'Guntur Red Chilli Powder', 'Crushed Garlic & Ginger', 'Curry Leaves', 'Stone-Pounded Country Spices', 'Pure Oil', 'Salt'],
    servingSuggestion: 'A treat with steaming hot rice and ghee, or paired with ragi sankati and rasam.',
    menuReferencePrice: 900,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 450,
      '500 g': 900,
      '1 kg': 1800
    },
    inStock: true
  },
  {
    id: 'crab-pickle',
    category: 'non-veg',
    name: 'Crab Pickle',
    teluguName: 'పీతల పచ్చడి',
    badge: 'Coastal Rare Delicacy',
    image: '/images/pickles/non-veg/crab_pickle.jpg',
    shortDescription: 'Fresh sea crab meat slow-roasted in fragrant coastal Andhra masalas, mustard tempering, ginger-garlic, and fiery red chilli oil.',
    fullDescription: 'A rare and coveted coastal delicacy. Fresh sea crabs are carefully prepared, and the sweet succulent crab meat is simmered in an aromatic blend of roasted mustard, fenugreek, fiery Guntur red chillies, garlic, and citrus-tamarind balance. Pure coastal ecstasy in every bite.',
    spiceLevel: 'High Spicy',
    keyIngredients: ['Fresh Sea Crab Meat', 'Guntur Red Chilli', 'Fresh Ginger-Garlic Paste', 'Coastal Garam Masala', 'Mustard Tempering', 'Cold-Pressed Oil', 'Salt'],
    servingSuggestion: 'Divine with hot steamed rice and melted ghee, or as a luxury accompaniment with biryani.',
    menuReferencePrice: 800,
    pricingBasis: '500 g',
    defaultWeight: '500 g',
    availableWeights: ['250 g', '500 g', '1 kg'],
    prices: {
      '250 g': 400,
      '500 g': 800,
      '1 kg': 1600
    },
    inStock: true
  }
];
