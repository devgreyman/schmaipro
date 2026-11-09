import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { resizeImageToBase64 } from '../../utils/imageUtils';
import { 
  Building2, 
  Upload, 
  Plus, 
  Trash2, 
  Search, 
  Check, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Globe,
  Camera,
  Edit2,
  X,
  Save,
  RotateCcw
} from 'lucide-react';

export default function SchoolManager() {
  const { schools, addSchool, deleteSchool, updateSchool, resetSchoolsToDefault, showToast } = usePortal();

  // Add School Form State
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [acronym, setAcronym] = useState('');
  const [tagline, setTagline] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [logoPreview, setLogoPreview] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit School Modal State
  const [editingSchool, setEditingSchool] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDomain, setEditDomain] = useState('');
  const [editAcronym, setEditAcronym] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [editColor, setEditColor] = useState('#2563EB');
  const [editLogoPreview, setEditLogoPreview] = useState('');

  // Image Upload handler for Add / Edit forms
  const handleLogoUpload = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg')) {
      showToast('Please select a valid image file (PNG, JPG, SVG, or WebP).', 'error');
      return;
    }

    try {
      setIsProcessingImage(true);
      const optimizedBase64 = await resizeImageToBase64(file, 200, 200);
      
      if (!optimizedBase64) {
        showToast('Could not process this image. Please try another file.', 'error');
        return;
      }

      if (isEdit) {
        setEditLogoPreview(optimizedBase64);
      } else {
        setLogoPreview(optimizedBase64);
        setUploadedFileName(file.name);
      }
      showToast(`Logo "${file.name}" attached successfully!`, 'success');
    } catch (err) {
      showToast('Error processing image file. Please try another image.', 'error');
    } finally {
      setIsProcessingImage(false);
      e.target.value = ''; // Always clear to allow re-upload
    }
  };

  // Direct 1-Click Logo Upload from School Card
  const handleDirectCardLogoUpload = async (schoolId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Uploading and saving new logo...', 'info');
      const optimizedBase64 = await resizeImageToBase64(file, 200, 200);
      
      if (!optimizedBase64) {
        showToast('Image processing failed. Try another format (PNG or JPG).', 'error');
        return;
      }

      updateSchool(schoolId, { logo: optimizedBase64 });
      showToast('School logo updated and saved instantly!', 'success');
    } catch (err) {
      showToast('Failed to update logo image.', 'error');
    } finally {
      e.target.value = ''; // Always clear to allow re-upload
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) {
      showToast('Please specify both School Name and Email Domain.', 'error');
      return;
    }

    const created = addSchool({
      name,
      domain,
      acronym: acronym || name.slice(0, 6).toUpperCase(),
      color,
      logo: logoPreview,
      tagline: tagline.trim() || '',
    });

    if (created) {
      setName('');
      setDomain('');
      setAcronym('');
      setTagline('');
      setLogoPreview('');
      setUploadedFileName('');
    }
  };

  // Open Edit Modal for an existing school
  const openEditModal = (school) => {
    setEditingSchool(school);
    setEditName(school.name);
    setEditDomain(school.domain);
    setEditAcronym(school.acronym || '');
    setEditTagline(school.tagline || '');
    setEditColor(school.color || '#2563EB');
    setEditLogoPreview(school.logo || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingSchool) return;

    updateSchool(editingSchool.id, {
      name: editName.trim(),
      domain: editDomain.trim(),
      acronym: editAcronym.trim().toUpperCase(),
      tagline: editTagline.trim(),
      color: editColor,
      logo: editLogoPreview,
    });

    setEditingSchool(null);
  };

  // Quick Preset Templates for convenience
  const handlePreset = (type) => {
    if (type === 'uniben') {
      setName('University of Benin (UNIBEN)');
      setDomain('@uniben.edu');
      setAcronym('UNIBEN');
      setColor('#6B21A8');
      setTagline('Knowledge and Excellence • Ugbowo, Benin City');
    } else if (type === 'unilag') {
      setName('University of Lagos (UNILAG)');
      setDomain('@unilag.edu.ng');
      setAcronym('UNILAG');
      setColor('#047857');
      setTagline('In Deed and in Truth • Akoka, Lagos');
    } else if (type === 'school1') {
      setName('School 1 International Academy');
      setDomain('@school1.edu');
      setAcronym('SCH-1');
      setColor('#2563EB');
      setTagline('Excellence in Global Learning & Research');
    } else if (type === 'mit') {
      setName('Massachusetts Institute of Technology');
      setDomain('@mit.edu');
      setAcronym('MIT');
      setColor('#A31F34');
      setTagline('Mens et Manus • Cambridge, MA');
    }
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.acronym && s.acronym.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in text-slate-200">
      
      {/* Intro Header */}
      <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">School Profiles & Logo Management</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload custom school logos and register email domains. When students enter their school email, their school logo instantly pops up on the login card.
              </p>
            </div>
          </div>

          {/* Reset to Clean Defaults Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all schools to clean official defaults (UNILAG, UNIBEN, School 1-5, etc.)?')) {
                resetSchoolsToDefault();
              }
            }}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#161F33] hover:bg-[#1E293B] border border-[#243048] hover:border-slate-500 text-xs text-slate-300 font-medium flex items-center gap-2 transition-colors cursor-pointer"
            title="Purge cached icons and restore clean presets"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reset Official Defaults</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Register New School & Upload Logo Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-white text-sm">
                  Add School & Upload Logo
                </h4>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePreset('unilag')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#161F33] border border-[#243048] hover:border-emerald-500 text-emerald-300 transition-colors cursor-pointer"
                  title="Preset UNILAG"
                >
                  UNILAG
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('uniben')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#161F33] border border-[#243048] hover:border-purple-500 text-purple-300 transition-colors cursor-pointer"
                  title="Preset UNIBEN"
                >
                  UNIBEN
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('school1')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#161F33] border border-[#243048] hover:border-blue-500 text-blue-300 transition-colors cursor-pointer"
                  title="Preset School 1"
                >
                  SCH 1
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* School Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  School / Institution Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. University of Lagos (UNILAG)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
                />
              </div>

              {/* School Email Domain */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Email Domain <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] text-indigo-400 font-mono">e.g. @unilag.edu.ng</span>
                </label>
                <input
                  type="text"
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value.toLowerCase())}
                  placeholder="@unilag.edu.ng or @uniben.edu"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Typing any email ending in this domain triggers this logo on the student login card.
                </p>
              </div>

              {/* Acronym & Brand Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Acronym / Badge
                  </label>
                  <input
                    type="text"
                    value={acronym}
                    onChange={(e) => setAcronym(e.target.value.toUpperCase())}
                    placeholder="e.g. UNILAG"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#1E293B] bg-[#0B0F19] cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  School Motto / Tagline (Optional)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. In Deed and in Truth"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
                />
              </div>

              {/* Logo Upload Dropzone */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Upload School Logo</span>
                  <span className="text-[10px] text-indigo-400">PNG, JPG, SVG, WebP</span>
                </label>

                <div 
                  onClick={() => document.getElementById('new-school-logo-file')?.click()}
                  className="cursor-pointer border border-dashed border-[#243048] hover:border-indigo-500 bg-[#0B0F19]/60 rounded-2xl p-4 flex flex-col items-center justify-center transition-all group"
                >
                  {logoPreview ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#1E293B] flex items-center justify-center flex-shrink-0 p-1">
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-white block truncate">
                          {uploadedFileName || 'Custom Logo Attached'}
                        </span>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Ready to pop up on student login
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-[#161F33] border border-[#243048] flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors mb-2">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors text-center">
                        {isProcessingImage ? 'Optimizing image...' : 'Click to select school logo image'}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    id="new-school-logo-file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, false)}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingImage}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Save School Profile & Logo</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Registered Schools Directory with Direct Logo Upload on Every Card */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111726] p-4 rounded-2xl border border-[#1E293B]">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                Registered Schools ({schools.length})
              </h4>
              <p className="text-[11px] text-slate-400">
                Click <strong>"Change Logo"</strong> on any card to upload your logo instantly.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search UNILAG, UNIBEN, domains..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:border-indigo-500 w-full sm:w-60 outline-hidden"
              />
            </div>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredSchools.map((school) => {
              const isCustomUpload = typeof school.logo === 'string' && (
                school.logo.startsWith('data:image/png') ||
                school.logo.startsWith('data:image/jpeg') ||
                school.logo.startsWith('data:image/webp')
              );

              return (
                <div
                  key={school.id}
                  className="bg-[#111726] border border-[#1E293B] hover:border-[#2E3C56] rounded-2xl p-4 shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-2">
                      {/* School Logo Thumbnail */}
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10 shadow-md p-1 relative bg-white"
                      >
                        {school.logo ? (
                          <img 
                            src={school.logo} 
                            alt={school.name} 
                            className="w-full h-full object-contain" 
                          />
                        ) : (
                          <span className="font-bold text-slate-800 text-xs font-mono">{school.acronym || 'SCH'}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-xs font-bold text-indigo-400 truncate">
                            {school.domain}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(school)}
                              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                              title="Edit School Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {schools.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove school profile ${school.name}?`)) {
                                    deleteSchool(school.id);
                                  }
                                }}
                                className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-950/20 transition-colors cursor-pointer"
                                title="Delete School"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <h5 className="font-bold text-white text-xs sm:text-sm truncate mt-0.5">
                          {school.name}
                        </h5>

                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {school.tagline || 'Verified Academic Portal'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct "Change Logo" Action on Card */}
                  <div className="pt-2.5 mt-2 border-t border-[#1E293B] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const fileInput = document.getElementById(`card-file-input-${school.id}`);
                        if (fileInput) fileInput.click();
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161F33] hover:bg-indigo-600/30 border border-[#243048] hover:border-indigo-500/50 text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Change Logo</span>
                    </button>
                    <input
                      type="file"
                      id={`card-file-input-${school.id}`}
                      accept="image/*"
                      onChange={(e) => handleDirectCardLogoUpload(school.id, e)}
                      style={{ display: 'none' }}
                    />

                    <span className={`flex items-center gap-1 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${
                      isCustomUpload 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {isCustomUpload ? 'Custom Logo' : 'Official Preset'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* EDIT SCHOOL DETAILS MODAL */}
      {editingSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#111726] border border-[#1E293B] rounded-3xl max-w-md w-full p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-base">Edit: {editingSchool.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingSchool(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">School Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:border-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Domain</label>
                <input
                  type="text"
                  required
                  value={editDomain}
                  onChange={(e) => setEditDomain(e.target.value.toLowerCase())}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:border-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Acronym</label>
                  <input
                    type="text"
                    value={editAcronym}
                    onChange={(e) => setEditAcronym(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:border-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-[#1E293B] bg-[#0B0F19] cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs font-mono rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white uppercase"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Motto / Tagline</label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:border-indigo-500 outline-hidden"
                />
              </div>

              {/* Edit Logo Upload */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">School Logo</label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#243048] flex items-center justify-center flex-shrink-0 p-1">
                    {editLogoPreview ? (
                      <img src={editLogoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-800">{editAcronym || 'SCH'}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById('edit-modal-logo-file')?.click()}
                    className="px-3 py-2 rounded-xl bg-[#161F33] hover:bg-[#1E293B] border border-[#243048] text-xs font-medium text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Upload New Image</span>
                  </button>
                  <input
                    type="file"
                    id="edit-modal-logo-file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, true)}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSchool(null)}
                  className="px-4 py-2 rounded-xl bg-[#161F33] hover:bg-[#1E293B] text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
