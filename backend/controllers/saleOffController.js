const SaleOff = require('../models/saleOffModel');
const Category = require('../models/categoryModel');

const getSaleOffs = async (req, res) => {
    const { limit, offset, filters } = req.body;
    try {
        const saleOffs = await SaleOff.getSaleOffs(
            parseInt(limit) || 10,
            parseInt(offset) || 0,
            filters ? JSON.parse(filters) : {}
        );
        res.status(200).json({
            errorCode: 0,
            data: saleOffs
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
}

const getSaleOffCount = async (req, res) => {
    const { filters } = req.body;
    try {
        const count = await SaleOff.getSaleOffCount(filters ? JSON.parse(filters) : {});
        res.status(200).json({
            errorCode: 0,
            count
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

const insertSaleOff = async (req, res) => {
    const { value, status, startDate, endDate } = req.body;
    try {
        const newSaleOff = await SaleOff.insertSaleOff({
            value,
            status,
            startDate,
            endDate
        });
        res.status(201).json({
            errorCode: 0,
            data: newSaleOff
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

const deleteSaleOff = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({
                errorCode: -1,
                error: 'Sale Off ID is required'
            });
        }
        //find categories with this sale off, then remove the sale off from them
        const categories = await Category.getCategories(100, 0, { saleOffId: id });
        console.log('Categories with sale off:', categories);
        if (categories && categories.length > 0) {
            for (const category of categories) {
                await Category.updateCategory(category.madanhmuc, { saleOffId: null });
            }
        }
        const deletedSaleOff = await SaleOff.deleteSaleOff(id);
        res.status(200).json({
            errorCode: 0,
            data: deletedSaleOff
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

const updateSaleOff = async (req, res) => {
    const { id } = req.params;
    const { value, status, startDate, endDate } = req.body;
    try {
        const updatedSaleOff = await SaleOff.updateSaleOff(id, {
            value,
            status,
            startDate,
            endDate
        });
        res.status(200).json({
            errorCode: 0,
            data: updatedSaleOff
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

module.exports = {
    getSaleOffs,
    getSaleOffCount,
    insertSaleOff,
    deleteSaleOff,
    updateSaleOff
};
