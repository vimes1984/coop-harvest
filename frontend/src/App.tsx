import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Vote, 
  TrendingUp, 
  Plus, 
  Check, 
  User, 
  PlusCircle, 
  X, 
  Info, 
  Percent, 
  ShieldAlert, 
  Grid, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import './App.css';

// API BASE URL
const API_URL = 'http://localhost:5001/api';

// Interfaces
interface Farmer {
  _id: string;
  name: string;
  farmName: string;
  location: { lat: number; lng: number; address: string };
  bio: string;
  image: string;
  coopShares: number;
}

interface PricingBreakdown {
  farmerShare: number;
  coopLogistics: number;
  coopAdmin: number;
}

interface Produce {
  _id: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Bakery' | 'Meat' | 'Grains';
  price: number;
  unit: string;
  stock: number;
  farmer: Farmer | string; // populated or ID
  image: string;
  description: string;
  pricingBreakdown: PricingBreakdown;
  harvestDate: string;
}

interface Proposal {
  _id: string;
  title: string;
  description: string;
  creatorName: string;
  yesVotes: number;
  noVotes: number;
  votes: Array<{ memberId: string; role: string; votedFor: 'Yes' | 'No' }>;
  deadline: string;
  status: 'Active' | 'Passed' | 'Rejected' | 'Expired';
}

interface CartItem {
  produce: Produce;
  quantity: number;
}

interface CoopStats {
  totalRevenue: number;
  farmerRevenue: number;
  logisticsRevenue: number;
  adminRevenue: number;
  farmerCount: number;
  proposalCount: number;
  orderCount: number;
}

// Initial Seed Data (Fallback if API is down)
const SEED_FARMERS: Farmer[] = [
  {
    _id: 'farm_01',
    name: 'Arthur Green',
    farmName: 'GreenValley Farms',
    location: { lat: 53.0123, lng: -6.3214, address: 'Wicklow Hills, Ireland' },
    bio: 'Arthur is a third-generation organic vegetable farmer committed to soil health and pesticide-free heirloom crops in the Garden of Ireland.',
    coopShares: 120,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80'
  },
  {
    _id: 'farm_02',
    name: 'Clara Meadow',
    farmName: 'MeadowFresh Dairy & Cheese',
    location: { lat: 52.1245, lng: -8.4952, address: 'Golden Vale, Cork, Ireland' },
    bio: 'Clara cares for a small herd of Jersey cows, producing rich organic milk, grass-fed butter, and artisanal cheese in the lush pastures of Cork.',
    coopShares: 150,
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=400&q=80'
  },
  {
    _id: 'farm_03',
    name: 'John Baker',
    farmName: 'GoldenGrains Bakery & Farm',
    location: { lat: 53.2841, lng: -9.0124, address: 'Galway Bay, Ireland' },
    bio: 'John grows ancient stone-ground wheat varieties and bakes slow-fermentation sourdough breads in a wood-fired oven in the West of Ireland.',
    coopShares: 95,
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=400&q=80'
  }
];

const SEED_PRODUCE: Produce[] = [
  {
    _id: 'prod_01',
    name: 'Organic Heirloom Tomatoes',
    category: 'Vegetables',
    price: 4.50,
    unit: 'kg',
    stock: 45,
    farmer: SEED_FARMERS[0],
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    description: 'Juicy, colorful heritage tomatoes picked ripe from the vine. Full of sweet flavor.',
    pricingBreakdown: { farmerShare: 0.82, coopLogistics: 0.13, coopAdmin: 0.05 },
    harvestDate: new Date().toISOString()
  },
  {
    _id: 'prod_02',
    name: 'Fresh Crisp Kale',
    category: 'Vegetables',
    price: 2.20,
    unit: 'bunch',
    stock: 30,
    farmer: SEED_FARMERS[0],
    image: 'https://images.unsplash.com/photo-1628773822503-930a8589ec93?auto=format&fit=crop&w=400&q=80',
    description: 'Dark green, curly kale leaves. Rich in iron, crisp, and perfect for salads or green smoothies.',
    pricingBreakdown: { farmerShare: 0.80, coopLogistics: 0.15, coopAdmin: 0.05 },
    harvestDate: new Date().toISOString()
  },
  {
    _id: 'prod_03',
    name: 'Artisanal Cheddar Cheese (Aged)',
    category: 'Dairy',
    price: 7.90,
    unit: '500g block',
    stock: 20,
    farmer: SEED_FARMERS[1],
    image: 'https://images.unsplash.com/photo-1618067425506-7551618e6f14?auto=format&fit=crop&w=400&q=80',
    description: 'Sharp, crumbly cheddar aged for 12 months in the farm cheese caves. Rich, complex taste.',
    pricingBreakdown: { farmerShare: 0.85, coopLogistics: 0.10, coopAdmin: 0.05 },
    harvestDate: new Date().toISOString()
  },
  {
    _id: 'prod_04',
    name: 'Grass-Fed Salted Butter',
    category: 'Dairy',
    price: 3.80,
    unit: '250g roll',
    stock: 25,
    farmer: SEED_FARMERS[1],
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
    description: 'Churned from cultured raw cream from grass-fed Jersey cows. Deep golden yellow color.',
    pricingBreakdown: { farmerShare: 0.80, coopLogistics: 0.15, coopAdmin: 0.05 },
    harvestDate: new Date().toISOString()
  },
  {
    _id: 'prod_05',
    name: 'Stone-Ground Sourdough Bread',
    category: 'Bakery',
    price: 4.20,
    unit: 'loaf',
    stock: 15,
    farmer: SEED_FARMERS[2],
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80',
    description: 'Crusty loaf baked daily using a 5-year-old wild yeast sourdough culture and Cotswolds organic wheat.',
    pricingBreakdown: { farmerShare: 0.83, coopLogistics: 0.12, coopAdmin: 0.05 },
    harvestDate: new Date().toISOString()
  }
];

const SEED_PROPOSALS: Proposal[] = [
  {
    _id: 'prop_01',
    title: 'Cooperative Cold-Storage Facility Purchase',
    description: 'Acquire a commercial-grade walk-in cooling container at our central logistics depot to extend the shelf life of fresh leafy greens and berries during summer harvests. Budget: €12,500 from the Coop reserves.',
    creatorName: 'Arthur Green',
    yesVotes: 18,
    noVotes: 2,
    votes: [],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    _id: 'prop_02',
    title: 'Reduce Administration Levy to 4%',
    description: 'With administrative systems running smoothly online, propose lowering the cooperative commission fee from 5% to 4%, directing an extra 1% directly back to farmers on every transaction.',
    creatorName: 'John Baker',
    yesVotes: 32,
    noVotes: 1,
    votes: [],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  }
];

