import React from 'react'
import CONTACT from '../json/about.json'

const About = () => {
  return (
    <>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-lg">We are a team of passionate developers.</p>
            <p className="text-lg">Our mission is to create amazing web applications.</p>
            <p className="text-lg">Contact us at: {CONTACT.contact}</p>
        </div>
    </>
  )
}

export default About