const mongoose =require("mongoose");

const paymentSchema = mongoose.Schema({
    userId :{
        type: mongoose.Types.ObjectId,
        ref : "User",
        required: true
    },
    paymentId :{
        type:String,
    },
    orderId :{
        type:String,
        required: true
    },
    status :{
        type:String,
        required: true
    },
    amount :{
        type:Number,
        required: true
    },
    receipt :{
        type:String,
        required: true
    },
    currency :{
        type:String,
        required: true
    },
    notes: {
            firstName:{
                type:String,
            },
            lastName: {
                type:String,
            },
            memberType: {
                type:String,
            }
        },
},{
    timestamps:true
})

const Payment = mongoose.model("Payment", paymentSchema)

module.exports = Payment