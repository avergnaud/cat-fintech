import React from "react"
import Container from "../components/container/container"
import styles from "./about.module.scss"

export default function About() {
  return (
    <Container>
      <section className={styles.firstSection}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>&Agrave; propos</h1>
              <p>
                Ce site est un&nbsp;
                <a target="_blank" href="https://fr.wikipedia.org/wiki/Preuve_de_concept">
                  Proof Of Concept
                </a> de blog technique orienté&nbsp;
                <a target="_blank" href="https://fr.wikipedia.org/wiki/Technologie_financi%C3%A8re">
                  Fintech
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}