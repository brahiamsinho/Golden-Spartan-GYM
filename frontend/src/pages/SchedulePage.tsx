import { Calendar, Clock, Users, Plus } from "lucide-react"
import styles from "./SchedulePage.module.css"

interface ClassSchedule {
  id: number
  name: string
  instructor: string
  time: string
  duration: number
  capacity: number
  enrolled: number
  day: string
}

export default function SchedulePage() {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  
  const classes: ClassSchedule[] = [
    { id: 1, name: "Yoga Matutino", instructor: "Ana García", time: "07:00", duration: 60, capacity: 15, enrolled: 12, day: "Lunes" },
    { id: 2, name: "CrossFit", instructor: "Carlos López", time: "08:30", duration: 45, capacity: 10, enrolled: 8, day: "Lunes" },
    { id: 3, name: "Pilates", instructor: "María Rodríguez", time: "10:00", duration: 50, capacity: 12, enrolled: 9, day: "Lunes" },
    { id: 4, name: "Spinning", instructor: "Pedro Martín", time: "18:00", duration: 45, capacity: 20, enrolled: 18, day: "Lunes" },
    { id: 5, name: "Zumba", instructor: "Laura Sánchez", time: "19:30", duration: 60, capacity: 25, enrolled: 22, day: "Lunes" },
    
    { id: 6, name: "Aqua Aeróbicos", instructor: "Ana García", time: "09:00", duration: 45, capacity: 8, enrolled: 6, day: "Martes" },
    { id: 7, name: "Boxeo", instructor: "Roberto Silva", time: "17:00", duration: 60, capacity: 12, enrolled: 10, day: "Martes" },
    { id: 8, name: "Yoga Avanzado", instructor: "Ana García", time: "20:00", duration: 75, capacity: 10, enrolled: 8, day: "Martes" },
    
    { id: 9, name: "CrossFit", instructor: "Carlos López", time: "06:30", duration: 45, capacity: 10, enrolled: 9, day: "Miércoles" },
    { id: 10, name: "TRX", instructor: "María Rodríguez", time: "12:00", duration: 45, capacity: 8, enrolled: 6, day: "Miércoles" },
    { id: 11, name: "Spinning", instructor: "Pedro Martín", time: "18:00", duration: 45, capacity: 20, enrolled: 20, day: "Miércoles" },
  ]

  const getClassesByDay = (day: string) => {
    return classes.filter(cls => cls.day === day).sort((a, b) => a.time.localeCompare(b.time))
  }

  const getOccupancyColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100
    if (percentage >= 90) return "#ef4444"
    if (percentage >= 70) return "#f59e0b"
    return "#10b981"
  }

  return (
    <div className={styles.schedule}>
      <div className={styles.header}>
        <div>
          <h1>Horarios de Clases</h1>
          <p>Gestiona el calendario de clases del gimnasio</p>
        </div>
        <button className={styles.addButton}>
          <Plus size={20} />
          Nueva Clase
        </button>
      </div>

      <div className={styles.calendar}>
        {days.map((day) => (
          <div key={day} className={styles.dayColumn}>
            <div className={styles.dayHeader}>
              <h3>{day}</h3>
              <Calendar size={18} />
            </div>
            
            <div className={styles.classesContainer}>
              {getClassesByDay(day).map((classItem) => (
                <div key={classItem.id} className={styles.classCard}>
                  <div className={styles.classTime}>
                    <Clock size={16} />
                    {classItem.time}
                  </div>
                  
                  <div className={styles.classInfo}>
                    <h4>{classItem.name}</h4>
                    <p>Instructor: {classItem.instructor}</p>
                    <div className={styles.classMeta}>
                      <span>{classItem.duration} min</span>
                      <div className={styles.capacity}>
                        <Users size={14} />
                        <span 
                          style={{ color: getOccupancyColor(classItem.enrolled, classItem.capacity) }}
                        >
                          {classItem.enrolled}/{classItem.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.classActions}>
                    <button className={styles.editButton}>Editar</button>
                    <button className={styles.viewButton}>Ver</button>
                  </div>
                </div>
              ))}
              
              {getClassesByDay(day).length === 0 && (
                <div className={styles.emptyDay}>
                  <p>No hay clases programadas</p>
                  <button className={styles.addClassButton}>
                    <Plus size={16} />
                    Agregar clase
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <h3>Leyenda de Ocupación</h3>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: "#10b981" }}></div>
            <span>Disponible (&lt;70%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: "#f59e0b" }}></div>
            <span>Casi lleno (70-89%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: "#ef4444" }}></div>
            <span>Completo (≥90%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}