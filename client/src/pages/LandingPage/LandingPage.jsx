import styles from "./LandingPage.module.css";
import myIcon from "../../assets/Meditation.svg";
const LandingPage = () => {
  return (
    <section className={styles.section}>
      <div className={styles.center}>
        <div className={styles.container}>
          <h1>Better Mind</h1>
          <p>
            Welcome to Better Mind, your trusted platform for convenient
            and confidential virtual consultations. Whether you're seeking
            therapy, counseling, or mental health support, our network of
            licensed professionals is here to help you navigate life's
            challenges. Connect with experienced therapists from the comfort and
            privacy of your own home. Your well-being is our priority
          </p>
          <button><a href="/register">Get Started</a></button>
        </div>
        <img src={myIcon} alt="My Icon" />
      </div>
    </section>
  );
};

export default LandingPage;
