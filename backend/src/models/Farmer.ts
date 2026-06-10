import { Schema, model, Document } from 'mongoose';

export interface IFarmer extends Document {
  name: string;
  farmName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  bio: string;
  image: string;
  coopShares: number;
  joinedDate: Date;
}

const FarmerSchema = new Schema<IFarmer>({
  name: { type: String, required: true },
  farmName: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  bio: { type: String, required: true },
  image: { type: String, default: '' },
  coopShares: { type: Number, required: true, default: 100 },
  joinedDate: { type: Date, default: Date.now }
});

export const Farmer = model<IFarmer>('Farmer', FarmerSchema);
