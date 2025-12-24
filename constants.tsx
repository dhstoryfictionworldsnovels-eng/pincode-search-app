
import React from 'react';

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

// Mapping of major districts for directory browsing
export const STATE_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Dharwad", "Gulbarga", "Shimoga"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Bareilly", "Aligarh"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Asansol", "Siliguri", "Durgapur", "Bardhaman"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "South Delhi", "West Delhi"]
};

export const SAMPLE_DATA = [
  { pincode: "110001", officeName: "Connaught Place", officeType: "H.O", deliveryStatus: "Delivery", district: "Central Delhi", state: "Delhi", divisionName: "Delhi Central", regionName: "Delhi", circleName: "Delhi", block: "New Delhi" },
  { pincode: "400001", officeName: "Mumbai G.P.O.", officeType: "G.P.O", deliveryStatus: "Delivery", district: "Mumbai", state: "Maharashtra", divisionName: "Mumbai City", regionName: "Mumbai", circleName: "Maharashtra", block: "Mumbai" },
  { pincode: "560001", officeName: "Bangalore G.P.O.", officeType: "G.P.O", deliveryStatus: "Delivery", district: "Bangalore", state: "Karnataka", divisionName: "Bangalore East", regionName: "Bangalore HQ", circleName: "Karnataka", block: "Bangalore North" },
  { pincode: "600001", officeName: "Chennai G.P.O.", officeType: "G.P.O", deliveryStatus: "Delivery", district: "Chennai", state: "Tamil Nadu", divisionName: "Chennai City Central", regionName: "Chennai Region", circleName: "Tamil Nadu", block: "Chennai" },
  { pincode: "700001", officeName: "Kolkata G.P.O.", officeType: "G.P.O", deliveryStatus: "Delivery", district: "Kolkata", state: "West Bengal", divisionName: "Kolkata Central", regionName: "Kolkata", circleName: "West Bengal", block: "Kolkata" },
  { pincode: "500001", officeName: "Hyderabad G.P.O.", officeType: "G.P.O", deliveryStatus: "Delivery", district: "Hyderabad", state: "Telangana", divisionName: "Hyderabad City", regionName: "Hyderabad", circleName: "Andhra Pradesh", block: "Hyderabad" },
];
