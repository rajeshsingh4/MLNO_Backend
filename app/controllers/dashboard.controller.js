const db = require("../models");
const Card = db.card;
const File = db.fileMaster;
const PullRequest = db.pullrequest;
// const DataTypes = db.Sequelize;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.getBankDashboard = async (req, res) => {
    try {
        let sortByConditions = {};
        if (req.query.sortType === 'all') {
            sortByConditions = {};
        } else if (req.query.startDate && req.query.endDate) {
            sortByConditions = {
                createdAt: {
                    [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate)]
                }
            };
        }

        const totalCards = await Card.count({
            where: {
                Bank: req.organisation,
                ...sortByConditions
            }
        });
        const cards = await Card.findAll({
            where: {
                Bank: req.organisation,
                ...sortByConditions
            },
            group: ['Bank', 'Bureau_Status', 'Courier_Status'],
            attributes: [
                'Bank', 'Bureau_Status', 'Courier_Status',
                [sequelize.fn('COUNT', sequelize.col('Bank')), 'total_bank_records'],
                [sequelize.fn('COUNT', sequelize.col('Bureau_Status')), 'total_bureau_status'],
                [sequelize.fn('COUNT', sequelize.col('Courier_Status')), 'total_courier_status'],
                [sequelize.literal('COUNT(DISTINCT(Bureau_Status))'), 'distinct_bureau'],
                [sequelize.literal('COUNT(DISTINCT(Courier_Status))'), 'distinct_courier'],
            ]
        });
        const recentFiles = await File.findAll({
            limit: 5,
            order: [['updatedAt', 'DESC']]
        });
        const recentCards = await Card.findAll({
            where: {
                Bank: req.organisation
            },
            include: [
                {
                    model: File,
                },
            ],
            limit: 5,
            order: [['updatedAt', 'DESC']]
        });
        const recentPullRequests = await PullRequest.findAll({
            limit: 5,
            order: [['updatedAt', 'DESC']],
            include: [
                {
                    model: Card,
                    attributes: ['Bank', 'id'],
                    where: {
                        Bank: req.organisation
                    }
                },
            ]
        });

        const data = {
            totalCards,
            cards,
            recentFiles,
            recentCards,
            recentPullRequests,
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ status:400, message: error.message });
    }
}

exports.getBureauDashboard = async (req, res) => {
    try {
        let sortByConditions = {};
        if (req.query.sortType === 'all') {
            sortByConditions = {};
        } else if (req.query.startDate && req.query.endDate) {
            sortByConditions = {
                createdAt: {
                    [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate)]
                }
            };
        }
        const totalCards = await Card.count({
            where: {
                Bank: req.organisation,
                ...sortByConditions
            }
        });
        const cards = await Card.findAll({
            where: {
                Bank: req.organisation,
                ...sortByConditions
            },
            group: ['Bank', 'Bureau_Status', 'Courier_Status'],
            attributes: [
                'Bank', 'Bureau_Status', 'Courier_Status',
                [sequelize.fn('COUNT', sequelize.col('Bank')), 'total_bank_records'],
                [sequelize.fn('COUNT', sequelize.col('Bureau_Status')), 'total_bureau_status'],
                [sequelize.fn('COUNT', sequelize.col('Courier_Status')), 'total_courier_status'],
                [sequelize.literal('COUNT(DISTINCT(Bureau_Status))'), 'distinct_bureau'],
                [sequelize.literal('COUNT(DISTINCT(Courier_Status))'), 'distinct_courier'],
            ]
        });
        const recentCards = await Card.findAll({
            where: {
                Bank: req.organisation
            },
            include: [
                {
                    model: File,
                },
            ],
            limit: 5,
            order: [['updatedAt', 'DESC']]
        });
        const recentPullRequests = await PullRequest.findAll({
            limit: 5,
            order: [['updatedAt', 'DESC']],
            include: [
                {
                    model: File,
                    attributes: ['BureauName', 'id'],
                    where: {
                        BureauName: req.organisation
                    }
                },
            ]
        });

        const data = {
            totalCards,
            cards,
            recentCards,
            recentPullRequests,
            recentFiles: [],
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ status:400, message: error.message });
    }
}

exports.getCourierDashboard = async (req, res) => {
    try {
        const totalCards = await Card.count();
        const cards = await Card.findAll({
            group: ['Bank', 'Courier_Status'],
            attributes: [
                'Bank', 'Courier_Status',
                [sequelize.fn('COUNT', sequelize.col('Bank')), 'total_bank_records'],
                [sequelize.fn('COUNT', sequelize.col('Courier_Status')), 'total_courier_status'],
                [sequelize.literal('COUNT(DISTINCT(Courier_Status))'), 'distinct_courier'],
            ]
        });
        const recentCards = await Card.findAll({
            limit: 5,
            order: [['updatedAt', 'DESC']]
        });

        const data = {
            totalCards,
            cards,
            recentCards,
            recentFiles : [],
            recentPullRequests: [],
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ status:400, message: error.message });
    }
}