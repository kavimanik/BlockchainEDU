pragma solidity 0.5.16;

contract EducationPage{
    uint public assignmentCount = 0;

  struct Assignment {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Assignment) public assignments;

  event AssignmentCreated(
    uint id,
    string content,
    bool completed
  );

  constructor() public {
    createAssignment("New Assignment Created");
  }

  function createAssignment(string memory _content) public {
    assignmentCount++;
    assignments[assignmentCount] = Assignment(assignmentCount, _content, false);
    emit AssignmentCreated(assignmentCount, _content, false);
  }



}