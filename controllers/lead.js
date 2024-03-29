const db = require("../models");
const Lead = db.lead;
const Contact = db.contact;
const Interaction = db.interaction;
const Payment = db.payment;

const getContacts = async () => {
    return await Contact.find({});
};

exports.addLead = async (req, res) => {
    const { 
        name, 
        addressLine1, 
        addressLine2, 
        city, 
        state, 
        zip, 
        email, 
        phone,
        contacts
    } = req.body;

    let primaryContact;
    const newContactRecords = [];
    const existingContactRecords = [];

    try {

        // Add provided contacts to the database
        if(contacts.length) {
            for(let i = 0; i < contacts.length; i++) {
                if(!contacts[i]._id) {
                    const contact = new Contact(contacts[i]);
                    newContactRecords.push(contact);
                } else {
                    existingContactRecords.push(contacts[i]);
                }
            }

            if(newContactRecords.length)
                await Contact.insertMany(newContactRecords);
            primaryContact = [...newContactRecords, ...existingContactRecords].find(contact => contact.isPrimaryContact)?._id;
            
        }
        
        // create a new lead
        const lead = new Lead({
            name,
            addressLine1,
            addressLine2,
            city,
            state,
            zip,
            email,
            phone,
            primaryContact,
            contacts: [...newContactRecords, ...existingContactRecords]
        })
        
        await lead.save();

        if(primaryContact) {
            const primaryContactFromDB = await Contact.findById(primaryContact._id.toString());
            primaryContactFromDB.primaryContactLeadId = [
                ...primaryContactFromDB.primaryContactLeadId, 
                lead._id
            ];
            await primaryContactFromDB.save();
        }

        res.status(200).json({ leadId: lead._id });
    } catch(err) {
        res.status(400).json({message: err.message})
    }

    
};

exports.getAllLeads = async (req, res) => {
    try {
        const leads =  await Lead.find({}).populate('primaryContact');
        res.status(200).json(leads);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
}

exports.getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('primaryContact').populate('contacts').populate('interactions').populate('payments');
        res.status(200).json(lead);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
    
}

exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        let primaryContact = lead.primaryContact;
        const newContactRecords = [];
        const existingContactRecords = [];
        let interactions = [];
        let payments = [];

         // Add provided contacts to the database
        if(req.body.contacts.length) {
            let dbContacts;
            if(req.body.contacts.some(contact => contact._id)) {
                dbContacts = await getContacts();
            }
            for(let i = 0; i < req.body.contacts.length; i++) {
                if(!req.body.contacts[i]._id) {
                    const contact = new Contact(req.body.contacts[i]);
                    newContactRecords.push(contact);
                } else {
                    const contactId = req.body.contacts[i]._id;
                    if(dbContacts.find(contact => contact._id.toString() === contactId)?.isPrimaryContact !== req.body.contacts[i].isPrimaryContact)
                        await Contact.findByIdAndUpdate(contactId, { isPrimaryContact: req.body.contacts[i].isPrimaryContact });
                    existingContactRecords.push(req.body.contacts[i]);
                }
            }
            
            if(newContactRecords.length)
                await Contact.insertMany(newContactRecords);
            primaryContact = [...newContactRecords, ...existingContactRecords].find(contact => contact.isPrimaryContact)?._id;
            
        }
        
        // Update primary contact if changed
        if((typeof primaryContact === 'string' && primaryContact !== lead.primaryContact?._id.toString()) || 
            (typeof primaryContact === 'object' && primaryContact?._id.toString() !== lead.primaryContact?._id.toString())) {
            const newPrimaryContactFromDB = await Contact.findById((typeof primaryContact === 'object' && primaryContact?._id.toString()) || primaryContact);
            const oldPrimaryContactFromDB = await Contact.findById(lead.primaryContact?._id.toString());

            newPrimaryContactFromDB.primaryContactLeadId = [
                ...newPrimaryContactFromDB?.primaryContactLeadId, 
                lead._id
            ];
            await newPrimaryContactFromDB?.save();

            if(oldPrimaryContactFromDB) {
                oldPrimaryContactFromDB.primaryContactLeadId = oldPrimaryContactFromDB?.primaryContactLeadId.filter(leadId => leadId.toString() !== lead._id.toString());
                if(oldPrimaryContactFromDB.primaryContactLeadId.length === 0)
                    oldPrimaryContactFromDB.isPrimaryContact = false;
                await oldPrimaryContactFromDB?.save();
            }
            
        }

        if (req.body.interactions && req.body.interactions.length) {
            req.body.interactions.forEach(async (i) => {
                const newInteraction = i._id ? i : new Interaction({
                    ...i,
                    lead: lead._id
                })

                interactions.push(newInteraction)

                if(!i._id) {
                    await newInteraction.save()
                }
                
            })
        }

        if (req.body.payments && req.body.payments.length) {
            req.body.payments.forEach(async (p) => {
                const newPayment = p._id ? p : new Payment({
                    ...p,
                    lead: lead._id
                })

                payments.push(newPayment)

                if(!p._id) await newPayment.save()
                
            })
        }
        

        const updatedLead = {
            ...lead,
            ...req.body,
            primaryContact,
            contacts: [...newContactRecords, ...existingContactRecords],
            interactions,
            payments,
        }
        console.log("UPLEAD", req.body)
        Object.assign(lead, updatedLead).save();
        res.status(204).json(lead);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if(lead.primaryContact) {
            const primaryContactFromDB = await Contact.findById(lead.primaryContact._id.toString());
            primaryContactFromDB.primaryContactLeadId = primaryContactFromDB.primaryContactLeadId.filter(leadId => leadId.toString() !== lead._id.toString());
            if(primaryContactFromDB.primaryContactLeadId.length === 0)
                primaryContactFromDB.isPrimaryContact = false;
            primaryContactFromDB.save();
        }
        await Lead.remove({_id : req.params.id});
        res.status(204).json({ message: "Lead successfully deleted!"})
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}

exports.assignContact = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        lead.contacts.push(req.body.contactId);
        lead.save();
        res.status(204).json(lead);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}