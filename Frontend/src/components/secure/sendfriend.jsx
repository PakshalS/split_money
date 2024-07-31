// import React, { useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// const SendFriendRequest = () => {
//   const [email, setEmail] = useState("");

//   const handleSubmit = async () => {
//     const token = Cookies.get("authToken");
//     if (!token) {
//       console.error("No auth token found");
//       return;
//     }

//     try {
//       await axios.post(
//         `http://localhost:3000/friends/send`,
//         {email},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Friend request sent successfully !");
//       onClose();
//     } catch (error) {
//       console.error('Error sending request', error);
//       setError('Failed to send request.');
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-950 shadow-md rounded-md flex-col items-center justify-center">
//       <h2 className="text-lg font-semibold mb-2 text-white">Send Friend Request</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           className="w-full p-2 border bg-gray-600 border-gray-500 rounded mb-2"
//           placeholder="Recipient's Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="w-full bg-black hover:text-green-500 text-white p-2 rounded"
//         >
//           Send Request
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SendFriendRequest;
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SendFriendRequest = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/friends/send`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Friend request sent successfully!");
      setEmail(''); // Clear the input field after sending
    } catch (error) {
      console.error('Error sending request', error);
      alert('Failed to send request.');
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-950 shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Send Friend Request</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          className="w-full p-2 border bg-gray-700 border-gray-600 rounded text-white"
          placeholder="Recipient's Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-black hover:text-green-500 text-white p-2 rounded"
        >
          Send Request
        </button>
      </form>
    </div>
  );
};

export default SendFriendRequest;
