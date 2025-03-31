
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import LocationPage from "./calculator/LocationPage";

const Index = () => {
  useEffect(() => {
    // Track page view for analytics
    console.log('Home page viewed');
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Home Page - Location Step',
        page_path: '/'
      });
    }
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Garage Floor Coating Calculator | American Concrete Coatings</title>
        <link rel="canonical" href="https://quote.garagefloorcoatingsdfw.com/" />
        <meta name="description" content="Calculate the cost of garage floor coatings in minutes! Use American Concrete Coatings estimator to get pricing on epoxy, polyurea, and polyaspartic coatings." />
      </Helmet>
      <LocationPage />
    </>
  );
};

export default Index;
