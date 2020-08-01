import React from "react"
import Container from "../components/container/container"
import styles from "./about.module.scss"

export default function About() {
  return (
    <Container>
      <section className={styles.firstSection}>
        <h1>A propos</h1>
        <p>
          En construction...
        </p>
      </section>
    </Container>
  )
}