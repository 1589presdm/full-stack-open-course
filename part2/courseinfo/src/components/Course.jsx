const Header = ({ course }) => <h1>{course.name}</h1>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>
    
const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part => (   
                <Part key={part.id} part={part} />
            ))}
        </div>
    )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total  parts={course.parts} />
    </div>
  )
}

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p><strong>total of {totalExercises} exercises</strong></p>
  )
  
}

export default Course
