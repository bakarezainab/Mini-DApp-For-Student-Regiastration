// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ClassReg{
    address public admin;

    constructor() {
        admin = msg.sender; //this ensures that only the admin can perform administrative role
    }

    struct Student {
        uint256 id;
        string name;
        bool isRegistered;
    } // this is the information of the student including the student id and name

    mapping(uint256 => Student) private students; // this ensures that we can get the student information by their id
    uint256[] private studentIds; 

    event StudentRegistered(uint256 studentId, string name);
    event StudentRemoved(uint256 studentId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier studentExists(uint256 studentId) {
        require(students[studentId].isRegistered, "Student not registered");
        _;
    }
    
    function registerStudent(uint256 studentId, string memory name) public onlyAdmin {
        require(!students[studentId].isRegistered, "Student already registered");

        students[studentId] = Student(studentId, name, true);
        studentIds.push(studentId);

        emit StudentRegistered(studentId, name);
    }

    function removeStudent(uint256 studentId) public onlyAdmin studentExists(studentId) {
        delete students[studentId];

        // Remove the studentId from the array
        for (uint256 i = 0; i < studentIds.length; i++) {
            if (studentIds[i] == studentId) {
                studentIds[i] = studentIds[studentIds.length - 1];
                studentIds.pop();
                break;
            }
        }

        emit StudentRemoved(studentId);
    }

    function getStudentById(uint256 studentId) public view studentExists(studentId) returns (string memory) {
        return students[studentId].name;
    }

    function getAllStudents() public view returns (uint256[] memory, string[] memory) {
        string[] memory names = new string[](studentIds.length);

        for (uint256 i = 0; i < studentIds.length; i++) {
            names[i] = students[studentIds[i]].name;
        }

        return (studentIds, names);
    }
}
