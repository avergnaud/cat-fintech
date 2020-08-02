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
                <a
                  target="_blank"
                  href="https://fr.wikipedia.org/wiki/Preuve_de_concept"
                >
                  Proof Of Concept
                </a>{" "}
                de blog technique orienté&nbsp;
                <a
                  target="_blank"
                  href="https://fr.wikipedia.org/wiki/Technologie_financi%C3%A8re"
                >
                  Fintech
                </a>
                .
              </p>
            </div>
            <div className="col-12">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Sources </b>&nbsp;
                <a
                  target="_blank"
                  href="https://github.com/avergnaud/cat-fintech"
                >
                  https://github.com/avergnaud/cat-fintech
                </a>
                </li>
                <li className="list-group-item">
                  <b>Contribution CMS </b>&nbsp;
                <a
                  target="_blank"
                  href="https://app.contentful.com/spaces/zpudkf7vj036"
                >
                  https://app.contentful.com/spaces/zpudkf7vj036
                </a>
                </li>
                <li className="list-group-item">
                  <b>Hébergement et déploiement continu </b>&nbsp;
                <a
                  target="_blank"
                  href="https://app.netlify.com/sites/cat-fintech"
                >
                  https://app.netlify.com/sites/cat-fintech
                </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}
