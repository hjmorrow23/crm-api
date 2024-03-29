const db = require("../models");
const paymentTypes = require("../enums/paymentTypes")
const Payment = db.payment;
const Lead = db.lead;
exports.addPayment = async (req, res) => {
    const { 
        type,
        label,
        description,
        amount,
        paymentDate,
        lead
    } = req.body;
    try {
        //Validate type
        if(!paymentTypes.includes(type)) {
            res.status(400).json({message: "Payment type is not a valid type"})
            return
        }

        const payment = new Payment({
            type,
            label,
            description,
            amount,
            paymentDate,
            lead
        })
        if(lead) {
            const relatedLead = await Lead.findById(lead);
            relatedLead.payments.push(payment._id);
            await relatedLead.save();
        }
        
    
        await payment.save();
        res.status(200).json({ paymentId: payment._id });
    } catch(err) {
        res.status(400).json({message: err.message})
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments =  await Payment.find({}).populate('lead', 'name');
        res.status(200).json(payments);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
}

exports.getPaymentsOnALead = async (req, res) => {
    try {
        const payments =  await Payment.find({lead: req.params.leadId}).populate('lead', 'name');
        res.status(200).json(payments);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
    
}

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('lead', 'name');
        res.status(200).json(payment);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
    
}

exports.updatePayment = async (req, res) => {
    try {
        const { type } = req.body;

        //Validate type
        if(!paymentTypes.includes(type)) {
            res.status(400).json({message: "Payment type is not a valid type"})
            return
        }
        const payment = await Payment.findById(req.params.id);
        if(req.body.lead && req.body.lead !== payment.lead) {
            const relatedLead = await Lead.findById(req.body.lead);
            const previousLead = await Lead.findById(payment.lead);
            relatedLead.payments.push(payment._id);
            previousLead.payments = previousLead.payments.filter(inter => inter.toString() !== payment._id.toString());
            await relatedLead.save();
            await previousLead.save();
        }
        Object.assign(payment, req.body).save();
        res.status(204).json(payment);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if(payment.lead) {
            const relatedLead = await Lead.findById(payment.lead);
            relatedLead.payments = relatedLead.payments.filter(inter => inter.toString() !== payment._id.toString());
            await relatedLead.save();
        }
        await Payment.remove({_id : req.params.id});
        res.status(204).json({ message: "Payment successfully deleted!"})
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}