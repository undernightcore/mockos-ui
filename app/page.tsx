import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <span className={styles.eyebrow}>Next.js </span>
        <h1 className={styles.title}>Mockos</h1>
      </section>
    </main>
  );
}
