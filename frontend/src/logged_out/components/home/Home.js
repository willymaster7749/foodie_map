import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import HeadSection from "./HeadSection";
import FeatureSection from "./FeatureSection";
import PricingSection from "./PricingSection";

// this file is responsible for the frame of main page

function Home(props) {
    const { selectHome } = props;
    useEffect(() => {
        selectHome();
    }, [selectHome]);
    return (
        <Fragment>
            <HeadSection />
        </Fragment>
    );
}

Home.propTypes = {
    selectHome: PropTypes.func.isRequired,
};

export default Home;
