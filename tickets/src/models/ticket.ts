import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Levels, HighSchoolSubjects, UniversitySubjects } from '@raypan2022-tickets/common';
import { UserDoc } from './user';

interface TicketAttrs {
  title: string;
  price: number;
  level: Levels;
  subject: HighSchoolSubjects | UniversitySubjects;
  userId: string;
  user: UserDoc;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  
  level: Levels;
  subject: HighSchoolSubjects | UniversitySubjects;
  userId: string;
  version: number;
  orderId?: string;
  user: UserDoc;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: Object.values(Levels),
    },
    subject: {
      type: String,
      required: true,
      enum: [...Object.values(HighSchoolSubjects), ...Object.values(UniversitySubjects)],
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
