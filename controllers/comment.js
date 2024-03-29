//! Import Dependencies
const express = require('express')
const Card = require('../models/card')
const Event = require('../models/event')

//! Create Router
const router = express.Router()

//* POST -> /comments/<someCardId>
// only logged in users can post comments
router.post('/card/:cardId', (req, res) => {
    console.log(req.params)
    console.log(req.body)
    const cardId = req.params.cardId
    if (req.session.loggedIn) {
        req.body.author = req.session.userId
        const theComment = req.body
        Card.findById(cardId)
            .then(card => {
                card.comments.push(theComment)
                return card.save()
            })
            .then(card => {
                res.redirect(`/cards/${card.id}`)
            })
            .catch(err => {
                console.log(err)
                res.redirect(`/error?error=${err}`)
        })
    } else {
        res.redirect(`/error?error=You%20are%20not%20allowed%20to%20comment%20on%20this%resource`)
    }
})

router.post('/event/:eventId', (req, res) => {
    const eventId = req.params.eventId
    console.log(req.params)
    console.log(req.body)
    if (req.session.loggedIn) {
        req.body.author = req.session.userId
        const theComment = req.body
        Event.findById(eventId)
            .then(event => {
                event.comments.push(theComment)
                return event.save()
            })
            .then(event => {
                res.redirect(`/events/${event.id}`)
            })
            .catch(err => {
                console.log(err)
                res.redirect(`/error?error=${err}`)
            })
    } else {
        res.redirect(`/error?error=You%20are%20not%20allowed%20to%20comment%20on%20this%resource`)
    }
})

//* DELETE -> /comments/delete/<someCardId>/<someCommentId>
router.delete('/delete/:cardId/:commId', (req, res) => {
    console.log(req.params)
    const { cardId, commId } = req.params
    Card.findById(cardId)
        .then(card => {
            const theComment = card.comments.id(commId)
            if (req.session.loggedIn) {
                if (theComment.author == req.session.userId) {
                    theComment.remove()
                    card.save()
                    res.redirect(`/cards/${card.id}`)
                } else {
                    res.redirect(`/error?error=You%20are%20not%20allowed%20to%delete%20this%comment`)
                }
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
    })
})

router.delete('/delete/event/:eventId/:commId', (req, res) => {
    console.log(req.params)
    const { eventId, commId } = req.params
    Event.findById(eventId)
        .then(event => {
            const theComment = event.comments.id(commId)
            if (req.session.loggedIn) {
                if (theComment.author == req.session.userId) {
                    theComment.remove()
                    event.save()
                    res.redirect(`/events/${event.id}`)
                } else {
                    res.redirect(`/error?error=You%20are%20not%20allowed%20to%delete%20this%comment`)
                }
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
    })
})

//! Export Router
module.exports = router