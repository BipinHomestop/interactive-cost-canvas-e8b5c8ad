
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Index = () => {
  useEffect(() => {
    // Track page view for analytics
    console.log('Home page viewed');
  }, []);
  
  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://quote.garagefloorcoatingsdfw.com/" />
        <meta name="description" content="Calculate the cost of garage floor coatings in minutes! Use American Concrete Coatings estimator to get pricing on epoxy, polyurea, and polyaspartic coatings." />
      </Helmet>
      <Navigate to="/calculator/location" replace />
    </>
  );
};

export default Index;
