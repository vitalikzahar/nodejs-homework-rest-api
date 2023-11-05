const express = require("express");

const router = express.Router();

const contacts = require("../../models/contacts");
const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
});

router.get("/", async (req, res, next) => {
  const result = await contacts.listContacts();
  res.status(200).json(result);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
});

router.post("/", async (req, res, next) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    res.status(400).json({ massage: "missing required name field" });
  }
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    res.status(400).json({ massage: "missing required name field" });
  }
  const { contactId } = req.params;
  const result = await contacts.updateContact(contactId, req.body);
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
});

module.exports = router;
