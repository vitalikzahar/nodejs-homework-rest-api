const Contact = require("../models/contact");

async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.find({ owner: req.user.id }).exec();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
}
async function getContactById(req, res, next) {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId).exec();

    if (contact === null) {
      res.status(404).json({ message: "Not found" });
    }
    if (contact.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
    owner: req.user.id,
  };
  console.log(req.user);
  try {
    const result = await Contact.create(contact);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  if (!Object.keys(req.body).length) {
    return res.status(404).json({ message: "missing field favorite" });
  }
  try {
    const result = await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });

    if (result === null) {
      return res.status(404).json({ message: " Not found " });
    }
    if (contact.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;

  try {
    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    if (result.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateStatusContact,
  removeContact,
};
