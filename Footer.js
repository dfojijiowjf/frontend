import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa';

function Footer() {

    const handleInsta = (e) => {
        e.preventDefault()
        window.location.replace('https://instagram.com/utsengage')
    }

  return (
    <div className='footer-container'>
        <div className='footer-container-inner'>
            <div className="footer-col">
                <h3 className='footer-header'>QUICK LINKS</h3>
                <Link to='/' className='footer-link'>
                    Home
                </Link>
                <Link to='/' className='footer-link'>
                    T&C's
                </Link>
            </div>

            <div className="footer-col">
                <h3 className='footer-header'>FOLLOW US</h3>
                <div className="social-icons" onClick={handleInsta}>
                    <FaInstagram className="social-logo"/>
                </div>
                <p className='tradmark'>2022 &copy; UTS</p>
            </div>
        </div>
    </div>
  );
}

export default Footer;
