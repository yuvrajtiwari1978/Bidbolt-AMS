import Auction from '../models/Auction.js';
import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

// Admin Auction Management Controller

// Admin delete auction
export const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);
    if (!auction) {
      return res.status(404).json(ApiResponse.error('Auction not found'));
    }
    res.json(ApiResponse.success(null, 'Auction deleted successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Admin cancel bidding
export const cancelBidding = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json(ApiResponse.error('Auction not found'));
  }
    
    auction.status = 'cancelled';
    auction.cancelledAt = new Date();
    await auction.save();
    
    res.json(ApiResponse.success(auction, 'Bidding cancelled successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Admin schedule auction
export const scheduleAuction = async (req, res) => {
  try {
    const { title, description, startTime, endTime, startingPrice, category } = req.body;
    
    const auction = new Auction({
      title,
      description,
      startingPrice,
      category,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'scheduled',
      createdBy: req.user.id
    });
    
    await auction.save();
    
    res.status(201).json(ApiResponse.success(auction, 'Auction scheduled successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Admin close auction
export const closeAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json(ApiResponse.error('Auction not found'));
    }
    
    auction.status = 'closed';
    auction.closedAt = new Date();
    await auction.save();
    
    res.json(ApiResponse.success(auction, 'Auction closed successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  };
};

// Admin get auction schedule
export const getAuctionSchedule = async (req, res) => {
  try {
    const auctions = await Auction.find({ status: { $in: ['scheduled', 'active'] } })
      .select('title startTime endTime status')
      .sort({ startTime: 1 });
    
    res.json(ApiResponse.success(auctions, 'Auction schedule retrieved successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Admin get auction details
export const getAuctionDetails = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('bids.user', 'username email');
    
    if (!auction) {
      return res.status(404).json(ApiResponse.error('Auction not found'));
    }
    
    res.json(ApiResponse.success(auction, 'Auction details retrieved successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Admin get auction analytics
export const getAuctionAnalytics = async (req, res) => {
  try {
    const totalAuctions = await Auction.countDocuments();
    const activeAuctions = await Auction.countDocuments({ status: 'active' });
    const completedAuctions = await Auction.countDocuments({ status: 'closed' });
    const cancelledAuctions = await Auction.countDocuments({ status: 'cancelled' });
    
    res.json(ApiResponse.success({
      totalAuctions,
      activeAuctions,
      completedAuctions,
      cancelledAuctions
    }, 'Auction analytics retrieved successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};
