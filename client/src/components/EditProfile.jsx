import React, { useContext, useRef, useState } from 'react';

import dp_image from "../assets/profile.png";

// React Icon Import Here
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { MdOutlineCameraAlt } from "react-icons/md";

import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';

import axios from 'axios';

const EditProfile = () => {
  let {serverUrl} = useContext(authDataContext);
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);

  // useState for Input filed
  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [userName, setUserName] = useState(userData.userName || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [location, setLocation] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");

  // state for skills
  let [skills, setSkills] = useState(userData.skills || []);
  let [newSkills, setNewSkills] = useState("");

  // state for education
  let [education, setEducation] = useState(userData.education || []);
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  });

  // useState for Profile and CoverImage
  let [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || dp_image);
  let [backendProfileImage, setBackendProfileImage] = useState(null);
  let [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || null);
  let [backendCoverImage, setBackendCoverImage] = useState(null);
  let [saving, setSaving] = useState(false);


  // useRef for Profile and CoverImage
  const profileImage = useRef();
  const coverImage = useRef();

  // state For Experience
  let [experience, setExperience] = useState(userData.experience || []);
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  })

  // Add Skill Functions
  function addSkill() {
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }
    setNewSkills("");
  }

  // Remove Skill Function
  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }

  // Add Education Function
  function addEducation() {
    if (newEducation.college && newEducation.degree && newEducation.fieldOfStudy) {
      setEducation([...education, newEducation]);
    }

    setNewEducation({ college: "", degree: "", fieldOfStudy: "", })
  }

  // Remove Education Function
  function removeEducation(edu) {
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu));
    }
  }

  // Add Experience Function
  function addExperience() {
        if (newExperience.title && newExperience.company && newExperience.description) {
      setExperience([...experience, newExperience]);
    }

    setNewExperience({ title: "", company: "", description: "", })
  }

  // Remove Experience Function
  function removeExperience(exp) {
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) => e !== exp));
    }
  }

  // handle profile Image
  function handleProfileImage(e) {
    let file = e.target.files[0];
    setBackendProfileImage(file);

    setFrontendProfileImage(URL.createObjectURL(file));
  }

  //Handle Cover Image
  function handleCoverImage(e) {
    let file = e.target.files[0];
    setBackendCoverImage(file);

    setFrontendCoverImage(URL.createObjectURL(file));
  }

  // handle Save Profile function
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));

      if(backendProfileImage) {
        formdata.append("profileImage", backendProfileImage);
      }

      if(backendCoverImage) {
        formdata.append("coverImage", backendCoverImage);
      }

      let result = await axios.put(serverUrl+"/api/user/updateprofile", formdata, {withCredentials: true});
      setUserData(result.data);
      setSaving(false);
      setEdit(false);

    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  }

  return (
    <div className='w-full h-[100vh] top-0 fixed z-[100] flex justify-center items-center'>

      {/* input for image */}
      <input type="file" accept='image/*' className='hidden' ref={profileImage} onChange={handleProfileImage} />
      <input type="file" accept='image/*' className='hidden' ref={coverImage} onChange={handleCoverImage} />

      <div className='w-[100%] bg-black opacity-[0.5] h-full absolute'></div>

      <div className='w-[90%] max-w-[500px] h-[600px] overflow-auto bg-white relative z-[200] shadow-lg rounded-lg p-[10px]'>
        {/* Cross icon */}
        <div className='absolute top-[20px] right-[20px]' onClick={() => setEdit(false)}>
          <RxCross2 className='w-[20px] h-[20px] text-gray-800 font-semibold cursor-pointer' />
        </div>
        {/* Profile and banner */}
        <div className='w-full h-[150px] bg-gray-300 rounded-lg mt-[40px] overflow-hidden' onClick={()=> coverImage.current.click()}>
          <img src={frontendCoverImage} alt="" className='w-full' />
          <MdOutlineCameraAlt className='absolute top-[60px] right-[20px] w-[20px] h-[20px] text-gray-800 cursor-pointer' />
        </div>

        <div className='w-[70px] h-[70px] rounded-full overflow-hidden cursor-pointer absolute top-[150px] ml-[20px] object-cover' onClick={()=> profileImage.current.click()}>
          <img src={frontendProfileImage} alt="" className='w-full h-full object-cover' />
        </div>

        <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[190px] left-[85px] rounded-full flex items-center justify-center cursor-pointer text-white'>
          <GoPlus />
        </div>

        {/* Form Field Section */}
        <div className='w-full flex flex-col items-center justify-center gap-[20px] mt-[50px] px-[20px] pb-[10px]'>
          <input type="text" placeholder='FirstName' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder='LastName' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input type="text" placeholder='UserName' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={userName} onChange={(e) => setUserName(e.target.value)} />
          <input type="text" placeholder='Headline' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={headline} onChange={(e) => setHeadline(e.target.value)} />
          <input type="text" placeholder='Location' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={location} onChange={(e) => setLocation(e.target.value)} />
          <input type="text" placeholder='Gender (male/female/other)' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={gender} onChange={(e) => setGender(e.target.value)} />

          {/* Skills */}
          <div className='w-full p-[10px] border border-[#ccc] flex flex-col gap-[10px] rounded-md'>
            <h1 className='text-[18px] font-semibold'>Skills</h1>

            <div className='flex gap-[10px]'>
              <input type="text" placeholder='Add New Skills' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={newSkills} onChange={(e) => setNewSkills(e.target.value)} />
              <button className='bg-black px-5 py-2 text-white font-semibold rounded-md' onClick={addSkill}>Add</button>
            </div>

            {skills && <div className='flex gap-2 flex-wrap'>
              {skills.map((skill, index) => (
                <div key={index} className='px-4 py-1 mt-1 border border-[#ccc] flex items-center justify-center rounded-full gap-2'><span>{skill}</span> <RxCross2 onClick={() => removeSkill(skill)} className='text-red-700 font-semibold cursor-pointer' /></div>
              ))}
            </div>}
          </div>

          {/* Education */}
          <div className='w-full p-[10px] border border-[#ccc] flex flex-col gap-[10px] rounded-md'>
            <h1 className='text-[18px] font-semibold'>Education</h1>

            <div className='flex flex-col gap-[10px]'>
              <input type="text" placeholder='College' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={newEducation.college} onChange={(e) => setNewEducation({ ...newEducation, college: e.target.value })} />
              <input type="text" placeholder='Degree' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
              <input type="text" placeholder='Field Of Study' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={newEducation.fieldOfStudy} onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })} />
              <button className='bg-black px-5 py-2 text-white font-semibold rounded-md' onClick={addEducation}>Add Education</button>
            </div>

            {education && <div className='flex gap-2 flex-wrap'>
              {education.map((edu, index) => (
                <div key={index} className='w-full px-4 py-1 mt-1 border border-[#ccc] relative rounded-md gap-2'>
                  <div className='mt-6 sm:mt-0 flex flex-col gap-2'>
                    <div><strong>College: </strong> {edu.college}</div>
                    <div><strong>Degree: </strong> {edu.degree}</div>
                    <div><strong>Field Of Study: </strong> {edu.fieldOfStudy} </div>
                  </div>
                  <RxCross2 className='text-red-700 font-semibold cursor-pointer absolute top-2 right-2' onClick={() => removeEducation(edu)} /></div>
              ))}
            </div>}
          </div>

          {/* Experience */}
          <div className='w-full p-[10px] border border-[#ccc] flex flex-col gap-[10px] rounded-md'>
            <h1 className='text-[18px] font-semibold'>Experience</h1>

            <div className='flex flex-col gap-[10px]'>
              <input type="text" placeholder='Title' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} />
              <input type="text" placeholder='Company' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} />
              <input type="text" placeholder='Description' autoComplete='off' className='w-full border outline-none border-[#ccc] rounded-md px-[10px] py-[7px] text-[16px]' value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} />
              <button className='bg-black px-5 py-2 text-white font-semibold rounded-md' onClick={addExperience}>Add Experience</button>
            </div>

            {experience && <div className='flex gap-2 flex-wrap'>
              {experience.map((exp, index) => (
                <div key={index} className='w-full px-4 py-1 mt-1 border border-[#ccc] relative rounded-md gap-2'>
                  <div className='mt-6 sm:mt-0 flex flex-col gap-2'>
                    <div><strong>Title: </strong> {exp.title}</div>
                    <div><strong>Company: </strong> {exp.company}</div>
                    <div><strong>Description: </strong> {exp.description} </div>
                  </div>
                  <RxCross2 className='text-red-700 font-semibold cursor-pointer absolute top-2 right-2' onClick={() => removeExperience(exp)} /></div>
              ))}
            </div>}
          </div>

          {/* Save Profile Button */}
           <button className='w-[100%] py-2 px-3 rounded-md bg-blue-600 mt-4 text-white font-semibold' onClick={handleSaveProfile} disable={saving}>{saving ? "saving...": "Save Profile"}</button>

        </div>
      </div>
    </div>
  )
}

export default EditProfile;