const SEED_ORDERS = [
  {
    _id: 'ord_01',
    consumerName: 'Liam O’Connor',
    consumerEmail: 'liam@wicklow.ie',
    deliveryAddress: 'Greenwood Cottage, Wicklow',
    items: [
      { produce: 'prod_01', name: 'Organic Heirloom Tomatoes', quantity: 2, priceAtPurchase: 4.50 },
      { produce: 'prod_02', name: 'Fresh Crisp Kale', quantity: 1, priceAtPurchase: 2.20 }
    ],
    totalAmount: 11.20,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'ord_02',
    consumerName: 'Sarah Murphy',
    consumerEmail: 'sarah@cork.ie',
    deliveryAddress: 'Apartment 4B, Patrick Street, Cork',
    items: [
      { produce: 'prod_03', name: 'Artisanal Cheddar Cheese (Aged)', quantity: 1, priceAtPurchase: 7.90 },
      { produce: 'prod_04', name: 'Grass-Fed Salted Butter', quantity: 2, priceAtPurchase: 3.80 }
    ],
    totalAmount: 15.50,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'map' | 'governance' | 'dashboard' | 'admin'>('marketplace');
  const [isApiOnline, setIsApiOnline] = useState<boolean>(false);
  
  // Data States
  const [farmers, setFarmers] = useState<Farmer[]>(SEED_FARMERS);
  const [produceList, setProduceList] = useState<Produce[]>(SEED_PRODUCE);
  const [proposals, setProposals] = useState<Proposal[]>(SEED_PROPOSALS);
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coopStats, setCoopStats] = useState<CoopStats>({
    totalRevenue: 2840.50,
    farmerRevenue: 2329.21,
    logisticsRevenue: 369.26,
    adminRevenue: 142.03,
    farmerCount: 3,
    proposalCount: 2,
    orderCount: 42
  });

  // Filters & Interactivity
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedFarmFilter, setSelectedFarmFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFarmOnMap, setSelectedFarmOnMap] = useState<Farmer | null>(SEED_FARMERS[0]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [showVoteSuccess, setShowVoteSuccess] = useState<string | null>(null);
  const [weeklySpend, setWeeklySpend] = useState<number>(100);

  // Farmer Portal Forms
  const [newProduce, setNewProduce] = useState({
    name: '',
    category: 'Vegetables' as const,
    price: 0,
    unit: 'kg',
    stock: 10,
    farmerId: 'farm_01',
    description: '',
    image: '',
    farmerShare: 80,
    coopLogistics: 15,
    coopAdmin: 5
  });

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    creatorName: ''
  });

  // Admin Portal Forms & Settings
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    farmName: '',
    address: '',
    bio: '',
    image: '',
    coopShares: 100
  });

  const [globalFeeSplit, setGlobalFeeSplit] = useState({
    farmerShare: 80,
    coopLogistics: 15,
    coopAdmin: 5
  });

  // Fetch initial data
  useEffect(() => {
    const checkApiAndLoad = async () => {
      try {
        const res = await fetch(`${API_URL}/stats`);
        if (res.ok) {
          setIsApiOnline(true);
          const statsData = await res.json();
          setCoopStats(statsData);

          const farmersRes = await fetch(`${API_URL}/farmers`);
          if (farmersRes.ok) setFarmers(await farmersRes.json());

          const produceRes = await fetch(`${API_URL}/produce`);
          if (produceRes.ok) setProduceList(await produceRes.json());

          const proposalsRes = await fetch(`${API_URL}/proposals`);
          if (proposalsRes.ok) setProposals(await proposalsRes.json());

          const ordersRes = await fetch(`${API_URL}/orders`);
          if (ordersRes.ok) setOrders(await ordersRes.json());
        } else {
          loadFromLocalStorage();
        }
      } catch (err) {
        console.warn('Backend is offline. Using local client mode with persistent LocalStorage.');
        setIsApiOnline(false);
        loadFromLocalStorage();
      }
    };

    checkApiAndLoad();

    // Check if redirected back from Stripe / Mock checkout success
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      setCart([]);
      window.history.replaceState({}, document.title, window.location.pathname);
      alert('Cooperative purchase successful! Your payment has been processed and splits routed directly to local family farms.');
      
      // Reload stats and produce lists to show updated stocks and splits ledger
      setTimeout(checkApiAndLoad, 1000);
    }
  }, []);

  // Sync state to localStorage in fallback mode
  const loadFromLocalStorage = () => {
    const localFarmers = localStorage.getItem('coop_farmers');
    const localProduce = localStorage.getItem('coop_produce');
    const localProposals = localStorage.getItem('coop_proposals');
    const localStats = localStorage.getItem('coop_stats');
    const localOrders = localStorage.getItem('coop_orders');

    if (localFarmers) setFarmers(JSON.parse(localFarmers));
    else localStorage.setItem('coop_farmers', JSON.stringify(SEED_FARMERS));

    if (localProduce) setProduceList(JSON.parse(localProduce));
    else localStorage.setItem('coop_produce', JSON.stringify(SEED_PRODUCE));

    if (localProposals) setProposals(JSON.parse(localProposals));
    else localStorage.setItem('coop_proposals', JSON.stringify(SEED_PROPOSALS));

    if (localStats) setCoopStats(JSON.parse(localStats));
    else localStorage.setItem('coop_stats', JSON.stringify(coopStats));

    if (localOrders) setOrders(JSON.parse(localOrders));
    else {
      setOrders(SEED_ORDERS);
      localStorage.setItem('coop_orders', JSON.stringify(SEED_ORDERS));
    }
  };

  const updateLocalStorage = (
    newProdList: Produce[], 
    newPropList: Proposal[], 
    newStats: CoopStats, 
    newFarmers: Farmer[] = farmers, 
    newOrders: any[] = orders
  ) => {
    localStorage.setItem('coop_produce', JSON.stringify(newProdList));
    localStorage.setItem('coop_proposals', JSON.stringify(newPropList));
    localStorage.setItem('coop_stats', JSON.stringify(newStats));
    localStorage.setItem('coop_farmers', JSON.stringify(newFarmers));
    localStorage.setItem('coop_orders', JSON.stringify(newOrders));
  };

  // Cart operations
  const addToCart = (produce: Produce) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.produce._id === produce._id);
      if (existing) {
        return prevCart.map(item => 
          item.produce._id === produce._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { produce, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (produceId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.produce._id === produceId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.produce.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const total = getCartTotal();
    const checkoutData = {
      consumerName: 'Consumer Cooperative Member',
      consumerEmail: 'member@cooperative.coop',
      deliveryAddress: '12 Grange Road, Dublin, Ireland',
      items: cart.map(item => ({
        produceId: item.produce._id,
        quantity: item.quantity
      }))
    };

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/checkout/create-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checkoutData)
        });
        if (res.ok) {
          const data = await res.json();
          setIsCartOpen(false);
          if (data.url) {
            window.location.href = data.url;
          } else {
            alert('Checkout failed: Session URL not found.');
          }
        } else {
          alert('Checkout failed: Server error.');
        }
      } catch (err) {
        console.error('Checkout error:', err);
        alert('Checkout error: Could not reach the server.');
      }
    } else {
      // Local storage mock checkout
      const newProduceList = produceList.map(p => {
        const cartItem = cart.find(ci => ci.produce._id === p._id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      });

      // Update stats
      let extraFarmer = 0;
      let extraLogistics = 0;
      let extraAdmin = 0;

      cart.forEach(item => {
        const cost = item.produce.price * item.quantity;
        const breakdown = item.produce.pricingBreakdown;
        extraFarmer += cost * breakdown.farmerShare;
        extraLogistics += cost * breakdown.coopLogistics;
        extraAdmin += cost * breakdown.coopAdmin;
      });

      const newStats: CoopStats = {
        ...coopStats,
        totalRevenue: Number((coopStats.totalRevenue + total).toFixed(2)),
        farmerRevenue: Number((coopStats.farmerRevenue + extraFarmer).toFixed(2)),
        logisticsRevenue: Number((coopStats.logisticsRevenue + extraLogistics).toFixed(2)),
        adminRevenue: Number((coopStats.adminRevenue + extraAdmin).toFixed(2)),
        orderCount: coopStats.orderCount + 1
      };

      setProduceList(newProduceList);
      setCoopStats(newStats);
      updateLocalStorage(newProduceList, proposals, newStats);
      setCart([]);
      setIsCartOpen(false);
      alert('Local Storage Demo: Cooperative purchase successful! Your purchase has been tracked in the Local Cooperative Ledger.');
    }
  };

  // Vote on proposal
  const castVote = async (proposalId: string, voteType: 'Yes' | 'No') => {
    const memberId = 'member_' + Math.random().toString(36).substring(2, 7);
    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/proposals/${proposalId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId,
            role: 'consumer',
            vote: voteType
          })
        });
        if (res.ok) {
          const updatedProp = await res.json();
          setProposals(prev => prev.map(p => p._id === proposalId ? updatedProp : p));
          setShowVoteSuccess(proposalId);
          setTimeout(() => setShowVoteSuccess(null), 3000);
        }
      } catch (err) {
        alert('Error voting');
      }
    } else {
      // Local Mock Vote
      const updatedProps = proposals.map(p => {
        if (p._id === proposalId) {
          return {
            ...p,
            yesVotes: voteType === 'Yes' ? p.yesVotes + 1 : p.yesVotes,
            noVotes: voteType === 'No' ? p.noVotes + 1 : p.noVotes,
            votes: [...p.votes, { memberId, role: 'consumer', votedFor: voteType, votedDate: new Date().toISOString() }]
          };
        }
        return p;
      });
      setProposals(updatedProps);
      updateLocalStorage(produceList, updatedProps, coopStats);
      setShowVoteSuccess(proposalId);
      setTimeout(() => setShowVoteSuccess(null), 3000);
    }
  };

  // Add proposal
  const submitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposal.title || !newProposal.description || !newProposal.creatorName) return;

    const proposalData = {
      title: newProposal.title,
      description: newProposal.description,
      creatorName: newProposal.creatorName,
      yesVotes: 1,
      noVotes: 0,
      votes: [],
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active' as const
    };

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/proposals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(proposalData)
        });
        if (res.ok) {
          const savedProp = await res.json();
          setProposals(prev => [savedProp, ...prev]);
          setNewProposal({ title: '', description: '', creatorName: '' });
          alert('Cooperative Proposal published! Active for democratic voting.');
        }
      } catch (err) {
        alert('Error publishing proposal');
      }
    } else {
      const createdProp: Proposal = {
        _id: 'prop_' + Date.now(),
        ...proposalData
      };
      const updatedProps = [createdProp, ...proposals];
      const updatedStats = { ...coopStats, proposalCount: coopStats.proposalCount + 1 };
      setProposals(updatedProps);
      setCoopStats(updatedStats);
      updateLocalStorage(produceList, updatedProps, updatedStats);
      setNewProposal({ title: '', description: '', creatorName: '' });
      alert('Local Storage Demo: Cooperative Proposal published in Ledger!');
    }
  };

  // Add produce (Farmer Portal)
  const submitProduce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduce.name || !newProduce.price || !newProduce.description) return;

    const matchedFarmer = farmers.find(f => f._id === newProduce.farmerId) || farmers[0];

    const totalBreakdown = newProduce.farmerShare + newProduce.coopLogistics + newProduce.coopAdmin;
    if (totalBreakdown !== 100) {
      alert('Error: Pricing breakdown shares must add up to exactly 100%');
      return;
    }

    const produceData = {
      name: newProduce.name,
      category: newProduce.category,
      price: Number(newProduce.price),
      unit: newProduce.unit,
      stock: Number(newProduce.stock),
      farmer: matchedFarmer._id,
      image: newProduce.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      description: newProduce.description,
      pricingBreakdown: {
        farmerShare: newProduce.farmerShare / 100,
        coopLogistics: newProduce.coopLogistics / 100,
        coopAdmin: newProduce.coopAdmin / 100
      },
      harvestDate: new Date().toISOString()
    };

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_URL}/produce`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produceData)
        });
        if (res.ok) {
          const produceRes = await fetch(`${API_URL}/produce`);
          if (produceRes.ok) setProduceList(await produceRes.json());
          setNewProduce({
            name: '',
            category: 'Vegetables',
            price: 0,
            unit: 'kg',
            stock: 10,
            farmerId: 'farm_01',
            description: '',
            image: '',
            farmerShare: 80,
            coopLogistics: 15,
            coopAdmin: 5
          });
          alert('Produce listed successfully on the Coop Marketplace!');
        }
      } catch (err) {
        alert('Error adding produce to server');
      }
    } else {
      const createdProduce: Produce = {
        _id: 'prod_' + Date.now(),
        ...produceData,
        farmer: matchedFarmer
      };
      const updatedList = [createdProduce, ...produceList];
      setProduceList(updatedList);
      updateLocalStorage(updatedList, proposals, coopStats);
      setNewProduce({
        name: '',
        category: 'Vegetables',
        price: 0,
        unit: 'kg',
        stock: 10,
        farmerId: 'farm_01',
        description: '',
        image: '',
        farmerShare: 80,
        coopLogistics: 15,
        coopAdmin: 5
      });
      alert('Local Storage Demo: New produce added to local list!');
    }
  };

  // Helper to format currency
  const fmt = (num: number) => `€${num.toFixed(2)}`;

  // Filtered produce logic
  const filteredProduce = produceList.filter(p => {
    const categoryMatch = categoryFilter === 'All' || p.category === categoryFilter;
    
    // Check farm filtering
    const farmerObj = typeof p.farmer === 'object' ? p.farmer as Farmer : null;
    const farmerId = farmerObj ? farmerObj._id : (p.farmer as string);
    const farmMatch = selectedFarmFilter === 'All' || farmerId === selectedFarmFilter;
    
    // Search query matching
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (farmerObj && farmerObj.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && farmMatch && searchMatch;
  });

  return (
    <div className="app-container">
      {/* Top Banner Status */}
      <div className={`system-status-bar ${isApiOnline ? 'online' : 'offline'}`} style={{ gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="status-indicator"></div>
          <span>{isApiOnline ? 'Connected to MongoDB Cooperatives DB' : 'Offline Mode (Mock Ledger Active)'}</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
          PROOF OF CONCEPT ONLY (Target: growerscollective.ie)
        </div>
        <ShieldAlert size={14} className="status-icon" />
      </div>

      {/* Navigation Header */}
      <header className="main-header glass">
        <div className="logo-section" onClick={() => { setActiveTab('marketplace'); setSelectedFarmFilter('All'); setCategoryFilter('All'); }}>
          <div className="logo-icon animate-float">
            <Sparkles size={24} color="#fff" />
          </div>
          <div className="logo-text">
            <h2>Growers' Collective</h2>
            <p>Direct Farmer-to-Consumer Cooperative</p>
          </div>
        </div>

        <nav className="nav-links">
          <button className={`nav-btn ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>
            <Grid size={16} />
            <span>Marketplace</span>
          </button>
          <button className={`nav-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            <MapPin size={16} />
            <span>Coop Map</span>
          </button>
          <button className={`nav-btn ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}>
            <Vote size={16} />
            <span>Democratic Governance</span>
          </button>
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <User size={16} />
            <span>Farmer Portal</span>
          </button>
          <button className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
            <ShieldAlert size={16} />
            <span>Coop Admin</span>
          </button>
        </nav>

        <div className="header-actions">
          <button className="cart-trigger glass" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={20} />
            {cart.length > 0 && <span className="cart-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
          </button>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="main-content">
        
        {/* Marketplace TAB */}
        {activeTab === 'marketplace' && (
          <div className="tab-view animate-fade-in">
            {/* Hero Image Section */}
            <section className="marketplace-hero glass" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
              <div className="hero-content" style={{ paddingRight: '20px' }}>
                <span className="hero-tagline">Food Sovereignty & Networked CSA</span>
                <h1 style={{ fontSize: '32px' }}>Direct farmer-to-consumer trade, bypassing corporate supermarkets.</h1>
                <p style={{ margin: '12px 0 24px 0' }}>
                  We model the values of Community Supported Agriculture (CSA). By co-investing in local organic harvests, consumer-members are designed to share the risks and bounty directly with Irish growers. Under our target charter, **82% of every Euro spent** is modeled to go straight to family farms.
                </p>
                <div className="hero-stats" style={{ display: 'flex', gap: '32px' }}>
                  <div className="hero-stat">
                    <h4 style={{ fontSize: '20px' }}>{fmt(coopStats.totalRevenue)}</h4>
                    <p style={{ fontSize: '10px' }}>Total Coop Trade</p>
                  </div>
                  <div className="hero-stat">
                    <h4 style={{ fontSize: '20px' }}>{fmt(coopStats.farmerRevenue)}</h4>
                    <p style={{ fontSize: '10px' }}>Paid to Farmers (82%)</p>
                  </div>
                  <div className="hero-stat">
                    <h4 style={{ fontSize: '20px' }}>{coopStats.farmerCount}</h4>
                    <p style={{ fontSize: '10px' }}>Active Farms</p>
                  </div>
                </div>
              </div>

              {/* Price comparison calculator widget */}
              <div className="hero-calculator glass" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Supermarket Price Gap</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
                  Drag the slider to see how much of your grocery spend goes directly back to Irish family farms compared to supermarkets.
                </p>
                
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px' }}>Your Spend:</span>
                    <span style={{ color: 'var(--primary)', fontSize: '20px', fontWeight: '800' }}>{fmt(weeklySpend)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="250" 
                    value={weeklySpend} 
                    onChange={(e) => setWeeklySpend(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                </div>

                <div className="comparison-bars">
                  {/* Supermarket representation */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Supermarkets (15% farmgate average)</span>
                      <span style={{ color: '#c62828' }}>{fmt(weeklySpend * 0.15)} to Farm</span>
                    </div>
                    <div className="pricing-breakdown-bar" style={{ height: '18px' }}>
                      <div style={{ width: '15%', backgroundColor: '#c62828' }}></div>
                      <div style={{ width: '85%', backgroundColor: 'rgba(0,0,0,0.08)' }}></div>
                    </div>
                  </div>

                  {/* Growers' Collective representation */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--primary)' }}>Growers' Collective (82% direct share)</span>
                      <span style={{ color: '#2e7d32' }}>{fmt(weeklySpend * 0.82)} to Farm</span>
                    </div>
                    <div className="pricing-breakdown-bar" style={{ height: '18px' }}>
                      <div className="pricing-segment-farmer" style={{ width: '82%' }}></div>
                      <div className="pricing-segment-logistics" style={{ width: '13%' }}></div>
                      <div className="pricing-segment-admin" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '16px', lineHeight: '1.4' }}>
                  *Supermarket estimation based on farmgate dairy & produce shares. Coop split shows direct payments to Irish farms.
                </div>
              </div>
            </section>

            {/* Filter controls */}
            <div className="filter-controls-row">
              <div className="search-box glass">
                <input 
                  type="text" 
                  placeholder="Search organic produce, vegetables, farms..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="farm-filter glass">
                <label>Filter Farm:</label>
                <select value={selectedFarmFilter} onChange={(e) => setSelectedFarmFilter(e.target.value)}>
                  <option value="All">All Coop Farms</option>
                  {farmers.map(f => (
                    <option key={f._id} value={f._id}>{f.farmName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category tabs */}
            <div className="category-scroll">
              {['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Grains'].map(cat => (
                <button 
                  key={cat} 
                  className={`category-chip ${categoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Produce Grid */}
            <div className="produce-grid">
              {filteredProduce.length === 0 ? (
                <div className="empty-state glass">
                  <p>No organic produce matched your filters.</p>
                  <button className="text-btn" onClick={() => { setCategoryFilter('All'); setSelectedFarmFilter('All'); setSearchQuery(''); }}>Reset Filters</button>
                </div>
              ) : (
                filteredProduce.map(produce => {
                  const farmer = typeof produce.farmer === 'object' ? produce.farmer : farmers.find(f => f._id === produce.farmer);
                  const farmerName = farmer ? farmer.farmName : 'Coop Farm';
                  
                  return (
                    <div key={produce._id} className="produce-card glass glass-hover">
                      <div className="produce-img-container">
                        <img src={produce.image} alt={produce.name} className="produce-img" />
                        <span className="produce-badge">{produce.category}</span>
                      </div>
                      <div className="produce-info">
                        <div className="produce-title-row">
                          <h3>{produce.name}</h3>
                          <span className="produce-price">{fmt(produce.price)}<span className="price-unit">/{produce.unit}</span></span>
                        </div>
                        <p className="produce-desc">{produce.description}</p>
                        
                        <div className="produce-farm-tag">
                          <MapPin size={12} />
                          <span>{farmerName}</span>
                        </div>

                        {/* Transparency Pricing Breakdown Visualizer */}
                        <div className="pricing-transparency-box">
                          <div className="transparency-header">
                            <span className="transparency-title"><Percent size={12} /> Transparent Price Share:</span>
                            <span className="farmer-share-label">{(produce.pricingBreakdown.farmerShare * 100).toFixed(0)}% to Farm</span>
                          </div>
                          
                          <div className="pricing-breakdown-bar">
                            <div 
                              className="pricing-segment-farmer" 
                              style={{ width: `${produce.pricingBreakdown.farmerShare * 100}%` }}
                              title={`Farmer direct share: ${(produce.pricingBreakdown.farmerShare * 100).toFixed(0)}%`}
                            ></div>
                            <div 
                              className="pricing-segment-logistics" 
                              style={{ width: `${produce.pricingBreakdown.coopLogistics * 100}%` }}
                              title={`Cooperative logistics/delivery: ${(produce.pricingBreakdown.coopLogistics * 100).toFixed(0)}%`}
                            ></div>
                            <div 
                              className="pricing-segment-admin" 
                              style={{ width: `${produce.pricingBreakdown.coopAdmin * 100}%` }}
                              title={`Coop admin fee: ${(produce.pricingBreakdown.coopAdmin * 100).toFixed(0)}%`}
                            ></div>
                          </div>

                          <div className="transparency-legend">
                            <span className="legend-item"><span className="dot dot-farmer"></span> Farmer: {fmt(produce.price * produce.pricingBreakdown.farmerShare)}</span>
                            <span className="legend-item"><span className="dot dot-logistics"></span> Delivery: {fmt(produce.price * produce.pricingBreakdown.coopLogistics)}</span>
                            <span className="legend-item"><span className="dot dot-admin"></span> Admin: {fmt(produce.price * produce.pricingBreakdown.coopAdmin)}</span>
                          </div>
                        </div>

                        <div className="card-footer">
                          <span className={`stock-level ${produce.stock > 10 ? 'in-stock' : produce.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                            {produce.stock > 10 ? `${produce.stock} available` : produce.stock > 0 ? `Only ${produce.stock} left!` : 'Out of stock'}
                          </span>
                          <button 
                            className="add-to-cart-btn" 
                            disabled={produce.stock <= 0}
                            onClick={() => addToCart(produce)}
                          >
                            <Plus size={16} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Coop Map TAB */}
        {activeTab === 'map' && (
          <div className="tab-view animate-fade-in">
            <div className="map-view-layout">
              {/* Interactive map illustration */}
              <div className="interactive-map-panel glass">
                <div className="map-instruction">
                  <h3>Interactive Cooperative Hubs & Farms</h3>
                  <p>Click on any marker to inspect the farmer bio, local crops, and cooperative stats.</p>
                </div>
                
                {/* Custom SVG Map representing physical farms and logistics hubs */}
                <div className="svg-map-wrapper">
                  <svg viewBox="0 0 600 400" className="region-svg-map">
                    {/* Background paths simulating countryside topography */}
                    <rect width="600" height="400" fill="#e2ede5" rx="16" />
                    
                    {/* Woods/Forest representation */}
                    <path d="M 40 50 Q 80 40 120 70 T 200 60 T 250 120 T 150 180 Z" fill="#d1e3d6" opacity="0.6" />
                    <path d="M 400 250 Q 450 220 500 270 T 550 350 T 450 380 Z" fill="#d1e3d6" opacity="0.6" />
                    
                    {/* Roads/Logistics lines */}
                    <path d="M 150 160 L 440 180" fill="none" stroke="#cfdbd2" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 8" />
                    <path d="M 180 320 L 440 180" fill="none" stroke="#cfdbd2" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 8" />
                    <path d="M 450 240 L 440 180" fill="none" stroke="#cfdbd2" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 8" />

                    {/* Central Logistics Hub */}
                    <g transform="translate(440, 180)" className="map-pin-group hub">
                      <circle r="20" fill="rgba(28, 46, 36, 0.15)" className="ping-effect" />
                      <circle r="12" fill="#1c2e24" />
                      <path d="M -6 -6 L 6 -6 L 6 6 L -6 6 Z" fill="#fff" transform="scale(0.7)" />
                      <circle r="3" fill="#1c2e24" />
                      <text y="-20" textAnchor="middle" fill="#1c2e24" fontWeight="bold" fontSize="11">Dublin Coop Depot</text>
                    </g>

                    {/* Farm 1: GreenValley Farms (Arthur Green) */}
                    <g 
                      transform="translate(450, 240)" 
                      className={`map-pin-group farm ${selectedFarmOnMap?._id === 'farm_01' ? 'active' : ''}`}
                      onClick={() => setSelectedFarmOnMap(farmers[0])}
                    >
                      <circle r="16" fill="rgba(46, 125, 50, 0.2)" className="ping-effect" />
                      <circle r="9" fill="#2e7d32" />
                      <text y="-16" textAnchor="middle" fill="#2e7d32" fontWeight="bold" fontSize="11">GreenValley Farms (Wicklow)</text>
                    </g>

                    {/* Farm 2: MeadowFresh Dairy (Clara Meadow) */}
                    <g 
                      transform="translate(180, 320)" 
                      className={`map-pin-group farm ${selectedFarmOnMap?._id === 'farm_02' ? 'active' : ''}`}
                      onClick={() => setSelectedFarmOnMap(farmers[1])}
                    >
                      <circle r="16" fill="rgba(46, 125, 50, 0.2)" className="ping-effect" />
                      <circle r="9" fill="#2e7d32" />
                      <text y="-16" textAnchor="middle" fill="#2e7d32" fontWeight="bold" fontSize="11">MeadowFresh Dairy (Cork)</text>
                    </g>

                    {/* Farm 3: GoldenGrains Bakery (John Baker) */}
                    <g 
                      transform="translate(150, 160)" 
                      className={`map-pin-group farm ${selectedFarmOnMap?._id === 'farm_03' ? 'active' : ''}`}
                      onClick={() => setSelectedFarmOnMap(farmers[2])}
                    >
                      <circle r="16" fill="rgba(46, 125, 50, 0.2)" className="ping-effect" />
                      <circle r="9" fill="#2e7d32" />
                      <text y="-16" textAnchor="middle" fill="#2e7d32" fontWeight="bold" fontSize="11">GoldenGrains Farm (Galway)</text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Farm inspect side panel */}
              <div className="farm-inspect-panel glass">
                {selectedFarmOnMap ? (
                  <div className="farm-profile animate-fade-in">
                    <img src={selectedFarmOnMap.image} alt={selectedFarmOnMap.farmName} className="farm-profile-img" />
                    <div className="farm-profile-info">
                      <h2>{selectedFarmOnMap.farmName}</h2>
                      <span className="farmer-badge">Coop Member Farmer</span>
                      
                      <div className="farm-detail-item">
                        <User size={16} />
                        <div>
                          <h5>Managed By</h5>
                          <p>{selectedFarmOnMap.name}</p>
                        </div>
                      </div>

                      <div className="farm-detail-item">
                        <MapPin size={16} />
                        <div>
                          <h5>Location</h5>
                          <p>{selectedFarmOnMap.location.address}</p>
                        </div>
                      </div>

                      <div className="farm-detail-item">
                        <Percent size={16} />
                        <div>
                          <h5>Cooperative Ownership Share</h5>
                          <p>{selectedFarmOnMap.coopShares} Votes/Shares</p>
                        </div>
                      </div>

                      <div className="farm-bio">
                        <h5>Biography</h5>
                        <p>{selectedFarmOnMap.bio}</p>
                      </div>

                      <button 
                        className="view-farm-produce-btn"
                        onClick={() => {
                          setSelectedFarmFilter(selectedFarmOnMap._id);
                          setActiveTab('marketplace');
                        }}
                      >
                        <span>Browse Produce from this Farm</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-inspect-state">
                    <Info size={40} />
                    <p>Click on any cooperative farm on the map to inspect their profile.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Governance TAB */}
        {activeTab === 'governance' && (
          <div className="tab-view animate-fade-in">
            {/* Governance intro banner */}
            <section className="governance-hero glass">
              <h1>Cooperative Governance & Proposals</h1>
              <p>
                As a democratic cooperative, decisions are made by members. Farmers and consumers vote on operational changes, financial investments, and pricing policy updates.
              </p>
            </section>

            {/* Financial Ledger overview */}
            <div className="financial-ledger-row">
              <div className="ledger-card glass">
                <div className="ledger-card-header">
                  <TrendingUp size={20} color="#2e7d32" />
                  <h3>Cooperative Treasury</h3>
                </div>
                <div className="ledger-total">{fmt(coopStats.totalRevenue)}</div>
                <p className="ledger-subtext">Cumulative sales processed through our charter.</p>
                
                <div className="ledger-distribution-list">
                  <div className="ledger-distribution-item">
                    <span>Paid to Farmers (82%)</span>
                    <span className="val">{fmt(coopStats.farmerRevenue)}</span>
                  </div>
                  <div className="ledger-distribution-item">
                    <span>Logistics Fund (13%)</span>
                    <span className="val">{fmt(coopStats.logisticsRevenue)}</span>
                  </div>
                  <div className="ledger-distribution-item">
                    <span>Admin/Software Reserve (5%)</span>
                    <span className="val">{fmt(coopStats.adminRevenue)}</span>
                  </div>
                </div>
              </div>

              {/* Create new proposal panel */}
              <div className="create-proposal-card glass">
                <h3>Submit Cooperative Proposal</h3>
                <form onSubmit={submitProposal} className="proposal-form">
                  <div className="form-group">
                    <label>Proposal Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Buy new community refrigerator truck"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Detailed Description</label>
                    <textarea 
                      rows={3} 
                      placeholder="Detail the budget, reasoning, and benefit to the cooperative..."
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Your Name (Member Name)</label>
                    <input 
                      type="text" 
                      placeholder="Your name"
                      value={newProposal.creatorName}
                      onChange={(e) => setNewProposal({...newProposal, creatorName: e.target.value})}
                      required
                    />
                  </div>

                  <button type="submit" className="submit-proposal-btn">
                    <PlusCircle size={16} />
                    <span>Submit Proposal to Ballot</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Active Proposals Section */}
            <div className="proposals-list-section">
              <h2>Active Ballots</h2>
              <div className="proposals-grid">
                {proposals.map(prop => {
                  const totalVotes = prop.yesVotes + prop.noVotes;
                  const yesPct = totalVotes > 0 ? (prop.yesVotes / totalVotes) * 100 : 50;
                  const noPct = totalVotes > 0 ? (prop.noVotes / totalVotes) * 100 : 50;

                  return (
                    <div key={prop._id} className="proposal-card glass">
                      <div className="proposal-header">
                        <span className="status-badge-active">Active Referendum</span>
                        <span className="proposal-deadline">Closes: {new Date(prop.deadline).toLocaleDateString()}</span>
                      </div>
                      <h3>{prop.title}</h3>
                      <p className="proposal-desc">{prop.description}</p>
                      
                      <div className="proposal-author">
                        <User size={12} />
                        <span>Proposed by: <strong>{prop.creatorName}</strong></span>
                      </div>

                      {/* Vote Progress Chart */}
                      <div className="vote-chart-box">
                        <div className="vote-labels">
                          <span>Yes ({prop.yesVotes})</span>
                          <span>No ({prop.noVotes})</span>
                        </div>
                        <div className="vote-bar">
                          <div className="yes-bar" style={{ width: `${yesPct}%` }}></div>
                          <div className="no-bar" style={{ width: `${noPct}%` }}></div>
                        </div>
                        <div className="vote-percentage">
                          <span>{yesPct.toFixed(0)}% Affirmative</span>
                          <span>{noPct.toFixed(0)}% Opposing</span>
                        </div>
                      </div>

                      {/* Voting Actions */}
                      <div className="vote-actions">
                        {showVoteSuccess === prop._id ? (
                          <div className="vote-success-message animate-fade-in">
                            <Check size={16} />
                            <span>Democratic Vote Cast Successfully!</span>
                          </div>
                        ) : (
                          <>
                            <button className="vote-btn yes" onClick={() => castVote(prop._id, 'Yes')}>Vote Yes (Agree)</button>
                            <button className="vote-btn no" onClick={() => castVote(prop._id, 'No')}>Vote No (Disagree)</button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Farmer Portal TAB */}
        {activeTab === 'dashboard' && (
          <div className="tab-view animate-fade-in">
            {/* Farmer Dashboard Header */}
            <div className="farmer-dashboard-header">
              <div>
                <h1>Farmer Portal</h1>
                <p>Register new crops, manage crop stocks, and view collective dividend shares.</p>
              </div>
              <div className="farmer-active-profile glass">
                <img src={farmers[0].image} alt={farmers[0].name} className="avatar" />
                <div>
                  <h5>{farmers[0].name}</h5>
                  <p>{farmers[0].farmName}</p>
                </div>
              </div>
            </div>

            {/* Farm statistics */}
            <div className="farm-stats-row">
              <div className="stat-card glass">
                <h5>Farm Direct Revenue</h5>
                <h3>{fmt(coopStats.farmerRevenue * 0.45)}</h3>
                <p>Your calculated earnings share (approx. 45% of total farmer sales ledger)</p>
              </div>
              <div className="stat-card glass">
                <h5>Active Listings</h5>
                <h3>{produceList.filter(p => {
                  const fId = typeof p.farmer === 'object' ? p.farmer._id : p.farmer;
                  return fId === 'farm_01';
                }).length}</h3>
                <p>Crops published on the consumer marketplace</p>
              </div>
              <div className="stat-card glass">
                <h5>Cooperative Ownership voting weight</h5>
                <h3>{farmers[0].coopShares} Votes</h3>
                <p>Based on your cooperative equity contributions</p>
              </div>
            </div>

            {/* Farm product list & Add product Form */}
            <div className="farm-management-layout">
              {/* Product Listing Form */}
              <div className="add-product-panel glass">
                <h3>List New Crop / Produce</h3>
                <form onSubmit={submitProduce} className="add-product-form">
                  <div className="form-group">
                    <label>Crop / Product Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Organic Strawberries" 
                      value={newProduce.name}
                      onChange={(e) => setNewProduce({ ...newProduce, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Category</label>
                      <select 
                        value={newProduce.category}
                        onChange={(e) => setNewProduce({ ...newProduce, category: e.target.value as any })}
                      >
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Grains">Grains</option>
                      </select>
                    </div>

                    <div className="form-group half">
                      <label>Select Farm Owner</label>
                      <select 
                        value={newProduce.farmerId}
                        onChange={(e) => setNewProduce({ ...newProduce, farmerId: e.target.value })}
                      >
                        {farmers.map(f => (
                          <option key={f._id} value={f._id}>{f.farmName} ({f.name})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Price (Retail USD)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="e.g. 3.50" 
                        value={newProduce.price || ''}
                        onChange={(e) => setNewProduce({ ...newProduce, price: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="form-group half">
                      <label>Selling Unit</label>
                      <input 
                        type="text" 
                        placeholder="e.g. kg, loaf, 250g jar" 
                        value={newProduce.unit}
                        onChange={(e) => setNewProduce({ ...newProduce, unit: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Initial Stock Level</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 50" 
                        value={newProduce.stock}
                        onChange={(e) => setNewProduce({ ...newProduce, stock: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="form-group half">
                      <label>Image URL (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Paste image link..." 
                        value={newProduce.image}
                        onChange={(e) => setNewProduce({ ...newProduce, image: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      rows={2} 
                      placeholder="Describe your crop, harvesting practices, taste..." 
                      value={newProduce.description}
                      onChange={(e) => setNewProduce({ ...newProduce, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  {/* Pricing Breakdown customizer */}
                  <div className="pricing-customizer-box">
                    <h5>Cooperative Pricing Breakdown (Must sum to 100%)</h5>
                    <div className="customizer-row">
                      <div className="customizer-col">
                        <label>Farmer Share (%)</label>
                        <input 
                          type="number" 
                          value={newProduce.farmerShare}
                          onChange={(e) => setNewProduce({ ...newProduce, farmerShare: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="customizer-col">
                        <label>Coop Logistics (%)</label>
                        <input 
                          type="number" 
                          value={newProduce.coopLogistics}
                          onChange={(e) => setNewProduce({ ...newProduce, coopLogistics: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="customizer-col">
                        <label>Coop Admin (%)</label>
                        <input 
                          type="number" 
                          value={newProduce.coopAdmin}
                          onChange={(e) => setNewProduce({ ...newProduce, coopAdmin: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="add-crop-submit-btn">
                    <PlusCircle size={16} />
                    <span>Publish Listing</span>
                  </button>
                </form>
              </div>

              {/* Active Farm listings table */}
              <div className="active-listings-panel glass">
                <h3>Active Cooperative Inventory</h3>
                <div className="inventory-table-wrapper">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Farmer Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produceList.map(p => {
                        const farmer = typeof p.farmer === 'object' ? p.farmer : farmers.find(f => f._id === p.farmer);
                        const farmerName = farmer ? farmer.farmName : 'Coop Farm';
                        
                        return (
                          <tr key={p._id}>
                            <td className="prod-cell">
                              <img src={p.image} alt={p.name} className="inventory-thumb" />
                              <div>
                                <h5>{p.name}</h5>
                                <p>{farmerName}</p>
                              </div>
                            </td>
                            <td>{fmt(p.price)}/{p.unit}</td>
                            <td>
                              <span className={`inventory-stock-badge ${p.stock > 0 ? 'instock' : 'outofstock'}`}>
                                {p.stock} units
                              </span>
                            </td>
                            <td>{(p.pricingBreakdown.farmerShare * 100).toFixed(0)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="tab-view animate-fade-in">
            <div className="farmer-dashboard-header">
              <div>
                <h1>Cooperative Administration Panel</h1>
                <p>Oversee logistics, dispatch orders, onboard new farmers, and configure pricing splits.</p>
              </div>
              <div className="farmer-active-profile glass">
                <div style={{ textAlign: 'right', marginRight: '12px' }}>
                  <h5>Central Coop Admin</h5>
                  <p>Dublin Headquarters</p>
                </div>
                <div className="avatar" style={{ backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '40px', height: '40px' }}>
                  <ShieldAlert size={20} color="#fff" />
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="farm-management-layout" style={{ gridTemplateColumns: '1fr 1.2fr', gap: '24px', marginBottom: '32px' }}>
              
              {/* Left Column: Register Farmer & Fee Config */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Farmer Registration Form */}
                <div className="add-product-panel glass">
                  <h3>Onboard New Farm Member</h3>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newFarmer.name || !newFarmer.farmName || !newFarmer.address) return;
                      
                      const createdFarmer: Farmer = {
                        _id: 'farm_' + Date.now(),
                        name: newFarmer.name,
                        farmName: newFarmer.farmName,
                        location: { lat: 53.0, lng: -8.0, address: newFarmer.address },
                        bio: newFarmer.bio || 'Cooperative organic member farmer.',
                        image: newFarmer.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
                        coopShares: Number(newFarmer.coopShares)
                      };

                      const updatedFarmers = [...farmers, createdFarmer];
                      setFarmers(updatedFarmers);
                      
                      const updatedStats = { ...coopStats, farmerCount: updatedFarmers.length };
                      setCoopStats(updatedStats);

                      if (!isApiOnline) {
                        updateLocalStorage(produceList, proposals, updatedStats, updatedFarmers, orders);
                      }

                      setNewFarmer({ name: '', farmName: '', address: '', bio: '', image: '', coopShares: 100 });
                      alert('New Farmer successfully onboarded to the Cooperative!');
                    }} 
                    className="add-product-form"
                  >
                    <div className="form-group">
                      <label>Farmer Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Fiona Murphy" 
                        value={newFarmer.name}
                        onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Farm Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Wicklow Orchard" 
                        value={newFarmer.farmName}
                        onChange={(e) => setNewFarmer({ ...newFarmer, farmName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Address / Region</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Glendalough, Wicklow" 
                        value={newFarmer.address}
                        onChange={(e) => setNewFarmer({ ...newFarmer, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Cooperative Voting Weight (Shares)</label>
                      <input 
                        type="number" 
                        value={newFarmer.coopShares}
                        onChange={(e) => setNewFarmer({ ...newFarmer, coopShares: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Farmer Bio</label>
                      <textarea 
                        rows={2} 
                        placeholder="Brief bio about their farming methods..." 
                        value={newFarmer.bio}
                        onChange={(e) => setNewFarmer({ ...newFarmer, bio: e.target.value })}
                      ></textarea>
                    </div>
                    <button type="submit" className="add-crop-submit-btn">
                      <PlusCircle size={16} />
                      <span>Onboard Farmer</span>
                    </button>
                  </form>
                </div>

                {/* Cooperative Fee Splits settings */}
                <div className="add-product-panel glass">
                  <h3>Default Pricing Split Guidelines</h3>
                  <div className="add-product-form">
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Configure the default percentage split allocated to new products published on the network.
                    </p>
                    <div className="pricing-customizer-box" style={{ margin: '0' }}>
                      <div className="customizer-row">
                        <div className="customizer-col">
                          <label>Farmer Share (%)</label>
                          <input 
                            type="number" 
                            value={globalFeeSplit.farmerShare}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setGlobalFeeSplit({ ...globalFeeSplit, farmerShare: val });
                            }}
                          />
                        </div>
                        <div className="customizer-col">
                          <label>Logistics (%)</label>
                          <input 
                            type="number" 
                            value={globalFeeSplit.coopLogistics}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setGlobalFeeSplit({ ...globalFeeSplit, coopLogistics: val });
                            }}
                          />
                        </div>
                        <div className="customizer-col">
                          <label>Admin (%)</label>
                          <input 
                            type="number" 
                            value={globalFeeSplit.coopAdmin}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setGlobalFeeSplit({ ...globalFeeSplit, coopAdmin: val });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      type="button" 
                      className="add-crop-submit-btn" 
                      style={{ background: 'var(--accent)' }}
                      onClick={() => {
                        const total = globalFeeSplit.farmerShare + globalFeeSplit.coopLogistics + globalFeeSplit.coopAdmin;
                        if (total !== 100) {
                          alert('Error: Splittings must sum to exactly 100%');
                          return;
                        }
                        alert('Cooperative fee guidelines updated successfully!');
                      }}
                    >
                      <Check size={16} />
                      <span>Apply Fee Splits</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Management & Farmer List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Orders desk */}
                <div className="active-listings-panel glass" style={{ flex: 1 }}>
                  <h3>Order Dispatch Desk</h3>
                  <div className="inventory-table-wrapper" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <table className="inventory-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Consumer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 ? (
                          <tr><td colSpan={5} style={{ textAlign: 'center' }}>No orders registered in the system.</td></tr>
                        ) : (
                          orders.map(order => (
                            <tr key={order._id}>
                              <td><strong>#{order._id.substring(4, 9)}</strong></td>
                              <td>
                                <div style={{ fontSize: '11px' }}>{order.consumerName}</div>
                                <div style={{ fontSize: '9px', color: 'var(--text-light)' }}>{order.deliveryAddress}</div>
                              </td>
                              <td>{fmt(order.totalAmount)}</td>
                              <td>
                                <span className={`inventory-stock-badge ${
                                  order.status === 'Delivered' ? 'instock' : 'outofstock'
                                }`} style={{ textTransform: 'capitalize' }}>
                                  {order.status}
                                </span>
                              </td>
                              <td>
                                <select 
                                  value={order.status} 
                                  onChange={(e) => {
                                    const nextStatus = e.target.value;
                                    const updatedOrders = orders.map(o => o._id === order._id ? { ...o, status: nextStatus } : o);
                                    setOrders(updatedOrders);
                                    if (!isApiOnline) {
                                      updateLocalStorage(produceList, proposals, coopStats, farmers, updatedOrders);
                                    }
                                  }}
                                  style={{ padding: '4px', fontSize: '11px', borderRadius: '4px' }}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Preparing">Preparing</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Farmer Member Directory */}
                <div className="active-listings-panel glass">
                  <h3>Cooperative Farmers Registry</h3>
                  <div className="inventory-table-wrapper" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <table className="inventory-table">
                      <thead>
                        <tr>
                          <th>Farm Name</th>
                          <th>Owner</th>
                          <th>Location</th>
                          <th>Shares</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farmers.map(f => (
                          <tr key={f._id}>
                            <td className="prod-cell">
                              <img src={f.image} alt={f.farmName} className="inventory-thumb" />
                              <h5>{f.farmName}</h5>
                            </td>
                            <td>{f.name}</td>
                            <td>{f.location.address.split(',')[0]}</td>
                            <td><strong>{f.coopShares}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}
      </main>

      {/* Cart Slider Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer glass" onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h3>Cooperative Cart</h3>
            <button className="close-btn" onClick={() => setIsCartOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="cart-drawer-body">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={48} />
                <p>Your basket is currently empty.</p>
                <button className="browse-btn" onClick={() => { setIsCartOpen(false); setActiveTab('marketplace'); }}>Browse Produce</button>
              </div>
            ) : (
              <div className="cart-items-list animate-fade-in">
                {cart.map(item => (
                  <div key={item.produce._id} className="cart-item">
                    <img src={item.produce.image} alt={item.produce.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4>{item.produce.name}</h4>
                      <p className="cart-item-price">{fmt(item.produce.price)} each</p>
                      
                      <div className="quantity-controls">
                        <button className="qty-btn" onClick={() => updateCartQuantity(item.produce._id, -1)}>-</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateCartQuantity(item.produce._id, 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-total-col">
                      <span>{fmt(item.produce.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-drawer-footer">
              <div className="totals-box">
                {/* Visual pricing breakdown of entire cart */}
                <div className="cart-transparency-summary">
                  <h5>Cooperative Distribution of your Total:</h5>
                  <div className="distribution-row">
                    <span>Direct Farmer Income (82% avg):</span>
                    <strong>{fmt(getCartTotal() * 0.82)}</strong>
                  </div>
                  <div className="distribution-row">
                    <span>Community Logistics (13% avg):</span>
                    <strong>{fmt(getCartTotal() * 0.13)}</strong>
                  </div>
                  <div className="distribution-row">
                    <span>Coop Administration (5% avg):</span>
                    <strong>{fmt(getCartTotal() * 0.05)}</strong>
                  </div>
                </div>

                <div className="grand-total-row">
                  <span>Grand Total</span>
                  <h3>{fmt(getCartTotal())}</h3>
                </div>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                <span>Confirm Cooperative Purchase</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
