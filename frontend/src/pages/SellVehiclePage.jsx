import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { createVehicle, reset } from '../features/vehicles/vehicleSlice';
import { Upload, Loader2 } from 'lucide-react';
import Header from '../components/Header';

const SellVehiclePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.vehicles
  );

  const [formData, setFormData] = useState({
    vehicleName: '',
    category: 'HCV',
    buyingPrice: '',
    sellingPrice: '',
    age: '',
    condition: 'Used',
    tyreCondition: 'Good',
    mileage: '',
    fuelType: 'Diesel',
    seatingCapacity: '',
    longDescription: '',
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success('Vehicle submitted for approval!');
      navigate('/dashboard');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, isSuccess, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!thumbnail) {
      toast.error('Please upload a thumbnail image.');
      return;
    }

    const vehicleData = new FormData();
    Object.keys(formData).forEach(key => {
      vehicleData.append(key, formData[key]);
    });
    vehicleData.append('thumbnail', thumbnail);
    
    dispatch(createVehicle(vehicleData));
  };
  
  const inputStyle = "w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <>
      <Header />
      <div className="bg-slate-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">List Your Commercial Vehicle</h1>
            <p className="mt-2 text-lg text-slate-500">Fill out the details below to submit your vehicle for approval by our team.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Thumbnail Image</label>
              <div
                className="mt-2 flex justify-center items-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition"
                onClick={() => document.getElementById('thumbnail-upload').click()}
              >
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-600">Click to upload an image</p>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
              <input id="thumbnail-upload" type="file" className="hidden" onChange={onFileChange} accept="image/*" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vehicleName" className="block text-sm font-bold text-slate-700 mb-2">Vehicle Name</label>
                <input type="text" name="vehicleName" value={formData.vehicleName} onChange={onChange} className={inputStyle} placeholder="e.g., Tata Ace Gold" required />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={onChange} className={inputStyle} required>
                  <option value="HCV">Heavy Commercial Vehicle (HCV)</option>
                  <option value="LMV">Light Motor Vehicle (LMV)</option>
                  <option value="MMV">Medium Motor Vehicle (MMV)</option>
                </select>
              </div>
              <div>
                <label htmlFor="buyingPrice" className="block text-sm font-bold text-slate-700 mb-2">Your Buying Price (₹)</label>
                <input type="number" name="buyingPrice" value={formData.buyingPrice} onChange={onChange} className={inputStyle} placeholder="e.g., 500000" required />
              </div>
              <div>
                <label htmlFor="sellingPrice" className="block text-sm font-bold text-slate-700 mb-2">Expected Selling Price (₹)</label>
                <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={onChange} className={inputStyle} placeholder="e.g., 450000" required />
              </div>
               <div>
                <label htmlFor="age" className="block text-sm font-bold text-slate-700 mb-2">Vehicle Age (Years)</label>
                <input type="number" name="age" value={formData.age} onChange={onChange} className={inputStyle} placeholder="e.g., 5" required />
              </div>
              <div>
                <label htmlFor="mileage" className="block text-sm font-bold text-slate-700 mb-2">Mileage (km)</label>
                <input type="number" name="mileage" value={formData.mileage} onChange={onChange} className={inputStyle} placeholder="e.g., 75000" required />
              </div>
               <div>
                <label htmlFor="condition" className="block text-sm font-bold text-slate-700 mb-2">Overall Condition</label>
                <select name="condition" value={formData.condition} onChange={onChange} className={inputStyle} required>
                    <option>Used</option>
                    <option>New</option>
                    <option>Refurbished</option>
                </select>
              </div>
              <div>
                <label htmlFor="tyreCondition" className="block text-sm font-bold text-slate-700 mb-2">Tyre Condition</label>
                <select name="tyreCondition" value={formData.tyreCondition} onChange={onChange} className={inputStyle} required>
                    <option>Good</option>
                    <option>Average</option>
                    <option>Needs Replacement</option>
                </select>
              </div>
              <div>
                <label htmlFor="fuelType" className="block text-sm font-bold text-slate-700 mb-2">Fuel Type</label>
                <select name="fuelType" value={formData.fuelType} onChange={onChange} className={inputStyle} required>
                    <option>Diesel</option>
                    <option>Petrol</option>
                    <option>CNG</option>
                    <option>Electric</option>
                </select>
              </div>
              <div>
                <label htmlFor="seatingCapacity" className="block text-sm font-bold text-slate-700 mb-2">Seating Capacity</label>
                <input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={onChange} className={inputStyle} placeholder="e.g., 2" required />
              </div>
            </div>

            <div>
              <label htmlFor="longDescription" className="block text-sm font-bold text-slate-700 mb-2">Detailed Description</label>
              <textarea name="longDescription" value={formData.longDescription} onChange={onChange} rows="6" className={inputStyle} placeholder="Describe the vehicle's history, features, and any other relevant details..." required></textarea>
            </div>

            <div className="text-center pt-4">
               <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto bg-slate-800 text-white font-bold py-3 px-12 rounded-lg hover:bg-slate-900 transition-colors duration-300 flex items-center justify-center disabled:bg-slate-500 mx-auto"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Submit for Approval'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SellVehiclePage;