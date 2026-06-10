import { Schema, model, Document } from 'mongoose';

export interface IVoter {
  memberId: string;
  role: 'farmer' | 'consumer';
  votedFor: 'Yes' | 'No';
  votedDate: Date;
}

export interface IProposal extends Document {
  title: string;
  description: string;
  creatorName: string;
  yesVotes: number;
  noVotes: number;
  votes: IVoter[];
  deadline: Date;
  status: 'Active' | 'Passed' | 'Rejected' | 'Expired';
  createdAt: Date;
}

const VoterSchema = new Schema<IVoter>({
  memberId: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'consumer'], required: true },
  votedFor: { type: String, enum: ['Yes', 'No'], required: true },
  votedDate: { type: Date, default: Date.now }
});

const ProposalSchema = new Schema<IProposal>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creatorName: { type: String, required: true },
  yesVotes: { type: Number, default: 0 },
  noVotes: { type: Number, default: 0 },
  votes: [VoterSchema],
  deadline: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Passed', 'Rejected', 'Expired'], 
    default: 'Active' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const Proposal = model<IProposal>('Proposal', ProposalSchema);
