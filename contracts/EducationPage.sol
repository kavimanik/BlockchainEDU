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

  event AssignmentCompleted(
    uint id,
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

  function toggleCompleted(uint _id) public {
    Assignment memory _assignment = assignments[_id];
    _assignment.completed = !_assignment.completed;
    assignments[_id] = _assignment;
    emit AssignmentCompleted(_id, _assignment.completed);
  }

}