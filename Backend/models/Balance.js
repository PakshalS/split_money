const mongoose = require ('mongoose');

const BalanceSchema = new  mongoose.Schema ({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group:{
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    amountOwed:{
        type: Number,
        default:0
    },
    amountOwing:{
        type: Number,
        default:0
    }
});

module.exports = mongoose.model('Balance', BalanceSchema);

