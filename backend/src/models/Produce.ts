import { Schema, model, Document, Types } from 'mongoose';

export interface IPricingBreakdown {
  farmerShare: number; // e.g. 0.80 for 80%
  coopLogistics: number; // e.g. 0.15 for 15%
  coopAdmin: number; // e.g. 0.05 for 5%
}

export interface IProduce extends Document {
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Bakery' | 'Meat' | 'Grains';
  price: number; // total retail price in USD
  unit: string; // e.g. 'kg', 'box', 'litre'
  stock: number;
  farmer: Types.ObjectId;
  image: string;
  description: string;
  pricingBreakdown: IPricingBreakdown;
  harvestDate: Date;
}

const ProduceSchema = new Schema<IProduce>({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Meat', 'Grains'], 
    required: true 
  },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  farmer: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
  image: { type: String, default: '' },
  description: { type: String, required: true },
  pricingBreakdown: {
    farmerShare: { type: Number, required: true, default: 0.80 },
    coopLogistics: { type: Number, required: true, default: 0.15 },
    coopAdmin: { type: Number, required: true, default: 0.05 }
  },
  harvestDate: { type: Date, default: Date.now }
});

export const Produce = model<IProduce>('Produce', ProduceSchema);
