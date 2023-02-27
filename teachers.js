class Teacher {
    constructor(firstName, lastName ){
        this.firstName = firstName;
        this.lastName = lastName;

    }

    register() {
        console.log(firstName + " " + lastName)
    }
}

// Added Teachers
let teacher1 = new Teacher("John", "Doe");
let teacher2 = new Teacher("Jacob", "Smith");
let teacher3 = new Teacher("Mary", "Williams");
let teacher4 = new Teacher("Jessica", "Lewis");
let teacher5 = new Teacher("Rachel", "Parker");

// List of teachers
const teachers = [teacher1, teacher2, teacher3, teacher4, teacher5]
for (const obj of teachers){
    let teacherList = document.getElementById("list");
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