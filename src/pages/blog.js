import React from "react"
import Link from "gatsby-link"
import { navigate } from "gatsby"
import Container from "../components/container/container"
import { graphql } from "gatsby"
import styles from "./blog.module.scss"

const BlogPost = ({ node }) => {
  return (
    <div className={styles.postWrapper}>
      <div className="media position-relative">
        <img 
          src={node.previewImage.file.url} 
          className={`mr-3 ${styles.previewImg}`}
          alt={node.previewImage.title} 
        />
        <div className="media-body">
          <h5 className="mt-0">{node.title}</h5>
          <p>{node.previewIntro}</p>
          <a 
            href="#" 
            className={`stretched-link ${styles.lireLink}`}
            onClick={event => {
              event.preventDefault()
              navigate(`/${node.slug}`)
            }}  
          >Lire l'article</a>
        </div>
      </div>
    </div>
  )
}

/* (props.data) */
export default function Blog({ data }) {
  return (
    <Container>
      <section className={styles.firstSection}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>Blog posts</h1>
              
                {data.allContentfulBlogPost.edges.map(edge => (
                  <BlogPost key={edge.node.slug} node={edge.node} />
                ))}
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}

export const pageQuery = graphql`
  query pageQuery {
    allContentfulBlogPost(filter: {node_locale: {eq: "en-US"}}, sort: {fields: publishDate}) {
      edges {
        node {
          title
          publishDate
          previewImage {
            file {
              url
            }
            title
          }
          previewIntro
          slug
        }
      }
    }
  }
`
