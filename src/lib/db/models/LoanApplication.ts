import mongoose, { Schema, Document } from 'mongoose';

export interface IPersonalDetails {
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  maritalStatus: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  employment: {
    type: string;
    companyName: string;
    designation: string;
    workExperience: number;
  };
  income: number;
}

export interface ILoanDetails {
  amount: number;
  purpose: string;
  tenure: number;
  interestRate?: number;
}

export interface IDocument {
  type: string;
  fileName: string;
  filePath: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

export interface IStatusHistory {
  status: string;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
  comments?: string;
}

export interface ILoanApplication extends Document {
  userId: mongoose.Types.ObjectId;
  dsaId?: mongoose.Types.ObjectId;
  applicationNumber: string;
  personalDetails: IPersonalDetails;
  loanDetails: ILoanDetails;
  documents: IDocument[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  assignedAt?: Date;
  reviewDeadline?: Date;
  statusHistory: IStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
  generateApplicationNumber(): string;
}

const PersonalDetailsSchema = new Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' },
  },
  employment: {
    type: { type: String, enum: ['Salaried', 'Self-Employed', 'Business'], required: true },
    companyName: { type: String, required: true },
    designation: { type: String, required: true },
    workExperience: { type: Number, required: true, min: 0 },
  },
  income: { type: Number, required: true, min: 0 },
});

const LoanDetailsSchema = new Schema({
  amount: { type: Number, required: true, min: 10000 },
  purpose: { type: String, required: true },
  tenure: { type: Number, required: true, min: 6, max: 360 }, // in months
  interestRate: { type: Number, min: 0, max: 50 },
});

const DocumentSchema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['Aadhar', 'PAN', 'Salary Slip', 'Bank Statement', 'ITR', 'Other']
  },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  comments: { type: String },
});

const StatusHistorySchema = new Schema({
  status: { type: String, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedAt: { type: Date, default: Date.now },
  comments: { type: String },
});

const LoanApplicationSchema = new Schema<ILoanApplication>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dsaId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  applicationNumber: {
    type: String,
    unique: true,
  },
  personalDetails: {
    type: PersonalDetailsSchema,
    required: true,
  },
  loanDetails: {
    type: LoanDetailsSchema,
    required: true,
  },
  documents: [DocumentSchema],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending',
  },
  assignedAt: {
    type: Date,
  },
  reviewDeadline: {
    type: Date,
  },
  statusHistory: [StatusHistorySchema],
}, {
  timestamps: true,
});

// Indexes for better query performance
LoanApplicationSchema.index({ userId: 1 });
LoanApplicationSchema.index({ dsaId: 1 });
LoanApplicationSchema.index({ status: 1 });
LoanApplicationSchema.index({ applicationNumber: 1 });
LoanApplicationSchema.index({ reviewDeadline: 1 });
LoanApplicationSchema.index({ createdAt: -1 });

// Pre-save middleware to generate application number
LoanApplicationSchema.pre('save', function(next) {
  if (!this.applicationNumber) {
    this.applicationNumber = this.generateApplicationNumber();
  }
  next();
});

// Method to generate application number
LoanApplicationSchema.methods.generateApplicationNumber = function(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `LA${year}${month}${timestamp}${random}`;
};

// Pre-save middleware to add status history
LoanApplicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      updatedBy: this.dsaId || this.userId,
      updatedAt: new Date(),
    });
  }
  next();
});

export default mongoose.models.LoanApplication || mongoose.model<ILoanApplication>('LoanApplication', LoanApplicationSchema);
