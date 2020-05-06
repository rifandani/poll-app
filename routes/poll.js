const express = require('express');
const router = express.Router();
const Pusher = require('pusher');

const mongoose = require('mongoose');
const Vote = require('../models/Vote');

// pusher id
var pusher = new Pusher({
  appId: '989278',
  key: '072bf72ee6b4b87d400a',
  secret: '7a158097b2be4947c5f0',
  cluster: 'ap1',
  encrypted: true,
});

// ketika ada yg GET request localhost/poll , maka akan mencari semua data dari model Vote kemudian memberikan response JSON
router.get('/', (req, res) => {
  Vote.find().then((votes) => {
    res.json({
      success: true,
      votes: votes,
    });
  });
});

// ketika ada yg POST request ke localhost/poll , maka akan menyimpan hasil form ke model Vote dengan isi data dari newVote
router.post('/', (req, res) => {
  // saving to MongoDB
  const newVote = {
    os: req.body.os,
    points: 1,
  };

  new Vote(newVote).save().then((vote) => {
    // making pusher trigger events for the chart
    pusher.trigger('os-poll', 'os-vote', {
      points: parseInt(vote.points),
      os: vote.os,
    });

    return res.json({
      success: true,
      message: 'Thank you for voting',
    });
  });
});

module.exports = router;
