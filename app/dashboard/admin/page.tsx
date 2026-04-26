"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"locations" | "regions">("locations");
  const [locations, setLocations] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    region: "",
    price: 0,
    image: "noname",
    rating: "4.5"
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (session && (session.user as any).status !== "admin" && (session.user as any).status !== "master") {
      router.push("/");
    }
    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [locRes, regRes] = await Promise.all([
        fetch("/api/admin/locations"),
        fetch("/api/admin/regions")
      ]);
      const locData = await locRes.json();
      const regData = await regRes.json();
      setLocations(locData.data || []);
      setRegions(regData.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalImageName = formData.image;

      // 1. Upload image if selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("image", selectedFile);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData
        });

        if (uploadRes.ok) {
          const { filename } = await uploadRes.json();
          finalImageName = filename;
        } else {
          throw new Error("Image upload failed");
        }
      }

      // 2. Add location with image name
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image: finalImageName })
      });

      if (res.ok) {
        alert("Location added!");
        setFormData({ name: "", description: "", region: "", price: 0, image: "noname", rating: "4.5" });
        setSelectedFile(null);
        fetchData();
      }
    } catch (err: any) {
      alert(err.message || "Error adding location");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-10 font-mono">LOADING_ADMIN_SYSTEM...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-mono p-4 md:p-10 border-[10px] border-black">
      <header className="flex justify-between items-center border-b-[5px] border-black pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">RUKE_ADMIN_v1.0</h1>
          <p className="text-sm bg-black text-white px-2 py-1 mt-2 inline-block">AUTHENTICATED: {session?.user?.name}</p>
        </div>
        <button onClick={() => signOut()} className="border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all font-bold uppercase">LOGOUT</button>
      </header>

      <div className="flex gap-4 mb-10">
        <button 
          onClick={() => setActiveTab("locations")}
          className={`flex-1 py-4 border-[4px] border-black text-xl font-black uppercase transition-all ${activeTab === "locations" ? "bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-x-[-4px] translate-y-[-4px]" : "hover:bg-gray-100"}`}
        >
          LOCATIONS_DB
        </button>
        <button 
          onClick={() => setActiveTab("regions")}
          className={`flex-1 py-4 border-[4px] border-black text-xl font-black uppercase transition-all ${activeTab === "regions" ? "bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-x-[-4px] translate-y-[-4px]" : "hover:bg-gray-100"}`}
        >
          REGIONS_DB
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-1 border-[4px] border-black p-6 bg-yellow-50">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-2">ADD_NEW_ENTRY</h2>
          <form onSubmit={handleAddLocation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">LOCATION_NAME</label>
              <input 
                type="text" 
                className="w-full border-2 border-black p-2 focus:bg-white bg-transparent outline-none" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">REGION_MAPPING</label>
              <select 
                className="w-full border-2 border-black p-2 focus:bg-white bg-transparent outline-none"
                value={formData.region}
                onChange={e => setFormData({...formData, region: e.target.value})}
                required
              >
                <option value="">SELECT_REGION</option>
                {regions.map(r => <option key={r._id} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">PRICE_USD</label>
              <input 
                type="number" 
                className="w-full border-2 border-black p-2 focus:bg-white bg-transparent outline-none"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">DESCRIPTION_RAW</label>
              <textarea 
                className="w-full border-2 border-black p-2 h-32 focus:bg-white bg-transparent outline-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">LOCATION_IMAGE (UPLOAD)</label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full border-2 border-black p-2 focus:bg-white bg-transparent outline-none" 
                onChange={e => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile && <p className="text-[10px] mt-1 font-bold text-blue-600 uppercase">FILE_READY: {selectedFile.name}</p>}
            </div>
            <button 
              type="submit" 
              disabled={uploading}
              className="w-full bg-black text-white py-4 font-black text-xl uppercase hover:bg-white hover:text-black border-2 border-black transition-all shadow-[6px_6px_0px_0px_rgba(150,150,150,1)] active:translate-y-1 active:shadow-none disabled:opacity-50"
            >
              {uploading ? "UPLOADING..." : "PUSH_TO_DB"}
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 border-[4px] border-black p-6">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-2">EXISTING_RECORDS</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-3 border border-black">NAME</th>
                  <th className="p-3 border border-black">REGION</th>
                  <th className="p-3 border border-black">PRICE</th>
                  <th className="p-3 border border-black">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "locations" ? (
                  locations.map(loc => (
                    <tr key={loc._id} className="hover:bg-gray-50">
                      <td className="p-3 border border-black font-bold">{loc.name}</td>
                      <td className="p-3 border border-black">{loc.region}</td>
                      <td className="p-3 border border-black">${loc.price}</td>
                      <td className="p-3 border border-black">
                        <button className="text-blue-600 font-bold hover:underline">EDIT</button>
                        <span className="mx-2">|</span>
                        <button className="text-red-600 font-bold hover:underline">DEL</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  regions.map(reg => (
                    <tr key={reg._id} className="hover:bg-gray-50">
                      <td className="p-3 border border-black font-bold">{reg.name}</td>
                      <td className="p-3 border border-black">{reg.capital}</td>
                      <td className="p-3 border border-black">-</td>
                      <td className="p-3 border border-black">
                        <button className="text-blue-600 font-bold hover:underline">EDIT</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
