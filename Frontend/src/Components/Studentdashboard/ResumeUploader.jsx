import React, { useState } from 'react';

const ResumeUploader = ({ setProfile, setIsEditing }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setStatus('Please upload a valid PDF file.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }

    setLoading(true);
    setStatus('Parsing your resume... ⏳');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://hire-stream.onrender.com/student/parse-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log(data?.parsed);
      const info = data?.parsed;
      for (let key in info) {
        if (key != 'email') {
          setProfile((prev) => ({ ...prev, [key]: info[key] }));
        }
      }
      setIsEditing(true);

      if (res.ok && data.ok) {
        setStatus('✅ Resume parsed successfully! Details updated.');
      } else {
        setStatus('❌ Failed to parse resume. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setStatus('⚠️ Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  mx-auto bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upload the Resume we will Parse and update your information
        autometically
      </h2>
      {loading === true && (
        <div className="animate-spin absolute w-20 h-20 border-4 border-t-0  rounded-full border-blue-500"></div>
      )}

      <label
        htmlFor="resume"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition"
      >
        <p className="text-gray-500 text-sm">
          {file ? `📄 ${file.name}` : 'Click to upload PDF file'}
        </p>
        <input
          id="resume"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`mt-4 w-full py-2 rounded-lg text-white font-medium transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Uploading...' : 'Upload & Parse'}
      </button>

      {status && (
        <p
          className={`mt-3 text-sm text-center ${
            status.includes('✅')
              ? 'text-green-600'
              : status.includes('❌') || status.includes('⚠️')
              ? 'text-red-500'
              : 'text-gray-600'
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default ResumeUploader;
