import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {

        product: {
          type: mongoose.Schema.ObjectId,
          ref: "products"
        },
        quantity: {
          type: Number,
          default: 1
        }

      }
    ],
    default: []
  }
});

//Paginate
cartSchema.plugin(mongoosePaginate);

//Middleware pre de mongoose
cartSchema.pre("find", function() {
  this.populate("products.product");
})

export const cartModel = mongoose.model(cartCollection, cartSchema)
export default cartModel;