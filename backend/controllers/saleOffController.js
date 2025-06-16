const SaleOff = require('../models/saleOffModel');
const Category = require('../models/categoryModel');

const getSaleOffs = async (req, res) => {
    console.log('Get SaleOffs APIs called:', req.query);
    const { limit, offset, minValue, maxValue, saleOffId, status, startDate, endDate } = req.query;
    try {
        const filters = {};
        
        // Validate and add filters
        if (minValue !== undefined && minValue !== null && minValue !== '') {
            filters.minValue = parseFloat(minValue);
        }
        if (maxValue !== undefined && maxValue !== null && maxValue !== '') {
            filters.maxValue = parseFloat(maxValue);
        }
        if (saleOffId !== undefined && saleOffId !== null && saleOffId !== '') {
            filters.saleOffId = saleOffId;
        }
        if (status !== undefined && status !== null && status !== '') {
            filters.status = status;
        }
        if (startDate !== undefined && startDate !== null && startDate !== '') {
            filters.startDate = startDate;
        }
        if (endDate !== undefined && endDate !== null && endDate !== '') {
            filters.endDate = endDate;
        }

        const saleOffs = await SaleOff.getSaleOffs(
            parseInt(limit) || 10,
            parseInt(offset) || 0,
            filters
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
    const { minValue, maxValue, saleOffId, status, startDate, endDate } = req.query;
    try {
        const filters = {};
        
        // Validate and add filters
        if (minValue !== undefined && minValue !== null && minValue !== '') {
            filters.minValue = parseFloat(minValue);
        }
        if (maxValue !== undefined && maxValue !== null && maxValue !== '') {
            filters.maxValue = parseFloat(maxValue);
        }
        if (saleOffId !== undefined && saleOffId !== null && saleOffId !== '') {
            filters.saleOffId = saleOffId;
        }
        if (status !== undefined && status !== null && status !== '') {
            filters.status = status;
        }
        if (startDate !== undefined && startDate !== null && startDate !== '') {
            filters.startDate = startDate;
        }
        if (endDate !== undefined && endDate !== null && endDate !== '') {
            filters.endDate = endDate;
        }

        const count = await SaleOff.getSaleOffCount(filters);
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
