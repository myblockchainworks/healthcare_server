pragma solidity ^0.4.11;

contract HealthcareTemplateContract {

    // Owner of this contract
    address public owner;
    string public version = '0.1';

    // Project Object
    struct Project {
        uint index;
        string location;
        address coordinator;
        string projectDetailHash;
        string projectImageHash;
    }

    // Project Question Object
    struct ProjectQuestion {
        bool question1;
        bool question2;
        bool question3;
        bool question4;
        bool question5;
        bool question6;
        uint index;
    }

    Project[] public projects; // List of all projects

    ProjectQuestion[] public questions; // List of all questions for a project

    // Triggered when new project is created.
    event ProjectCreated(uint index, string location);

    // Triggered when coordinator is assgined to a project
    event CoordinatorAssigned(uint index, address coordinator);

    // Functions with this modifier can only be executed by the owner
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // Delete / kill the contract... only the owner has rights to do this
    function kill() onlyOwner {
        suicide(owner);
    }

    // Constructor
    // @notice Create HealthcareTemplateContract
    function HealthcareTemplateContract() {
        owner = msg.sender;
    }

    // @notice Create a new project with the location and project details as swarm hash
    // @param _location The location of the project
    // @param _projectDetailHash The hash string from swarm of the project details
    // @param _projectImageHash The hash string from swarm of the project image
    // @return the transaction address and send the event as ProjectCreated at Location
    function addNewProject(string _location, string _projectDetailHash, string _projectImageHash) {
        uint currentIndex = projects.length;
        address empty = 0x000;
        projects.push(Project({
            index : currentIndex,
            location : _location,
            coordinator : empty,
            projectDetailHash : _projectDetailHash,
            projectImageHash : _projectImageHash
        }));

        ProjectCreated(currentIndex, _location);
    }

    // @notice Add questions for the new project
    // @param quest1 to quest6 The boolean value of true or false for the selected question
    // @return the transaction address
    function addQuestion(bool quest1, bool quest2, bool quest3, bool quest4, bool quest5, bool quest6)  {
        uint currentIndex = questions.length;
        questions.push(ProjectQuestion({
            question1 : quest1,
            question2 : quest2,
            question3 : quest3,
            question4 : quest4,
            question5 : quest5,
            question6 : quest6,
            index : currentIndex
        }));
    }

    // @notice Assign a coordinator to the project
    // @param _index The index position of the project
    // @param _coordinator The coordinator of the project
    // retrun the transaction address and send the event as CoordinatorAssigned with coordinator address
    function assignCoordinator(uint _index, address _coordinator) {
        projects[_index].coordinator = _coordinator;
        CoordinatorAssigned(_index, _coordinator);
    }

    // Get the total count of the projects
    // @return total projects
    function getProjectCount() constant returns (uint) {
        return projects.length;
    }

    // Get the project detail by index
    // @param _index The index position of the project
    // @return the project location, coordinator and swarm hash
    function getProjectByIndex(uint _index) constant returns (uint, string, address, string, string) {
        return (projects[_index].index, projects[_index].location, projects[_index].coordinator, projects[_index].projectDetailHash, projects[_index].projectImageHash);
    }

    function getQuestionByIndex(uint _index) constant returns (uint, bool, bool, bool, bool, bool, bool) {
        return (questions[_index].index, questions[_index].question1, questions[_index].question2, questions[_index].question3, questions[_index].question4, questions[_index].question5, questions[_index].question6);
    }
}
