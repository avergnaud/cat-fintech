import React from "react"
import Container from "../components/container/container"
import styles from "./contact.module.scss"

export default function Contact() {
  return (
    <Container>
      <section className={styles.firstSection}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>Contact</h1>
                <form
                  name="contact"
                  method="POST"
                  netlify-honeypot="bot-field"
                  data-netlify="true"
                >
                  <input type="hidden" name="bot-field" />
                  <input type="hidden" name="form-name" value="contact" />
                  <div className="form-group">
                    <label for="email">Votre adresse mail</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      aria-describedby="emailHelp" 
                      placeholder="Saisissez votre email">
                    </input>
                  </div>
                  <div className="form-group">
                    <label for="message">Votre message</label>
                    <textarea class="form-control" id="message" rows="5"></textarea>
                  </div>
                  
                    <button type="submit" className="btn btn-primary">Envoyer</button>
                </form>

            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}
