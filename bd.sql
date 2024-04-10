CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL
);

-- Создание таблицы курсов
CREATE TABLE Courses (
    CourseID SERIAL PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    Description TEXT
);

-- Создание таблицы для связи пользователей с курсами, которые они проходят
CREATE TABLE UserCourses (
    UserCourseID SERIAL PRIMARY KEY,
    UserID INT REFERENCES Users(UserID),
    CourseID INT REFERENCES Courses(CourseID),
    CompletedSteps INT DEFAULT 0,
    LastCompletedStep INT DEFAULT 0,
    CONSTRAINT UniqueUserCourse UNIQUE(UserID, CourseID)
);