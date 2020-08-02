import React from "react"
import { Link } from "gatsby"
import Container from "../components/container/container"
import styles from "./terms.module.scss"

export default function About() {
  return (
    <Container>
      <section className={styles.firstSection}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>Mentions légales</h1>
              <p>
                Ce site (Cat-fintech) n’est en aucun cas un site de conseil.
                Cat-fintech fournit des informations partielles relatives aux
                marchés des crypto-monnaies. Le trading peut vous exposer à des
                risques de pertes.&nbsp;
                <a
                  target="_blank"
                  href="https://www.amf-france.org/en/node/59217"
                >
                  Les performances passées ne préjugent pas des performances
                  futures
                </a>
                . Ce site n'est en aucun cas une offre de conseil en
                investissement ni une incitation quelconque à acheter ou vendre
                des actifs financiers. Les informations présentées sur ce site
                ne constituent pas des conseils en investissement et ne doivent
                pas être interprétées comme telles.
              </p>
              <p>
                L'hébergeur Netlify est&nbsp;
                <a target="_blank" href="https://www.netlify.com/gdpr/">
                  conforme RGPD
                </a>
                . Cat-fintech ne collecte pas de données personnelles.
              </p>
              <p>
                En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004
                pour la confiance dans l'économie numérique, il est précisé aux
                utilisateurs du site internet https://cat-fintech.netlify.app/
                l'identité des différents intervenants dans le cadre de sa
                réalisation et de son suivi : 
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                    Propriétaire : Adrien Vergnaud - 6 chemin des Coteaux 79370 Aigondigné
                    </li>
                    <li className="list-group-item">
                        Responsable publication et Webmaster : Adrien Vergnaud – 
                        <Link 
                          to="/contact/"
                        >
                          Contact
                        </Link>    
                    </li>
                    <li className="list-group-item">Hébergeur : Netlify – Dogpatch 94107 San Francisco, CA, USA</li>
                    <li className="list-group-item">Délégué à la protection des données : Netlify DPO privacy@netlify.com</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}
