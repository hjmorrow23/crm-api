const db = require("../models");
const Interaction = db.interaction;
exports.addInteraction = async (req, res) => {
    const { 
        type,
        label,
        description,
        contact
    } = req.body;
    const interaction = new Interaction({
        type,
        label,
        description,
        contact
    })
    try {
        await interaction.save();
        res.status(200).json({ interactionId: interaction._id });
    } catch(err) {
        res.status(400).json({message: err.message})
    }
};

exports.getAllInteractions = async (req, res) => {
    try {
        const interactions =  await Interaction.find({});
        res.status(200).json(interactions);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
}

exports.getInteractionById = async (req, res) => {
    try {
        const interaction = await Interaction.findById(req.params.id);
        res.status(200).json(interaction);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
    
}

exports.updateInteraction = async (req, res) => {
    try {
        const interaction = await Interaction.findById(req.params.id);
        Object.assign(interaction, req.body).save();
        res.status(204).json(interaction);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteInteraction = async (req, res) => {
    try {
        await Interaction.remove({_id : req.params.id});
        res.status(204).json({ message: "Interaction successfully deleted!"})
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}