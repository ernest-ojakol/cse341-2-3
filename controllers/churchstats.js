const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('cojccountries').find();
    const countries = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching countries', error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const countryId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('cojccountries').findOne({ _id: countryId });
    if (!result) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching country', error: err.message });
  }
};

const openNewCountry = async (req, res) => {
  try {
    const country = {
      country: req.body.country,
      stakes: req.body.stakes,
      temples: req.body.temples,
      church_members: req.body.church_members,
      temple_present: req.body.temple_present,
      temple_contributions: req.body.temple_contributions,
      names_submitted_to_temple: req.body.names_submitted_to_temple
    };

    const response = await mongodb.getDatabase().db().collection('cojccountries').insertOne(country);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Country opened', id: response.insertedId });
    } else {
      throw new Error('Insert operation not acknowledged');
    }
  } catch (err) {
    res.status(500).json({ message: 'Error opening country', error: err.message });
  }
};

const updateMembership = async (req, res) => {
  try {
    const countryId = new ObjectId(req.params.id);
    const country = {
      country: req.body.country,
      stakes: req.body.stakes,
      temples: req.body.temples,
      church_members: req.body.church_members,
      temple_present: req.body.temple_present,
      temple_contributions: req.body.temple_contributions,
      names_submitted_to_temple: req.body.names_submitted_to_temple
    };

    Object.keys(country).forEach(key => country[key] === undefined && delete country[key]);

    const response = await mongodb.getDatabase().db().collection('cojccountries').replaceOne(
      { _id: countryId },
      country
    );
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else if (response.matchedCount === 0) {
      res.status(404).json({ message: 'Country not found' });
    } else {
      res.status(400).json({ message: 'No changes made to country' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating country', error: err.message });
  }
};

const closeChurchOffice = async (req, res) => {
  try {
    const countryId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('cojccountries').deleteOne({ _id: countryId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Country not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error closing church office', error: err.message });
  }
};

module.exports = { getAll, getSingle, openNewCountry, updateMembership, closeChurchOffice };