/*import React from "react";
//import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const updatedDate = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleFacebook = () => {
    window.open("https://www.facebook.com/maloloyon.ejemar", "_blank")
  }
  const handleTwitter = () => {
    window.open("https://www.Twitter.com", "_blank")
  }
  const handleInstagram = () => {
    window.open("https://www.Instagram.com", "_blank")
  }
  const handleGithub = () => {
    window.open("https://github.com/Devwezardtech", "_blank")
  }
  const handleLinkIn = () => {
    window.open("https://www.Linkin.com", "_blank")
  }


  return (
    <footer className="bg-gray-100 text-black w-full">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">MyStore</h1>
            <p className="text-sm text-gray-800">{updatedDate}</p>
          </div>

          <div className="flex gap-4 text-xl">
           <button className="hover:text-blue-500" onClick={handleFacebook}> facebook</button>
           <button className="hover:text-blue-500" onClick={handleTwitter}> Twitter</button>
           <button className="hover:text-blue-500" onClick={handleInstagram}> Instagram</button>
           <button className="hover:text-blue-500" onClick={handleGithub}> Github</button>
           <button className="hover:text-blue-500" onClick={handleLinkIn}> LinkIn</button>
            
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 border-t border-gray-700 pt-6">
          <div className="text-center text-green-900 md:text-right">
            &copy; {currentYear} MyStore. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
*/
