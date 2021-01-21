import React, { useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Grid, Box, isWidthUp, withWidth, withStyles } from "@material-ui/core";
import BlogCard from "./BlogCard";
import nightMarket from "../../../assets/nightMarket.jpeg";
import lemon from "../../../assets/lemon.jpg";
import "../../../blog.css";

// this file is responsible for the main arrangement of blog posts in the "BLOG" page

const styles = (theme) => ({
    blogContentWrapper: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(4),
            marginRight: theme.spacing(4),
        },
        maxWidth: 1280,
        width: "100%",
    },
    wrapper: {
        minHeight: "60vh",
    },
    noDecoration: {
        textDecoration: "none !important",
    },
});

function getVerticalBlogPosts(width, blogPosts) {
    const gridRows = [[], [], []];
    let rows;
    let xs;
    if (isWidthUp("md", width)) {
        rows = 3;
        xs = 4;
    } else if (isWidthUp("sm", width)) {
        rows = 2;
        xs = 6;
    } else {
        rows = 1;
        xs = 12;
    }
    blogPosts.forEach((blogPost, index) => {
        gridRows[index % rows].push(
            <Grid key={blogPost.id} item xs={12}>
                <Box mb={3}>
                    <BlogCard
                        src={blogPost.src}
                        title={blogPost.title}
                        snippet={blogPost.snippet}
                        date={blogPost.date}
                        url={blogPost.url}
                    />
                </Box>
            </Grid>
        );
    });
    return gridRows.map((element, index) => (
        <Grid key={index} item xs={xs}>
            {element}
        </Grid>
    ));
}

function Blog(props) {
    const { classes, width, blogPosts, selectBlog } = props;
    var wave = document.getElementById("waving");

    useEffect(() => {
        selectBlog();
    }, [selectBlog]);

    // display the posts
    return (
        <div style={{ height: "180vh" }}>
            <div
                class="lemon"
                style={{
                    height: "90vh",
                    backgroundImage: `url(${lemon})`,
                    backgroundSize: "cover",
                    backgroundPosition: "right 0px bottom 700px",
                }}
            >
                <h1 class="motto">
                    "Foodiez is not a website. It's a spirit. It's an attitude.
                    "
                </h1>
                <p class="quote"> - Albert Lin, legendary foodie</p>
            </div>
            <div class="content">
                <h1>
                    "The origin of Foodiez is a pure passion for great food.
                    Foodiez was established in 2013 with three sophomore
                    co-founders: Terrance Chen, Albert Lin and Willy Huang.
                    Because of the love for food. they're dedicated to find
                    perfect restaurants for all the NTU students. With Foodiez,
                    you can explore the amazing world of food around NTU."
                </h1>
            </div>
        </div>
    );
}

Blog.propTypes = {
    selectBlog: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
    blogPosts: PropTypes.arrayOf(PropTypes.object),
};

export default withWidth()(withStyles(styles, { withTheme: true })(Blog));
