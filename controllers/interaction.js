const db = require("../models");
const interactionTypes = require("../enums/interactionTypes");
const Interaction = db.interaction;
const Lead = db.lead;
exports.addInteraction = async (req, res) => {
    const { 
        type,
        label,
        description,
        contact,
        lead
    } = req.body;
    try {

        //Validate type
        if(!interactionTypes.includes(type)) {
            res.status(400).json({message: "Interaction type is not a valid type"})
            return
        }

        const interaction = new Interaction({
            type,
            label,
            description,
            contact,
            lead
        })
        if(lead) {
            const relatedLead = await Lead.findById(lead);
            relatedLead.interactions.push(interaction._id);
            await relatedLead.save();
        }
    
        await interaction.save();
        res.status(200).json({ interactionId: interaction._id });
    } catch(err) {
        res.status(400).json({message: err.message})
    }
};

exports.getAllInteractions = async (req, res) => {
    try {
        const interactions =  await Interaction.find({}).populate('contact', 'firstName lastName').populate('lead', 'name');
        res.status(200).json(interactions);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
}

exports.getInteractionsOnALead = async (req, res) => {
    try {
        const interactions =  await Interaction.find({lead: req.params.leadId}).populate('contact', 'firstName lastName').populate('lead', 'name');
        res.status(200).json(interactions);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
    
}

exports.getInteractionsOnAContact = async (req, res) => {
    try {
        const interactions =  await Interaction.find({contact: req.params.contactId}).populate('contact', 'firstName lastName company');
        res.status(200).json(interactions);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
    
}

exports.getInteractionById = async (req, res) => {
    try {
        const interaction = await Interaction.findById(req.params.id).populate('contact', 'firstName lastName').populate('lead', 'name');
        res.status(200).json(interaction);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
    
}

exports.updateInteraction = async (req, res) => {
    try {
        const { type } = req.body;
        //Validate type
        if(!interactionTypes.includes(type)) {
            res.status(400).json({message: "Interaction type is not a valid type"})
            return
        }
        const interaction = await Interaction.findById(req.params.id);
        if(req.body.lead && req.body.lead !== interaction.lead) {
            const relatedLead = await Lead.findById(req.body.lead);
            const previousLead = await Lead.findById(interaction.lead);
            relatedLead.interactions.push(interaction._id);
            previousLead.interactions = previousLead.interactions.filter(inter => inter.toString() !== interaction._id.toString());
            await relatedLead.save();
            await previousLead.save();
        }
        Object.assign(interaction, req.body).save();
        res.status(204).json(interaction);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteInteraction = async (req, res) => {
    try {
        const interaction = await Interaction.findById(req.params.id);
        if(interaction.lead) {
            const relatedLead = await Lead.findById(interaction.lead);
            relatedLead.interactions = relatedLead.interactions.filter(inter => inter.toString() !== interaction._id.toString());
            await relatedLead.save();
        }
        await Interaction.remove({_id : req.params.id});
        res.status(204).json({ message: "Interaction successfully deleted!"})
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}