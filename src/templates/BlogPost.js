import React, { Component } from "react";
import { graphql } from "gatsby"
import styles from "./BlogPost.module.scss";

class BlogPost extends Component {

    render() {
        
        const {
            title
        } = this.props.data.contentfulBlogPost;
    
        return (
            <div>
                <h1>{title}</h1>
            </div>
        );
    }
}
export default BlogPost;

export const pageQuery = graphql`
    query blogPostQuery($slug: String!) {
        contentfulBlogPost(slug: {eq: $slug}) {
            title
            slug
        }
    }
`;