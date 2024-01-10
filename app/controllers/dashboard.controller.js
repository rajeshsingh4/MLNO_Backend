const db = require("../models");
const Card = db.card;
const File = db.fileMaster;
const PullRequest = db.pullrequest;
// const DataTypes = db.Sequelize;
const sequelize = db.sequelize;

exports.getBankDashboard = async (req, res) => {
    try {
        const totalCards = await Card.count();
        const cards = await Card.findAll({
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

        const data = {
            totalCards,
            bank: cards
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ status:400, message: error.message });
    }
}

exports.getBureauDashboard = async (req, res) => {
    try {
        const totalCards = await Card.count();
        const cards = await Card.findAll({
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
        const data = {
            totalCards,
            bureau: cards
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
        const data = {
            totalCards,
            courier: cards
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ status:400, message: error.message });
    }
}