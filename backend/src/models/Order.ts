import { Schema, model, Document, Types } from 'mongoose';

export interface IOrderItem {
  produce: Types.ObjectId;
  name: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder extends Document {
  consumerName: string;
  consumerEmail: string;
  deliveryAddress: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  produce: { type: Schema.Types.ObjectId, ref: 'Produce', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true }
});

const OrderSchema = new Schema<IOrder>({
  consumerName: { type: String, required: true },
  consumerEmail: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const Order = model<IOrder>('Order', OrderSchema);
