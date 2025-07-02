import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContect";
import HeaderAffiliate from "./HeaderAffiliate";

const AffiliateProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/auth/${user.id}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchProfile();
  }, [user]);

  if (loading) return <div className="text-center mt-32">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed w-full z-50">
              <HeaderAffiliate />
            </div>
            <div className="pt-20">
               <div className=" max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Affiliate Profile</h2>
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Role:</strong> {profile?.role}</p>
      </div>
            </div>
      
    </div>
  );
};

export default AffiliateProfile;
