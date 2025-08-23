import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getHeroImages, createHeroImage, deleteHeroImage, reset } from '../../features/heroImages/heroImageSlice';
import { Loader2, Upload, Trash2, ImageOff } from 'lucide-react';

const ManageHeroImages = () => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  const { heroImages, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.heroImages
  );

  // --- HOOK 1: FOR HANDLING TOAST NOTIFICATIONS & STATE RESETS ---
  // This hook runs ONLY when isError or isSuccess changes.
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    
    if (isSuccess && message) {
      toast.success(message);
    }
    
    // Always reset the state after a success or error has been handled.
    // This prevents the toast from showing again on the next action.
    if (isError || isSuccess) {
        dispatch(reset());
    }
  }, [isError, isSuccess, message, dispatch]);

  // --- HOOK 2: FOR INITIAL DATA FETCH ---
  // This hook runs ONLY ONCE when the component mounts.
  useEffect(() => {
    dispatch(getHeroImages());
  }, [dispatch]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image file first.');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    dispatch(createHeroImage(formData));
    setImageFile(null);
    setPreview('');
    e.target.reset();
  };
  
  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this image?')) {
      dispatch(deleteHeroImage(id));
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Manage Hero Images</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Upload New Image</h2>
        <form onSubmit={handleUpload}>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="imageUpload"
              name="image"
              className="hidden"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
            />
            <label htmlFor="imageUpload" className="cursor-pointer">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-md mb-4" />
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <Upload className="w-12 h-12 mb-2" />
                  <span className="font-semibold">Click to select an image</span>
                  <span className="text-sm">PNG, JPG or WEBP</span>
                </div>
              )}
            </label>
          </div>
          <button
            type="submit"
            disabled={!imageFile || isLoading}
            className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-slate-400 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Upload Image'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Current Images</h2>
        {isLoading && heroImages.length === 0 ? (
            <div className="text-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
            </div>
        ) : heroImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {heroImages.map((image) => (
              <div key={image._id} className="relative group bg-slate-100 rounded-lg overflow-hidden shadow">
                <img src={image.url} alt="Hero" className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleDelete(image._id)} disabled={isLoading} className="text-white p-2 bg-red-600 rounded-full hover:bg-red-700 disabled:bg-slate-400">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center py-10 bg-slate-50 rounded-lg">
                <ImageOff className="h-10 w-10 mx-auto text-slate-400 mb-2"/>
                <p className="text-slate-500">No hero images have been uploaded yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ManageHeroImages;