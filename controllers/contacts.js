const Contact = require("../models/contact");

async function getContacts(req, res, next) {
  try {
    const contacts = await Contact.find().exec();
    // res.send(contacts);
    console.log(contacts);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
}
async function getContact(req, res, next) {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id).exec();

    if (contact === null) {
      return res.status(404).send("Book not found:(");
    }

    res.send(contact);
  } catch (err) {
    next(err);
  }
}

// async function createBook(req, res, next) {
//   const book = {
//     title: req.body.title,
//     author: req.body.author,
//     genre: req.body.genre,
//     year: req.body.year,
//   };

//   try {
//     const result = await Book.create(book);

//     res.status(201).send(result);
//   } catch (err) {
//     next(err);
//   }
// }

// async function updateBook(req, res, next) {
//   const { id } = req.params;

//   const book = {
//     title: req.body.title,
//     author: req.body.author,
//     genre: req.body.genre,
//     year: req.body.year,
//   };

//   try {
//     const result = await Book.findByIdAndUpdate(id, book, { new: true });

//     if (result === null) {
//       return res.status(404).send("Book not found");
//     }

//     res.send(result);
//   } catch (err) {
//     next(err);
//   }
// }

// async function deleteBook(req, res, next) {
//   const { id } = req.params;

//   try {
//     const result = await Book.findByIdAndDelete(id);

//     if (result === null) {
//       return res.status(404).send("Book not found");
//     }

//     res.send({ id });
//   } catch (err) {
//     next(err);
//   }
// }
module.exports = { getContacts, getContact };
