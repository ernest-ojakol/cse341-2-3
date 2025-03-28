const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllTemples = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('temples').find();
        const temples = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(temples);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching temples', error: err.message });
    }
};

const getSingleTemple = async (req, res) => {
    try {
        const templeId = new ObjectId(req.params.id); // Validation already handled in route
        const result = await mongodb.getDatabase().db().collection('temples').findOne({ _id: templeId });
        if (!result) {
            return res.status(404).json({ message: 'Temple not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching temple', error: err.message });
    }
};

const announceTemple = async (req, res) => {
    try {
        const temple = {
            temple_name: req.body.temple_name,
            city: req.body.city,
            date_of_announcement: new String(req.body.date_of_announcement),
            date_of_dedication: req.body.date_of_dedication ? new String(req.body.date_of_dedication) : undefined,
            size: req.body.size ? String(req.body.size) : undefined
        };

        const response = await mongodb.getDatabase().db().collection('temples').insertOne(temple);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Temple announced', id: response.insertedId });
        } else {
            throw new Error('Insert operation not acknowledged');
        }
    } catch (err) {
        res.status(500).json({ message: 'Error announcing temple', error: err.message });
    }
};

const renovateTemple = async (req, res) => {
    try {
        const templeId = new ObjectId(req.params.id);
        const temple = {
            temple_name: req.body.temple_name,
            city: req.body.city,
            date_of_announcement: req.body.date_of_announcement ? new Date(req.body.date_of_announcement) : undefined,
            date_of_dedication: req.body.date_of_dedication ? new Date(req.body.date_of_dedication) : undefined,
            size: req.body.size ? String(req.body.size) : undefined
        };

        Object.keys(temple).forEach(key => temple[key] === undefined && delete temple[key]);

        const response = await mongodb.getDatabase().db().collection('temples').replaceOne(
            { _id: templeId },
            temple
        );
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else if (response.matchedCount === 0) {
            res.status(404).json({ message: 'Temple not found' });
        } else {
            res.status(400).json({ message: 'No changes made to temple' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error renovating temple', error: err.message });
    }
};

const deleteTemple = async (req, res) => {
    try {
        const templeId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('temples').deleteOne({ _id: templeId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Temple not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting temple', error: err.message });
    }
};

module.exports = { getAllTemples, getSingleTemple, announceTemple, renovateTemple, deleteTemple };