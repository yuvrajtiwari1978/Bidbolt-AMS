import Auction from '../models/Auction.js';

// Get all active auctions
export const getActiveAuctions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      condition,
      sortBy = 'ending_soon',
      search
    } = req.query;

    // Build query
    const query = { status: 'active' };
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (condition) {
      query.condition = condition;
    }
    
    if (minPrice || maxPrice) {
      query.currentBid = {};
      if (minPrice) query.currentBid.$gte = parseFloat(minPrice);
      if (maxPrice) query.currentBid.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'price_low':
        sort.currentBid = 1;
        break;
      case 'price_high':
        sort.currentBid = -1;
        break;
      case 'most_watched':
        sort.watchers = -1;
        break;
      case 'most_bids':
        sort.bidCount = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'ending_soon':
      default:
        sort.endTime = 1;
        break;
    }

    const auctions = await Auction.find(query)
      .populate('seller', 'name rating avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Auction.countDocuments(query);

    res.json({
      success: true,
      data: {
        auctions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      },
      message: 'Active auctions retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Get single auction details
export const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'name rating avatar email joinDate')
      .populate({
        path: 'bids',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
        data: null
      });
    }

    res.json({
      success: true,
      data: auction,
      message: 'Auction details retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Get auctions by category
export const getAuctionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const auctions = await Auction.find({ 
      category: { $regex: category, $options: 'i' },
      status: 'active'
    })
      .populate('seller', 'name rating avatar')
      .sort({ endTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Auction.countDocuments({ 
      category: { $regex: category, $options: 'i' },
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        auctions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      },
      message: 'Category auctions retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Get featured auctions
export const getFeaturedAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ 
      status: 'active',
      $or: [
        { watchers: { $gte: 10 } },
        { bidCount: { $gte: 5 } }
      ]
    })
      .populate('seller', 'name rating avatar')
      .sort({ watchers: -1, bidCount: -1 })
      .limit(8);

    res.json({
      success: true,
      data: auctions,
      message: 'Featured auctions retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Get ending soon auctions
export const getEndingSoonAuctions = async (req, res) => {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const auctions = await Auction.find({
      status: 'active',
      endTime: { $gte: now, $lte: tomorrow }
    })
      .populate('seller', 'name rating avatar')
      .sort({ endTime: 1 })
      .limit(12);

    res.json({
      success: true,
      data: auctions,
      message: 'Ending soon auctions retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Get related auctions
export const getRelatedAuctions = async (req, res) => {
  try {
    const { auctionId } = req.params;
    
    const currentAuction = await Auction.findById(auctionId);
    if (!currentAuction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
        data: null
      });
    }

    const relatedAuctions = await Auction.find({
      _id: { $ne: auctionId },
      category: currentAuction.category,
      status: 'active'
    })
      .populate('seller', 'name rating avatar')
      .limit(4);

    res.json({
      success: true,
      data: relatedAuctions,
      message: 'Related auctions retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};
