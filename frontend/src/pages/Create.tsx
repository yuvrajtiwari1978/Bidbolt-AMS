import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, X, Plus, Calendar, DollarSign, Package, MapPin } from 'lucide-react';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    startingBid: '',
    buyNowPrice: '',
    duration: '7',
    shippingCost: '',
    location: '',
    internationalShipping: false
  });
  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const categories = [
    'Electronics', 'Fashion', 'Collectibles', 'Sports', 'Automotive', 'Home', 'Books', 'Music', 'Art', 'Jewelry'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    // Handle dropped files similar to handleImageUpload
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating auction:', formData, images);
    // Navigate to the new auction or success page
    navigate('/explore');
  };

  return (
    <div className="px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Create New Auction</h1>
          <p className="text-white/60">List your item and start receiving bids from buyers worldwide</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Photos (up to 10)
            </h3>
            
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragOver 
                  ? 'border-purple-400 bg-purple-500/10' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <p className="text-white mb-2">Drag and drop images here, or click to browse</p>
              <p className="text-white/60 text-sm mb-4">Supports JPG, PNG, GIF up to 10MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Photos
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Item Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  placeholder="Enter a descriptive title for your item"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  <option value="">Select condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
                  placeholder="Provide detailed information about your item, including any flaws or special features"
                />
              </div>
            </div>
          </div>

          {/* Pricing and Duration */}
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing & Duration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Starting Bid *</label>
                <input
                  type="number"
                  name="startingBid"
                  value={formData.startingBid}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Buy It Now Price</label>
                <input
                  type="number"
                  name="buyNowPrice"
                  value={formData.buyNowPrice}
                  onChange={handleInputChange}
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Duration *</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                  <option value="10">10 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Shipping & Location
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Your Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  placeholder="City, State/Country"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Shipping Cost</label>
                <input
                  type="number"
                  name="shippingCost"
                  value={formData.shippingCost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  placeholder="0.00 for free shipping"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="internationalShipping"
                    checked={formData.internationalShipping}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-500 bg-white/5 border border-white/20 rounded focus:ring-purple-400/50"
                  />
                  <span className="text-white/80">Offer international shipping</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="relative group px-8 py-4 rounded-xl font-semibold transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></div>
              <span className="relative text-white">Create Auction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;