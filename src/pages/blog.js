import React from "react"
import Link from "gatsby-link"
import Container from "../components/container/container"
import { graphql } from "gatsby";
import styles from "./blog.module.scss";

const BlogPost = ({node}) => {
  return (
    <li>
      <Link to={`/${node.slug}`}>{node.title}</Link>
    </li>
  );
}

/* (props.data) */
export default function Blog({data}) {
  return (
    <Container>
      <section className={styles.firstSection}>
        <h1>Blog posts</h1>
        <div>
          <ul>
            {data.allContentfulBlogPost.edges.map(edge => 
              <BlogPost key={edge.node.slug} node={edge.node} />
            )}
          </ul>
        </div>
      </section>
    </Container>
  )
}

export const pageQuery = graphql`
  query pageQuery {
    allContentfulBlogPost (filter: {
      node_locale: {eq: "en-US"}
    }) {
      edges {
        node {
          title
          slug
        }
      }
    }
  }
`