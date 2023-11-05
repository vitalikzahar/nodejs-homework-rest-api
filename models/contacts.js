const fs = require("node:fs/promises");
const path = require("node:path");

const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, { encoding: "UTF-8" });

  return JSON.parse(data);
};

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

const getContactById = async (id) => {
  const contacts = await listContacts();

  const contact = contacts.find((contact) => contact.id === id);
  if (contact === undefined) {
    return null;
  }
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }
  const contactRemove = await getContactById(contactId);
  const newContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];

  await writeContacts(newContacts);
  return contactRemove;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const contact = { id: crypto.randomUUID(), ...body };

  contacts.push(contact);

  await writeContacts(contacts);

  return contact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { contactId, ...body };
  await writeContacts(contacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
