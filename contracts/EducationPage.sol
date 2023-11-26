pragma solidity 0.5.16;

contract EducationPage{
  //keeps track of the total number of assignments
  uint public assignmentCount = 0;

  constructor() public {
    createAssignment("New Assignment Created");
  }

  //Assignment struct which holds necessary info about the assignments
  struct Assignment {
    uint id;
    string content;
    bool completed;
  }

  //maps an unsigned int to and assignment which helps keep track of the assignments
  mapping(uint => Assignment) public assignments;

  //event for when an assignment is completed
  event AssignmentCompleted(
    uint id,
    bool completed
  );

//event for when an assignment is created
  event AssignmentCreated(
    uint id,
    string content,
    bool completed
  );

//toggles when an assignment is completed which is used when check the assignments off the list
  function toggleCompleted(uint _id) public {
    Assignment memory _assignment = assignments[_id];
    _assignment.completed = !_assignment.completed;
    assignments[_id] = _assignment;
    emit AssignmentCompleted(_id, _assignment.completed);
  }

  //function to create assignment which adds assignment to mapping and increments count
  function createAssignment(string memory _content) public {
    assignmentCount++;
    assignments[assignmentCount] = Assignment(assignmentCount, _content, false);
    emit AssignmentCreated(assignmentCount, _content, false);
  }

}