// frontend/src/pages/admin/AddVehicle.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDispatch, useSelector } from 'react-redux';
import { createVehicle, reset } from '../../features/vehicles/vehicleSlice';

const TiptapToolbar = ({ editor }) => {
  if (!editor) return null;
  const buttonClass = "p-2 rounded-md hover:bg-slate-100 transition-colors";
  const activeClass = "bg-slate-200 text-slate-800";
  return (
    <div className="border border-slate-300 rounded-t-lg p-2 flex gap-1 flex-wrap text-sm">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${buttonClass} ${editor.isActive('bold') ? activeClass : ''}`}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${buttonClass} ${editor.isActive('italic') ? activeClass : ''}`}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : ''}`}>List</button>
    </div>
  );
};

const AddVehicle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(state => state.vehicles);
  
  // --- FORM STATE UPDATED TO MATCH NEW MODEL ---
  const [formData, setFormData] = useState({
    vehicleName: '', category: '', exShowroomPrice: '', sellingPrice: '',
    age: '', condition: '', tyreCondition: '', mileage: '', engine: '', transmission: '', fuelType: '', seatingCapacity: '',
    pros: '', cons: '',
  });
  const [longDescription, setLongDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  const editor = useEditor({
    extensions: [StarterKit], content: longDescription, onUpdate: ({ editor }) => { setLongDescription(editor.getHTML()); },
    editorProps: { attributes: { class: 'prose min-h-[150px] max-w-none p-4 bg-white border-x border-b border-slate-300 rounded-b-lg focus:outline-none' } },
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset()); 
    }
    if (isSuccess) {
      toast.success('Vehicle added successfully!');
      navigate('/admin/vehicles');
    }
    return () => {
        dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleThumbnailChange = (e) => { 
    const file = e.target.files[0]; 
    if (file) { 
      setThumbnail(file); 
      setThumbnailPreview(URL.createObjectURL(file)); 
    } 
  };

  const handleGalleryChange = (e) => { 
    const files = Array.from(e.target.files); 
    setGallery(files); 
    const previews = files.map(file => URL.createObjectURL(file)); 
    setGalleryPreviews(previews); 
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const vehicleFormData = new FormData();
    for (const key in formData) {
      vehicleFormData.append(key, formData[key]);
    }
    vehicleFormData.append('longDescription', longDescription);
    if (thumbnail) {
      vehicleFormData.append('thumbnail', thumbnail);
    }
    if (gallery.length > 0) {
      gallery.forEach(file => vehicleFormData.append('gallery', file));
    }
    dispatch(createVehicle(vehicleFormData));
  };

  const inputClass = "w-full p-2 bg-white rounded-md border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none";
  const labelClass = "block text-sm font-semibold text-slate-600 mb-1.5";
  const fileInputClass = "w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer";

  return (
    <>
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add New Vehicle</h1>
            <p className="text-sm text-slate-500">Fill out the details below to add a new listing.</p>
          </div>
        </div>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-3">Core Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div><label className={labelClass}>Vehicle Name*</label><input type="text" name="vehicleName" value={formData.vehicleName} onChange={handleChange} required className={inputClass} /></div>
              <div><label className={labelClass}>Category*</label><input type="text" name="category" value={formData.category} onChange={handleChange} required className={inputClass} placeholder="e.g., LMV, HCV" /></div>
              {/* --- PRICE FIELDS UPDATED FOR ADMIN LOGIC --- */}
              <div><label className={labelClass}>Ex-Showroom Price (₹)</label><input type="number" name="exShowroomPrice" value={formData.exShowroomPrice} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Asking Price (₹)*</label><input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} required className={inputClass} /></div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Key Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div><label className={labelClass}>Age</label><input type="text" name="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="e.g., 3 Years"/></div>
              <div><label className={labelClass}>Condition</label><input type="text" name="condition" value={formData.condition} onChange={handleChange} className={inputClass} placeholder="e.g., Good"/></div>
              <div><label className={labelClass}>Tyre Condition</label><input type="text" name="tyreCondition" value={formData.tyreCondition} onChange={handleChange} className={inputClass} placeholder="e.g., 75%"/></div>
              <div><label className={labelClass}>Mileage</label><input type="text" name="mileage" value={formData.mileage} onChange={handleChange} className={inputClass} placeholder="e.g., 22 KMPL"/></div>
              <div><label className={labelClass}>Engine</label><input type="text" name="engine" value={formData.engine} onChange={handleChange} className={inputClass} placeholder="e.g., AC Induction"/></div>
              <div><label className={labelClass}>Transmission</label><input type="text" name="transmission" value={formData.transmission} onChange={handleChange} className={inputClass} placeholder="e.g., Manual"/></div>
              <div><label className={labelClass}>Fuel Type</label><input type="text" name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClass} placeholder="e.g., Diesel"/></div>
              <div><label className={labelClass}>Seating Capacity</label><input type="text" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} className={inputClass} placeholder="e.g., 7 Seater"/></div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200"><h2 className="text-lg font-semibold text-slate-700 mb-4">Pros & Cons</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className={labelClass}>Pros <span className="text-xs text-slate-500 font-normal">(one per line)</span></label><textarea name="pros" value={formData.pros} onChange={handleChange} rows="5" className={inputClass}></textarea></div><div><label className={labelClass}>Cons <span className="text-xs text-slate-500 font-normal">(one per line)</span></label><textarea name="cons" value={formData.cons} onChange={handleChange} rows="5" className={inputClass}></textarea></div></div></div>
          <div className="pt-6 border-t border-slate-200"><h2 className="text-lg font-semibold text-slate-700 mb-4">Images</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8"><div><label className={labelClass}>Thumbnail Image*</label><input type="file" name="thumbnail" onChange={handleThumbnailChange} required accept="image/*" className={fileInputClass}/>{thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-4 h-32 w-auto object-cover rounded-lg border border-slate-200" />}</div><div><label className={labelClass}>Gallery Images</label><input type="file" name="gallery" onChange={handleGalleryChange} multiple accept="image/*" className={fileInputClass}/>{galleryPreviews.length > 0 && <div className="mt-4 flex gap-2 flex-wrap">{galleryPreviews.map((src, i) => <img key={i} src={src} alt={`Gallery Preview ${i}`} className="h-24 w-auto object-cover rounded-lg border border-slate-200" />)}</div>}</div></div></div>
          <div className="pt-6 border-t border-slate-200"><h2 className="text-lg font-semibold text-slate-700 mb-4">Long Description</h2><TiptapToolbar editor={editor} /><EditorContent editor={editor} /></div>

          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button type="submit" disabled={isLoading} className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm">
              {isLoading ? <><Loader2 className="animate-spin h-5 w-5" /> Saving...</> : <><Plus className="h-5 w-5"/> Save Vehicle</>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddVehicle;