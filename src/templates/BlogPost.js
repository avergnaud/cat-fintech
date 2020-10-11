import React, { Component } from "react"
import { graphql } from "gatsby"
import { BLOCKS } from "@contentful/rich-text-types"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import Container from "../components/container/container"
import styles from "./BlogPost.module.scss"

const richTextOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: node => {

      if(!node.data.target.fields) return <div>erreur</div>

      const { title, description, file } = node.data.target.fields
      const mimeType = file["en-US"].contentType
      const mimeGroup = mimeType.split("/")[0]

      switch (mimeGroup) {
        case "image":
          return (
            <img
              title={title ? title["en-US"] : null}
              alt={description ? description["en-US"] : null}
              src={file["en-US"].url}
            />
          )
        default:
          return (
            <span style={{ backgroundColor: "red", color: "white" }}>
              {" "}
              {mimeType} embedded asset{" "}
            </span>
          )
      }
    },
    [BLOCKS.LIST_ITEM]: (node, children) => {
      /* ? Contentful adds a p inside each li ? */
      let output = children
      if(children[0] 
        && children[0].props 
        && children[0].props.children
        && children[0].props.children[0]) {
          output = children[0].props.children[0]
      }
      return <li>{output}</li>
    },
  },
}

class BlogPost extends Component {
  render() {
    const { contentfulBlogPost } = this.props.data

    return (
      <Container>
        <section className={styles.firstSection}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1>{contentfulBlogPost.title}</h1>
                {documentToReactComponents(
                  contentfulBlogPost.content.json,
                  richTextOptions
                )}
              </div>
            </div>
          </div>
        </section>
      </Container>
    )
  }
}
export default BlogPost

export const pageQuery = graphql`
  query blogPostQuery($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      slug
      content {
        json
      }
    }
  }
`
