import { Dumbbell } from "lucide-react"
import styles from "./login-header.module.css"

export default function LoginHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Dumbbell className={styles.logoIcon} />
          <span className={styles.logoText}>Golden Spartan</span>
        </div>
        <div className={styles.screenCode}>Login</div>
      </div>
    </header>
  )
}
