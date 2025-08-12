// frontend/src/pages/admin/EditVehicle.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import vehicleService from '../../features/vehicles/vehicleService';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Tiptap Toolbar (same as in AddVehicle)
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

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id: vehicleId } = useParams();

  const [formData, setFormData] = useState({
    vehicleName: '', category: '', originalPrice: '', xKeyPrice: '',
    age: '', condition: '', tyre: '', mileage: '', engine: '', transmission: '', fuelType: '', seating: '',
    pros: '', cons: '',
  });
  const [longDescription, setLongDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: longDescription,
    onUpdate: ({ editor }) => setLongDescription(editor.getHTML()),
    editorProps: { attributes: { class: 'prose min-h-[150px] max-w-none p-4 bg-white border-x border-b border-slate-300 rounded-b-lg focus:outline-none' } },
  });

  useEffect(() => {
    const fetchVehicleData = async () => {
      setIsFetching(true);
      try {
        const data = await vehicleService.getVehicleById(vehicleId);
        
        // --- MODIFIED: Safely access nested specifications ---
        // This ensures that if 'specifications' doesn't exist on an old vehicle record, the app doesn't crash.
        const specs = data.specifications || {};

        setFormData({
          vehicleName: data.vehicleName || '',
          category: data.category || '',
          originalPrice: data.originalPrice || '',
          xKeyPrice: data.xKeyPrice || '',
          age: specs.age || '',
          condition: specs.condition || '',
          tyre: specs.tyre || '',
          mileage: specs.mileage || '',
          engine: specs.engine || '',
          transmission: specs.transmission || '',
          fuelType: specs.fuelType || '',
          seating: specs.seating || '',
          pros: data.pros ? data.pros.join('\n') : '',
          cons: data.cons ? data.cons.join('\n') : '',
        });
        
        if (editor && data.longDescription) {
          editor.commands.setContent(data.longDescription);
        }
      } catch (error) {
        toast.error('Failed to fetch vehicle data.');
        navigate('/admin/vehicles');
      } finally {
        setIsFetching(false);
      }
    };

    fetchVehicleData();
  // We remove 'editor' from dependency array. It's stable and won't cause re-fetches.
  }, [vehicleId, navigate]);


  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // We need to structure the data to match the backend model
    const vehicleUpdateData = {
        vehicleName: formData.vehicleName,
        category: formData.category,
        originalPrice: formData.originalPrice,
        xKeyPrice: formData.xKeyPrice,
        longDescription,
        pros: formData.pros,
        cons: formData.cons,
        // Nest the specifications
        specifications: {
            age: formData.age,
            condition: formData.condition,
            tyre: formData.tyre,
            mileage: formData.mileage,
            engine: formData.engine,
            transmission: formData.transmission,
            fuelType: formData.fuelType,
            seating: formData.seating,
        }
    };
    
    try {
      await vehicleService.updateVehicle(vehicleId, vehicleUpdateData);
      toast.success('Vehicle updated successfully!');
      navigate('/admin/vehicles');
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-2 bg-white rounded-md border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none";
  const labelClass = "block text-sm font-semibold text-slate-600 mb-1.5";
  
  if (isFetching) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /></div>;
  }

  return (
    <>
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Vehicle</h1>
            <p className="text-sm text-slate-500">Update the details for: {formData.vehicleName}</p>
          </div>
        </div>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Core Information */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-3">Core Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div><label className={labelClass}>Vehicle Name*</label><input type="text" name="vehicleName" value={formData.vehicleName} onChange={handleChange} required className={inputClass} /></div>
              <div><label className={labelClass}>Category*</label><input type="text" name="category" value={formData.category} onChange={handleChange} required className={inputClass} /></div>
              <div><label className={labelClass}>Original Price (₹)*</label><input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} required className={inputClass} /></div>
              <div><label className={labelClass}>xKey Price (₹)*</label><input type="number" name="xKeyPrice" value={formData.xKeyPrice} onChange={handleChange} required className={inputClass} /></div>
            </div>
          </div>

          {/* Key Specifications */}
          <div className="pt-6 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Key Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div><label className={labelClass}>Age</label><input type="text" name="age" value={formData.age} onChange={handleChange} className={inputClass}/></div>
              <div><label className={labelClass}>Condition</label><input type="text" name="condition" value={formData.condition} onChange={handleChange} className={inputClass}/></div>
              <div><label className={labelClass}>Tyre Condition</label><input type="text" name="tyre" value={formData.tyre} onChange={handleChange} className={inputClass}/></div>
              <div><label className={labelClass}>Mileage</label><input type="text" name="mileage" value={formData.mileage} onChange={handleChange} className={inputClass}/></div>
              <div><label className={labelClass}>Engine</label><input type="text" name="engine" value={formData.engine} onChange={handleChange} className={inputClass}/></div>
              {/* --- FIXED: Correctly assigned the 'name' and 'value' properties --- */}
              <div><label className={labelClass}>Transmission</label><input type="text" name="transmission" value={formData.transmission} onChange={handleChange} className={inputClass}/></div>
              <div><label className={labelClass}>Fuel Type</label><input type="text" name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClass}/></div>
              <div><label className={labelClass}>Seating Capacity</label><input type="text" name="seating" value={formData.seating} onChange={handleChange} className={inputClass}/></div>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="pt-6 border-t border-slate-200"><h2 className="text-lg font-semibold text-slate-700 mb-4">Pros & Cons</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className={labelClass}>Pros <span className="text-xs text-slate-500 font-normal">(one per line)</span></label><textarea name="pros" value={formData.pros} onChange={handleChange} rows="5" className={inputClass}></textarea></div><div><label className={labelClass}>Cons <span className="text-xs text-slate-500 font-normal">(one per line)</span></label><textarea name="cons" value={formData.cons} onChange={handleChange} rows="5" className={inputClass}></textarea></div></div></div>

          {/* Long Description */}
          <div className="pt-6 border-t border-slate-200"><h2 className="text-lg font-semibold text-slate-700 mb-4">Long Description</h2><TiptapToolbar editor={editor} /><EditorContent editor={editor} /></div>
          
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button type="submit" disabled={isLoading} className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm">
              {isLoading ? <><Loader2 className="animate-spin h-5 w-5" /> Saving Changes...</> : <><Save className="h-5 w-5"/> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditVehicle;