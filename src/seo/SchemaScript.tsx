
import React from 'react';
import { generateSchemaData } from './dynamic-schema-data';

export const SchemaScript: React.FC = () => {
  const schemaData = generateSchemaData();
  
  return (
    <>
      {/* Enhanced Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData.website)}
      </script>
      
      {/* WebPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData.webpage)}
      </script>
      
      {/* Enhanced Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData.organization)}
      </script>
      
      {/* Enhanced Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData.localBusiness)}
      </script>
      
      {/* Software Application Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData.softwareApplication)}
      </script>
      
      {/* Enhanced Product Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData.product)}
      </script>
      
      {/* Enhanced Service Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData.service)}
      </script>
      
      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData.faq)}
      </script>
      
      {/* Speakable Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData.speakable)}
      </script>
    </>
  );
};
