import RegisterForm from "../../components/RegisterForm/RegisterForm";
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {
  return (
    <section className={styles.pageContainer}>
      <RegisterForm />
    </section>
  );
};

export default RegisterPage;
