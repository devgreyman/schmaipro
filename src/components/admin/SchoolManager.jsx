import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Building2, 
  Upload, 
  Plus, 
  Trash2, 
  Search, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Globe
} from 'lucide-react';

export default function SchoolManager() {
  const { schools, addSchool, deleteSchool, updateSchool, showToast } = usePortal();

  // Form State
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [acronym, setAcronym] = useState('');
  const [tagline, setTagline] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [logoPreview, setLogoPreview] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEditingSchool, setActiveEditingSchool] = useState(null);

  // File upload reader -> converts to Base64 Data URL for persistent storage
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file (PNG, JPG, or SVG).', 'error');
        return;
      }

      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
      acronym: acronym || name.slice(0, 4).toUpperCase(),
      color,
      logo: logoPreview,
      tagline,
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

  // Quick Preset Templates to test
  const handlePreset = (type) => {
    if (type === 'school6') {
      setName('School 6 Advanced Academy');
      setDomain('@school6.edu');
      setAcronym('SCH6');
      setColor('#0284C7');
      setTagline('Innovation and Leadership in Learning');
    } else if (type === 'school7') {
      setName('School 7 Science & Tech');
      setDomain('@school7.edu');
      setAcronym('SCH7');
      setColor('#0D9488');
      setTagline('Tomorrow Scientists Today');
    } else if (type === 'ivy') {
      setName('Princeton Collegiate Institute');
      setDomain('@princeton.edu');
      setAcronym('PRIN');
      setColor('#FF6000');
      setTagline('Dei Sub Numine Viget');
    }
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.acronym.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-slate-200">
      
      {/* Intro Header */}
      <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">School Profiles & Logo Management</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload custom school logos and register email domains. When students enter their school email, the matching school logo instantly pops up on the login card.
            </p>
          </div>
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

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePreset('school6')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#161F33] border border-[#243048] hover:border-indigo-500 text-slate-300 transition-colors"
                >
                  + School 6
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('ivy')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#161F33] border border-[#243048] hover:border-indigo-500 text-slate-300 transition-colors"
                >
                  + Princeton
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* School Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  School / University Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. School 1 International Academy"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
                />
              </div>

              {/* School Email Domain */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Email Domain <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] text-indigo-400 font-mono">e.g. @school1.edu</span>
                </label>
                <input
                  type="text"
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value.toLowerCase())}
                  placeholder="@school1.edu or @stanford.edu"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Typing any email with this domain triggers this school's logo on the login page.
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
                    placeholder="e.g. SCH1"
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
                  placeholder="e.g. Excellence in Academic Leadership"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
                />
              </div>

              {/* Logo Upload Dropzone (User Requirement) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Upload School Logo</span>
                  <span className="text-[10px] text-indigo-400">PNG, JPG, or SVG</span>
                </label>

                <label className="cursor-pointer border border-dashed border-[#243048] hover:border-indigo-500 bg-[#0B0F19]/60 rounded-2xl p-4 flex flex-col items-center justify-center transition-all group">
                  {logoPreview ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-[#1E293B] flex items-center justify-center flex-shrink-0 p-1">
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-white block truncate">
                          {uploadedFileName || 'Custom Logo Attached'}
                        </span>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Ready to pop up on login
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-[#161F33] border border-[#243048] flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors mb-2">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors text-center">
                        Click or drag to upload school logo file
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save School Profile & Logo</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Registered Schools Directory */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111726] p-4 rounded-2xl border border-[#1E293B]">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                Configured School Domains ({schools.length})
              </h4>
              <p className="text-[11px] text-slate-400">
                Logos will automatically pop up when students enter matching emails.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schools or domains..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:border-indigo-500 w-full sm:w-56 outline-hidden"
              />
            </div>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-[#111726] border border-[#1E293B] hover:border-[#2E3C56] rounded-2xl p-4 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    {/* School Logo Avatar */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10 shadow-md p-1"
                      style={{ backgroundColor: school.color || '#2563EB' }}
                    >
                      {school.logo ? (
                        <img src={school.logo} alt={school.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-bold text-white text-xs font-mono">{school.acronym || 'SCH'}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-xs font-bold text-indigo-400 truncate">
                          {school.domain}
                        </span>
                        {schools.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove school profile ${school.name}?`)) {
                                deleteSchool(school.id);
                              }
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                            title="Delete School"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <h5 className="font-bold text-white text-xs sm:text-sm truncate mt-0.5">
                        {school.name}
                      </h5>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                    {school.tagline || 'Verified Academic Portal'}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Badge: <strong className="text-slate-300">{school.acronym}</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3 h-3" /> Pop-up Active
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

