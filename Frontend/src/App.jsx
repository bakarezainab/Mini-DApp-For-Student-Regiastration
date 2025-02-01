"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "./abi.json"

const contractAddress = "0xB9C9c2A584715E522F60eBaEf49C34c9528D3723";;


export default function ClassRegistrationApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    const web3Signer = provider.getSigner();
    setSigner(web3Signer);
    setContract(new ethers.Contract(contractAddress, contractABI, web3Signer));
  };

  const registerStudent = async () => {
    if (contract) {
      try {
        const tx = await contract.registerStudent(parseInt(studentId), name);
        await tx.wait();
        alert("Student Registered!");
        fetchStudents();
      } catch (error) {
        console.error("Error registering student:", error);
      }
    }
  };

  const removeStudent = async (id) => {
    if (contract) {
      try {
        const tx = await contract.removeStudent(id);
        await tx.wait();
        alert("Student Removed!");
        fetchStudents();
      } catch (error) {
        console.error("Error removing student:", error);
      }
    }
  };

  const fetchStudents = async () => {
    if (contract) {
      try {
        const [ids, names] = await contract.getAllStudents();
        const studentsList = ids.map((id, index) => ({ id: id.toString(), name: names[index] }));
        setStudents(studentsList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-lg mx-auto space-y-4 bg-gray-100 rounded-lg shadow-md">
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Class Registration</h2>
        <button onClick={connectWallet} className="w-full bg-blue-500 text-white py-2 rounded">Connect Wallet</button>
        {account && <p className="mt-2 text-sm text-gray-600">Connected: {account}</p>}
        <input type="number" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full mt-2 p-2 border rounded" />
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 p-2 border rounded" />
        <button onClick={registerStudent} className="w-full bg-green-500 text-white py-2 rounded mt-2">Register Student</button>
        <button onClick={fetchStudents} className="w-full bg-yellow-500 text-white py-2 rounded mt-2">Get All Students</button>
      </div>
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Registered Students</h3>
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student.id} className="flex justify-between items-center bg-gray-200 p-2 rounded-lg mb-2">
              <span>{student.name} (ID: {student.id})</span>
              <button onClick={() => removeStudent(student.id)} className="bg-red-500 text-white py-1 px-2 rounded">Remove</button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No students registered</p>
        )}
      </div>
    </div>
  );
}

