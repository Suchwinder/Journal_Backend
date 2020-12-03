const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware');

const { Journals } = require("../database/models");

//  Get note by Id
function getJournalEntry(req, res, next) {
    Journals.findByPk(req.params.id)
        .then(journalEntry => res.json(journalEntry))
        .catch(err => next(err));
};

//	SELECT * FROM notes WHERE "studySessionId" = ;
function getAllJournals(req, res, next) {
	Journals.findAll({ 
		where: {
			userID: req.params.id
		}
	})
  .then(found => res.json(found))
  .catch(err=>next(err));
};

function addJournalEntry(req, res, next) {
    Journals.create(req.body)
    .then((newJournalEntry)=>res.status(201).json(newJournalEntry))
    .catch(err=>next(err));
};

// function deleteNote(req, res, next){
//     Note.destroy(
//         {where: {id: req.params.id}}
//     )
//     .then((response) => res.sendStatus(204))
//     .catch((err) => next(err));

// };

/******************* Edit Function *********************/
// function editNote(req, res, next) {
//     Note.update(
//         {noteRecord: req.param('noteRecord')},
//         {where: {id: req.params.id}}
//     )
//     .then((response) => res.sendStatus(200))
//     .catch((err) => next(err));   
// };

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
router.get('/journal_entries/:id', isAuthenticated, getAllJournals);

router.get('/:id', isAuthenticated, getJournalEntry);

router.post('/add', isAuthenticated, addJournalEntry);

// router.delete('/delete/:id', isAuthenticated, deleteNote);

// router.put('/edit/:id', isAuthenticated, editNote);

module.exports = router;
