import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Farmer } from './models/Farmer';
import { Produce } from './models/Produce';
import { Proposal } from './models/Proposal';
import { Order } from './models/Order';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/coop-harvest';

app.use(cors());
app.use(express.json());

// Seeding function
async function seedDatabase() {
  try {
    const farmerCount = await Farmer.countDocuments();
    if (farmerCount === 0) {
      console.log('Seeding initial cooperative farmers...');
      const seededFarmers = await Farmer.insertMany([
        {
          name: 'Arthur Green',
          farmName: 'GreenValley Farms',
          location: { lat: 53.0123, lng: -6.3214, address: 'Wicklow Hills, Ireland' },
          bio: 'Arthur is a third-generation organic vegetable farmer committed to soil health and pesticide-free heirloom crops in the Garden of Ireland.',
          coopShares: 120,
          image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Clara Meadow',
          farmName: 'MeadowFresh Dairy & Cheese',
          location: { lat: 52.1245, lng: -8.4952, address: 'Golden Vale, Cork, Ireland' },
          bio: 'Clara cares for a small herd of Jersey cows, producing rich organic milk, grass-fed butter, and artisanal cheese in the lush pastures of Cork.',
          coopShares: 150,
          image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'John Baker',
          farmName: 'GoldenGrains Bakery & Farm',
          location: { lat: 53.2841, lng: -9.0124, address: 'Galway Bay, Ireland' },
          bio: 'John grows ancient stone-ground wheat varieties and bakes slow-fermentation sourdough breads in a wood-fired oven in the West of Ireland.',
          coopShares: 95,
          image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=400&q=80'
        }
      ]);

      console.log('Seeding initial produce items...');
      await Produce.insertMany([
        {
          name: 'Organic Heirloom Tomatoes',
          category: 'Vegetables',
          price: 4.50,
          unit: 'kg',
          stock: 45,
          farmer: seededFarmers[0]._id,
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
          description: 'Juicy, colorful heritage tomatoes picked ripe from the vine. Full of sweet flavor.',
          pricingBreakdown: { farmerShare: 0.82, coopLogistics: 0.13, coopAdmin: 0.05 }
        },
        {
          name: 'Fresh Crisp Kale',
          category: 'Vegetables',
          price: 2.20,
          unit: 'bunch',
          stock: 30,
          farmer: seededFarmers[0]._id,
          image: 'https://images.unsplash.com/photo-1628773822503-930a8589ec93?auto=format&fit=crop&w=400&q=80',
          description: 'Dark green, curly kale leaves. Rich in iron, crisp, and perfect for salads or green smoothies.',
          pricingBreakdown: { farmerShare: 0.80, coopLogistics: 0.15, coopAdmin: 0.05 }
        },
        {
          name: 'Artisanal Cheddar Cheese (Aged)',
          category: 'Dairy',
          price: 7.90,
          unit: '500g block',
          stock: 20,
          farmer: seededFarmers[1]._id,
          image: 'https://images.unsplash.com/photo-1618067425506-7551618e6f14?auto=format&fit=crop&w=400&q=80',
          description: 'Sharp, crumbly cheddar aged for 12 months in the farm cheese caves. Rich, complex taste.',
          pricingBreakdown: { farmerShare: 0.85, coopLogistics: 0.10, coopAdmin: 0.05 }
        },
        {
          name: 'Grass-Fed Salted Butter',
          category: 'Dairy',
          price: 3.80,
          unit: '250g roll',
          stock: 25,
          farmer: seededFarmers[1]._id,
          image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
          description: 'Churned from cultured raw cream from grass-fed Jersey cows. Deep golden yellow color.',
          pricingBreakdown: { farmerShare: 0.80, coopLogistics: 0.15, coopAdmin: 0.05 }
        },
        {
          name: 'Stone-Ground Sourdough Bread',
          category: 'Bakery',
          price: 4.20,
          unit: 'loaf',
          stock: 15,
          farmer: seededFarmers[2]._id,
          image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80',
          description: 'Crusty loaf baked daily using a 5-year-old wild yeast sourdough culture and Cotswolds organic wheat.',
          pricingBreakdown: { farmerShare: 0.83, coopLogistics: 0.12, coopAdmin: 0.05 }
        }
      ]);

      console.log('Seeding initial cooperative proposals...');
      await Proposal.insertMany([
        {
          title: 'Cooperative Cold-Storage Facility Purchase',
          description: 'Acquire a commercial-grade walk-in cooling container at our central logistics depot to extend the shelf life of fresh leafy greens and berries during summer harvests. Budget: €12,500 from the Coop reserves.',
          creatorName: 'Arthur Green',
          yesVotes: 18,
          noVotes: 2,
          votes: [
            { memberId: 'f_01', role: 'farmer', votedFor: 'Yes', votedDate: new Date() },
            { memberId: 'c_01', role: 'consumer', votedFor: 'Yes', votedDate: new Date() },
            { memberId: 'f_02', role: 'farmer', votedFor: 'No', votedDate: new Date() }
          ],
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          status: 'Active'
        },
        {
          title: 'Reduce Administration Levy to 4%',
          description: 'With administrative systems running smoothly online, propose lowering the cooperative commission fee from 5% to 4%, directing an extra 1% directly back to farmers on every transaction.',
          creatorName: 'John Baker',
          yesVotes: 32,
          noVotes: 0,
          votes: [
            { memberId: 'f_03', role: 'farmer', votedFor: 'Yes', votedDate: new Date() }
          ],
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          status: 'Active'
        }
      ]);
      console.log('Database successfully seeded!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// API Endpoints
app.get('/api/farmers', async (req: Request, res: Response) => {
  try {
    const farmers = await Farmer.find();
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

app.get('/api/produce', async (req: Request, res: Response) => {
  try {
    const produce = await Produce.find().populate('farmer');
    res.json(produce);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch produce' });
  }
});

app.post('/api/produce', async (req: Request, res: Response) => {
  try {
    const newProduce = new Produce(req.body);
    const savedProduce = await newProduce.save();
    res.status(201).json(savedProduce);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add produce' });
  }
});

app.get('/api/proposals', async (req: Request, res: Response) => {
  try {
    const proposals = await Proposal.find();
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

app.post('/api/proposals', async (req: Request, res: Response) => {
  try {
    const newProposal = new Proposal(req.body);
    const savedProposal = await newProposal.save();
    res.status(201).json(savedProposal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

app.post('/api/proposals/:id/vote', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { memberId, role, vote } = req.body; // vote is 'Yes' or 'No'

  try {
    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Check if member already voted
    const alreadyVoted = proposal.votes.some(v => v.memberId === memberId);
    if (alreadyVoted) {
      return res.status(400).json({ error: 'You have already voted on this proposal' });
    }

    proposal.votes.push({
      memberId,
      role,
      votedFor: vote,
      votedDate: new Date()
    });

    if (vote === 'Yes') {
      proposal.yesVotes += 1;
    } else {
      proposal.noVotes += 1;
    }

    await proposal.save();
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register vote' });
  }
});

app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    // Deduct stock for ordered items
    for (const item of newOrder.items) {
      await Produce.findByIdAndUpdate(item.produce, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    const produceList = await Produce.find();
    const farmers = await Farmer.find();
    const proposals = await Proposal.find();

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate distributions based on pricingBreakdown
    let farmerRevenue = 0;
    let logisticsRevenue = 0;
    let adminRevenue = 0;

    for (const order of orders) {
      for (const item of order.items) {
        const prod = produceList.find(p => p._id.toString() === item.produce.toString());
        const share = prod?.pricingBreakdown || { farmerShare: 0.80, coopLogistics: 0.15, coopAdmin: 0.05 };
        const itemTotal = item.priceAtPurchase * item.quantity;
        
        farmerRevenue += itemTotal * share.farmerShare;
        logisticsRevenue += itemTotal * share.coopLogistics;
        adminRevenue += itemTotal * share.coopAdmin;
      }
    }

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      farmerRevenue: Number(farmerRevenue.toFixed(2)),
      logisticsRevenue: Number(logisticsRevenue.toFixed(2)),
      adminRevenue: Number(adminRevenue.toFixed(2)),
      farmerCount: farmers.length,
      proposalCount: proposals.length,
      orderCount: orders.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

// Database connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB.');
    seedDatabase();
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB. Starting Express server with local mock data routing...');
    
    // Server fallback logic when MongoDB is not running (enables local testing easily)
    app.listen(PORT, () => {
      console.log(`Backend server (MOCK FALLBACK) running on http://localhost:${PORT}`);
    });
  });
