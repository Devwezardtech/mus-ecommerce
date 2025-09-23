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
        const res = await api.get(`/api/auth/user/${user.id}`);
        setProfile(res.data);
        console.log("data of profile", profile);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchProfile();
  }, [user, profile]);

  if (loading) return <div >
    <div className="fixed w-full z-50">
              <HeaderAffiliate />
            </div>

           <div>
             <div className="text-center pt-20 ">Loading profile...</div>
            </div>
    
    </div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed w-full z-50">
              <HeaderAffiliate />
            </div>
            <div>
               <div className=" max-w-xl mx-auto bg-white p-6 pt-20 rounded">
       
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Role:</strong> {profile?.role}</p>
      </div>
            </div>
      
    </div>
  );
};

export default AffiliateProfile;
