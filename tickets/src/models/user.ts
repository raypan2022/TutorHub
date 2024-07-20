import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  id: string;
  email: string;
  name: string;
  description?: string;
  calendlyAccessToken?: string;
  calendlyRefreshToken?: string;
  eventuuid?: string;
  userURI?: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<UserDoc | null>;
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  email: string;
  name: string;
  description?: string;
  calendlyAccessToken?: string;
  calendlyRefreshToken?: string;
  eventuuid?: string;
  userURI?: string;
  version: number;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    calendlyAccessToken: {
      type: String
    },
    calendlyRefreshToken: {
      type: String
    },
    eventuuid: {
      type: String
    },
    userURI: {
      type: String
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    email: attrs.email,
    name: attrs.name,
    description: attrs.description,
    calendlyAccessToken: attrs.calendlyAccessToken,
    calendlyRefreshToken: attrs.calendlyRefreshToken,
    eventuuid: attrs.eventuuid,
    userURI: attrs.userURI
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
