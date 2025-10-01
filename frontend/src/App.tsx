import LoginHeader from "./components/login/login-header"
import GymImageSide from "./components/login/gym-image-side"
import LoginForm from "./components/login/login-form"
import styles from "./App.module.css"
import "./App.css"

export default function App() {
  return (
    <div className={styles.container}>
      <LoginHeader />
      <div className={styles.content}>
        <GymImageSide />
        <div className={styles.formSide}>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
