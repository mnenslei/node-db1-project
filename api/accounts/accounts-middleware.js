const Accounts = require('../accounts/accounts-model')
const db = require('../../data/db-config')

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body
  if (!name || !budget) {
    res.status(400).json({ message: "name and budget are required" })
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    res.status(400).json({ message: "name of account must be between 3 and 100" })
  } else if (isNaN(budget)) {
    res.status(400).json({ message: "budget of account must be a number" })
  } else if (budget < 100 || budget > 1000000) {
    res.status(400).json({ message: "budget of account is too large or too small" })
  } else {
    req.name = name.trim()
    next()
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const existing = await db('accounts').where('name', req.body.name.trim()).first()

    if(existing) {
      res.status(400).json({ message: 'that name is taken' })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const result = await Accounts.getById(req.params.id) 
    if (!result) {
      res.status(404).json({ message: 'account not found' })
    } else {
      req.result = result
      next()
    }
  } catch (err) {
    res.status(500).json({ message: 'you broke it' })
  }
}
