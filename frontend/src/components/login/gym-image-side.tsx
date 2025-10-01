import styles from "./gym-image-side.module.css"

export default function GymImageSide() {
  return (
    <div className={styles.container}>
      <img src="/src/assets/gym-moderno.jpg" alt="Gimnasio moderno" className={styles.image} />
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>Golden Spartan Gym</h1>
          <p className={styles.subtitle}>Sistema de gestión para tu gimnasio</p>
        </div>
      </div>
    </div>
  )
}
