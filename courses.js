// Course Class
class Course {
    constructor(title, description, subjectArea, credits ){
        this.title = title;
        this.description = description;
        this.subjectArea = subjectArea;
        this.credits = credits;
    }

    register() {
        console.log("This is " + this.title + " class.")
    }
}

// Added Courses
let english = new Course("English", "Freshmen English composition course.", "General Studies", "3");
let finiteMath = new Course("Finite Math", "A standard finite mathmatics course.", "Mathematics", "3");
let comm = new Course("Communications", "Fundemental skills of public speaking.", "General Studies", "3");

// List of courses
const courses = [english, finiteMath, comm]
for (const obj of courses){
    let courseList = document.getElementById("list");
    var row = courseList.insertRow(courses.indexOf(obj))
    var titleCell = row.insertCell(0)
    var descriptionCell = row.insertCell(1)
    var subCell = row.insertCell(2)
    var creditCell = row.insertCell(3)
    titleCell.innerHTML = obj.title
    descriptionCell.innerHTML = obj.description
    subCell.innerHTML = obj.subjectArea
    creditCell.innerHTML = obj.credits   
};

