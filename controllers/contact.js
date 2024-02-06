const db = require("../models");
const Contact = db.contact;
exports.addContact = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        title,
        company,
        addressLine1,
        addressLine2,
        city,
        state,
        zip
    } = req.body;
    
    const contact = new Contact({
        firstName,
        lastName,
        email,
        phone,
        title,
        company,
        addressLine1,
        addressLine2,
        city,
        state,
        zip
    })
    try {
        await contact.save();
        res.status(200).json({ contactId: contact._id });
    } catch(err) {
        res.status(400).json({message: err.message})
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        const contacts =  await Contact.find({}).populate('company', 'name');
        res.status(200).json(contacts);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
}

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).populate('company');
        res.status(200).json(contact);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
    
}

exports.updateContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        const updatedContact = {
            ...contact,
            ...req.body,
        };
        if(contact.company !== req.body.company) {
            const contactLead = await Lead.findById(contact.company);
            updatedContact.isPrimaryContact = false;
            updatedContact.primaryContactLeadId = contact.primaryContactLeadId.filter(id => id.toString() !== contactLead._id.toString());
            if(contactLead.contacts.includes(contact._id)) {
                contactLead.contacts = contactLead.contacts.filter(leadContact => leadContact.toString() !== contact._id.toString());
                if(contactLead.primaryContact?.toString() === contact._id.toString()) {
                    contactLead.primaryContact = null;
                }
                contactLead.save();
            }
        }
        Object.assign(contact, updatedContact).save();
        res.status(204).json(contact);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteContact = async (req, res) => {
    try {
        await Contact.remove({_id : req.params.id});
        res.status(204).json({ message: "Contact successfully deleted!"})
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}